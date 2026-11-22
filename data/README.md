# Data notes

Raw datasets are **not committed** (see `.gitignore`). This file records where data comes from so anyone can reproduce it.

| Dataset | Source / link | Licence / terms | Downloaded by | Date | Notes |
|---|---|---|---|---|---|
| `India_Flood_Inventory_v3.csv` | **TODO: verify source and link** | **TODO: verify licence/terms** | **TODO: record downloader** | **TODO: record download date** | 6,876 rows x 23 columns; flood-event inventory. No confirmed binary `flood` label. |
| `District_FloodImpact.csv` | **TODO: verify source and link** | **TODO: verify licence/terms** | **TODO: record downloader** | **TODO: record download date** | 732 rows x 5 columns; district-level human impact summary. |
| `District_FloodedArea.csv` | **TODO: verify source and link** | **TODO: verify licence/terms** | **TODO: record downloader** | **TODO: record download date** | 732 rows x 4 columns; district-level flooded-area percentages. |
| `DFSI.csv` | **TODO: verify source and link** | **TODO: verify licence/terms** | **TODO: record downloader** | **TODO: record download date** | 744 rows x 3 columns; district/state DFSI values. |

## Expected model features

The raw CSVs should contain or support derivation of:

| Model field | Meaning | Unit | Raw-column mapping |
|---|---|---|---|
| `rain_1d` | Rainfall over 1 day | **TODO: verify unit** | **TODO: no verified source column identified** |
| `rain_3d` | Rainfall over 3 days | **TODO: verify unit** | **TODO: no verified source column identified** |
| `rain_7d` | Rainfall over 7 days | **TODO: verify unit** | **TODO: no verified source column identified** |
| `river_level_m` | River water level | **TODO: verify unit** | **TODO: no verified source column identified** |
| `soil_saturation` | Soil saturation or moisture level | **TODO: verify unit and meaning** | **TODO: no verified source column identified** |
| `elevation_m` | Terrain elevation | **TODO: verify unit** | **TODO: no verified source column identified** |
| `flood` | Binary flood occurrence label | **TODO: verify encoding** | **TODO: no confirmed binary source column or label mapping identified** |

## Current raw-data profile

- `DFSI.csv`: 744 rows, 3 columns. Dtypes are `Unnamed: 0: str`, `State_Name: str`, and `DFSI: float64`. One of 744 `DFSI` values is missing. No date-named column was identified.
- `District_FloodedArea.csv`: 732 rows, 4 columns. All values are present. Dtypes are `Dist_Name: str`, `Percent_Flooded_Area: float64`, `Parmanent_Water: float64`, and `Corrected_Percent_Flooded_Area: float64`. No date-named column was identified. These flooded-area columns are not confirmed binary labels.
- `District_FloodImpact.csv`: 732 rows, 5 columns. Dtypes are `Dist_Name: str`, `Human_fatality: int64`, `Human_injured: int64`, `Population: int64`, and `Mean_Flood_Duration: float64`. `Mean_Flood_Duration` has 11 missing values. No date-named column was identified.
- `India_Flood_Inventory_v3.csv`: 6,876 rows, 23 columns. `Start Date` and `End Date` parse to 1967-07-02 through 2023-09-12 for 6,856 rows each; 20 values in each date column are missing or unparseable. No confirmed binary `flood` column was identified. `Severity` is 100% missing. No duplicate full rows were found in this file.
- No duplicate full rows were found in any of the four CSVs.
- **TODO: verify whether any raw column can support derivation of `rain_1d`, `rain_3d`, `rain_7d`, `river_level_m`, `soil_saturation`, or `elevation_m`.**
- **TODO: verify source, licence, downloader, and download date for every dataset.**

The flood inventory should not be treated as a binary ML sample until label construction is approved. A diagnostic text heuristic found 2,416 inventory rows whose non-null `Main Cause` contains "flood" and 4,460 rows that do not; this is not a source-provided flood/non-flood label and does not establish class balance.

Run `python data/eda_raw.py` to refresh the generated, factual raw-data profile in `data/eda_raw_report.md`.

## How to add a dataset
1. Download it to `data/raw/` (git-ignored).
2. Add a row above: link, licence, what each column means, what the label means, class balance (count of flood vs non-flood).
3. Put cleaning code in `ml/src/` or a notebook in `ml/notebooks/`, never edit raw files by hand.
4. Anything small enough to share (under about 1 MB, licence permitting) may go in `data/sample/` for tests and demos.

Suggested starting points are listed in the synopsis references: Kaggle flood datasets, India-WRIS, CWC, IMD, NRSC/Bhuvan.
Check each licence and terms of use before using or redistributing data.
