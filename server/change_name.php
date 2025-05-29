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

if (!isset($data['newName']) || trim($data['newName']) === '') {
    echo json_encode(['error' => 'Имя не может быть пустым']);
    exit;
}

$newName = trim($data['newName']);
$userId = $_SESSION['user_id'];

try {
    // Проверяем, не пытается ли пользователь установить то же самое имя
    $stmt = $pdo->prepare("SELECT name FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $currentUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($currentUser['name'] === $newName) {
        echo json_encode(['error' => 'Это имя уже установлено']);
        exit;
    }

    // Проверяем, не используется ли имя другим пользователем
    $stmt = $pdo->prepare("SELECT id FROM users WHERE name = ? AND id != ?");
    $stmt->execute([$newName, $userId]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['error' => 'Это имя пользователя уже используется']);
        exit;
    }

    // Обновление имени пользователя
    $stmt = $pdo->prepare("UPDATE users SET name = ? WHERE id = ?");
    $stmt->execute([$newName, $userId]);

    if ($stmt->rowCount() > 0) {
        // Обновление данных сессии
        $_SESSION['user_name'] = $newName;
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userId,
                'name' => $newName,
                'email' => $_SESSION['user_email']
            ]
        ]);
    } else {
        echo json_encode(['error' => 'Не удалось обновить имя']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => 'Ошибка при обновлении имени: ' . $e->getMessage()]);
}
?> 