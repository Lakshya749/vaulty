#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR" || exit 1

export PATH="$PROJECT_DIR/.tools/node/bin:$PROJECT_DIR/.tools/bin:$PATH"

echo "=================================================="
echo "⚡ Starting Vaulty (SubTrack) - BCA Minor Project"
echo "Candidate: Lakshya Singh | Roll: 240919106122"
echo "College: IMS Noida (CCSU) | Subject: BCA-508"
echo "=================================================="
echo "Starting local server and public Cloudflare Tunnel..."

# Start Cloudflare Tunnel in background and capture URL
mkdir -p "$PROJECT_DIR/.tools/logs"
"$PROJECT_DIR/.tools/bin/cloudflared" tunnel --url http://localhost:3000 > "$PROJECT_DIR/.tools/logs/tunnel.log" 2>&1 &
TUNNEL_PID=$!

# Open browser automatically after 3 seconds
(
  sleep 3
  open "http://localhost:3000"
  sleep 3
  LIVE_URL=$(grep -o 'https://.*\.trycloudflare\.com' "$PROJECT_DIR/.tools/logs/tunnel.log" | tail -n 1)
  if [ -n "$LIVE_URL" ]; then
    echo "=================================================="
    echo "🌐 LIVE PUBLIC DEPLOYMENT URL FOR DEMO / FACULTY:"
    echo "$LIVE_URL"
    echo "=================================================="
  fi
) &

# Start dev server
npm run dev

# Cleanup tunnel on exit
kill $TUNNEL_PID 2>/dev/null
