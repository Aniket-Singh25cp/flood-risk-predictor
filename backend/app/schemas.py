from __future__ import annotations

from pydantic import BaseModel, Field, model_validator


class PredictRequest(BaseModel):
    district_id: int | None = Field(default=None, description="Known district id, or give latitude/longitude")
    latitude: float | None = Field(default=None, ge=6.0, le=38.0)
    longitude: float | None = Field(default=None, ge=68.0, le=98.0)
    rain_1d: float = Field(ge=0, le=2000, description="Rainfall in the last 1 day (mm)")
    rain_3d: float = Field(ge=0, le=3000, description="Cumulative rainfall, last 3 days (mm)")
    rain_7d: float = Field(ge=0, le=5000, description="Cumulative rainfall, last 7 days (mm)")
    river_level_m: float | None = Field(default=None, ge=0, le=100)
    soil_saturation: float | None = Field(default=None, ge=0, le=1)
    elevation_m: float | None = Field(default=None, ge=-100, le=9000)

    @model_validator(mode="after")
    def need_a_location(self) -> PredictRequest:
        has_point = self.latitude is not None and self.longitude is not None
        if self.district_id is None and not has_point:
            raise ValueError("provide district_id or both latitude and longitude")
        return self


class PredictResponse(BaseModel):
    probability: float = Field(ge=0, le=1)
    level: str
    inputs_used: list[str]
    model_version: str
    disclaimer: str


class DistrictRisk(BaseModel):
    district_id: int
    name: str
    state: str
    latitude: float
    longitude: float
    probability: float
    level: str
    mock: bool = True


class RiskMapResponse(BaseModel):
    districts: list[DistrictRisk]
    disclaimer: str


class DistrictResponse(BaseModel):
    id: int
    name: str
    state: str
    latitude: float
    longitude: float
    elevation_m: float | None = None
