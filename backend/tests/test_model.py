from __future__ import annotations

import numpy as np

import backend.app.model as model_module
from backend.app.model import ModelPredictor


class FakeModel:
    def predict_proba(self, frame):
        return np.array([[0.2, 0.8]])


def test_missing_artifact_uses_heuristic_identity():
    predictor = ModelPredictor(model_module.MODEL_PATH.parent / "missing.joblib")
    predictor.load()

    assert predictor.predict({"rain_1d": 50}) is None
    assert predictor.model_version == "heuristic-0.1"


def test_valid_artifact_is_loaded_and_predicts(monkeypatch, tmp_path):
    artifact_path = tmp_path / "model.joblib"
    artifact_path.touch()
    monkeypatch.setattr(
        model_module.joblib,
        "load",
        lambda _: {
            "model": FakeModel(),
            "features": ["rain_1d", "elevation_m"],
            "threshold": 0.5,
            "name": "test-model",
        },
    )

    predictor = ModelPredictor(artifact_path)
    predictor.load()

    assert predictor.predict({"rain_1d": 50, "elevation_m": 53}) == 0.8
    assert predictor.model_version == "test-model"
