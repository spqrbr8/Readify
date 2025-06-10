<?php
// Disable error reporting to prevent HTML output
error_reporting(0);
ini_set('display_errors', 0);

// Ensure we're sending JSON
header('Content-Type: application/json');

try {
    // Check if vendor/autoload.php exists using the correct path
    $autoloadPath = __DIR__ . '/../vendor/autoload.php';
    if (!file_exists($autoloadPath)) {
        throw new Exception('Composer dependencies not installed. Please run: composer require smalot/pdfparser');
    }

    require_once $autoloadPath;

    if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Nu s-a încărcat niciun fișier PDF sau a apărut o eroare la încărcare');
    }

    $file = $_FILES['pdf']['tmp_name'];
    
    // Check if file exists
    if (!file_exists($file)) {
        throw new Exception('Fișierul temporar nu a fost găsit');
    }
    
    // Verifică dacă fișierul este un PDF valid
    if (mime_content_type($file) !== 'application/pdf') {
        throw new Exception('Fișierul încărcat nu este un PDF valid');
    }

    // Inițializează parserul PDF
    $parser = new \Smalot\PdfParser\Parser();
    
    // Parsează PDF-ul
    $pdf = $parser->parseFile($file);
    
    // Extrage textul
    $text = $pdf->getText();
    
    // Curăță textul de caractere nedorite și spații multiple
    $text = preg_replace('/\s+/', ' ', $text);
    $text = trim($text);

    // Împarte textul în capitole de aproximativ 3000 de caractere, tăind doar la spații
    $chapters = [];
    $targetLength = 3000;
    $totalLength = strlen($text);
    $position = 0;
    $chapterNumber = 2; // Începem de la Capitol 2

    while ($position < $totalLength) {
        // Găsim poziția unde să tăiem (la următorul spațiu după 3000 de caractere)
        $cutPosition = $position + $targetLength;
        
        if ($cutPosition >= $totalLength) {
            // Ultimul capitol
            $chapterText = substr($text, $position);
        } else {
            // Căutăm următorul spațiu după poziția de tăiere
            $nextSpace = strpos($text, ' ', $cutPosition);
            if ($nextSpace === false) {
                $nextSpace = $totalLength;
            }
            $chapterText = substr($text, $position, $nextSpace - $position);
            $position = $nextSpace + 1; // +1 pentru a sări peste spațiu
        }

        $chapters[] = "Capitol " . $chapterNumber . "\n\n" . $chapterText;
        $chapterNumber++;
        
        if ($cutPosition >= $totalLength) {
            break;
        }
    }

    // Combină toate capitolele într-un singur text
    $formattedText = implode("\n\n", $chapters);

    echo json_encode([
        'success' => true,
        'text' => $formattedText,
        'chapters' => count($chapters)
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} 