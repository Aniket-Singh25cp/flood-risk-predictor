"""Read-only exploratory profile of CSV files in data/raw.

Run from the repository root:
    python data/eda_raw.py

The script only reads raw files and writes a Markdown summary next to this script.
It does not clean or overwrite source data.
"""

from difflib import SequenceMatcher
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = REPO_ROOT / "data" / "raw"
REPORT_PATH = REPO_ROOT / "data" / "eda_raw_report.md"
EXPECTED_FEATURES = [
    "rain_1d",
    "rain_3d",
    "rain_7d",
    "river_level_m",
    "soil_saturation",
    "elevation_m",
    "flood",
]

EXPECTED_ALIASES = {
    "rain_1d": ("rain", "rainfall", "precip"),
    "rain_3d": ("rain", "rainfall", "precip"),
    "rain_7d": ("rain", "rainfall", "precip"),
    "river_level_m": ("river", "water level", "gauge"),
    "soil_saturation": ("soil", "saturation", "moisture"),
    "elevation_m": ("elevation", "altitude", "height", "dem"),
    "flood": ("flood", "inundation", "label", "target"),
}


def normalized_name(name: object) -> str:
    return "".join(character.lower() if character.isalnum() else " " for character in str(name)).strip()


def find_feature_mappings(columns: list[str]) -> dict[str, list[str]]:
    mappings: dict[str, list[str]] = {}
    normalized_columns = {normalized_name(column): column for column in columns}

    for feature in EXPECTED_FEATURES:
        exact = []
        partial = []
        for normalized_column, original in normalized_columns.items():
            if normalized_column == feature.replace("_", " "):
                exact.append(original)
                continue

            aliases = EXPECTED_ALIASES[feature]
            window_matches = any(alias in normalized_column for alias in aliases)
            if window_matches:
                similarity = max(
                    SequenceMatcher(None, feature.replace("_", " "), normalized_column).ratio(),
                    SequenceMatcher(None, feature, normalized_column.replace(" ", "_")).ratio(),
                )
                partial.append((similarity, original))

        ranked = [column for _, column in sorted(partial, reverse=True)]
        mappings[feature] = exact + ranked
    return mappings


def date_columns(frame: pd.DataFrame) -> list[str]:
    candidates = []
    for column in frame.columns:
        name = str(column).lower()
        if "date" in name or "time" in name:
            candidates.append(column)
    return candidates


def date_range(frame: pd.DataFrame, column: str) -> str:
    parsed = pd.to_datetime(frame[column], errors="coerce", dayfirst=True)
    if parsed.notna().sum() == 0:
        return "no parseable dates"
    return f"{parsed.min().date()} to {parsed.max().date()} ({parsed.notna().sum()} parseable)"


def label_candidates(frame: pd.DataFrame) -> list[str]:
    candidates = []
    for column in frame.columns:
        normalized = normalized_name(column)
        if normalized in {"flood", "flood label", "flood target", "label", "target", "severity"}:
            candidates.append(column)
    if "Main Cause" in frame.columns:
        candidates.append("Main Cause")
    return list(dict.fromkeys(candidates))


def heuristic_binary_distribution(frame: pd.DataFrame) -> list[str] | None:
    cause_column = "Main Cause"
    if cause_column not in frame.columns:
        return None

    causes = frame[cause_column].fillna("").astype(str)
    contains_flood = causes.str.lower().str.contains("flood", regex=False)
    positives = int(contains_flood.sum())
    negatives = len(frame) - positives
    total = len(frame)
    if positives == 0:
        return [
            "- Text heuristic: 0 positive (`Main Cause` contains flood), "
            f"{negatives} ({negatives / total:.2%}) negative"
        ]
    return [
        f"- Text heuristic positive (non-null `Main Cause` contains `flood`): {positives} ({positives / total:.2%})",
        f"- Text heuristic negative: {negatives} ({negatives / total:.2%})",
    ]


def value_distribution(frame: pd.DataFrame, column: str, limit: int = 20) -> list[str]:
    counts = frame[column].value_counts(dropna=False)
    total = len(frame)
    rows = []
    for value, count in counts.head(limit).items():
        label = "<missing>" if pd.isna(value) else str(value)
        rows.append(f"`{label}`: {count} ({count / total:.2%})")
    if len(counts) > limit:
        rows.append(f"... {len(counts) - limit} additional values")
    return rows


def format_missing(frame: pd.DataFrame) -> list[str]:
    missing = frame.isna().sum()
    missing = missing[missing > 0].sort_values(ascending=False)
    if missing.empty:
        return ["- None"]
    total = len(frame)
    return [f"- `{column}`: {count} ({count / total:.2%})" for column, count in missing.items()]


def profile_csv(csv_path: Path) -> str:
    frame = pd.read_csv(csv_path, encoding="utf-8-sig")
    lines = [
        f"## {csv_path.name}",
        "",
        f"- Shape: **{frame.shape[0]:,} rows x {frame.shape[1]:,} columns**",
        f"- Duplicate full rows: **{frame.duplicated().sum():,}**",
        "",
        "### Dtypes",
        "",
        "| Column | Dtype |",
        "|---|---|",
    ]
    lines.extend(f"| `{column}` | `{dtype}` |" for column, dtype in frame.dtypes.items())

    dates = date_columns(frame)
    lines.extend(["", "### Date ranges", ""])
    if dates:
        lines.extend(f"- `{column}`: {date_range(frame, column)}" for column in dates)
    else:
        lines.append("- No column names identified as dates.")

    lines.extend(["", "### Missing values", ""])
    lines.extend(format_missing(frame))

    lines.extend(["", "### Flood label / balance candidates", ""])
    candidates = label_candidates(frame)
    if candidates:
        for column in candidates:
            lines.append(f"- `{column}`:")
            lines.extend(f"  - {item}" for item in value_distribution(frame, column))
    else:
        lines.append("- No explicit flood, label, target, severity, or inundation column found.")
    heuristic = heuristic_binary_distribution(frame)
    if heuristic:
        lines.extend(
            [
                "- Heuristic balance from free-text cause (not a source-provided binary label):",
                *[f"  {item}" for item in heuristic],
            ]
        )

    lines.extend(["", "### Mapping to expected ML features", ""])
    mappings = find_feature_mappings(list(frame.columns))
    for feature in EXPECTED_FEATURES:
        matched = mappings[feature]
        if matched:
            lines.append(f"- `{feature}`: candidate(s) `{', '.join(matched)}`")
        else:
            lines.append(f"- `{feature}`: **not represented**")

    return "\n".join(lines)


def main() -> None:
    csv_files = sorted(RAW_DIR.glob("*.csv"))
    if not csv_files:
        raise SystemExit(f"No CSV files found in {RAW_DIR}")

    sections = [
        "# Raw Dataset EDA",
        "",
        "Generated by `data/eda_raw.py`. This report is read-only with respect to `data/raw/`.",
        "",
    ]
    sections.extend(profile_csv(csv_path) for csv_path in csv_files)
    REPORT_PATH.write_text("\n".join(sections) + "\n", encoding="utf-8")
    print("\n".join(sections))
    print(f"\nReport written to {REPORT_PATH.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
