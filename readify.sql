-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 04, 2025 at 09:05 AM
-- Server version: 8.0.41
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `readify`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `genres` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ongoing','completed','paused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ongoing',
  `rating` float DEFAULT '0',
  `chapters` int DEFAULT '0',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `publish_date` date DEFAULT NULL,
  `publisher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `genres`, `status`, `rating`, `chapters`, `cover`, `description`, `publish_date`, `publisher`, `created_at`, `updated_at`, `content`) VALUES
(2, 'Dune', 'Frank Herbert', 'Sci-Fi,Adventure,Epic', 'completed', 4.8, 48, '', 'Dune este o operă epică de science fiction care explorează teme complexe precum politica, religia, și ecologia într-un univers fascinant.', '1965-08-01', 'Chilton Books', '2025-06-02 08:22:02', '2025-06-04 09:03:50', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus nunc eu ex facilisis dapibus. In auctor tortor et velit rutrum mattis. In viverra tempor fringilla. Pellentesque bibendum volutpat dapibus. Morbi rhoncus malesuada congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at bibendum sem. Nunc a lacinia tortor, rhoncus imperdiet est. Ut blandit turpis magna, eu commodo ligula mollis sed. Aenean vel diam et erat varius dignissim. Donec semper lacus lorem, ut dictum risus vehicula eu. Nam congue vehicula feugiat. Aliquam sed aliquet felis. Nulla turpis nisi, bibendum at tortor ac, facilisis consectetur quam. Cras efficitur fermentum maximus.\n\nVestibulum magna mi, dignissim vel neque nec, imperdiet eleifend elit. Praesent ante tortor, mollis maximus massa ac, venenatis rutrum turpis. Donec ullamcorper iaculis metus, ut aliquet mi auctor ac. In sodales pellentesque neque, vitae convallis quam tincidunt at. Sed non aliquet sem. Etiam lacinia tempor magna quis euismod. Donec et augue massa. Nullam vel tellus purus. Nunc imperdiet cursus purus. Nulla sed lacus sed elit dignissim imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus.\n\nProin ultricies sapien augue, eu mollis elit fermentum et. In vitae ultricies diam. Morbi sit amet ultricies orci, vitae aliquet arcu. Suspendisse potenti. Sed mollis tellus eu dui ultricies euismod. Nullam volutpat eu odio ut laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus ultricies luctus nibh, at accumsan velit faucibus id. Ut sit amet venenatis purus. Cras tincidunt eros et diam porttitor bibendum.\n\nVestibulum tempor quam eu quam varius, ut vehicula libero suscipit. Curabitur viverra purus tristique dui venenatis, ut euismod sem fermentum. Aliquam mattis dui a rutrum tincidunt. Fusce porta, risus vitae fermentum efficitur, diam tortor fermentum eros, sit amet vulputate neque urna et velit. Phasellus sed nunc porttitor, aliquam nibh sit amet, varius justo. Nullam lacus justo, ultricies a lacus vel, molestie cursus diam. Nullam ullamcorper odio tortor, a facilisis lectus molestie et. Nunc in imperdiet lacus, eget aliquam lacus. Phasellus egestas congue diam sit amet convallis. Mauris vulputate purus quam, vel lacinia ex auctor quis. Morbi tempus lectus in dolor imperdiet, molestie sollicitudin erat ultricies. Ut commodo condimentum ipsum, sed mattis tellus convallis ut. Maecenas ornare purus nisi, a lobortis arcu euismod et. Mauris magna risus, semper ut nunc in, efficitur aliquam neque. Ut malesuada rhoncus finibus.\nCapitol 2\n\nVivamus viverra eu mauris nec hendrerit. Etiam mollis iaculis fringilla. Sed placerat nisl et nisi mollis, nec feugiat diam consectetur. Praesent non est fermentum, fringilla lorem et, accumsan lacus. Cras sed dictum nibh, a tempor dui. Nulla nec aliquam ipsum. Donec blandit facilisis consectetur. Nunc eget sapien eget dui rutrum suscipit id id sapien. Curabitur lacus arcu, ornare bibendum suscipit ut, tempus ac turpis.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus nunc eu ex facilisis dapibus. In auctor tortor et velit rutrum mattis. In viverra tempor fringilla. Pellentesque bibendum volutpat dapibus. Morbi rhoncus malesuada congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at bibendum sem. Nunc a lacinia tortor, rhoncus imperdiet est. Ut blandit turpis magna, eu commodo ligula mollis sed. Aenean vel diam et erat varius dignissim. Donec semper lacus lorem, ut dictum risus vehicula eu. Nam congue vehicula feugiat. Aliquam sed aliquet felis. Nulla turpis nisi, bibendum at tortor ac, facilisis consectetur quam. Cras efficitur fermentum maximus.\n\nVestibulum magna mi, dignissim vel neque nec, imperdiet eleifend elit. Praesent ante tortor, mollis maximus massa ac, venenatis rutrum turpis. Donec ullamcorper iaculis metus, ut aliquet mi auctor ac. In sodales pellentesque neque, vitae convallis quam tincidunt at. Sed non aliquet sem. Etiam lacinia tempor magna quis euismod. Donec et augue massa. Nullam vel tellus purus. Nunc imperdiet cursus purus. Nulla sed lacus sed elit dignissim imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus.\n\nProin ultricies sapien augue, eu mollis elit fermentum et. In vitae ultricies diam. Morbi sit amet ultricies orci, vitae aliquet arcu. Suspendisse potenti. Sed mollis tellus eu dui ultricies euismod. Nullam volutpat eu odio ut laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus ultricies luctus nibh, at accumsan velit faucibus id. Ut sit amet venenatis purus. Cras tincidunt eros et diam porttitor bibendum.\n\nVestibulum tempor quam eu quam varius, ut vehicula libero suscipit. Curabitur viverra purus tristique dui venenatis, ut euismod sem fermentum. Aliquam mattis dui a rutrum tincidunt. Fusce porta, risus vitae fermentum efficitur, diam tortor fermentum eros, sit amet vulputate neque urna et velit. Phasellus sed nunc porttitor, aliquam nibh sit amet, varius justo. Nullam lacus justo, ultricies a lacus vel, molestie cursus diam. Nullam ullamcorper odio tortor, a facilisis lectus molestie et. Nunc in imperdiet lacus, eget aliquam lacus. Phasellus egestas congue diam sit amet convallis. Mauris vulputate purus quam, vel lacinia ex auctor quis. Morbi tempus lectus in dolor imperdiet, molestie sollicitudin erat ultricies. Ut commodo condimentum ipsum, sed mattis tellus convallis ut. Maecenas ornare purus nisi, a lobortis arcu euismod et. Mauris magna risus, semper ut nunc in, efficitur aliquam neque. Ut malesuada rhoncus finibus.\n\nVivamus viverra eu mauris nec hendrerit. Etiam mollis iaculis fringilla. Sed placerat nisl et nisi mollis, nec feugiat diam consectetur. Praesent non est fermentum, fringilla lorem et, accumsan lacus. Cras sed dictum nibh, a tempor dui. Nulla nec aliquam ipsum. Donec blandit facilisis consectetur. Nunc eget sapien eget dui rutrum suscipit id id sapien. Curabitur lacus arcu, ornare bibendum suscipit ut, tempus ac turpis.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus nunc eu ex facilisis dapibus. In auctor tortor et velit rutrum mattis. In viverra tempor fringilla. Pellentesque bibendum volutpat dapibus. Morbi rhoncus malesuada congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at bibendum sem. Nunc a lacinia tortor, rhoncus imperdiet est. Ut blandit turpis magna, eu commodo ligula mollis sed. Aenean vel diam et erat varius dignissim. Donec semper lacus lorem, ut dictum risus vehicula eu. Nam congue vehicula feugiat. Aliquam sed aliquet felis. Nulla turpis nisi, bibendum at tortor ac, facilisis consectetur quam. Cras efficitur fermentum maximus.\n\nVestibulum magna mi, dignissim vel neque nec, imperdiet eleifend elit. Praesent ante tortor, mollis maximus massa ac, venenatis rutrum turpis. Donec ullamcorper iaculis metus, ut aliquet mi auctor ac. In sodales pellentesque neque, vitae convallis quam tincidunt at. Sed non aliquet sem. Etiam lacinia tempor magna quis euismod. Donec et augue massa. Nullam vel tellus purus. Nunc imperdiet cursus purus. Nulla sed lacus sed elit dignissim imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus.\n\nProin ultricies sapien augue, eu mollis elit fermentum et. In vitae ultricies diam. Morbi sit amet ultricies orci, vitae aliquet arcu. Suspendisse potenti. Sed mollis tellus eu dui ultricies euismod. Nullam volutpat eu odio ut laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus ultricies luctus nibh, at accumsan velit faucibus id. Ut sit amet venenatis purus. Cras tincidunt eros et diam porttitor bibendum.\n\nVestibulum tempor quam eu quam varius, ut vehicula libero suscipit. Curabitur viverra purus tristique dui venenatis, ut euismod sem fermentum. Aliquam mattis dui a rutrum tincidunt. Fusce porta, risus vitae fermentum efficitur, diam tortor fermentum eros, sit amet vulputate neque urna et velit. Phasellus sed nunc porttitor, aliquam nibh sit amet, varius justo. Nullam lacus justo, ultricies a lacus vel, molestie cursus diam. Nullam ullamcorper odio tortor, a facilisis lectus molestie et. Nunc in imperdiet lacus, eget aliquam lacus. Phasellus egestas congue diam sit amet convallis. Mauris vulputate purus quam, vel lacinia ex auctor quis. Morbi tempus lectus in dolor imperdiet, molestie sollicitudin erat ultricies. Ut commodo condimentum ipsum, sed mattis tellus convallis ut. Maecenas ornare purus nisi, a lobortis arcu euismod et. Mauris magna risus, semper ut nunc in, efficitur aliquam neque. Ut malesuada rhoncus finibus.\n\nVivamus viverra eu mauris nec hendrerit. Etiam mollis iaculis fringilla. Sed placerat nisl et nisi mollis, nec feugiat diam consectetur. Praesent non est fermentum, fringilla lorem et, accumsan lacus. Cras sed dictum nibh, a tempor dui. Nulla nec aliquam ipsum. Donec blandit facilisis consectetur. Nunc eget sapien eget dui rutrum suscipit id id sapien. Curabitur lacus arcu, ornare bibendum suscipit ut, tempus ac turpis.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus nunc eu ex facilisis dapibus. In auctor tortor et velit rutrum mattis. In viverra tempor fringilla. Pellentesque bibendum volutpat dapibus. Morbi rhoncus malesuada congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at bibendum sem. Nunc a lacinia tortor, rhoncus imperdiet est. Ut blandit turpis magna, eu commodo ligula mollis sed. Aenean vel diam et erat varius dignissim. Donec semper lacus lorem, ut dictum risus vehicula eu. Nam congue vehicula feugiat. Aliquam sed aliquet felis. Nulla turpis nisi, bibendum at tortor ac, facilisis consectetur quam. Cras efficitur fermentum maximus.\n\nVestibulum magna mi, dignissim vel neque nec, imperdiet eleifend elit. Praesent ante tortor, mollis maximus massa ac, venenatis rutrum turpis. Donec ullamcorper iaculis metus, ut aliquet mi auctor ac. In sodales pellentesque neque, vitae convallis quam tincidunt at. Sed non aliquet sem. Etiam lacinia tempor magna quis euismod. Donec et augue massa. Nullam vel tellus purus. Nunc imperdiet cursus purus. Nulla sed lacus sed elit dignissim imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus.\n\nProin ultricies sapien augue, eu mollis elit fermentum et. In vitae ultricies diam. Morbi sit amet ultricies orci, vitae aliquet arcu. Suspendisse potenti. Sed mollis tellus eu dui ultricies euismod. Nullam volutpat eu odio ut laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus ultricies luctus nibh, at accumsan velit faucibus id. Ut sit amet venenatis purus. Cras tincidunt eros et diam porttitor bibendum.\n\nVestibulum tempor quam eu quam varius, ut vehicula libero suscipit. Curabitur viverra purus tristique dui venenatis, ut euismod sem fermentum. Aliquam mattis dui a rutrum tincidunt. Fusce porta, risus vitae fermentum efficitur, diam tortor fermentum eros, sit amet vulputate neque urna et velit. Phasellus sed nunc porttitor, aliquam nibh sit amet, varius justo. Nullam lacus justo, ultricies a lacus vel, molestie cursus diam. Nullam ullamcorper odio tortor, a facilisis lectus molestie et. Nunc in imperdiet lacus, eget aliquam lacus. Phasellus egestas congue diam sit amet convallis. Mauris vulputate purus quam, vel lacinia ex auctor quis. Morbi tempus lectus in dolor imperdiet, molestie sollicitudin erat ultricies. Ut commodo condimentum ipsum, sed mattis tellus convallis ut. Maecenas ornare purus nisi, a lobortis arcu euismod et. Mauris magna risus, semper ut nunc in, efficitur aliquam neque. Ut malesuada rhoncus finibus.\n\nVivamus viverra eu mauris nec hendrerit. Etiam mollis iaculis fringilla. Sed placerat nisl et nisi mollis, nec feugiat diam consectetur. Praesent non est fermentum, fringilla lorem et, accumsan lacus. Cras sed dictum nibh, a tempor dui. Nulla nec aliquam ipsum. Donec blandit facilisis consectetur. Nunc eget sapien eget dui rutrum suscipit id id sapien. Curabitur lacus arcu, ornare bibendum suscipit ut, tempus ac turpis.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus nunc eu ex facilisis dapibus. In auctor tortor et velit rutrum mattis. In viverra tempor fringilla. Pellentesque bibendum volutpat dapibus. Morbi rhoncus malesuada congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at bibendum sem. Nunc a lacinia tortor, rhoncus imperdiet est. Ut blandit turpis magna, eu commodo ligula mollis sed. Aenean vel diam et erat varius dignissim. Donec semper lacus lorem, ut dictum risus vehicula eu. Nam congue vehicula feugiat. Aliquam sed aliquet felis. Nulla turpis nisi, bibendum at tortor ac, facilisis consectetur quam. Cras efficitur fermentum maximus.\n\nVestibulum magna mi, dignissim vel neque nec, imperdiet eleifend elit. Praesent ante tortor, mollis maximus massa ac, venenatis rutrum turpis. Donec ullamcorper iaculis metus, ut aliquet mi auctor ac. In sodales pellentesque neque, vitae convallis quam tincidunt at. Sed non aliquet sem. Etiam lacinia tempor magna quis euismod. Donec et augue massa. Nullam vel tellus purus. Nunc imperdiet cursus purus. Nulla sed lacus sed elit dignissim imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus.\n\nProin ultricies sapien augue, eu mollis elit fermentum et. In vitae ultricies diam. Morbi sit amet ultricies orci, vitae aliquet arcu. Suspendisse potenti. Sed mollis tellus eu dui ultricies euismod. Nullam volutpat eu odio ut laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus ultricies luctus nibh, at accumsan velit faucibus id. Ut sit amet venenatis purus. Cras tincidunt eros et diam porttitor bibendum.\n\nVestibulum tempor quam eu quam varius, ut vehicula libero suscipit. Curabitur viverra purus tristique dui venenatis, ut euismod sem fermentum. Aliquam mattis dui a rutrum tincidunt. Fusce porta, risus vitae fermentum efficitur, diam tortor fermentum eros, sit amet vulputate neque urna et velit. Phasellus sed nunc porttitor, aliquam nibh sit amet, varius justo. Nullam lacus justo, ultricies a lacus vel, molestie cursus diam. Nullam ullamcorper odio tortor, a facilisis lectus molestie et. Nunc in imperdiet lacus, eget aliquam lacus. Phasellus egestas congue diam sit amet convallis. Mauris vulputate purus quam, vel lacinia ex auctor quis. Morbi tempus lectus in dolor imperdiet, molestie sollicitudin erat ultricies. Ut commodo condimentum ipsum, sed mattis tellus convallis ut. Maecenas ornare purus nisi, a lobortis arcu euismod et. Mauris magna risus, semper ut nunc in, efficitur aliquam neque. Ut malesuada rhoncus finibus.\n\nVivamus viverra eu mauris nec hendrerit. Etiam mollis iaculis fringilla. Sed placerat nisl et nisi mollis, nec feugiat diam consectetur. Praesent non est fermentum, fringilla lorem et, accumsan lacus. Cras sed dictum nibh, a tempor dui. Nulla nec aliquam ipsum. Donec blandit facilisis consectetur. Nunc eget sapien eget dui rutrum suscipit id id sapien. Curabitur lacus arcu, ornare bibendum suscipit ut, tempus ac turpis.'),
(3, '1984', 'George Orwell', 'Dystopian,Classic,Political', 'completed', 4.9, 24, '', 'Un roman distopic clasic.', '1949-06-08', 'Secker & Warburg', '2025-06-02 08:22:02', '2025-06-02 08:22:02', NULL),
(4, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy,Adventure', 'completed', 4.7, 19, '', 'O aventură magică în Middle-earth.', '1937-09-21', 'George Allen & Unwin', '2025-06-02 08:22:02', '2025-06-02 08:22:02', NULL),
(5, 'Harry Potter și Piatra Filosofală', 'J.K. Rowling', 'Fantasy,Adventure,Young Adult', 'ongoing', 4.6, 17, '', 'Începutul aventurilor lui Harry Potter.', '1997-06-26', 'Bloomsbury', '2025-06-02 08:22:02', '2025-06-02 08:22:02', NULL),
(6, 'Pride and Prejudice', 'Jane Austen', 'Romance,Classic', 'completed', 4.5, 61, '', 'Un clasic al literaturii romantice.', '1813-01-28', 'T. Egerton', '2025-06-02 08:22:02', '2025-06-02 08:22:02', NULL),
(7, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic,Tragedy', 'completed', 4.3, 9, '', 'Drama americană din anii \'20.', '1925-04-10', 'Charles Scribner\'s Sons', '2025-06-02 08:22:02', '2025-06-02 08:22:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `book_genres`
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
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
CREATE TABLE IF NOT EXISTS `chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `chapter_number` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_chapter` (`book_id`,`chapter_number`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`id`, `book_id`, `chapter_number`, `title`, `content`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Capitol 122231132', 'Acesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.\r\n\r\nAcesta este un text demonstrativ pentru capitolul 1. Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.', '2025-06-04 08:40:24', '2025-06-04 08:40:24');

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
CREATE TABLE IF NOT EXISTS `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `status` enum('active','inactive','blocked') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Antonskaa', 'untilastefan8@gmail.com', '$2y$10$e7xU/RQ2fDfJPPbCluaDJupC6hwZ.C4y750olsdKmvqD1Cvoo0CYW', 'user', 'active', '2025-06-01 15:09:31', '2025-06-04 07:38:46'),
(5, 'admin', 'admin@readify.com', '$2y$10$zWWAqZrH5SoQUUZZLQbVp.17tlKNaZlURr17ZDr28uotW8ZimqPC6', 'admin', 'active', '2025-06-01 19:08:57', '2025-06-01 19:09:54'),
(6, 'laur', 'test@gmail.com', '$2y$10$zUZgqMoI4fv5xNrL9r6DOeB/TtbD1k2EOaydGzuqd31P2rYESOtfO', 'user', 'active', '2025-06-04 05:54:43', '2025-06-04 07:25:42');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book_genres`
--
ALTER TABLE `book_genres`
  ADD CONSTRAINT `book_genres_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Создание таблицы отзывов
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `book_id` INT NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `rating` TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
);

-- Добавление тестовых отзывов
INSERT INTO `reviews` (`book_id`, `author`, `rating`, `comment`)
VALUES
(1, 'Ion Popescu', 5, 'Lectură captivantă!'),
(1, 'Maria Ionescu', 4, 'Bună, dar un pic lungă.'),
(2, 'Alex Dumitru', 3, 'Complexă, dar dificil de urmărit.'),
(3, 'Elena Georgescu', 5, 'O capodoperă modernă.');
