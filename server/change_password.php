<?php
header('Content-Type: application/json');
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Необходима авторизация']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
    echo json_encode(['error' => 'Не все поля заполнены']);
    exit;
}

$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];
$userId = $_SESSION['user_id'];

// Проверка длины нового пароля
if (strlen($newPassword) < 6) {
    echo json_encode(['error' => 'Новый пароль должен содержать минимум 6 символов']);
    exit;
}

try {
    // Получение текущего пароля
    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($currentPassword, $user['password'])) {
        echo json_encode(['error' => 'Неверный текущий пароль']);
        exit;
    }

    // Хеширование нового пароля
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Обновление пароля
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute([$hashedPassword, $userId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Не удалось обновить пароль']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => 'Ошибка при обновлении пароля: ' . $e->getMessage()]);
}
?> 