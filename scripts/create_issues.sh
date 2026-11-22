#!/usr/bin/env bash
# Creates labels, milestones and issues from the backlog. Run ONCE by Aniket after the repo exists, `gh auth login` is done
# and all teammates have ACCEPTED their collaborator invitation (otherwise assigning them fails).
#   1) Edit the four *_GH usernames below.  2) From the repo folder run: bash scripts/create_issues.sh
set -euo pipefail
ANIKET_GH="Aniket-Singh25cp"; KSHITIJ_GH="kshitij-tiwari1845"; AVIRAL_GH="aviralbajpai171280-droid"; ANMOL_GH="Anmolcoder01"
for v in "$ANIKET_GH" "$KSHITIJ_GH" "$AVIRAL_GH" "$ANMOL_GH"; do [ "$v" != "CHANGE_ME" ] || { echo "Edit the usernames at the top of this script first."; exit 1; }; done
gh auth status >/dev/null || { echo "Run: gh auth login"; exit 1; }

for l in ml backend frontend data devops docs task bug Must Should; do gh label create "$l" --force >/dev/null 2>&1 || true; done
for m in BW1 BW2 BW3 BW4 BW5 BW6; do gh api repos/{owner}/{repo}/milestones -f title="$m" >/dev/null 2>&1 || true; done

mk() { # week area owner_username priority title acceptance
  local body
  body=$(printf '**Area:** %s  |  **Week:** %s  |  **Priority:** %s\n\n**Acceptance criteria**\n%s\n\n_Read AGENTS.md and docs/api-contract.md first._' "$2" "$1" "$4" "$6")
  gh issue create --title "$5" --label "task,$2,$4" --milestone "$1" --assignee "$3" --body "$body"
}

mk BW1 data "$ANMOL_GH" Must "Download baseline flood datasets and document them in data/README.md" "GIVEN the Kaggle flood datasets WHEN a teammate follows data/README.md THEN they can download the same files; source, licence, columns, label meaning and class balance are written down"
mk BW1 data "$ANMOL_GH" Must "EDA notebook: class balance, missing values, correlations" "GIVEN the dataset WHEN the notebook runs top to bottom THEN it shows flood vs non-flood counts, missing values per column and a correlation view, with 5 written findings"
mk BW1 ml "$ANIKET_GH" Must "Define features and target; train Logistic Regression baseline" "GIVEN prepared data WHEN python -m ml.src.train --csv runs THEN recall, precision, F1, ROC-AUC and the confusion matrix are printed for the baseline"
mk BW1 backend "$KSHITIJ_GH" Must "Run API locally and add database models (District, WeatherObs, Prediction)" "GIVEN a fresh clone WHEN setup is run THEN pytest passes and the API serves /docs; tables for districts, observations and prediction log exist with a migration or create_all script"
mk BW1 frontend "$AVIRAL_GH" Must "Scaffold Vite React app and call /health" "GIVEN the backend running WHEN npm run dev THEN the page shows the API status and model_version; CI frontend job passes"
mk BW1 frontend "$AVIRAL_GH" Should "Wireframes for form, map, trend, alert and admin screens" "GIVEN the feature list WHEN wireframes are shared THEN the team has approved the 5 screens and the risk colour/label scheme"
mk BW2 ml "$ANIKET_GH" Must "Imbalance handling: class weights vs SMOTE with correct splits" "GIVEN train/validation/test splits WHEN models are compared THEN a table shows each method's recall and precision on the test set, and resampling touches only training data"
mk BW2 backend "$KSHITIJ_GH" Must "Seed districts table and add GET /districts" "GIVEN the seed script WHEN GET /districts is called THEN it returns id, name, state, centre point and elevation for each district; contract updated"
mk BW2 frontend "$AVIRAL_GH" Must "Input form wired to POST /predict with risk badge" "GIVEN valid inputs WHEN the form is submitted THEN probability and a colour plus text level are shown with the disclaimer; invalid inputs show clear messages; missing optional inputs still work"
mk BW2 data "$ANMOL_GH" Must "Test plan v1 and pytest fixtures for API and data checks" "GIVEN docs/test-plan.md WHEN reviewed THEN it lists test types, owners and exit criteria; fixtures exist for valid and invalid /predict payloads"
mk BW3 ml "$ANIKET_GH" Must "Train Random Forest and XGBoost; tune; model comparison table" "GIVEN the same splits WHEN all three models are evaluated THEN one table compares them on recall, precision, F1, ROC-AUC, PR-AUC and false negatives"
mk BW3 backend "$KSHITIJ_GH" Should "Open-Meteo forecast client with caching and fallback" "GIVEN a district WHEN forecast is requested THEN rainfall for the next days is returned; on API failure the last cached or manual value is used and the response says so"
mk BW3 frontend "$AVIRAL_GH" Must "Leaflet district map coloured by /risk-map" "GIVEN /risk-map WHEN the map loads THEN each district shows a colour and text level, a legend and a popup with probability"
mk BW3 data "$ANMOL_GH" Should "Clean historical flood events and load them into the database" "GIVEN a flood history source WHEN the loader runs THEN events (district, date, severity, source) are stored and counted in a short report"
mk BW4 ml "$ANIKET_GH" Must "ROC-based thresholds and saved model artifact" "GIVEN the best model WHEN thresholds are chosen on validation data THEN model.joblib stores model, features, threshold and name, and the test-set report is saved in docs/"
mk BW4 backend "$KSHITIJ_GH" Must "Load the model artifact in /predict and /risk-map" "GIVEN ml/models/model.joblib WHEN /predict is called THEN probability comes from the model, model_version changes, and tests still pass; heuristic remains only as a fallback"
mk BW4 backend "$KSHITIJ_GH" Should "Add GET /trend and GET /history" "GIVEN a district WHEN the endpoints are called THEN they return the shapes in docs/api-contract.md; contract and tests updated"
mk BW4 frontend "$AVIRAL_GH" Should "Historical overlay and multi-day trend chart" "GIVEN a selected district WHEN the panel opens THEN past events and the next-days risk chart are shown"
mk BW5 backend "$KSHITIJ_GH" Should "Alert simulation endpoint, alert log and admin logs endpoint with token" "GIVEN risk at or above High WHEN an alert is simulated THEN it is stored; GET /admin/logs without the token returns 401"
mk BW5 frontend "$AVIRAL_GH" Should "Alert banner and admin view" "GIVEN a High or Severe prediction WHEN shown THEN an alert banner appears; the admin page lists predictions and outcomes"
mk BW5 data "$ANMOL_GH" Must "End-to-end and edge-case tests, including missing optional inputs" "GIVEN the running app WHEN the edge-case checklist is executed THEN results are recorded in docs/test-report.md and every Must feature has a passing check"
mk BW5 devops "$KSHITIJ_GH" Must "Deploy backend to Render or Railway with environment variables" "GIVEN main WHEN merged THEN the public API URL serves /health and /docs; secrets are set in the host dashboard, not in git"
mk BW5 devops "$AVIRAL_GH" Must "Deploy frontend to Vercel pointing at the live API" "GIVEN the live API WHEN the Vercel site loads THEN the form and map work against it; CORS_ORIGINS updated on the backend"
mk BW6 ml "$ANIKET_GH" Must "Model card and final metrics" "GIVEN the final model WHEN docs/model-card.md is read THEN it states data, method, thresholds, recall, precision, F1, ROC-AUC, confusion matrix, limits and the not-an-official-warning statement"
mk BW6 data "$ANMOL_GH" Should "User guide and final test report" "GIVEN the deployed app WHEN a new user reads docs/user-guide.md THEN they can get a risk result in 3 steps"
mk BW6 docs "$ANIKET_GH" Must "Final report, slides and demo script" "GIVEN all features WHEN the demo is rehearsed twice THEN it runs in the time limit with a fallback if the network fails"
echo "Done. Open the Issues tab and create a Project board (see docs/TEAM_GUIDE.md)."
