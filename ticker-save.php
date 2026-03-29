<?php
// ── ticker-save.php ────────────────────────────────────────────────────
// Saves posted content to ticker.txt
// Place this file in public_html alongside ticker.txt
//
// SECURITY: Set a password below. Access the admin page as:
//   https://dallastatvamasis.com/ticker-admin.html
// ──────────────────────────────────────────────────────────────────────

// ── CORS header (allows OBS browser source to read ticker.txt) ─────────
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/plain; charset=utf-8');

// ── Only allow POST ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

// ── Get content ───────────────────────────────────────────────────────
$content = isset($_POST['content']) ? $_POST['content'] : '';

// ── Basic sanitize — strip null bytes ─────────────────────────────────
$content = str_replace("\0", '', $content);

// ── Write to ticker.txt (same folder as this PHP file) ────────────────
$file = __DIR__ . '/ticker.txt';

if (file_put_contents($file, $content) !== false) {
    echo 'OK';
} else {
    http_response_code(500);
    echo 'ERROR: Could not write ticker.txt — check file permissions (chmod 644)';
}
?>
