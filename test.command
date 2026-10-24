#!/bin/bash
cd "$(dirname "$0")"
export PATH="$(pwd)/.tools/node/bin:$PATH"

echo "=================================================="
echo "⚡ Running Mathematical Logic Unit Tests (Vitest)"
echo "Candidate: Lakshya Singh | Roll: 240919106122"
echo "=================================================="
npm test
read -p "Press [Enter] to exit..."
