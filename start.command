#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR" || exit 1

export PATH="$PROJECT_DIR/.tools/node/bin:$PROJECT_DIR/.tools/bin:$PATH"

echo "=================================================="
echo "⚡ Starting Vaulty (SubTrack) - BCA Minor Project"
echo "Candidate: Lakshya Singh | Roll: 240919106122"
echo "College: IMS Noida (CCSU) | Subject: BCA-508"
echo "=================================================="
echo "🌐 Permanent 24/7 Live URL: https://lakshya749.github.io/vaulty/"
echo "🌐 Local Instance:          http://localhost:3000"
echo "=================================================="
echo "Starting local dev server..."

# Open browser automatically after 2 seconds
(sleep 2 && open "http://localhost:3000") &

# Start dev server
npm run dev
