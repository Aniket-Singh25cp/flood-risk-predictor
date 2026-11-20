"""Risk logic shared by the API. Replace `heuristic_probability` with the trained model (see ml/)."""

from __future__ import annotations

import math

# Placeholder cut-offs. Aniket replaces these with ROC-derived thresholds from ml/ (saved in the model artifact).
THRESHOLDS = (0.25, 0.50, 0.75)  # Low < 0.25 <= Medium < 0.50 <= High < 0.75 <= Severe
LEVELS = ("Low", "Medium", "High", "Severe")
DISCLAIMER = "Decision-support estimate. Not an official flood warning."
MODEL_VERSION = "heuristic-0.1"


def level_from_probability(p: float) -> str:
    """Map a probability in [0, 1] to Low / Medium / High / Severe."""
    if not 0.0 <= p <= 1.0:
        raise ValueError("probability must be between 0 and 1")
    t1, t2, t3 = THRESHOLDS
    if p < t1:
        return LEVELS[0]
    if p < t2:
        return LEVELS[1]
    if p < t3:
        return LEVELS[2]
    return LEVELS[3]


def heuristic_probability(
    rain_1d: float,
    rain_3d: float,
    rain_7d: float,
    river_level_m: float | None = None,
    soil_saturation: float | None = None,
    elevation_m: float | None = None,
) -> float:
    """Stand-in scoring function so the whole app works before the ML model is ready.

    Monotonic in rainfall, river level and soil saturation; lower elevation raises risk.
    This is NOT the real model and must not be described as one.
    """
    score = -4.0 + 0.012 * rain_1d + 0.010 * rain_3d + 0.006 * rain_7d
    if river_level_m is not None:
        score += 0.35 * river_level_m
    if soil_saturation is not None:
        score += 1.5 * soil_saturation
    if elevation_m is not None:
        score -= 0.004 * min(elevation_m, 500.0)
    return 1.0 / (1.0 + math.exp(-score))
