<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['userId'])) {
        throw new Exception('User ID is required');
    }

    $userId = $_GET['userId'];

    // Get user's reading goal
    $stmt = $pdo->prepare("
        SELECT monthly_goal 
        FROM user_goals 
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $goal = $stmt->fetch(PDO::FETCH_ASSOC);

    // If no goal exists, create default
    if (!$goal) {
        $stmt = $pdo->prepare("
            INSERT INTO user_goals (user_id, monthly_goal) 
            VALUES (?, 5)
        ");
        $stmt->execute([$userId]);
        $goal = ['monthly_goal' => 5];
    }

    // Get books read this month
    $stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT book_id) as books_read
        FROM user_reading_progress
        WHERE user_id = ? 
        AND MONTH(last_read_at) = MONTH(CURRENT_DATE())
        AND YEAR(last_read_at) = YEAR(CURRENT_DATE())
    ");
    $stmt->execute([$userId]);
    $booksRead = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'goal' => [
            'monthly_goal' => (int)$goal['monthly_goal'],
            'books_read' => (int)$booksRead['books_read']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 