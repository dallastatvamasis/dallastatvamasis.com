<?php
/**
 * obs-photos-upload.php
 * Place at: dallastatvamasis.com/obs-photos-upload.php
 *
 * Actions: upload | caption | delete | list | reorder
 */
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

define('PHOTOS_DIR', __DIR__ . '/obs-photos/');
define('MANIFEST',   PHOTOS_DIR . 'photos.json');   /* captions */
define('ORDER_FILE', PHOTOS_DIR . 'order.json');     /* custom display order */
define('MAX_MB',     20);
define('MAX_N',      60);
define('ALLOWED',    ['image/jpeg','image/png','image/webp']);

if (!is_dir(PHOTOS_DIR)) mkdir(PHOTOS_DIR, 0755, true);

/* ── helpers ── */
function readJson(string $path): array {
    if (!file_exists($path)) return [];
    $d = json_decode(file_get_contents($path), true);
    return is_array($d) ? $d : [];
}
function writeJson(string $path, $data): void {
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
}
function safeName(string $s): string {
    return preg_replace('/[^a-z0-9_\-\.]/i','_', basename($s));
}
function allPhotoFiles(): array {
    $files = [];
    for ($i=1; $i<=MAX_N; $i++) {
        $n = sprintf('photo_%02d.jpg',$i);
        if (file_exists(PHOTOS_DIR.$n)) $files[] = $n;
    }
    return $files;
}
function orderedPhotoFiles(): array {
    $order    = readJson(ORDER_FILE);   /* custom order saved by manager */
    $existing = allPhotoFiles();
    if (empty($order)) return $existing;
    /* merge: custom order first, then any not in order appended */
    $result = [];
    foreach ($order as $n) {
        if (in_array($n, $existing, true)) $result[] = $n;
    }
    foreach ($existing as $n) {
        if (!in_array($n, $result, true)) $result[] = $n;
    }
    return $result;
}

$action = $_POST['action'] ?? $_GET['action'] ?? 'list';

/* ════════ LIST ════════ */
if ($action === 'list') {
    $manifest = readJson(MANIFEST);
    $files    = orderedPhotoFiles();
    $photos   = array_map(fn($n) => [
        'name'    => $n,
        'caption' => $manifest[$n] ?? '',
        'url'     => '/obs-photos/'.$n,
    ], $files);
    echo json_encode(['ok'=>true,'photos'=>$photos,'count'=>count($photos)]);
    exit;
}

/* ════════ UPLOAD ════════ */
if ($action === 'upload') {
    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['ok'=>false,'error'=>'No file or upload error']);
        exit;
    }
    $file    = $_FILES['photo'];
    $name    = safeName($_POST['filename'] ?? $file['name']);
    $caption = trim($_POST['caption'] ?? '');

    if (!preg_match('/^photo_\d{2}\.(jpg|jpeg|png|webp)$/i', $name))
        $name = sprintf('photo_%02d.jpg', (time() % MAX_N)+1);
    $name = preg_replace('/\.(png|webp|jpeg)$/i','.jpg',$name);

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    if (!in_array($mime, ALLOWED)) {
        http_response_code(415); echo json_encode(['ok'=>false,'error'=>'Type not allowed']); exit;
    }
    if ($file['size'] > MAX_MB*1024*1024) {
        http_response_code(413); echo json_encode(['ok'=>false,'error'=>'Too large']); exit;
    }
    if (!move_uploaded_file($file['tmp_name'], PHOTOS_DIR.$name)) {
        http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Save failed']); exit;
    }

    $manifest        = readJson(MANIFEST);
    $manifest[$name] = $caption;
    writeJson(MANIFEST, $manifest);

    /* Append to order if not already present */
    $order = readJson(ORDER_FILE);
    if (!in_array($name, $order, true)) { $order[] = $name; writeJson(ORDER_FILE, $order); }

    echo json_encode(['ok'=>true,'filename'=>$name,'caption'=>$caption]);
    exit;
}

/* ════════ CAPTION ════════ */
if ($action === 'caption') {
    $name    = safeName($_POST['filename'] ?? '');
    $caption = trim($_POST['caption'] ?? '');
    if (!preg_match('/^photo_\d{2}\.jpg$/i',$name)) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Bad name']); exit;
    }
    if (!file_exists(PHOTOS_DIR.$name)) {
        http_response_code(404); echo json_encode(['ok'=>false,'error'=>'Not found']); exit;
    }
    $manifest = readJson(MANIFEST);
    $manifest[$name] = $caption;
    writeJson(MANIFEST, $manifest);
    echo json_encode(['ok'=>true,'filename'=>$name,'caption'=>$caption]);
    exit;
}

/* ════════ DELETE ════════ */
if ($action === 'delete') {
    $name = safeName($_POST['filename'] ?? '');
    if (!preg_match('/^photo_\d{2}\.jpg$/i',$name)) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Bad name']); exit;
    }
    if (!file_exists(PHOTOS_DIR.$name)) {
        http_response_code(404); echo json_encode(['ok'=>false,'error'=>'Not found']); exit;
    }
    unlink(PHOTOS_DIR.$name);
    $manifest = readJson(MANIFEST);
    unset($manifest[$name]);
    writeJson(MANIFEST, $manifest);
    $order = readJson(ORDER_FILE);
    writeJson(ORDER_FILE, array_values(array_filter($order, fn($n)=>$n!==$name)));
    echo json_encode(['ok'=>true,'deleted'=>$name]);
    exit;
}

/* ════════ REORDER ════════ */
if ($action === 'reorder') {
    $raw   = $_POST['order'] ?? '[]';
    $order = json_decode($raw, true);
    if (!is_array($order)) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Invalid order']); exit;
    }
    /* Validate — only allow known photo_NN.jpg filenames */
    $existing = allPhotoFiles();
    $clean    = array_values(array_filter($order,
        fn($n) => preg_match('/^photo_\d{2}\.jpg$/i',$n) && in_array($n,$existing,true)
    ));
    writeJson(ORDER_FILE, $clean);
    echo json_encode(['ok'=>true,'order'=>$clean,'count'=>count($clean)]);
    exit;
}

/* ════════ SETTINGS — write config.json ════════ */
if ($action === 'settings') {
    $cfg = [
        'event'   => trim($_POST['event']  ?? ''),
        'sub'     => trim($_POST['sub']    ?? ''),
        'ticker'  => trim($_POST['ticker'] ?? ''),
        'dt'      => trim($_POST['dt']     ?? ''),
        'dur'     => intval($_POST['dur']  ?? 8),
        'updated' => date('Y-m-d H:i:s'),
    ];
    $configPath = PHOTOS_DIR . 'config.json';
    if (file_put_contents($configPath, json_encode($cfg, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['ok' => true, 'saved' => $cfg]);
    } else {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Could not write config.json']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['ok'=>false,'error'=>'Unknown action: '.$action]);
