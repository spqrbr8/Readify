<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_GET['userId'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

$userId = (int)$_GET['userId'];

try {
    // Get books read (completed books)
    $booksReadStmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM user_reading_progress urp
        JOIN books b ON urp.book_id = b.id
        WHERE urp.user_id = :userId 
        AND urp.current_chapter = b.chapters
    ");
    $booksReadStmt->execute(['userId' => $userId]);
    $booksRead = $booksReadStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Get total chapters read
    $chaptersReadStmt = $pdo->prepare("
        SELECT SUM(current_chapter) as total
        FROM user_reading_progress
        WHERE user_id = :userId
    ");
    $chaptersReadStmt->execute(['userId' => $userId]);
    $chaptersRead = $chaptersReadStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    // Get total reading time
    $readingTimeStmt = $pdo->prepare("
        SELECT SUM(reading_time) as total
        FROM user_reading_progress
        WHERE user_id = :userId
    ");
    $readingTimeStmt->execute(['userId' => $userId]);
    $readingTime = $readingTimeStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    // Get total reviews written
    $reviewsStmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM reviews
        WHERE user_id = :userId
    ");
    $reviewsStmt->execute(['userId' => $userId]);
    $reviewsWritten = $reviewsStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Get in-progress books
    $inProgressStmt = $pdo->prepare("
        SELECT b.*, urp.current_chapter, urp.reading_time
        FROM user_reading_progress urp
        JOIN books b ON urp.book_id = b.id
        WHERE urp.user_id = :userId 
        AND urp.current_chapter < b.chapters
        ORDER BY urp.last_read_at DESC
        LIMIT 3
    ");
    $inProgressStmt->execute(['userId' => $userId]);
    $inProgressBooks = $inProgressStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get most read genres
    $genresStmt = $pdo->prepare("
        SELECT b.genres, COUNT(*) as count
        FROM user_reading_progress urp
        JOIN books b ON urp.book_id = b.id
        WHERE urp.user_id = :userId
        GROUP BY b.genres
        ORDER BY count DESC
        LIMIT 3
    ");
    $genresStmt->execute(['userId' => $userId]);
    $topGenres = $genresStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get last read book
    $lastReadStmt = $pdo->prepare("
        SELECT b.*, urp.current_chapter
        FROM user_reading_progress urp
        JOIN books b ON urp.book_id = b.id
        WHERE urp.user_id = :userId
        ORDER BY urp.last_read_at DESC
        LIMIT 1
    ");
    $lastReadStmt->execute(['userId' => $userId]);
    $lastReadBook = $lastReadStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'stats' => [
            'booksRead' => $booksRead,
            'chaptersRead' => $chaptersRead,
            'readingTime' => $readingTime,
            'reviewsWritten' => $reviewsWritten,
            'inProgressBooks' => $inProgressBooks,
            'topGenres' => $topGenres,
            'lastReadBook' => $lastReadBook
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching user statistics: ' . $e->getMessage()
    ]);
} 