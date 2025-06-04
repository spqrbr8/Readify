<?php
session_start();
require_once 'config.php';

// Verifică dacă utilizatorul este autentificat
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Autentificare necesară']);
    exit;
}

// Verifică dacă utilizatorul este admin
$userId = $_SESSION['user_id'];
$stmt = $pdo->prepare('SELECT role FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acces interzis']);
    exit;
}

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID utilizator lipsă']);
    exit;
}

$targetUserId = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("SELECT id, name, email, role, status FROM users WHERE id = ?");
    $stmt->execute([$targetUserId]);
    
    if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Utilizatorul nu a fost găsit']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare la baza de date']);
}
?> 