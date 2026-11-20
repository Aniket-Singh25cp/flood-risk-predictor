# Data notes

Raw datasets are **not committed** (see `.gitignore`). This file records where data comes from so anyone can reproduce it.

| Dataset | Source / link | Licence / terms | Downloaded by | Date | Notes |
|---|---|---|---|---|---|
| _fill in_ | _Kaggle URL_ | _check the dataset page_ | _name_ | _date_ | rows, columns, label definition |

## How to add a dataset
1. Download it to `data/raw/` (git-ignored).
2. Add a row above: link, licence, what each column means, what the label means, class balance (count of flood vs non-flood).
3. Put cleaning code in `ml/src/` or a notebook in `ml/notebooks/`, never edit raw files by hand.
4. Anything small enough to share (under about 1 MB, licence permitting) may go in `data/sample/` for tests and demos.

Suggested starting points are listed in the synopsis references: Kaggle flood datasets, India-WRIS, CWC, IMD, NRSC/Bhuvan.
Check each licence and terms of use before using or redistributing data.
