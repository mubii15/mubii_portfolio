<?php
// Ensure this is only accessed via index.php
if (!isset($pdo)) exit;

$method = $_SERVER['REQUEST_METHOD'];

function handleCorsFlight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
handleCorsFlight();

// GET /api/projects or /api/projects?slug={slug} or /api/projects?id={id}
if ($method === 'GET') {
    if (isset($_GET['slug'])) {
        $slug = $_GET['slug'];
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE slug = ?");
        $stmt->execute([$slug]);
        $project = $stmt->fetch();
        
        if ($project) {
            $stmt = $pdo->prepare("SELECT * FROM project_blocks WHERE project_id = ? ORDER BY order_index ASC");
            $stmt->execute([$project['id']]);
            $project['blocks'] = $stmt->fetchAll();
            foreach ($project['blocks'] as &$block) {
                $block['data'] = json_decode($block['data'], true);
            }
            echo json_encode($project);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Project not found"]);
        }
    } elseif (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        $project = $stmt->fetch();
        
        if ($project) {
            $stmt = $pdo->prepare("SELECT * FROM project_blocks WHERE project_id = ? ORDER BY order_index ASC");
            $stmt->execute([$project['id']]);
            $project['blocks'] = $stmt->fetchAll();
            foreach ($project['blocks'] as &$block) {
                $block['data'] = json_decode($block['data'], true);
            }
            echo json_encode($project);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Project not found"]);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC");
        $projects = $stmt->fetchAll();
        
        if (!empty($projects)) {
            $projectIds = array_column($projects, 'id');
            $placeholders = implode(',', array_fill(0, count($projectIds), '?'));
            $blockStmt = $pdo->prepare("SELECT * FROM project_blocks WHERE project_id IN ($placeholders) ORDER BY order_index ASC");
            $blockStmt->execute($projectIds);
            $allBlocks = $blockStmt->fetchAll();
            
            foreach ($projects as &$project) {
                $project['blocks'] = [];
                foreach ($allBlocks as $block) {
                    if ($block['project_id'] == $project['id']) {
                        $block['data'] = json_decode($block['data'], true);
                        $project['blocks'][] = $block;
                    }
                }
            }
        }
        echo json_encode($projects);
    }
}

// POST /api/projects
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }
    
    $title = $data['title'] ?? '';
    $slug = $data['slug'] ?? '';
    $description = $data['description'] ?? '';
    $category = $data['category'] ?? '';
    $status = $data['status'] ?? 'draft';
    $cover_asset = $data['cover_asset'] ?? '';
    $item_type = $data['item_type'] ?? 'project';
    $blocks = $data['blocks'] ?? [];

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO projects (title, slug, description, category, status, cover_asset, item_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $slug, $description, $category, $status, $cover_asset, $item_type]);
        $projectId = $pdo->lastInsertId();

        if (!empty($blocks)) {
            $blockStmt = $pdo->prepare("INSERT INTO project_blocks (project_id, type, data, order_index) VALUES (?, ?, ?, ?)");
            foreach ($blocks as $idx => $block) {
                $blockStmt->execute([$projectId, $block['type'], json_encode($block['data']), $idx]);
            }
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "id" => $projectId]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// PUT /api/projects?id={id}
elseif ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing project ID"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    // Fetch existing row to merge (so partial edits don't blank fields)
    $existing = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
    $existing->execute([$id]);
    $row = $existing->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(["error" => "Project not found"]);
        exit;
    }

    $title      = $data['title']       ?? $row['title'];
    $slug       = $data['slug']        ?? $row['slug'];
    $description= $data['description'] ?? $row['description'];
    $category   = $data['category']    ?? $row['category'];
    $status     = $data['status']      ?? $row['status'];
    $cover_asset= $data['cover_asset'] ?? $row['cover_asset'];
    $item_type  = $data['item_type']   ?? $row['item_type'];
    $blocks     = $data['blocks']      ?? null;

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("UPDATE projects SET title = ?, slug = ?, description = ?, category = ?, status = ?, cover_asset = ?, item_type = ? WHERE id = ?");
        $stmt->execute([$title, $slug, $description, $category, $status, $cover_asset, $item_type, $id]);

        if ($blocks !== null) {
            $pdo->prepare("DELETE FROM project_blocks WHERE project_id = ?")->execute([$id]);
            if (!empty($blocks)) {
                $blockStmt = $pdo->prepare("INSERT INTO project_blocks (project_id, type, data, order_index) VALUES (?, ?, ?, ?)");
                foreach ($blocks as $idx => $block) {
                    $blockStmt->execute([$id, $block['type'], json_encode($block['data']), $idx]);
                }
            }
        }
        
        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// DELETE /api/projects?id={id}
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing project ID"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
