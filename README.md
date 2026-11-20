# Flood Risk Predictor

AI/ML web app that estimates flood probability and a risk level (Low / Medium / High / Severe) for a district from rainfall,
river, terrain and soil inputs, and shows it on a colour-coded map with history, a multi-day trend and simulated alerts.
Academic decision-support prototype. **Not an official flood warning.**

Team 71, GLA University: Aniket Kumar Singh (leader, ML), Kshitij Tiwari (backend), Aviral Bajpai (frontend), Anmol Jaiswal (data, QA, docs).

## Start here
1. Read [`docs/TEAM_GUIDE.md`](docs/TEAM_GUIDE.md): GitHub setup, PC setup, daily workflow, and how to use AI tools.
2. Run the setup script once: `bash scripts/setup.sh` (macOS/Linux/Git Bash) or
   `powershell -ExecutionPolicy Bypass -File scripts/setup.ps1` (Windows).
3. Pick an issue from the board. Your AI playbook is in [`docs/ai/`](docs/ai/).

## Layout
| Folder | What | Owner |
|---|---|---|
| `ml/` | Features, training, evaluation, model artifact | Aniket |
| `backend/` | FastAPI API, database, weather client, alerts | Kshitij |
| `frontend/` | React + Leaflet app | Aviral |
| `data/`, `docs/` | Dataset notes, test plan, reports, guides | Anmol |

## Run it
```
uvicorn backend.app.main:app --reload     # API on http://localhost:8000/docs
cd frontend && npm run dev                # app on http://localhost:5173 (after the frontend is scaffolded)
pytest                                    # all Python tests
```
Rules for people and AI assistants: [`AGENTS.md`](AGENTS.md). API shapes: [`docs/api-contract.md`](docs/api-contract.md).
