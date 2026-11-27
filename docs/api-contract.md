# API contract (v0.1)

Single source of truth for what the backend returns and what the frontend may rely on.
The live version is always at `http://localhost:8000/docs` (Swagger) and `/openapi.json` when the backend runs.
**Change this file in the same PR as any endpoint or field change, and tag the other owner for review.**

Base URL (dev): `http://localhost:8000`. All bodies are JSON. Every risk response carries a `disclaimer`.

| Endpoint | Method | Status | Purpose |
|---|---|---|---|
| `/health` | GET | live | Liveness and model version |
| `/predict` | POST | live (heuristic until the ML model is plugged in) | Probability and risk level |
| `/risk-map` | GET | live, **mock data** until BW4 | One risk per district for the map |
| `/districts` | GET | live | District list with centre points and elevation for the map |
| `/trend` | GET | planned (BW4) | Multi-day risk from forecast rainfall |
| `/history` | GET | planned (BW4) | Past flood events for a district |
| `/alerts/simulate` | POST | planned (BW5) | Create a mock alert and log it |
| `/admin/logs` | GET | planned (BW5), `Authorization: Bearer <ADMIN_TOKEN>` | Predictions versus actual outcomes |

## POST /predict
Request (either `district_id` or both `latitude` and `longitude` is required):
```json
{
  "district_id": 1,
  "latitude": null, "longitude": null,
  "rain_1d": 50, "rain_3d": 120, "rain_7d": 250,
  "river_level_m": 4.2, "soil_saturation": 0.8, "elevation_m": 53
}
```
`river_level_m`, `soil_saturation`, `elevation_m` are optional. Ranges: rain >= 0, soil_saturation 0 to 1.

Response 200:
```json
{
  "probability": 0.4281,
  "level": "Medium",
  "inputs_used": ["rain_1d", "rain_3d", "rain_7d"],
  "model_version": "heuristic-0.1",
  "disclaimer": "Decision-support estimate. Not an official flood warning."
}
```
`level` is one of `Low`, `Medium`, `High`, `Severe`. Invalid input returns 422 with FastAPI's error list.

## GET /risk-map
```json
{
  "districts": [
    {"district_id": 1, "name": "Patna", "state": "Bihar", "latitude": 25.59, "longitude": 85.14,
     "probability": 0.428, "level": "Medium", "mock": true}
  ],
  "disclaimer": "Decision-support estimate. Not an official flood warning."
}
```
`mock: true` is removed (or false) once real predictions replace the sample data.

## GET /districts
Returns a JSON array ordered by district id:
```json
[
  {"id": 1, "name": "Patna", "state": "Bihar", "latitude": 25.59, "longitude": 85.14, "elevation_m": 53}
]
```

## Colour and text mapping (frontend)
| Level | Colour (suggested) | Text label |
|---|---|---|
| Low | green | Low |
| Medium | yellow | Medium |
| High | orange | High |
| Severe | red | Severe |

Always show the text label next to the colour (accessibility).

## Planned shapes (draft, confirm before building)
- `GET /trend?district_id=1&days=3` -> `{"series": [{"date": "2026-12-01", "probability": 0.31, "level": "Medium"}]}`
- `GET /history?district_id=1` -> `{"events": [{"date": "2024-08-10", "severity": "High", "source": "..."}]}`
- `POST /alerts/simulate` `{"district_id": 1, "channel": "sms"}` -> `201 {"alert_id": 7, "status": "simulated"}`
- `GET /admin/logs?from=&to=&page=` -> `{"rows": [...], "total": 0}`
