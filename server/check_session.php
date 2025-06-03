<?php
header('Content-Type: application/json');
require_once 'config.php';
session_start();

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
        exit;
    }
}

echo json_encode([
    'success' => false,
    'error' => 'Nu există sesiune activă'
]); 