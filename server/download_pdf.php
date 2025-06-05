<?php
ob_start();
require_once 'config.php';
require_once __DIR__ . '/../vendor/autoload.php';

// Verificăm dacă există ID-ul cărții
if (!isset($_GET['book_id'])) {
    die('ID-ul cărții lipsește');
}

$book_id = (int)$_GET['book_id'];

// Obținem informațiile despre carte
$stmt = $pdo->prepare("SELECT title, author, content FROM books WHERE id = ?");
$stmt->execute([$book_id]);
$book = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$book) {
    die('Cartea nu a fost găsită');
}

// Creăm un nou document PDF
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// Setăm informațiile documentului
$pdf->SetCreator('Readify');
$pdf->SetAuthor($book['author']);
$pdf->SetTitle($book['title']);

// Setăm margini
$pdf->SetMargins(15, 15, 15);
$pdf->SetHeaderMargin(5);
$pdf->SetFooterMargin(10);

// Setăm auto page breaks
$pdf->SetAutoPageBreak(TRUE, 15);

// Adăugăm o pagină
$pdf->AddPage();

// Setăm fontul
$pdf->SetFont('dejavusans', '', 12);

// Adăugăm titlul
$pdf->SetFont('dejavusans', 'B', 16);
$pdf->Cell(0, 10, $book['title'], 0, 1, 'C');
$pdf->Ln(5);

// Adăugăm autorul
$pdf->SetFont('dejavusans', 'I', 12);
$pdf->Cell(0, 10, 'Autor: ' . $book['author'], 0, 1, 'C');
$pdf->Ln(10);

// Adăugăm conținutul
$pdf->MultiCell(0, 10, $book['content'], 0, 'J');

// Golim bufferul de output înainte de generarea PDF-ului
ob_end_clean();
// Generăm PDF-ul
$pdf->Output($book['title'] . '.pdf', 'D');