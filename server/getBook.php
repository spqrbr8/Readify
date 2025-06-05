<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($pdo)) {
    echo json_encode(['success' => false, 'message' => 'Eroare de conexiune la baza de date']);
    exit;
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID invalid']);
    exit;
}

$bookId = (int)$_GET['id'];

try {
    // Получаем основную информацию о книге
    $stmt = $pdo->prepare("SELECT * FROM books WHERE id = ?");
    $stmt->execute([$bookId]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$book) {
        echo json_encode(['success' => false, 'message' => 'Cartea nu a fost găsită']);
        exit;
    }

    // Получаем жанры книги
    $stmt = $pdo->prepare("SELECT genre FROM book_genres WHERE book_id = ?");
    $stmt->execute([$bookId]);
    $genres = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $book['genres'] = array_column($genres, 'genre');

    // Получаем отзывы
    $stmt = $pdo->prepare("SELECT * FROM reviews WHERE book_id = ? ORDER BY created_at DESC");
    $stmt->execute([$bookId]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $book['reviews'] = $reviews;

    // Вычисляем средний рейтинг
    if (!empty($reviews)) {
        $totalRating = array_sum(array_column($reviews, 'rating'));
        $book['rating'] = round($totalRating / count($reviews), 1);
    } else {
        $book['rating'] = 0;
    }

    echo json_encode(['success' => true, 'book' => $book]);
} catch (PDOException $e) {
    error_log("Eroare în getBook.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Eroare la încărcarea cărții: ' . $e->getMessage()]);
}
?> 