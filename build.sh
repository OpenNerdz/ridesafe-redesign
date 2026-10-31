#!/usr/bin/env bash
# Full build: images (cached), map preview (cached), then the static site into dist/.
set -euo pipefail
cd "$(dirname "$0")"
python3 -I tools/images.py
[ -f assets/map.webp ] || python3 -I tools/map.py
node build.mjs
