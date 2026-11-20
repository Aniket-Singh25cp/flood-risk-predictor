Follow the rules in `AGENTS.md` at the repository root. In short:
- This is a FastAPI + React + scikit-learn flood-risk prototype; stay inside the folder you are asked to change.
- The API contract is `docs/api-contract.md`; do not change it silently.
- Flood data is imbalanced: use recall/precision/F1/ROC-AUC, split before resampling, never report accuracy alone.
- Never output secrets, invented metrics, invented citations or invented links.
- Add or update tests with every behaviour change; format Python with ruff; use type hints.
