"""Training skeleton. Run `python -m ml.src.train --synthetic` to smoke-test the whole pipeline.

Replace `make_synthetic` with the real dataset loader (see data/README.md) once the Kaggle/CWC data is downloaded.
Key rules: split BEFORE resampling or scaling; SMOTE sits inside the pipeline so it only touches training folds.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from .evaluate import metrics_at_threshold, pick_threshold_for_recall

FEATURES = ["rain_1d", "rain_3d", "rain_7d", "river_level_m", "soil_saturation", "elevation_m"]
MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "model.joblib"


def make_synthetic(n: int = 4000, flood_rate: float = 0.05, seed: int = 42) -> pd.DataFrame:
    """Fake, imbalanced data ONLY for testing the pipeline. Never report results from it."""
    rng = np.random.default_rng(seed)
    rain_1d = rng.gamma(2.0, 15.0, n)
    rain_3d = rain_1d + rng.gamma(2.0, 25.0, n)
    rain_7d = rain_3d + rng.gamma(2.0, 40.0, n)
    river = rng.gamma(3.0, 1.0, n)
    soil = rng.uniform(0, 1, n)
    elev = rng.uniform(0, 400, n)
    score = 0.02 * rain_1d + 0.012 * rain_3d + 0.006 * rain_7d + 0.4 * river + 1.5 * soil - 0.01 * elev
    cutoff = np.quantile(score, 1 - flood_rate)
    y = (score + rng.normal(0, 0.8, n) > cutoff).astype(int)
    return pd.DataFrame(
        {
            "rain_1d": rain_1d,
            "rain_3d": rain_3d,
            "rain_7d": rain_7d,
            "river_level_m": river,
            "soil_saturation": soil,
            "elevation_m": elev,
            "flood": y,
        }
    )


def build_models(seed: int = 42) -> dict:
    models = {
        "logreg_weighted": ImbPipeline(
            [
                ("scale", StandardScaler()),
                ("clf", LogisticRegression(class_weight="balanced", max_iter=1000)),
            ]
        ),
        "rf_smote": ImbPipeline(
            [
                ("smote", SMOTE(random_state=seed)),
                ("clf", RandomForestClassifier(n_estimators=200, random_state=seed)),
            ]
        ),
    }
    try:
        from xgboost import XGBClassifier

        models["xgb_smote"] = ImbPipeline(
            [
                ("smote", SMOTE(random_state=seed)),
                (
                    "clf",
                    XGBClassifier(
                        n_estimators=200,
                        max_depth=4,
                        learning_rate=0.1,
                        eval_metric="logloss",
                        random_state=seed,
                    ),
                ),
            ]
        )
    except ImportError:  # xgboost optional locally
        pass
    return models


def run(
    df: pd.DataFrame,
    target: str = "flood",
    min_recall: float = 0.85,
    seed: int = 42,
    save: bool = True,
) -> dict:
    X, y = df[FEATURES], df[target]
    # Split first: train / validation / test, stratified so every split keeps flood rows.
    X_tr, X_tmp, y_tr, y_tmp = train_test_split(X, y, test_size=0.4, stratify=y, random_state=seed)
    X_val, X_te, y_val, y_te = train_test_split(X_tmp, y_tmp, test_size=0.5, stratify=y_tmp, random_state=seed)

    results, fitted = {}, {}
    for name, model in build_models(seed).items():
        model.fit(X_tr, y_tr)
        thr = pick_threshold_for_recall(y_val, model.predict_proba(X_val)[:, 1], min_recall)
        results[name] = metrics_at_threshold(y_te, model.predict_proba(X_te)[:, 1], thr)
        fitted[name] = model

    best = max(results, key=lambda k: results[k]["pr_auc"])
    if save:
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(
            {
                "model": fitted[best],
                "features": FEATURES,
                "threshold": results[best]["threshold"],
                "name": best,
            },
            MODEL_PATH,
        )
    return {"results": results, "best": best}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--synthetic", action="store_true", help="use fake data to smoke-test the pipeline")
    ap.add_argument(
        "--csv",
        type=str,
        help="path to a prepared CSV with the FEATURES columns and a 'flood' label",
    )
    args = ap.parse_args()
    if args.synthetic:
        df = make_synthetic()
        print("WARNING: synthetic data. Metrics below are NOT results for the project.")
    elif args.csv:
        df = pd.read_csv(args.csv)
    else:
        ap.error("pass --synthetic or --csv PATH")
    out = run(df)
    print(
        pd.DataFrame(out["results"])
        .T[["threshold", "recall", "precision", "f1", "roc_auc", "pr_auc", "fn", "fp"]]
        .round(3)
        .to_string()
    )
    print("best by PR-AUC:", out["best"])


if __name__ == "__main__":
    main()
