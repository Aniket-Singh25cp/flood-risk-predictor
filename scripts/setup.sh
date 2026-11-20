#!/usr/bin/env bash
# One-shot local setup for macOS / Linux / WSL / Git Bash. Run from the repository root: bash scripts/setup.sh
set -euo pipefail

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1. See docs/TEAM_GUIDE.md part B."; exit 1; }; }
need git; need python3; need node; need npm

PY=python3
$PY -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)' || { echo "Python 3.11+ required"; exit 1; }

[ -d .venv ] || $PY -m venv .venv
# shellcheck disable=SC1091
if [ -f .venv/bin/activate ]; then source .venv/bin/activate; else source .venv/Scripts/activate; fi
python -m pip install --upgrade pip
pip install -r backend/requirements.txt -r ml/requirements.txt ruff

[ -f .env ] || cp .env.example .env
if [ -f frontend/package.json ]; then (cd frontend && npm install); else echo "frontend/ not created yet (see frontend/README.md)"; fi

echo "Formatting and running checks..."
ruff check --fix . && ruff format . && pytest -q
echo "Setup OK. Activate the venv next time with:  source .venv/bin/activate   (Git Bash: source .venv/Scripts/activate)"
