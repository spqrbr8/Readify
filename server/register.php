<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Не все поля заполнены']);
    exit;
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = $data['password'];

// Проверка email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Неверный формат email']);
    exit;
}

// Проверка длины пароля
if (strlen($password) < 6) {
    echo json_encode(['error' => 'Пароль должен содержать минимум 6 символов']);
    exit;
}

try {
    // Проверка существования email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['error' => 'Этот email уже зарегистрирован']);
        exit;
    }

    // Проверка существования имени
    $stmt = $pdo->prepare("SELECT id FROM users WHERE name = ?");
    $stmt->execute([$name]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['error' => 'Это имя пользователя уже используется']);
        exit;
    }

    // Хеширование пароля
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Добавление пользователя
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword]);

    // Получение ID нового пользователя
    $userId = $pdo->lastInsertId();

    // Создание сессии
    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email
        ]
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => 'Ошибка при регистрации: ' . $e->getMessage()]);
}
?> 