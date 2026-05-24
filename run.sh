#!/usr/bin/env bash
# Supply Chain AI Value Navigator launcher
set -e
cd "$(dirname "$0")"
if [ ! -f supply_chain_demo_mapping.xlsx ]; then
  echo "[WARN] supply_chain_demo_mapping.xlsx not found in this folder."
  echo "       The app will start but Tab 1 will show an error banner."
fi
uv pip install -r requirements.txt --quiet
uv run app.py
