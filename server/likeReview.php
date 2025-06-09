<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';
require_once 'auth.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Trebuie să fii autentificat pentru a aprecia o recenzie']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Metoda invalidă']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['reviewId']) || !is_numeric($data['reviewId'])) {
    echo json_encode(['success' => false, 'message' => 'ID recenzie invalid']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Проверяем, существует ли отзыв
    $checkStmt = $pdo->prepare("SELECT id FROM reviews WHERE id = :reviewId");
    $checkStmt->execute(['reviewId' => (int)$data['reviewId']]);
    
    if (!$checkStmt->fetch()) {
        throw new Exception('Recenzia nu există');
    }

    // Проверяем, не лайкнул ли уже пользователь этот отзыв
    $likeStmt = $pdo->prepare("
        SELECT id FROM review_likes 
        WHERE review_id = :reviewId AND user_id = :userId
    ");
    $likeStmt->execute([
        'reviewId' => (int)$data['reviewId'],
        'userId' => $_SESSION['user_id']
    ]);

    if ($likeStmt->fetch()) {
        // Если лайк уже есть - удаляем его
        $deleteStmt = $pdo->prepare("
            DELETE FROM review_likes 
            WHERE review_id = :reviewId AND user_id = :userId
        ");
        $deleteStmt->execute([
            'reviewId' => (int)$data['reviewId'],
            'userId' => $_SESSION['user_id']
        ]);
        $action = 'unliked';
    } else {
        // Если лайка нет - добавляем его
        $insertStmt = $pdo->prepare("
            INSERT INTO review_likes (review_id, user_id)
            VALUES (:reviewId, :userId)
        ");
        $insertStmt->execute([
            'reviewId' => (int)$data['reviewId'],
            'userId' => $_SESSION['user_id']
        ]);
        $action = 'liked';
    }

    // Обновляем количество лайков в таблице reviews
    $updateStmt = $pdo->prepare("
        UPDATE reviews 
        SET likes = (
            SELECT COUNT(*) 
            FROM review_likes 
            WHERE review_id = :reviewId
        )
        WHERE id = :reviewId
    ");
    $updateStmt->execute(['reviewId' => (int)$data['reviewId']]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'action' => $action,
        'message' => $action === 'liked' ? 'Recenzie apreciată' : 'Apreciere retrasă'
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'message' => 'Eroare: ' . $e->getMessage()
    ]);
} 