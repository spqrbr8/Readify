<?php
session_start();
require_once 'config.php';

// Verifică dacă utilizatorul este admin
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acces neautorizat']);
    exit;
}

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID utilizator lipsă']);
    exit;
}

$userId = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("SELECT id, name, email, role, status FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    
    if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Utilizatorul nu a fost găsit']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare la baza de date']);
}
?> 