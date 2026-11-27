import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.risk import LEVELS, level_from_probability

client = TestClient(app)

BASE = {"district_id": 1, "rain_1d": 50, "rain_3d": 120, "rain_7d": 250}


def test_root_redirects_to_api_docs():
    r = client.get("/", follow_redirects=False)
    assert r.status_code in (307, 308)
    assert r.headers["location"] == "/docs"


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


@pytest.mark.parametrize(
    "origin",
    ["http://localhost:5173", "http://127.0.0.1:5173"],
)
def test_health_allows_frontend_origins(origin):
    r = client.get("/health", headers={"Origin": origin})
    assert r.status_code == 200
    assert r.headers["access-control-allow-origin"] == origin


def test_predict_returns_probability_level_and_disclaimer():
    r = client.post("/predict", json=BASE)
    assert r.status_code == 200
    body = r.json()
    assert 0 <= body["probability"] <= 1
    assert body["level"] in LEVELS
    assert "Not an official flood warning" in body["disclaimer"]
    assert body["inputs_used"] == ["rain_1d", "rain_3d", "rain_7d"]


def test_predict_reports_optional_inputs_used():
    r = client.post("/predict", json={**BASE, "river_level_m": 4.2, "soil_saturation": 0.8})
    assert r.json()["inputs_used"] == [
        "rain_1d",
        "rain_3d",
        "rain_7d",
        "river_level_m",
        "soil_saturation",
    ]


def test_more_rain_never_lowers_probability():
    low = client.post("/predict", json={**BASE, "rain_1d": 10}).json()["probability"]
    high = client.post("/predict", json={**BASE, "rain_1d": 200}).json()["probability"]
    assert high >= low


@pytest.mark.parametrize("bad", [{"rain_1d": -5}, {"soil_saturation": 1.5}, {"rain_3d": "lots"}])
def test_predict_rejects_invalid_values(bad):
    r = client.post("/predict", json={**BASE, **bad})
    assert r.status_code == 422


def test_predict_needs_a_location():
    r = client.post("/predict", json={"rain_1d": 1, "rain_3d": 2, "rain_7d": 3})
    assert r.status_code == 422


@pytest.mark.parametrize(
    "p,expected",
    [
        (0.0, "Low"),
        (0.249, "Low"),
        (0.25, "Medium"),
        (0.5, "High"),
        (0.75, "Severe"),
        (1.0, "Severe"),
    ],
)
def test_level_boundaries(p, expected):
    assert level_from_probability(p) == expected


def test_level_rejects_out_of_range():
    with pytest.raises(ValueError):
        level_from_probability(1.2)


def test_risk_map_shape_and_mock_flag():
    r = client.get("/risk-map")
    assert r.status_code == 200
    districts = r.json()["districts"]
    assert len(districts) >= 3
    assert all(d["mock"] is True and d["level"] in LEVELS for d in districts)


def test_mock_map_shows_every_risk_level_so_the_ui_can_be_built():
    levels = {d["level"] for d in client.get("/risk-map").json()["districts"]}
    assert levels == set(LEVELS)


def test_districts_returns_seeded_district_locations():
    r = client.get("/districts")
    assert r.status_code == 200
    districts = r.json()
    assert len(districts) >= 3
    assert {"id", "name", "state", "latitude", "longitude", "elevation_m"} <= set(districts[0])
