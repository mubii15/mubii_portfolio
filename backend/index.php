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

// It might be accessed as https://mubii.com.ng/api/projects
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
    
    // Dynamic Sitemap Generator
    if ($requestPath === '/sitemap.xml') {
        require_once 'config.php';
        $db = getDB();
        $stmt = $db->query("SELECT id, updated_at FROM projects WHERE status = 'published' ORDER BY updated_at DESC");
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $FRONTEND_URL = defined('APP_URL') ? APP_URL : (getenv('APP_URL') ?: getenv('SITE_URL') ?: 'https://mubii.com.ng');
        
        $xml = new XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        $xml->startDocument('1.0', 'UTF-8');
        $xml->startElement('urlset');
        $xml->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        
        $staticRoutes = ['/', '/about', '/contact', '/gallery/all', '/gallery/photography', '/gallery/cinematography', '/gallery/vfx', '/gallery/contemporary-art'];
        $now = date('Y-m-d');
        
        foreach ($staticRoutes as $route) {
            $xml->startElement('url');
            $xml->writeElement('loc', $FRONTEND_URL . $route);
            $xml->writeElement('lastmod', $now);
            $xml->writeElement('changefreq', 'weekly');
            $xml->writeElement('priority', $route === '/' ? '1.0' : '0.8');
            $xml->endElement();
        }
        
        foreach ($projects as $project) {
            $date = !empty($project['updated_at']) ? substr($project['updated_at'], 0, 10) : $now;
            $xml->startElement('url');
            $xml->writeElement('loc', $FRONTEND_URL . '/project/' . $project['id']);
            $xml->writeElement('lastmod', $date);
            $xml->writeElement('changefreq', 'monthly');
            $xml->writeElement('priority', '0.6');
            $xml->endElement();
        }
        
        $xml->endElement();
        $xml->endDocument();
        
        header("Content-Type: text/xml; charset=UTF-8");
        echo $xml->outputMemory();
        exit;
    }

    http_response_code(404);
    echo json_encode(["error" => "Not found", "path" => $requestPath]);
    exit;
}

$resource = $pathParts[1] ?? null;

$requiresDb = in_array($resource, ['projects', 'thumbnails', 'thumb', 'stats', 'settings'], true);
if ($requiresDb && !$pdo) {
    http_response_code(503);
    echo json_encode([
        "error" => "Database unavailable",
        "details" => "The API request requires a working database connection."
    ]);
    exit;
}

if ($resource === 'projects') {
    require_once 'api/projects.php';
} elseif ($resource === 'upload') {
    require_once 'api/upload.php';
} elseif ($resource === 'thumbnails') {
    require_once 'api/thumbnails.php';
} elseif ($resource === 'thumb') {
    require_once 'api/thumb.php';
} elseif ($resource === 'stats') {
    require_once 'api/stats.php';
} elseif ($resource === 'settings') {
    require_once 'api/settings.php';
} else {
    http_response_code(404);
    echo json_encode(["error" => "API endpoint not found"]);
}
