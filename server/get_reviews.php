<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->prepare("SELECT id, book_id, author as name, rating, comment, created_at 
                           FROM reviews 
                           ORDER BY created_at DESC");
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'reviews' => $reviews]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?> 