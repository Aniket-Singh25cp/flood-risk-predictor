# ML pipeline

Owner: Aniket (Anmol supports data and EDA).
```
python -m ml.src.train --synthetic          # smoke test with FAKE data (numbers are meaningless)
python -m ml.src.train --csv data/processed/flood.csv    # real data: FEATURES columns + `flood` label
pytest ml/tests
```
Rules: split first, resample only the training data (SMOTE is inside the pipeline), choose the threshold on the validation
set, report on the untouched test set with recall, precision, F1, ROC-AUC, PR-AUC and the confusion matrix.
The saved artifact `ml/models/model.joblib` is git-ignored; share it through the release page or a drive link, and record
the model version in `backend/app/risk.py`.
