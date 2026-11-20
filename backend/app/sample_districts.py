"""A few sample districts so the frontend map can be built before the real district dataset exists.

Coordinates are approximate city/district centres. Kshitij replaces this with the database table in week 2.
"""

SAMPLE_DISTRICTS = [
    {
        "district_id": 1,
        "name": "Patna",
        "state": "Bihar",
        "latitude": 25.59,
        "longitude": 85.14,
        "elevation_m": 53,
    },
    {
        "district_id": 2,
        "name": "Kamrup Metropolitan",
        "state": "Assam",
        "latitude": 26.14,
        "longitude": 91.74,
        "elevation_m": 55,
    },
    {
        "district_id": 3,
        "name": "Lucknow",
        "state": "Uttar Pradesh",
        "latitude": 26.85,
        "longitude": 80.95,
        "elevation_m": 123,
    },
    {
        "district_id": 4,
        "name": "Ernakulam",
        "state": "Kerala",
        "latitude": 9.98,
        "longitude": 76.28,
        "elevation_m": 8,
    },
]

# Fixed mock rainfall per district (mm) so the demo map shows all four colours. Not real data.
MOCK_RAIN = {1: (60, 140, 300), 2: (120, 260, 480), 3: (10, 30, 70), 4: (80, 170, 330)}
