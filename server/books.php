<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query('SELECT * FROM books ORDER BY created_at DESC');
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Добавляем отладочную информацию
    error_log('Books from database: ' . print_r($books, true));
    
    echo json_encode(['success' => true, 'books' => $books]);
} catch(PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} 