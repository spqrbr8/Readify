<?php
header('Content-Type: application/json');
session_start();

// Уничтожение сессии
session_destroy();

echo json_encode(['success' => true]);
?> 