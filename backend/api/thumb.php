<?php
$pathParam = $_GET['path'] ?? '';
if (!$pathParam) {
    http_response_code(400);
    exit(json_encode(["error" => "No path provided"]));
}

// Ensure the Content-Type header doesn't stay application/json if we plan to serve an image directly
// But we actually plan to redirect to the image URL, which is handled by index.php or Nginx
// Let's just output a Location header

$parsedUrl = parse_url($pathParam, PHP_URL_PATH);
$relativePath = str_replace('/uploads/', '', $parsedUrl);
$relativePath = ltrim($relativePath, '/');

$originalFile = __DIR__ . '/../uploads/' . $relativePath;
if (!file_exists($originalFile) || !is_file($originalFile)) {
    http_response_code(404);
    exit(json_encode(["error" => "Not found"]));
}

$cacheDir = __DIR__ . '/../uploads/cache/';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

// Generate a deterministic cache filename based on original path and modification time
$fileMtime = filemtime($originalFile);
$hash = md5($relativePath . $fileMtime);
$cacheFileName = $hash . '.webp';
$cacheFile = $cacheDir . $cacheFileName;

// If cache doesn't exist, generate it
if (!file_exists($cacheFile)) {
    $ext = strtolower(pathinfo($originalFile, PATHINFO_EXTENSION));
    $image = null;
    
    switch($ext) {
        case 'jpg':
        case 'jpeg': $image = @imagecreatefromjpeg($originalFile); break;
        case 'png':  $image = @imagecreatefrompng($originalFile); break;
        case 'gif':  $image = @imagecreatefromgif($originalFile); break;
        case 'webp': $image = @imagecreatefromwebp($originalFile); break;
    }
    
    if ($image) {
        $origWidth = imagesx($image);
        $origHeight = imagesy($image);
        
        $maxWidth = 1000;
        if ($origWidth > $maxWidth) {
            $ratio = $maxWidth / $origWidth;
            $newWidth = $maxWidth;
            $newHeight = (int)($origHeight * $ratio);
            
            $thumb = imagecreatetruecolor($newWidth, $newHeight);
            
            // Handle transparency
            if ($ext === 'png' || $ext === 'webp' || $ext === 'gif') {
                imagealphablending($thumb, false);
                imagesavealpha($thumb, true);
                $transparent = imagecolorallocatealpha($thumb, 255, 255, 255, 127);
                imagefilledrectangle($thumb, 0, 0, $newWidth, $newHeight, $transparent);
            }
            
            imagecopyresampled($thumb, $image, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
            imagewebp($thumb, $cacheFile, 85); // 85% quality for preview
            imagedestroy($thumb);
        } else {
            // Already small enough, just save as low quality webp
            imagewebp($image, $cacheFile, 85);
        }
        imagedestroy($image);
    }
}

// If we failed to generate cache for some reason, redirect to original URL
if (!file_exists($cacheFile)) {
    header("Location: " . APP_URL . "/uploads/" . $relativePath);
    exit;
}

// Redirect to cached file
header("Location: " . APP_URL . "/uploads/cache/" . $cacheFileName);
exit;
