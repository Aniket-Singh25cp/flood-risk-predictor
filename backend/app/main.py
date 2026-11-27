from __future__ import annotations

import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from .db import Base, SessionLocal, engine, get_db
from .model import ModelPredictor
from .models import District
from .risk import DISCLAIMER, heuristic_probability, level_from_probability
from .sample_districts import MOCK_RAIN, SAMPLE_DISTRICTS
from .schemas import DistrictResponse, DistrictRisk, PredictRequest, PredictResponse, RiskMapResponse
from .seed import seed_districts

load_dotenv()

DistrictDB = Depends(get_db)
predictor = ModelPredictor()

default_origins = {"http://localhost:5173", "http://127.0.0.1:5173"}
origins = default_origins | {
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
}


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_districts(db)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    initialize_database()
    predictor.load()
    yield


app = FastAPI(title="Flood Risk Predictor API", version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])
initialize_database()


@app.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model_version": predictor.model_version}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    optional = {
        "river_level_m": req.river_level_m,
        "soil_saturation": req.soil_saturation,
        "elevation_m": req.elevation_m,
    }
    used = ["rain_1d", "rain_3d", "rain_7d"] + [k for k, v in optional.items() if v is not None]
    elevation_m = req.elevation_m
    if elevation_m is None and req.district_id is not None:
        district = next(
            (d for d in SAMPLE_DISTRICTS if d["district_id"] == req.district_id),
            None,
        )
        if district is not None:
            elevation_m = district["elevation_m"]

    model_values = {
        "rain_1d": req.rain_1d,
        "rain_3d": req.rain_3d,
        "rain_7d": req.rain_7d,
        "river_level_m": req.river_level_m or 0.0,
        "soil_saturation": req.soil_saturation or 0.0,
        "elevation_m": elevation_m or 0.0,
    }
    p = predictor.predict(model_values)
    if p is None:
        p = heuristic_probability(req.rain_1d, req.rain_3d, req.rain_7d, **optional)
    return PredictResponse(
        probability=round(p, 4),
        level=level_from_probability(p),
        inputs_used=used,
        model_version=predictor.model_version,
        disclaimer=DISCLAIMER,
    )


@app.get("/risk-map", response_model=RiskMapResponse)
def risk_map() -> RiskMapResponse:
    """MOCK data for frontend development. Real per-district predictions arrive in week 4."""
    rows = []
    for d in SAMPLE_DISTRICTS:
        r1, r3, r7 = MOCK_RAIN[d["district_id"]]
        p = predictor.predict(
            {
                "rain_1d": r1,
                "rain_3d": r3,
                "rain_7d": r7,
                "river_level_m": 0.0,
                "soil_saturation": 0.0,
                "elevation_m": d["elevation_m"],
            }
        )
        if p is None:
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


@app.get("/districts", response_model=list[DistrictResponse])
def districts(db: Session = DistrictDB) -> list[DistrictResponse]:
    rows = db.query(District).order_by(District.id).all()
    return [
        DistrictResponse(
            id=row.id,
            name=row.name,
            state=row.state,
            latitude=row.latitude,
            longitude=row.longitude,
            elevation_m=row.elevation_m,
        )
        for row in rows
    ]
