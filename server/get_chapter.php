<?php
header('Content-Type: application/json');
require_once 'config.php';
session_start();

// Проверяем авторизацию
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Autentificare necesară']);
    exit;
}

// Получаем параметры
$bookId = isset($_GET['bookId']) ? (int)$_GET['bookId'] : 0;
$chapter = isset($_GET['chapter']) ? (int)$_GET['chapter'] : 0;

if (!$bookId || !$chapter) {
    echo json_encode(['error' => 'Parametri invalizi']);
    exit;
}

try {
    // Получаем текст книги
    $stmt = $pdo->prepare('SELECT content FROM books WHERE id = ?');
    $stmt->execute([$bookId]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$book) {
        echo json_encode(['error' => 'Cartea nu a fost găsită']);
        exit;
    }
    
    // Если текст книги пустой
    if (empty($book['content'])) {
        echo json_encode(['success' => true, 'content' => 'Conținutul cărții nu este disponibil.']);
        exit;
    }
    
    // Разбиваем текст на главы (предполагаем, что главы разделены маркером "Capitol X")
    $chapters = preg_split('/Capitol\s+\d+/i', $book['content'], -1, PREG_SPLIT_NO_EMPTY);
    
    // Проверяем, существует ли запрошенная глава
    if ($chapter > count($chapters)) {
        echo json_encode(['error' => 'Capitolul nu există']);
        exit;
    }
    
    // Возвращаем текст запрошенной главы
    echo json_encode([
        'success' => true,
        'content' => trim($chapters[$chapter - 1])
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Eroare la baza de date']);
}
?> 