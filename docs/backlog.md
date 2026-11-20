# Backlog (issues to create)

Generated together with `scripts/create_issues.sh`. Build weeks (BW) are relative to the build start, **17 Nov 2026 = BW1 day 1**.
If the real deadline is earlier than the end of BW6, drop **Should** items first, then keep **Must** items only.


## BW1

| Owner | Area | Priority | Task | Acceptance |
|---|---|---|---|---|
| Anmol | data | Must | Download baseline flood datasets and document them in data/README.md | GIVEN the Kaggle flood datasets WHEN a teammate follows data/README.md THEN they can download the same files; source, licence, columns, label meaning and class balance are written down |
| Anmol | data | Must | EDA notebook: class balance, missing values, correlations | GIVEN the dataset WHEN the notebook runs top to bottom THEN it shows flood vs non-flood counts, missing values per column and a correlation view, with 5 written findings |
| Aniket | ml | Must | Define features and target; train Logistic Regression baseline | GIVEN prepared data WHEN python -m ml.src.train --csv runs THEN recall, precision, F1, ROC-AUC and the confusion matrix are printed for the baseline |
| Kshitij | backend | Must | Run API locally and add database models (District, WeatherObs, Prediction) | GIVEN a fresh clone WHEN setup is run THEN pytest passes and the API serves /docs; tables for districts, observations and prediction log exist with a migration or create_all script |
| Aviral | frontend | Must | Scaffold Vite React app and call /health | GIVEN the backend running WHEN npm run dev THEN the page shows the API status and model_version; CI frontend job passes |
| Aviral | frontend | Should | Wireframes for form, map, trend, alert and admin screens | GIVEN the feature list WHEN wireframes are shared THEN the team has approved the 5 screens and the risk colour/label scheme |

## BW2

| Owner | Area | Priority | Task | Acceptance |
|---|---|---|---|---|
| Aniket | ml | Must | Imbalance handling: class weights vs SMOTE with correct splits | GIVEN train/validation/test splits WHEN models are compared THEN a table shows each method's recall and precision on the test set, and resampling touches only training data |
| Kshitij | backend | Must | Seed districts table and add GET /districts | GIVEN the seed script WHEN GET /districts is called THEN it returns id, name, state, centre point and elevation for each district; contract updated |
| Aviral | frontend | Must | Input form wired to POST /predict with risk badge | GIVEN valid inputs WHEN the form is submitted THEN probability and a colour plus text level are shown with the disclaimer; invalid inputs show clear messages; missing optional inputs still work |
| Anmol | data | Must | Test plan v1 and pytest fixtures for API and data checks | GIVEN docs/test-plan.md WHEN reviewed THEN it lists test types, owners and exit criteria; fixtures exist for valid and invalid /predict payloads |

## BW3

| Owner | Area | Priority | Task | Acceptance |
|---|---|---|---|---|
| Aniket | ml | Must | Train Random Forest and XGBoost; tune; model comparison table | GIVEN the same splits WHEN all three models are evaluated THEN one table compares them on recall, precision, F1, ROC-AUC, PR-AUC and false negatives |
| Kshitij | backend | Should | Open-Meteo forecast client with caching and fallback | GIVEN a district WHEN forecast is requested THEN rainfall for the next days is returned; on API failure the last cached or manual value is used and the response says so |
| Aviral | frontend | Must | Leaflet district map coloured by /risk-map | GIVEN /risk-map WHEN the map loads THEN each district shows a colour and text level, a legend and a popup with probability |
| Anmol | data | Should | Clean historical flood events and load them into the database | GIVEN a flood history source WHEN the loader runs THEN events (district, date, severity, source) are stored and counted in a short report |

## BW4

| Owner | Area | Priority | Task | Acceptance |
|---|---|---|---|---|
| Aniket | ml | Must | ROC-based thresholds and saved model artifact | GIVEN the best model WHEN thresholds are chosen on validation data THEN model.joblib stores model, features, threshold and name, and the test-set report is saved in docs/ |
| Kshitij | backend | Must | Load the model artifact in /predict and /risk-map | GIVEN ml/models/model.joblib WHEN /predict is called THEN probability comes from the model, model_version changes, and tests still pass; heuristic remains only as a fallback |
| Kshitij | backend | Should | Add GET /trend and GET /history | GIVEN a district WHEN the endpoints are called THEN they return the shapes in docs/api-contract.md; contract and tests updated |
| Aviral | frontend | Should | Historical overlay and multi-day trend chart | GIVEN a selected district WHEN the panel opens THEN past events and the next-days risk chart are shown |

## BW5

| Owner | Area | Priority | Task | Acceptance |
|---|---|---|---|---|
| Kshitij | backend | Should | Alert simulation endpoint, alert log and admin logs endpoint with token | GIVEN risk at or above High WHEN an alert is simulated THEN it is stored; GET /admin/logs without the token returns 401 |
| Aviral | frontend | Should | Alert banner and admin view | GIVEN a High or Severe prediction WHEN shown THEN an alert banner appears; the admin page lists predictions and outcomes |
| Anmol | data | Must | End-to-end and edge-case tests, including missing optional inputs | GIVEN the running app WHEN the edge-case checklist is executed THEN results are recorded in docs/test-report.md and every Must feature has a passing check |
| Kshitij | devops | Must | Deploy backend to Render or Railway with environment variables | GIVEN main WHEN merged THEN the public API URL serves /health and /docs; secrets are set in the host dashboard, not in git |
| Aviral | devops | Must | Deploy frontend to Vercel pointing at the live API | GIVEN the live API WHEN the Vercel site loads THEN the form and map work against it; CORS_ORIGINS updated on the backend |

## BW6

| Owner | Area | Priority | Task | Acceptance |
|---|---|---|---|---|
| Aniket | ml | Must | Model card and final metrics | GIVEN the final model WHEN docs/model-card.md is read THEN it states data, method, thresholds, recall, precision, F1, ROC-AUC, confusion matrix, limits and the not-an-official-warning statement |
| Anmol | data | Should | User guide and final test report | GIVEN the deployed app WHEN a new user reads docs/user-guide.md THEN they can get a risk result in 3 steps |
| Aniket | docs | Must | Final report, slides and demo script | GIVEN all features WHEN the demo is rehearsed twice THEN it runs in the time limit with a fallback if the network fails |
