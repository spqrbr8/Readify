-- Create database
CREATE DATABASE IF NOT EXISTS readify DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE readify;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    description TEXT,
    cover_url VARCHAR(255),
    publish_date DATE,
    publisher VARCHAR(100),
    chapters INT NOT NULL,
    status ENUM('ongoing', 'completed', 'paused') DEFAULT 'ongoing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Book_genres (relație many-to-many între books și genres)
CREATE TABLE IF NOT EXISTS book_genres (
    book_id INT,
    genre_id INT,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- User_progress (progresul utilizatorului pentru fiecare carte)
CREATE TABLE IF NOT EXISTS user_progress (
    user_id INT,
    book_id INT,
    current_chapter INT DEFAULT 0,
    reading_time INT DEFAULT 0, -- în minute
    last_read_position INT DEFAULT 0,
    last_read_chapter INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Bookmarks (cărțile favorite ale utilizatorilor)
CREATE TABLE IF NOT EXISTS bookmarks (
    user_id INT,
    book_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Reading_history (istoricul de citire)
CREATE TABLE IF NOT EXISTS reading_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    chapter INT,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Reviews (recenziile utilizatorilor)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- User_settings (setările utilizatorului)
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT PRIMARY KEY,
    theme ENUM('light', 'dark', 'auto') DEFAULT 'dark',
    font_size ENUM('small', 'medium', 'large') DEFAULT 'medium',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert some default genres
INSERT IGNORE INTO genres (name) VALUES 
('Sci-Fi'),
('Fantasy'),
('Romance'),
('Thriller'),
('Mystery'),
('Classic'),
('Dystopian'),
('Adventure'),
('Epic'),
('Political'),
('Young Adult'),
('Tragedy');

-- Insert sample books
INSERT IGNORE INTO books (title, author, description, chapters, status, publish_date, publisher) VALUES
('Dune', 'Frank Herbert', 'Dune este o operă epică de science fiction care explorează teme complexe precum politica, religia, și ecologia într-un univers fascinant.', 48, 'completed', '1965-08-01', 'Chilton Books'),
('1984', 'George Orwell', 'Un roman distopic clasic.', 24, 'completed', '1949-06-08', 'Secker & Warburg'),
('The Hobbit', 'J.R.R. Tolkien', 'O aventură magică în Middle-earth.', 19, 'completed', '1937-09-21', 'George Allen & Unwin'),
('Harry Potter și Piatra Filosofală', 'J.K. Rowling', 'Începutul aventurilor lui Harry Potter.', 17, 'completed', '1997-06-26', 'Bloomsbury'),
('Pride and Prejudice', 'Jane Austen', 'Un clasic al literaturii romantice.', 61, 'completed', '1813-01-28', 'T. Egerton'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Drama americană din anii ''20.', 9, 'completed', '1925-04-10', 'Charles Scribner''s Sons');

-- Link books with genres
INSERT IGNORE INTO book_genres (book_id, genre_id)
SELECT b.id, g.id
FROM books b, genres g
WHERE b.title = 'Dune' AND g.name IN ('Sci-Fi', 'Adventure', 'Epic')
UNION ALL
SELECT b.id, g.id
FROM books b, genres g
WHERE b.title = '1984' AND g.name IN ('Dystopian', 'Classic', 'Political')
UNION ALL
SELECT b.id, g.id
FROM books b, genres g
WHERE b.title = 'The Hobbit' AND g.name IN ('Fantasy', 'Adventure')
UNION ALL
SELECT b.id, g.id
FROM books b, genres g
WHERE b.title = 'Harry Potter și Piatra Filosofală' AND g.name IN ('Fantasy', 'Adventure', 'Young Adult')
UNION ALL
SELECT b.id, g.id
FROM books b, genres g
WHERE b.title = 'Pride and Prejudice' AND g.name IN ('Romance', 'Classic')
UNION ALL
SELECT b.id, g.id
FROM books b, genres g
WHERE b.title = 'The Great Gatsby' AND g.name IN ('Classic', 'Tragedy'); 