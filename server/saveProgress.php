<?php
require_once 'config.php';

header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userId']) || !isset($data['bookId']) || !isset($data['chapter'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

$userId = (int)$data['userId'];
$bookId = (int)$data['bookId'];
$chapter = (int)$data['chapter'];
$readingTime = isset($data['readingTime']) ? (int)$data['readingTime'] : 0;
$lastReadPosition = isset($data['lastReadPosition']) ? (int)$data['lastReadPosition'] : 0;

try {
    // Check if progress record exists
    $checkStmt = $pdo->prepare("
        SELECT id FROM user_reading_progress 
        WHERE user_id = :userId AND book_id = :bookId
    ");
    $checkStmt->execute(['userId' => $userId, 'bookId' => $bookId]);
    $exists = $checkStmt->fetch();

    if ($exists) {
        // Update existing progress
        $stmt = $pdo->prepare("
            UPDATE user_reading_progress 
            SET current_chapter = :chapter,
                reading_time = :readingTime,
                last_read_position = :lastReadPosition,
                last_read_at = CURRENT_TIMESTAMP
            WHERE user_id = :userId AND book_id = :bookId
        ");
    } else {
        // Insert new progress
        $stmt = $pdo->prepare("
            INSERT INTO user_reading_progress 
            (user_id, book_id, current_chapter, reading_time, last_read_position)
            VALUES (:userId, :bookId, :chapter, :readingTime, :lastReadPosition)
        ");
    }

    $stmt->execute([
        'userId' => $userId,
        'bookId' => $bookId,
        'chapter' => $chapter,
        'readingTime' => $readingTime,
        'lastReadPosition' => $lastReadPosition
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error saving progress: ' . $e->getMessage()
    ]);
} 