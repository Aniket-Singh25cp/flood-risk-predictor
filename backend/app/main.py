from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .risk import DISCLAIMER, MODEL_VERSION, heuristic_probability, level_from_probability
from .sample_districts import MOCK_RAIN, SAMPLE_DISTRICTS
from .schemas import DistrictRisk, PredictRequest, PredictResponse, RiskMapResponse

app = FastAPI(title="Flood Risk Predictor API", version="0.1.0")

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model_version": MODEL_VERSION}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    optional = {
        "river_level_m": req.river_level_m,
        "soil_saturation": req.soil_saturation,
        "elevation_m": req.elevation_m,
    }
    used = ["rain_1d", "rain_3d", "rain_7d"] + [k for k, v in optional.items() if v is not None]
    p = heuristic_probability(req.rain_1d, req.rain_3d, req.rain_7d, **optional)
    return PredictResponse(
        probability=round(p, 4),
        level=level_from_probability(p),
        inputs_used=used,
        model_version=MODEL_VERSION,
        disclaimer=DISCLAIMER,
    )


@app.get("/risk-map", response_model=RiskMapResponse)
def risk_map() -> RiskMapResponse:
    """MOCK data for frontend development. Real per-district predictions arrive in week 4."""
    rows = []
    for d in SAMPLE_DISTRICTS:
        r1, r3, r7 = MOCK_RAIN[d["district_id"]]
        p = heuristic_probability(r1, r3, r7, elevation_m=d["elevation_m"])
        rows.append(
            DistrictRisk(
                district_id=d["district_id"],
                name=d["name"],
                state=d["state"],
                latitude=d["latitude"],
                longitude=d["longitude"],
                probability=round(p, 4),
                level=level_from_probability(p),
            )
        )
    return RiskMapResponse(districts=rows, disclaimer=DISCLAIMER)
