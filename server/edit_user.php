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

// Verifică datele necesare
if (!isset($_POST['userId']) || !isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['role'])) {
    echo json_encode(['success' => false, 'message' => 'Date incomplete']);
    exit;
}

$userId = intval($_POST['userId']);
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$role = $_POST['role'];
$status = $_POST['status'] ?? 'active';
$password = $_POST['password'] ?? '';

// Validări de bază
if (empty($name) || empty($email) || !in_array($role, ['user', 'admin']) || !in_array($status, ['active', 'inactive', 'blocked'])) {
    echo json_encode(['success' => false, 'message' => 'Date invalide']);
    exit;
}

try {
    // Verifică dacă email-ul există deja pentru alt utilizator
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$email, $userId]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Acest email este deja folosit']);
        exit;
    }

    // Construiește query-ul în funcție de dacă se schimbă parola
    if (!empty($password)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, role = ?, status = ?, password = ? WHERE id = ?");
        $stmt->execute([$name, $email, $role, $status, $hashedPassword, $userId]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?");
        $stmt->execute([$name, $email, $role, $status, $userId]);
    }

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Utilizator actualizat cu succes']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Eroare la actualizarea utilizatorului']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare la baza de date']);
}
?> 