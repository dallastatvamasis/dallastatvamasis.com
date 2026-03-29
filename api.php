<?php
/**
 * DTS Media Live – Song Queue API
 */

// Show ALL PHP errors in response (helps diagnose issues)
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

// ── DB credentials ─────────────────────────────────────────────────────────
$DB_NAME  = 'u691358696_dtssongs';
$DB_USER  = 'u691358696_dtssongs';
$DB_PASS  = 'Dtssongs@123';
$DB_TABLE = '`song-queue`';

// ── Try multiple hosts (Hostinger uses localhost or 127.0.0.1) ─────────────
$hosts   = ['localhost', '127.0.0.1', 'srv573.hstgr.io'];
$pdo     = null;
$connErr = [];

foreach ($hosts as $host) {
    try {
        $pdo = new PDO(
            "mysql:host={$host};dbname={$DB_NAME};charset=utf8mb4",
            $DB_USER, $DB_PASS,
            [PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
             PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
             PDO::ATTR_TIMEOUT            => 5]
        );
        break; // connected — stop trying
    } catch (PDOException $e) {
        $connErr[$host] = $e->getMessage();
        $pdo = null;
    }
}

// ── Parse action ───────────────────────────────────────────────────────────
$action = $_GET['action'] ?? '';
$body   = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true) ?? [];
    if (!$action) $action = $body['action'] ?? '';
}

// ── TEST endpoint: yoursite.com/api.php?action=test ────────────────────────
if ($action === 'test') {
    $result = [
        'php'        => PHP_VERSION,
        'pdo_mysql'  => extension_loaded('pdo_mysql') ? 'yes' : 'NO — pdo_mysql not loaded!',
        'attempts'   => $connErr,
        'connected'  => ($pdo !== null) ? 'YES' : 'NO',
    ];
    if ($pdo) {
        $result['host_used'] = array_values(array_diff($hosts, array_keys($connErr)))[0] ?? '?';
        try {
            $tables = $pdo->query("SHOW TABLES LIKE 'song-queue'")->fetchAll(PDO::FETCH_COLUMN);
            $result['table_exists'] = !empty($tables);
            if ($result['table_exists']) {
                $cols = $pdo->query("SHOW COLUMNS FROM {$DB_TABLE}")->fetchAll();
                $result['columns']   = array_column($cols, 'Field');
                $result['row_count'] = (int)$pdo->query("SELECT COUNT(*) FROM {$DB_TABLE}")->fetchColumn();
            }
        } catch (Exception $e) {
            $result['table_error'] = $e->getMessage();
        }
    }
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// ── All other actions require a live connection ────────────────────────────
if (!$pdo) {
    http_response_code(500);
    echo json_encode([
        'error'    => 'Could not connect to MySQL on any host',
        'attempts' => $connErr,
    ]);
    exit;
}

// ── Ensure id and sort_order columns exist ─────────────────────────────────
try {
    $cols = $pdo->query(
        "SELECT COLUMN_NAME FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'song-queue'"
    )->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('id', $cols)) {
        $pdo->exec("ALTER TABLE {$DB_TABLE} ADD COLUMN `id` INT AUTO_INCREMENT PRIMARY KEY FIRST");
    }
    if (!in_array('sort_order', $cols)) {
        $pdo->exec("ALTER TABLE {$DB_TABLE} ADD COLUMN `sort_order` INT DEFAULT 0");
        $pdo->exec("UPDATE {$DB_TABLE} SET sort_order = id");
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Schema check failed: ' . $e->getMessage()]);
    exit;
}

// ── Normalize row → front-end format ──────────────────────────────────────
function norm($row) {
    return [
        'id'     => (int)($row['id']     ?? 0),
        'name'   => $row['Name']         ?? '',
        'song'   => $row['Song']         ?? '',
        'status' => $row['status']       ?? 'waiting',
        'sort_order' => (int)($row['sort_order'] ?? 0),
    ];
}

// ── Router ─────────────────────────────────────────────────────────────────
try {
    switch ($action) {

        case 'get':
            $rows = $pdo->query("SELECT * FROM {$DB_TABLE} ORDER BY sort_order ASC, id ASC")->fetchAll();
            echo json_encode(array_map('norm', $rows));
            break;

        case 'add':
            $name = trim($body['name'] ?? '');
            $song = trim($body['song'] ?? '');
            if ($name === '' || $song === '') {
                http_response_code(400);
                echo json_encode(['error' => 'Name and song are required']);
                exit;
            }
            $maxOrd = (int)$pdo->query("SELECT COALESCE(MAX(sort_order),0) FROM {$DB_TABLE}")->fetchColumn();
            $st = $pdo->prepare("INSERT INTO {$DB_TABLE} (Name, Song, status, sort_order) VALUES (?,?,'waiting',?)");
            $st->execute([$name, $song, $maxOrd + 1]);
            echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
            break;

        case 'updateStatus':
            $id     = (int)($body['id']     ?? 0);
            $status = trim($body['status']  ?? '');
            if (!in_array($status, ['current','done','waiting'])) {
                http_response_code(400); echo json_encode(['error'=>'Invalid status']); exit;
            }
            if ($status === 'current')
                $pdo->exec("UPDATE {$DB_TABLE} SET status='waiting' WHERE status='current'");
            $st = $pdo->prepare("UPDATE {$DB_TABLE} SET status=? WHERE id=?");
            $st->execute([$status, $id]);
            echo json_encode(['success' => true]);
            break;

        case 'delete':
            $id = (int)($body['id'] ?? 0);
            $pdo->prepare("DELETE FROM {$DB_TABLE} WHERE id=?")->execute([$id]);
            echo json_encode(['success' => true]);
            break;

        case 'reorder':
            $ids = $body['ids'] ?? [];
            if (!is_array($ids)) { http_response_code(400); echo json_encode(['error'=>'ids must be array']); exit; }
            $st = $pdo->prepare("UPDATE {$DB_TABLE} SET sort_order=? WHERE id=?");
            foreach ($ids as $ord => $id) $st->execute([(int)$ord, (int)$id]);
            echo json_encode(['success' => true]);
            break;

        case 'promoteNext':
            $pdo->exec("UPDATE {$DB_TABLE} SET status='waiting' WHERE status='current'");
            $next = $pdo->query("SELECT id,Name FROM {$DB_TABLE} WHERE status='waiting' ORDER BY sort_order,id LIMIT 1")->fetch();
            if ($next) {
                $pdo->prepare("UPDATE {$DB_TABLE} SET status='current' WHERE id=?")->execute([$next['id']]);
                echo json_encode(['success'=>true, 'name'=>$next['Name']]);
            } else {
                echo json_encode(['success'=>false, 'error'=>'No waiting entries']);
            }
            break;

        case 'clear':
            $pdo->exec("DELETE FROM {$DB_TABLE}");
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Unknown action: ' . htmlspecialchars($action)]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
