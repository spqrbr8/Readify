<?php
$host = 'localhost';
$dbname = 'readify';
$username = 'root';
$password = '2007';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Ошибка подключения к базе данных: ' . $e->getMessage()]);
    exit;
}
?> 