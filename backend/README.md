# Backend (FastAPI)

Owner: Kshitij. Run from the **repository root** with the virtual environment active:
```
uvicorn backend.app.main:app --reload     # http://localhost:8000  (docs at /docs)
pytest backend/tests
```
- `app/main.py` endpoints, `app/schemas.py` request/response models, `app/risk.py` risk levels and the stand-in scoring
  function, `app/sample_districts.py` mock districts for the map.
- `app/db.py` SQLAlchemy SQLite setup, `app/models.py` database tables and `app/seed.py` district seed data.
  Tables are created and sample districts seeded automatically at API startup.
- `app/model.py` loads `ml/models/model.joblib` once at startup when present. The artifact must contain
  `model`, `features`, `threshold` and `name`; when missing, `/predict` and `/risk-map` keep using the heuristic.
  Keep `inputs_used` and the decision-support disclaimer in every prediction response.
