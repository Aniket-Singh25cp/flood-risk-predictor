import pandas as pd

from ml.src.evaluate import metrics_at_threshold, pick_threshold_for_recall
from ml.src.features import add_rain_windows


def test_rain_windows_are_per_district_and_use_past_only():
    df = pd.DataFrame(
        {
            "district_id": [1, 1, 1, 2, 2],
            "date": pd.to_datetime(["2026-07-01", "2026-07-02", "2026-07-03"] + ["2026-07-01", "2026-07-02"]),
            "rain_mm": [10, 20, 30, 100, 200],
        }
    )
    out = add_rain_windows(df)
    d1 = out[out.district_id == 1].reset_index(drop=True)
    assert list(d1["rain_1d"]) == [10, 20, 30]
    assert list(d1["rain_3d"]) == [10, 30, 60]
    d2 = out[out.district_id == 2].reset_index(drop=True)
    assert list(d2["rain_3d"]) == [100, 300]  # district 2 does not see district 1 rain


def test_metrics_counts_false_negatives():
    y = [1, 1, 0, 0]
    p = [0.9, 0.2, 0.1, 0.6]
    m = metrics_at_threshold(y, p, 0.5)
    assert (m["tp"], m["fn"], m["fp"], m["tn"]) == (1, 1, 1, 1)
    assert m["recall"] == 0.5


def test_threshold_meets_min_recall():
    y = [1, 1, 1, 1, 0, 0, 0, 0]
    p = [0.9, 0.8, 0.7, 0.3, 0.6, 0.2, 0.1, 0.05]
    t = pick_threshold_for_recall(y, p, min_recall=0.75)
    assert metrics_at_threshold(y, p, t)["recall"] >= 0.75


def test_pipeline_runs_on_synthetic_data_without_saving():
    from ml.src.train import (  # needs imbalanced-learn; imported here so other tests run without it
        make_synthetic,
        run,
    )

    df = make_synthetic(n=1500)
    assert 0.02 < df["flood"].mean() < 0.12  # imbalanced on purpose
    out = run(df, save=False)
    assert out["best"] in out["results"]
    assert all(0 <= m["recall"] <= 1 for m in out["results"].values())
