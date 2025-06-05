<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Metoda invalidă']);
    exit;
}

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие всех необходимых полей
if (!isset($data['bookId']) || !isset($data['author']) || !isset($data['rating']) || !isset($data['comment'])) {
    echo json_encode(['success' => false, 'message' => 'Date incomplete']);
    exit;
}

try {
    // Подготавливаем и выполняем запрос
    $stmt = $pdo->prepare("
        INSERT INTO reviews (book_id, author, rating, comment)
        VALUES (:bookId, :author, :rating, :comment)
    ");

    $stmt->execute([
        'bookId' => (int)$data['bookId'],
        'author' => $data['author'],
        'rating' => (int)$data['rating'],
        'comment' => $data['comment']
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Recenzie adăugată cu succes',
        'reviewId' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Eroare la adăugarea recenziei: ' . $e->getMessage()
    ]);
} 