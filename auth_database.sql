-- Create database
CREATE DATABASE IF NOT EXISTS readify DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE readify;

-- Users table - tabelul principal pentru autentificare și înregistrare
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User_settings - setările de bază ale utilizatorului (opțional, dar recomandat)
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT PRIMARY KEY,
    theme ENUM('light', 'dark', 'auto') DEFAULT 'dark',
    font_size ENUM('small', 'medium', 'large') DEFAULT 'medium',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exemplu de inserare utilizator (parolă: test123)
-- INSERT INTO users (username, email, password) VALUES 
-- ('test_user', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Exemplu de inserare setări pentru utilizator
-- INSERT INTO user_settings (user_id, theme, font_size) VALUES 
-- (1, 'dark', 'medium'); 