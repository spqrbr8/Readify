<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

if (!isset($_GET['bookId']) || !is_numeric($_GET['bookId'])) {
    echo json_encode(['success' => false, 'message' => 'bookId invalid']);
    exit;
}

$bookId = (int) $_GET['bookId'];
$stmt = $pdo->prepare("
    SELECT id, author, rating, comment, created_at
    FROM reviews
    WHERE book_id = :bookId
    ORDER BY created_at DESC
");
$stmt->execute(['bookId' => $bookId]);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'reviews' => $reviews
]); 