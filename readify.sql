-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1:3306
-- Timp de generare: iun. 02, 2025 la 08:42 AM
-- Versiune server: 8.0.41
-- Versiune PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Bază de date: `readify`
--

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genres` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ongoing','completed','paused') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ongoing',
  `rating` float DEFAULT '0',
  `chapters` int DEFAULT '0',
  `cover` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `publish_date` date DEFAULT NULL,
  `publisher` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Eliminarea datelor din tabel `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `genres`, `status`, `rating`, `chapters`, `cover`, `description`, `publish_date`, `publisher`, `created_at`, `updated_at`) VALUES
(1, 'AAW-231 - grupa de bis', 'Antonymus', 'Reality', 'ongoing', 2, 6, '', 'Lorem ipsum dolor sit amet', '2025-05-29', 'Colegiul UTM', '2025-06-02 07:12:48', '2025-06-02 07:12:48'),
(2, 'Dune', 'Frank Herbert', 'Sci-Fi,Adventure,Epic', 'completed', 4.8, 48, '', 'Dune este o operă epică de science fiction care explorează teme complexe precum politica, religia, și ecologia într-un univers fascinant.', '1965-08-01', 'Chilton Books', '2025-06-02 08:22:02', '2025-06-02 08:22:02'),
(3, '1984', 'George Orwell', 'Dystopian,Classic,Political', 'completed', 4.9, 24, '', 'Un roman distopic clasic.', '1949-06-08', 'Secker & Warburg', '2025-06-02 08:22:02', '2025-06-02 08:22:02'),
(4, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy,Adventure', 'completed', 4.7, 19, '', 'O aventură magică în Middle-earth.', '1937-09-21', 'George Allen & Unwin', '2025-06-02 08:22:02', '2025-06-02 08:22:02'),
(5, 'Harry Potter și Piatra Filosofală', 'J.K. Rowling', 'Fantasy,Adventure,Young Adult', 'ongoing', 4.6, 17, '', 'Începutul aventurilor lui Harry Potter.', '1997-06-26', 'Bloomsbury', '2025-06-02 08:22:02', '2025-06-02 08:22:02'),
(6, 'Pride and Prejudice', 'Jane Austen', 'Romance,Classic', 'completed', 4.5, 61, '', 'Un clasic al literaturii romantice.', '1813-01-28', 'T. Egerton', '2025-06-02 08:22:02', '2025-06-02 08:22:02'),
(7, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic,Tragedy', 'completed', 4.3, 9, '', 'Drama americană din anii \'20.', '1925-04-10', 'Charles Scribner\'s Sons', '2025-06-02 08:22:02', '2025-06-02 08:22:02');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `book_genres`
--

DROP TABLE IF EXISTS `book_genres`;
CREATE TABLE IF NOT EXISTS `book_genres` (
  `book_id` int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`book_id`,`genre_id`),
  KEY `genre_id` (`genre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `chapters`
--

DROP TABLE IF EXISTS `chapters`;
CREATE TABLE IF NOT EXISTS `chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `chapter_number` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_chapter` (`book_id`,`chapter_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `genres`
--

DROP TABLE IF EXISTS `genres`;
CREATE TABLE IF NOT EXISTS `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Eliminarea datelor din tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Anton', 'untilastefan8@gmail.com', '$2y$10$sLWtt/ADByhQzHE4L2EW6OtzTcFpAxIPAVESAyDIe/M9Oywg0BGLe', 'user', '2025-06-01 15:09:31', '2025-06-01 15:09:31'),
(5, 'admin', 'admin@readify.com', '$2y$10$zWWAqZrH5SoQUUZZLQbVp.17tlKNaZlURr17ZDr28uotW8ZimqPC6', 'admin', '2025-06-01 19:08:57', '2025-06-01 19:09:54');

--
-- Constrângeri pentru tabele eliminate
--

--
-- Constrângeri pentru tabele `book_genres`
--
ALTER TABLE `book_genres`
  ADD CONSTRAINT `book_genres_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE;

--
-- Constrângeri pentru tabele `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
