<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';
require_once 'auth.php';

if (!isset($_GET['bookId']) || !is_numeric($_GET['bookId'])) {
    echo json_encode(['success' => false, 'message' => 'bookId invalid']);
    exit;
}

$bookId = (int) $_GET['bookId'];
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

try {
    // Получаем общее количество отзывов
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM reviews WHERE book_id = :bookId");
    $countStmt->execute(['bookId' => $bookId]);
    $totalReviews = $countStmt->fetchColumn();

    // Получаем отзывы с информацией о пользователях
    $stmt = $pdo->prepare("
        SELECT r.*, u.name as author_name, u.avatar,
               (SELECT COUNT(*) FROM review_likes WHERE review_id = r.id) as likes_count,
               CASE WHEN :userId IS NOT NULL THEN 
                    EXISTS(SELECT 1 FROM review_likes WHERE review_id = r.id AND user_id = :userId)
               ELSE FALSE END as user_liked
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.book_id = :bookId
        ORDER BY r.created_at DESC
        LIMIT :limit OFFSET :offset
    ");

    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    $stmt->bindValue(':bookId', $bookId, PDO::PARAM_INT);
    $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Получаем статистику рейтингов
    $ratingStmt = $pdo->prepare("
        SELECT rating, COUNT(*) as count
        FROM reviews
        WHERE book_id = :bookId
        GROUP BY rating
        ORDER BY rating DESC
    ");
    $ratingStmt->execute(['bookId' => $bookId]);
    $ratingStats = $ratingStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'reviews' => $reviews,
        'pagination' => [
            'total' => $totalReviews,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($totalReviews / $limit)
        ],
        'rating_stats' => $ratingStats
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Eroare la încărcarea recenziilor: ' . $e->getMessage()
    ]);
} 