# Flood Risk Predictor: instructions for AI assistants and agents

Read this file first. It applies to every AI tool used on this repository (Claude Code, GitHub Copilot,
Gemini CLI, ChatGPT/Claude chat, etc.). Humans should read it too.

## What this project is
A web app that takes rainfall, river level, elevation, soil and historical flood data for an Indian district and returns
a flood probability and a risk level (Low / Medium / High / Severe). It shows a colour-coded district map, a multi-day
trend, a historical flood overlay, a simulated alert and an admin log of predictions versus outcomes.
It is an academic decision-support prototype, NOT a certified warning system. Never claim otherwise in UI text or docs.

## Layout and owners
| Path | Purpose | Owner |
|---|---|---|
| `ml/` | Feature engineering, training, evaluation, saved model | Aniket |
| `backend/` | FastAPI service, DB, weather integration, alerts, admin API | Kshitij |
| `frontend/` | React + Vite app, Leaflet map, charts | Aviral |
| `data/`, `docs/`, `backend/tests`, `ml/tests` | Datasets notes, docs, test plan, QA | Anmol |

Stay inside your assigned folder unless the task says otherwise. If a change needs another area (for example a new API
field), update `docs/api-contract.md` and tell the owner in the PR instead of editing their code.

## Tech stack
- Python 3.11+, FastAPI, pydantic, SQLAlchemy (SQLite dev / PostgreSQL prod), pytest, ruff
- ML: pandas, scikit-learn, imbalanced-learn, xgboost, joblib
- Frontend: React (Vite), Leaflet + OpenStreetMap, Recharts
- Hosting: Render or Railway (backend), Vercel (frontend)

## Commands
```
# backend (from repo root, venv active)
uvicorn backend.app.main:app --reload          # run API on :8000
pytest                                         # all tests
ruff check . && ruff format --check .          # lint and format check

# ml
python -m ml.src.train --synthetic             # smoke-test the training pipeline

# frontend
cd frontend && npm install && npm run dev      # app on :5173
cd frontend && npm run lint && npm run build
```

## Rules that matter
1. **Contract first.** The API shape lives in `docs/api-contract.md` and FastAPI's `/openapi.json`. Do not change a
   request or response field without updating the contract and the tests in the same PR.
2. **Imbalance is the core ML problem.** Flood rows are rare. Evaluate with recall, precision, F1, ROC-AUC and a confusion
   matrix. Never report accuracy alone. Fit resampling (SMOTE) on the training split only, never before the split.
3. **No leakage.** Split before any scaling, imputing or resampling. Use time-aware splits where dates exist.
4. **Honest numbers.** Do not invent metrics, dataset facts, citations or links. If unknown, say so and add a TODO.
5. **Secrets.** Never put keys, tokens or passwords in code, notebooks, prompts or commits. Use `.env` (git-ignored).
6. **Data.** Raw datasets are not committed. Document source, licence and download steps in `data/README.md`.
7. **Small changes.** One issue per branch, one concern per PR, under about 400 changed lines.
8. **Tests.** New behaviour needs a test. Fix the failing test or the code; never delete or weaken a test to go green.
9. **Style.** Python formatted by ruff, type hints on public functions, short docstrings. React: function components,
   hooks, no class components. Keep UI text plain and accessible (text labels with colours, never colour alone).
10. **Disclaimers.** Every user-facing risk screen shows: "Decision-support estimate. Not an official flood warning."

## Git workflow
- Never commit to `main`. Branch: `feature/<area>-<short-name>` or `fix/<area>-<short-name>`.
- Commit messages: `type(area): summary`, for example `feat(backend): add /risk-map endpoint`.
  Types: feat, fix, docs, test, refactor, chore.
- Open a PR into `main`, fill in the template, get one teammate review, wait for green CI, squash merge.

## When working as an AI agent
- Start by reading this file, `docs/api-contract.md` and the issue text. Restate the task in two lines.
- Make a short plan, then change the minimum number of files. Run tests and lint before saying you are done.
- Explain what you changed and what you did NOT verify. Do not claim tests pass unless you ran them.
- Ask before adding a new dependency, deleting files, or touching files outside the owner's folder.
- Never run destructive commands (`git push --force`, `rm -rf`, dropping tables) without explicit approval.
