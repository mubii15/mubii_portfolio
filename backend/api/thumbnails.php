<?php
if (!$pdo) {
    http_response_code(503);
    echo json_encode([
        "error" => "Database unavailable",
        "details" => "The thumbnails API requires a working database connection."
    ]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

function handleCorsFlightThumbnails() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
handleCorsFlightThumbnails();

$thumbnailsDir = __DIR__ . '/../uploads/thumbnails/';
if (!is_dir($thumbnailsDir)) {
    mkdir($thumbnailsDir, 0777, true);
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM category_thumbnails");
    $thumbnails = $stmt->fetchAll();
    echo json_encode($thumbnails);
}
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    $category = $data['category'] ?? '';
    $source_url = $data['source_url'] ?? '';

    if (!$category || !$source_url) {
        http_response_code(400);
        echo json_encode(["error" => "Category and source_url are required"]);
        exit;
    }

    // Attempt to map the URL back to local filesystem 
    // Format: {APP_URL}/uploads/img/2026/04/unique-id.webp
    $localPath = '';
    $parsedUrl = parse_url($source_url, PHP_URL_PATH); // e.g. /uploads/img/...
    if (strpos($parsedUrl, '/uploads/') === 0) {
        $localPath = __DIR__ . '/..' . $parsedUrl;
    }

    if (!$localPath || !file_exists($localPath)) {
        http_response_code(404);
        echo json_encode(["error" => "Source file could not be located on server", "path" => $localPath]);
        exit;
    }

    // Try to determine image type
    $fileExt = strtolower(pathinfo($localPath, PATHINFO_EXTENSION));
    $image = null;
    switch($fileExt) {
        case 'jpg':
        case 'jpeg':
            $image = @imagecreatefromjpeg($localPath);
            break;
        case 'png':
            $image = @imagecreatefrompng($localPath);
            break;
        case 'gif':
            $image = @imagecreatefromgif($localPath);
            break;
        case 'webp':
            $image = @imagecreatefromwebp($localPath);
            break;
    }

    if (!$image) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to read source image."]);
        exit;
    }

    $origWidth = imagesx($image);
    $origHeight = imagesy($image);

    // Calculate center crop 1:1 aspect ratio
    $minDim = min($origWidth, $origHeight);
    $srcX = ($origWidth - $minDim) / 2;
    $srcY = ($origHeight - $minDim) / 2;

    $canvas = imagecreatetruecolor(1024, 1024);
    // Maintain transparency if needed (though webp handles it, we use solid background for safety or copy alpha)
    imagealphablending($canvas, false);
    imagesavealpha($canvas, true);
    
    // Crop and Resize
    imagecopyresampled($canvas, $image, 0, 0, $srcX, $srcY, 1024, 1024, $minDim, $minDim);
    imagedestroy($image);

    // See if one exists in DB to delete the old cropped file
    $stmt = $pdo->prepare("SELECT cropped_url FROM category_thumbnails WHERE category = ?");
    $stmt->execute([$category]);
    $existing = $stmt->fetch();
    
    if ($existing && $existing['cropped_url']) {
        $oldParsedUrl = parse_url($existing['cropped_url'], PHP_URL_PATH);
        if (strpos($oldParsedUrl, '/uploads/thumbnails/') === 0) {
            $oldLocalPath = __DIR__ . '/..' . $oldParsedUrl;
            if (file_exists($oldLocalPath)) {
                unlink($oldLocalPath);
            }
        }
    }

    $uniqueName = strtolower($category) . '-' . time() . '.webp';
    $targetPath = $thumbnailsDir . $uniqueName;

    if (imagewebp($canvas, $targetPath, 80)) {
        imagedestroy($canvas);
        $cropped_url = APP_URL . '/uploads/thumbnails/' . $uniqueName;

        // Upsert DB
        $stmt = $pdo->prepare("INSERT INTO category_thumbnails (category, original_url, cropped_url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE original_url = VALUES(original_url), cropped_url = VALUES(cropped_url)");
        $stmt->execute([$category, $source_url, $cropped_url]);

        echo json_encode([
            "success" => true, 
            "cropped_url" => $cropped_url
        ]);
    } else {
        imagedestroy($canvas);
        http_response_code(500);
        echo json_encode(["error" => "Failed to save cropped webp image."]);
    }

} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
