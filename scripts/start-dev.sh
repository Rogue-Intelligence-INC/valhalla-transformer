#!/usr/bin/env bash
# Start test API + Vue viz for valhalla-transformer
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

export VT_API_PORT="${VT_API_PORT:-8780}"
export VALHALLA_NATIVE_QA="${VALHALLA_NATIVE_QA:-$HOME/AI/Valhalla/target/release/valhalla_native_qa}"

echo "=== valhalla-transformer dev stack ==="
echo "API  : http://127.0.0.1:$VT_API_PORT"
echo "Viz  : http://127.0.0.1:5173 (proxy /api → API)"
echo "Native QA: ${VALHALLA_NATIVE_QA}"

cd "$ROOT/api"
npm install --silent 2>/dev/null || npm install
node server.js &
API_PID=$!

cd "$ROOT/viz"
npm install --silent 2>/dev/null || npm install
npm run dev &
VIZ_PID=$!

trap "kill $API_PID $VIZ_PID 2>/dev/null" EXIT
wait
