# Anmol: Data, QA and Documentation, AI playbook

You own `data/`, the EDA, the test plan and reports, and the user-facing documentation. You are the team's quality gate.

## Where AI helps you
| Task | Let AI do | You must do |
|---|---|---|
| Data cleaning code | Draft pandas cleaning and a data-quality report | Look at the rows; decide what counts as an error |
| EDA | Suggest plots and write the notebook cells | Write the findings in your own words |
| Test cases | Brainstorm edge cases and generate pytest cases | Decide the coverage and exit criteria |
| Reviews | Run the checklist on a PR diff | Read the diff yourself and approve or block |
| Documentation | Draft user guide, test report, glossary | Check every claim against the running app |

## Prompt cards
**1. Dataset notes**
> I downloaded [dataset name]. Using only the CSV header and the first 20 rows I paste below, draft the data dictionary
> table for `data/README.md` (column, meaning, unit, type). Mark anything you cannot know from the data as "UNKNOWN, check source".

**2. EDA notebook**
> In `ml/notebooks/01_eda.ipynb`, write cells that show: flood vs non-flood counts and percentage, missing values per column,
> distributions of rainfall and river level split by label, and a correlation heatmap. Add a markdown cell for my findings.

**3. Edge-case test list**
> Given `docs/api-contract.md` and `backend/app/schemas.py`, list 25 test cases for `/predict` including boundaries,
> missing optional inputs, wrong types, extremes and unrealistic combinations. Then write pytest code for the ones marked automatable.

**4. PR review**
> Review this diff against `.github/pull_request_template.md` and AGENTS.md. Check contract drift, weakened tests, secrets,
> leakage, accuracy-only reporting, and missing disclaimers. Return Blocking / Should fix / Nice to have with file and line.

**5. Test report and user guide**
> From `docs/test-plan.md` and this list of test results [paste], draft `docs/test-report.md` (pass/fail table, defects, open risks).
> Then draft `docs/user-guide.md` for a district officer: three steps to a result, what the colours mean, and the limits.

## Verify before you trust
- Any statistic about the data came from code you ran, not from the AI's guess.
- Licences and sources in `data/README.md` are copied from the dataset page, not recalled.
- A test that passes for the wrong reason is worse than a failing one: break the code on purpose once and see the test fail.
- References: every link opened, every claim matched to the source.

## Weekly QA routine
Monday: re-run the full test suite on `main` and post the result. Thursday: review every open PR within 24 hours. Friday: update the test report and the risk table.
