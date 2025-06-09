<?php
session_start();

// Проверяем, авторизован ли пользователь
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Получаем ID текущего пользователя
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

// Получаем имя текущего пользователя
function getCurrentUserName() {
    return $_SESSION['user_name'] ?? null;
}

// Проверяем, является ли пользователь администратором
function isAdmin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}
?> 