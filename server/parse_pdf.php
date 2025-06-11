<?php
// Disable error reporting to prevent HTML output
error_reporting(0);
ini_set('display_errors', 0);

// Set PHP configuration for handling large PDF files
ini_set('upload_max_filesize', '20M');
ini_set('post_max_size', '20M');
ini_set('memory_limit', '256M');
ini_set('max_execution_time', '60');

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
    
    // Verifică dacă fișierul este un PDF valid folosind finfo în loc de mime_content_type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $type = finfo_file($finfo, $file);
    finfo_close($finfo);
    
    if ($type !== 'application/pdf') {
        throw new Exception('Fișierul încărcat nu este un PDF valid (detected: ' . $type . ')');
    }

    // Inițializează parserul PDF cu configurație personalizată
    $config = new \Smalot\PdfParser\Config();
    $config->setIgnoreEncryption(true); // Ignoră flag-ul de criptare dacă PDF-ul nu este de fapt criptat
    $parser = new \Smalot\PdfParser\Parser([], $config);
    
    // Parsează PDF-ul
    $pdf = $parser->parseFile($file);
    
    // Extrage textul
    $text = $pdf->getText();
    
    // Verifică dacă textul este gol (PDF scanat sau protejat)
    if (empty(trim($text))) {
        throw new Exception('PDF-ul pare să fie scanat sau protejat. Nu s-a putut extrage textul.');
    }
    
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