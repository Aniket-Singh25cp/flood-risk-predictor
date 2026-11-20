# Aniket: Team Leader and ML Lead, AI playbook

You own `ml/`, the final model, the thresholds, integration and the report. You also keep the team unblocked.

## Where AI helps you (and where it must not decide)
| Task | Let AI do | You must do |
|---|---|---|
| Feature engineering code | Draft rolling-window and join code | Decide which features make hydrological sense |
| Model comparison | Write the training and evaluation loop | Check the split order and the metric table |
| Threshold choice | Explain ROC/PR trade-offs, draft the selection code | Pick the recall target and defend it |
| Reading papers | Summarise, extract method and metrics | Open the paper and confirm every number you cite |
| Planning and reviews | Draft issue text, triage, review checklists | Final merge decisions |

## Prompt cards (copy, fill the brackets)
**1. Leakage audit**
> Read `ml/src/train.py`. List every place where information from the validation or test data could reach training
> (scaling, imputing, SMOTE, threshold choice, feature windows). For each, say where it is and how to fix it. Do not change code yet.

**2. Imbalance experiment**
> Using the same stratified splits, compare: no handling, class_weight, SMOTE, and SMOTE+Tomek for [model]. Resampling must
> only touch training folds. Output one table: recall, precision, F1, ROC-AUC, PR-AUC, false negatives. State what is NOT proven by the result.

**3. Threshold selection**
> Given validation probabilities, write a function that returns the highest threshold with recall >= [0.85], plus a
> plot of precision and recall versus threshold. Explain in 5 lines how I justify this choice to a non-technical reviewer.

**4. Model card**
> Draft `docs/model-card.md` from `ml/src/train.py` outputs: data, features, method, thresholds, test metrics, confusion matrix,
> limitations, and the sentence "Decision-support estimate. Not an official flood warning." Mark any number you cannot find as TODO.

**5. Unblock a teammate**
> Kshitij needs the model artifact format. Describe `ml/models/model.joblib` (keys, feature order, threshold) in the API
> contract style and write a 10-line example of loading it and predicting one row.

## Verify before you trust
- Is the split done before scaling, SMOTE and threshold choice? Are test rows untouched until the final report?
- Does the table show **false negatives**? Does any claim rest on accuracy alone?
- Did you re-run the numbers yourself? AI-written metrics must come from a run, never from the chat.
- Can you explain every line in `train.py` without the AI open?

## Team lead routine (15 minutes, Monday and Thursday)
Merge order: contract changes, then backend, then frontend, then ML artifact updates. Ask AI to draft the stand-up summary from
`gh issue list --state open` and the last week's merged PRs, then edit it. Keep the board honest: move cards yourself.
