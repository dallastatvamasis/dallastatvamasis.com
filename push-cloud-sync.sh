#!/bin/bash
# push-cloud-sync.sh
# Merges remote changes and pushes all 3 cloud-sync updated files.
# Run from Terminal: bash push-cloud-sync.sh

set -e
cd "$(dirname "$0")"

echo "==> Saving updated files..."
cp public/obs-overlay.html /tmp/_obs.html
cp public/song-queue-display.html /tmp/_sqd.html
cp public/song-queue.html /tmp/_sq.html

echo "==> Fetching remote..."
git fetch origin

echo "==> Resetting to remote main..."
git reset --hard origin/main

echo "==> Restoring updated files..."
cp /tmp/_obs.html public/obs-overlay.html
cp /tmp/_sqd.html public/song-queue-display.html
cp /tmp/_sq.html public/song-queue.html

echo "==> Committing..."
git add public/obs-overlay.html public/song-queue-display.html public/song-queue.html
git commit -m "Add cloud sync (GitHub repo) to obs-overlay, song-queue-display, song-queue"

echo "==> Pushing..."
git push origin main

echo ""
echo "✅ Done! All 3 files are now live on GitHub."
