# Kshitij: Backend and Deployment, AI playbook

You own `backend/`: endpoints, validation, database, weather client, alerts, admin API and the deployed API.

## Where AI helps you
| Task | Let AI do | You must do |
|---|---|---|
| Endpoint boilerplate | Generate route, schema and test | Confirm it matches `docs/api-contract.md` |
| SQL models and queries | Draft SQLAlchemy models and seed scripts | Review indexes, nulls and migrations |
| External API client | Draft Open-Meteo calls, caching, retries | Test with the network off, handle failure |
| Security | Run a STRIDE-style review of your endpoints | Decide the fixes; never paste real keys into any AI |
| Deployment | Draft Render/Railway config and environment checklist | Set secrets in the dashboard yourself |

## Prompt cards
**1. New endpoint, test first**
> Read `docs/api-contract.md` and `backend/app/main.py`. Add `GET /districts` that returns [fields]. First write pytest tests
> (happy path, empty table, bad query), then the endpoint, then update the contract. Show me the plan before editing.

**2. Replace the heuristic with the model**
> `ml/models/model.joblib` is a dict with keys model, features, threshold, name. Load it once at startup (not per request),
> use it in `/predict` and `/risk-map`, keep `heuristic_probability` as a labelled fallback if the file is missing, and
> return the artifact name in `model_version`. Add tests for both paths.

**3. Weather client with fallback**
> Write an Open-Meteo client for daily precipitation for latitude/longitude with a 30-minute in-memory cache, a 5-second
> timeout, and a fallback to the last cached value with a `source: "cached"` flag. Mock the HTTP calls in tests.

**4. Security review**
> Review `backend/app` using STRIDE. List threats, impact, and a concrete fix for each. Focus on input validation, the admin
> token, CORS, rate limiting and logging of personal or secret data.

**5. Deploy**
> Give me a step-by-step checklist to deploy this FastAPI app to [Render/Railway]: start command, Python version, env vars
> from `.env.example`, health check path `/health`, and how to roll back. Mark anything you are unsure about.

## Verify before you trust
- `pytest` and `ruff` pass locally; open `/docs` and call every endpoint by hand once.
- Invalid input returns 422, not a 500. Optional inputs missing still returns a result and `inputs_used` says so.
- No secrets in the diff (`git diff --staged`). `.env` is not tracked (`git status`).
- Contract file and code agree. Tell Aviral in the PR when a field changes.

## Deployment notes
Free tiers sleep when idle, so the first request can be slow: add a loading state request to Aviral's issue and a keep-alive ping if needed.
Set `CORS_ORIGINS` to the Vercel URL after the frontend is live.
