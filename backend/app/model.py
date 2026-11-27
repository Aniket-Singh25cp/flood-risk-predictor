from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parents[2] / "ml" / "models" / "model.joblib"


class ModelPredictor:
    """Load and run the optional ML artifact without changing API contracts."""

    def __init__(self, path: Path = MODEL_PATH) -> None:
        self.path = path
        self._model: Any = None
        self.features: list[str] = []
        self.name = "heuristic"

    def load(self) -> None:
        if not self.path.is_file():
            self._model = None
            self.features = []
            self.name = "heuristic"
            return

        artifact = joblib.load(self.path)
        if not isinstance(artifact, dict):
            raise ValueError("model artifact must be a dictionary")
        missing = {"model", "features", "threshold", "name"} - artifact.keys()
        if missing:
            raise ValueError(f"model artifact missing keys: {sorted(missing)}")

        self._model = artifact["model"]
        self.features = list(artifact["features"])
        self.name = str(artifact["name"])

    @property
    def model_version(self) -> str:
        return self.name if self._model is not None else "heuristic-0.1"

    def predict(self, values: dict[str, float]) -> float | None:
        if self._model is None:
            return None

        row = {feature: float(values.get(feature, 0.0)) for feature in self.features}
        frame = pd.DataFrame([row], columns=self.features)
        probabilities = self._model.predict_proba(frame)[:, 1]
        probability = float(probabilities[0])
        return min(1.0, max(0.0, probability))
