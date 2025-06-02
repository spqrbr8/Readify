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

$userId = $_SESSION['user_id'];

try {
    // Удаление пользователя
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        // Уничтожение сессии
        session_destroy();
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Не удалось удалить аккаунт']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => 'Ошибка при удалении аккаунта: ' . $e->getMessage()]);
}
?> 