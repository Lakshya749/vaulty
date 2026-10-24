#!/bin/bash
cd "$(dirname "$0")"
export PATH="$(pwd)/.tools/node/bin:$PATH"

echo "=================================================="
echo "⚡ Starting Vaulty (SubTrack) - BCA Minor Project"
echo "Candidate: Lakshya Singh | Roll: 240919106122"
echo "=================================================="
(sleep 2 && open "http://localhost:3000") &
npm run dev
