# Backend (FastAPI)

Owner: Kshitij. Run from the **repository root** with the virtual environment active:
```
uvicorn backend.app.main:app --reload     # http://localhost:8000  (docs at /docs)
pytest backend/tests
```
- `app/main.py` endpoints, `app/schemas.py` request/response models, `app/risk.py` risk levels and the stand-in scoring
  function, `app/sample_districts.py` mock districts for the map.
- Plug in the trained model by loading `ml/models/model.joblib` (a dict with `model`, `features`, `threshold`, `name`)
  and replacing `heuristic_probability` in `/predict`. Keep `inputs_used` and `disclaimer` in every response.
