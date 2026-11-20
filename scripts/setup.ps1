# One-shot local setup for Windows PowerShell. Run from the repository root:
#   powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
$ErrorActionPreference = "Stop"

function Need($cmd) { if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { Write-Error "Missing: $cmd. See docs/TEAM_GUIDE.md part B."; exit 1 } }
Need git; Need node; Need npm

# Prefer the Python launcher; fall back to python
if (Get-Command py -ErrorAction SilentlyContinue) { $py = "py" } else { Need python; $py = "python" }
& $py -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)"
if ($LASTEXITCODE -ne 0) { Write-Error "Python 3.11+ required"; exit 1 }

if (-not (Test-Path ".venv")) { & $py -m venv .venv }
& .\.venv\Scripts\python.exe -m pip install --upgrade pip
& .\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt -r ml/requirements.txt ruff

if (-not (Test-Path ".env")) { Copy-Item .env.example .env }
if (Test-Path "frontend/package.json") { Push-Location frontend; npm install; Pop-Location }
else { Write-Host "frontend/ not created yet (see frontend/README.md)" }

Write-Host "Formatting and running checks..."
& .\.venv\Scripts\ruff.exe check --fix .
& .\.venv\Scripts\ruff.exe format .
& .\.venv\Scripts\python.exe -m pytest -q
Write-Host "Setup OK. Activate the venv next time with:  .\.venv\Scripts\Activate.ps1"
