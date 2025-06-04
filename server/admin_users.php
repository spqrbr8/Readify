<?php
header('Content-Type: application/json');
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Autentificare necesară']);
    exit;
}

// Verifică dacă utilizatorul este admin
$userId = $_SESSION['user_id'];
$stmt = $pdo->prepare('SELECT role FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user || $user['role'] !== 'admin') {
    echo json_encode(['error' => 'Acces interzis']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Listare utilizatori
    $stmt = $pdo->query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'users' => $users]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'PUT') {
    // Editare utilizator
    if (!isset($data['id'])) {
        echo json_encode(['error' => 'ID utilizator lipsă']);
        exit;
    }
    
    $fields = ['name', 'email', 'role'];
    $set = [];
    $params = [];
    
    foreach ($fields as $f) {
        if (isset($data[$f])) {
            $set[] = "$f = ?";
            $params[] = $data[$f];
        }
    }
    
    $params[] = $data['id'];
    $sql = 'UPDATE users SET ' . implode(', ', $set) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE') {
    // Ștergere utilizator
    if (!isset($data['id'])) {
        echo json_encode(['error' => 'ID utilizator lipsă']);
        exit;
    }
    
    // Nu permite ștergerea contului propriu
    if ($data['id'] == $userId) {
        echo json_encode(['error' => 'Nu poți șterge propriul cont']);
        exit;
    }
    
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$data['id']]);
    
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['error' => 'Metodă neacceptată']); 