#!/bin/bash
cd "$(dirname "$0")"
echo "====================================================="
echo "   Pushing Vaulty to https://github.com/Lakshya749/vaulty"
echo "====================================================="
echo ""
git push -u origin main
echo ""
echo "====================================================="
echo "Push process finished. Press any key to close."
read -n 1 -s
