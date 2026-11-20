"""Feature engineering helpers."""

from __future__ import annotations

import pandas as pd


def add_rain_windows(
    df: pd.DataFrame,
    date_col: str = "date",
    group_col: str = "district_id",
    rain_col: str = "rain_mm",
    windows: tuple[int, ...] = (1, 3, 7),
) -> pd.DataFrame:
    """Add rain_{n}d columns: cumulative rainfall over the last n days (including today), per district.

    Rows are sorted by district and date. Uses only today and past days, so there is no future leakage.
    """
    out = df.sort_values([group_col, date_col]).copy()
    grouped = out.groupby(group_col)[rain_col]
    for n in windows:
        out[f"rain_{n}d"] = grouped.transform(lambda s, n=n: s.rolling(n, min_periods=1).sum())
    return out
