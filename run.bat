@echo off
REM Supply Chain AI Value Navigator launcher
setlocal
cd /d %~dp0
if not exist supply_chain_demo_mapping.xlsx (
  echo [WARN] supply_chain_demo_mapping.xlsx not found in this folder.
  echo        The app will start but Tab 1 will show an error banner.
)
uv pip install -r requirements.txt --quiet
uv run app.py
endlocal
