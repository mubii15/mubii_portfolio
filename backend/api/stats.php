<?php
if (!isset($pdo)) exit;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(["error" => "Method not allowed"]));
}

try {
    $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC");
    $allProjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalProjects = 0;
    $totalMedia = 0;
    $categories = [];
    $recentActivity = [];

    foreach ($allProjects as $project) {
        $totalProjects++;
        $totalMedia++; // Count the cover asset
        
        $categories[$project['category']] = true;

        if (!empty($project['blocks'])) {
            $blocks = json_decode($project['blocks'], true);
            if (is_array($blocks)) {
                foreach ($blocks as $block) {
                    if ($block['type'] === 'image' || $block['type'] === 'video') {
                        $totalMedia++;
                    }
                }
            }
        }
    }

    // Get 4 most recent additions
    $recentCount = 0;
    foreach ($allProjects as $project) {
        if ($recentCount >= 4) break;
        $recentActivity[] = [
            'id' => $project['id'],
            'title' => $project['title'],
            'category' => $project['category'],
            'cover' => $project['cover_asset'],
            'created_at' => $project['created_at']
        ];
        $recentCount++;
    }

    $stats = [
        'totalProjects' => $totalProjects,
        'totalMedia' => $totalMedia,
        'totalCategories' => count($categories),
        'recentActivity' => $recentActivity
    ];

    echo json_encode($stats);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "details" => $e->getMessage()]);
}
