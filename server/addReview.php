<?php
// Включаем логирование ошибок
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Устанавливаем заголовок JSON
header('Content-Type: application/json; charset=utf-8');

// Проверяем подключение к базе данных
try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    error_log("Error loading required files: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Eroare de sistem'
    ]);
    exit;
}

try {
    // Проверяем авторизацию
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Trebuie să fiți autentificat pentru a adăuga o recenzie');
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Metoda invalidă');
    }

    // Получаем JSON данные
    $json = file_get_contents('php://input');
    
    // Дополнительное логирование сырых JSON данных
    error_log("Raw JSON received: " . $json);

    $data = json_decode($json, true);

    // Логируем полученные данные
    error_log("Received data: " . print_r($data, true));

    if (!$data) {
        throw new Exception('Date invalide');
    }

    // Проверяем наличие всех необходимых полей
    if (!isset($data['bookId']) || !isset($data['rating']) || !isset($data['title']) || !isset($data['content'])) {
        throw new Exception('Toate câmpurile sunt obligatorii');
    }

    // Проверяем валидность данных
    $bookId = (int)$data['bookId'];
    $rating = (int)$data['rating'];
    $title = trim($data['title']);
    $content = trim($data['content']);

    // Логируем полученные данные
    error_log("Received review data: " . json_encode([
        'bookId' => $bookId,
        'rating' => $rating,
        'title' => $title,
        'content' => $content
    ]));

    if ($rating < 1 || $rating > 5) {
        throw new Exception('Rating invalid');
    }

    if (strlen($title) < 3 || strlen($title) > 100) {
        throw new Exception('Titlul trebuie să aibă între 3 și 100 de caractere');
    }

    if (strlen($content) < 10) {
        throw new Exception('Recenzia trebuie să aibă cel puțin 10 caractere');
    }

    // Проверяем существование книги
    $checkBookStmt = $pdo->prepare("SELECT id FROM books WHERE id = :bookId");
    $checkBookStmt->execute(['bookId' => $bookId]);
    if (!$checkBookStmt->fetch()) {
        throw new Exception('Carte invalidă');
    }

    // Проверяем, не оставил ли пользователь уже отзыв на эту книгу
    $checkStmt = $pdo->prepare("SELECT id FROM reviews WHERE book_id = :bookId AND user_id = :userId");
    $checkStmt->execute([
        'bookId' => $bookId,
        'userId' => $_SESSION['user_id']
    ]);
    
    if ($checkStmt->fetch()) {
        throw new Exception('Ai deja adăugat o recenzie pentru această carte');
    }

    // Начинаем транзакцию
    $pdo->beginTransaction();

    try {
        // Добавляем отзыв
        $stmt = $pdo->prepare("
            INSERT INTO reviews (book_id, user_id, rating, title, content, created_at)
            VALUES (:bookId, :userId, :rating, :title, :content, NOW())
        ");

        $stmt->execute([
            'bookId' => $bookId,
            'userId' => $_SESSION['user_id'],
            'rating' => $rating,
            'title' => $title,
            'content' => $content
        ]);

        $reviewId = $pdo->lastInsertId();

        // Обновляем средний рейтинг книги
        $updateBookStmt = $pdo->prepare("
            UPDATE books 
            SET rating = (
                SELECT AVG(rating) 
                FROM reviews 
                WHERE book_id = :bookId
            )
            WHERE id = :bookId
        ");
        $updateBookStmt->execute(['bookId' => $bookId]);

        // Подтверждаем транзакцию
        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Recenzie adăugată cu succes',
            'reviewId' => $reviewId
        ]);

    } catch (Exception $e) {
        // Откатываем транзакцию в случае ошибки
        $pdo->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Error in addReview.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (PDOException $e) {
    error_log("Database error in addReview.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Eroare la adăugarea recenziei'
    ]);
} 