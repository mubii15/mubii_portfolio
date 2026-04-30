<?php
// Always return JSON — suppress PHP HTML error output
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Custom error handler to return JSON even for fatal errors
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) return false;
    http_response_code(500);
    echo json_encode([
        "error" => "PHP Error",
        "message" => $errstr,
        "file" => basename($errfile),
        "line" => $errline
    ]);
    exit;
});

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && $error['type'] === E_ERROR) {
        http_response_code(500);
        echo json_encode([
            "error" => "PHP Fatal Error",
            "message" => $error['message'],
            "file" => basename($error['file']),
            "line" => $error['line']
        ]);
    }
});

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($requestPath, '/'));

// It might be accessed as http://localhost:8080/api/projects
// The URL path could be /api/projects
if ($pathParts[0] !== 'api') {
    // Also try serving uploaded files
    if (strpos($requestPath, '/uploads/') === 0) {
        $file = __DIR__ . $requestPath;
        if (file_exists($file)) {
            $mime = mime_content_type($file);
            header("Content-Type: $mime");
            readfile($file);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(["error" => "Not found", "path" => $requestPath]);
    exit;
}

$resource = $pathParts[1] ?? null;

if ($resource === 'projects') {
    require_once 'api/projects.php';
} elseif ($resource === 'upload') {
    require_once 'api/upload.php';
} elseif ($resource === 'thumbnails') {
    require_once 'api/thumbnails.php';
} else {
    http_response_code(404);
    echo json_encode(["error" => "API endpoint not found"]);
}
