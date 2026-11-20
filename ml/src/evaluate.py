"""Imbalance-aware evaluation. Never report accuracy alone."""

from __future__ import annotations

import numpy as np
from sklearn.metrics import (
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


def metrics_at_threshold(y_true, proba, threshold: float = 0.5) -> dict:
    y_true = np.asarray(y_true)
    pred = (np.asarray(proba) >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, pred, labels=[0, 1]).ravel()
    return {
        "threshold": threshold,
        "recall": recall_score(y_true, pred, zero_division=0),
        "precision": precision_score(y_true, pred, zero_division=0),
        "f1": f1_score(y_true, pred, zero_division=0),
        "roc_auc": roc_auc_score(y_true, proba),
        "pr_auc": average_precision_score(y_true, proba),
        "tn": int(tn),
        "fp": int(fp),
        "fn": int(fn),
        "tp": int(tp),
    }


def pick_threshold_for_recall(y_true, proba, min_recall: float = 0.85) -> float:
    """Highest threshold that still reaches `min_recall` on the flood class (keeps precision as high as possible).

    Choose this on a validation set, then report on a separate test set.
    """
    y_true = np.asarray(y_true)
    proba = np.asarray(proba)
    best = 0.0
    for t in np.unique(proba):
        pred = proba >= t
        recall = (pred & (y_true == 1)).sum() / max((y_true == 1).sum(), 1)
        if recall >= min_recall:
            best = max(best, float(t))
    return best
