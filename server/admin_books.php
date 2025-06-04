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
    // Если передан ID, возвращаем данные конкретной книги
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM books WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        $book = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($book) {
            echo json_encode(['success' => true, 'book' => $book]);
        } else {
            echo json_encode(['error' => 'Cartea nu a fost găsită']);
        }
        exit;
    }
    
    // Иначе возвращаем список всех книг
    $stmt = $pdo->query('SELECT * FROM books ORDER BY created_at DESC');
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'books' => $books]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    // Adăugare carte
    $fields = ['title','author','genres','status','rating','chapters','cover','description','content','publish_date','publisher'];
    $values = [];
    foreach ($fields as $f) {
        $values[$f] = isset($data[$f]) ? $data[$f] : null;
    }
    $stmt = $pdo->prepare('INSERT INTO books (title, author, genres, status, rating, chapters, cover, description, content, publish_date, publisher) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $values['title'], $values['author'], $values['genres'], $values['status'], $values['rating'], $values['chapters'], $values['cover'], $values['description'], $values['content'], $values['publish_date'], $values['publisher']
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}

if ($method === 'PUT') {
    // Editare carte
    if (!isset($data['id'])) {
        echo json_encode(['error' => 'ID carte lipsă']);
        exit;
    }
    $fields = ['title','author','genres','status','rating','chapters','cover','description','content','publish_date','publisher'];
    $set = [];
    $params = [];
    foreach ($fields as $f) {
        if (isset($data[$f])) {
            $set[] = "$f = ?";
            $params[] = $data[$f];
        }
    }
    $params[] = $data['id'];
    $sql = 'UPDATE books SET ' . implode(', ', $set) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE') {
    // Ștergere carte
    if (!isset($data['id'])) {
        echo json_encode(['error' => 'ID carte lipsă']);
        exit;
    }
    $stmt = $pdo->prepare('DELETE FROM books WHERE id = ?');
    $stmt->execute([$data['id']]);
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['error' => 'Metodă neacceptată']); 