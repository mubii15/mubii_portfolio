<?php
// Ensure this is only accessed via index.php
if (!isset($pdo)) exit;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "No file uploaded or upload error", "details" => $_FILES['file']['error'] ?? 'No file key']);
    exit;
}

$file = $_FILES['file'];
$fileName = basename($file['name']);
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

$allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

if (!in_array($fileExt, $allowedExts)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid file type. Only images allowed."]);
    exit;
}

// Generate subfolder path like uploads/img/2026/04/
$year = date('Y');
$month = date('m');
$relativeSubDir = 'img/' . $year . '/' . $month . '/';
$uploadDir = __DIR__ . '/../uploads/' . $relativeSubDir;

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Generate unique WebP filename
$uniqueName = uniqid() . '-' . time() . '.webp';
$targetPath = $uploadDir . $uniqueName;
$tmpName = $file['tmp_name'];

// Create image resource from temp file
$image = null;
switch($fileExt) {
    case 'jpg':
    case 'jpeg':
        $image = imagecreatefromjpeg($tmpName);
        break;
    case 'png':
        $image = imagecreatefrompng($tmpName);
        if ($image) {
            imagepalettetotruecolor($image);
            imagealphablending($image, true);
            imagesavealpha($image, true);
        }
        break;
    case 'gif':
        $image = imagecreatefromgif($tmpName);
        if ($image) imagepalettetotruecolor($image);
        break;
    case 'webp':
        $image = imagecreatefromwebp($tmpName);
        break;
}

if (!$image) {
    $err = error_get_last();
    http_response_code(500);
    echo json_encode(["error" => "Failed to process image.", "details" => $err['message'] ?? 'Unknown GD error']);
    exit;
}

if (!function_exists('imagewebp')) {
    http_response_code(500);
    echo json_encode(["error" => "WebP conversion not supported by server GD library."]);
    exit;
}

// Convert and save as WebP with 80% quality compression
$saved = imagewebp($image, $targetPath, 80);

if ($saved) {
    imagedestroy($image);
    // URL accessible from the frontend via nginx/apache proxy
    $url = 'http://localhost:8080/uploads/' . $relativeSubDir . $uniqueName;
    echo json_encode(["success" => true, "url" => $url]);
} else {
    $err = error_get_last();
    imagedestroy($image);
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to convert and save WebP.",
        "detail" => $err['message'] ?? "imagewebp() returned false",
        "target" => $targetPath,
        "dir_writable" => is_writable(dirname($targetPath)),
        "dir_exists" => is_dir(dirname($targetPath)),
        "php_user" => posix_getpwuid(posix_geteuid())['name'] ?? 'unknown'
    ]);
}
