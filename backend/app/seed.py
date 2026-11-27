from __future__ import annotations

from sqlalchemy.orm import Session

from .models import District
from .sample_districts import SAMPLE_DISTRICTS


def seed_districts(db: Session) -> int:
    """Insert missing sample districts and return the total district count."""
    for item in SAMPLE_DISTRICTS:
        district = db.get(District, item["district_id"])
        if district is None:
            db.add(
                District(
                    id=item["district_id"],
                    name=item["name"],
                    state=item["state"],
                    latitude=item["latitude"],
                    longitude=item["longitude"],
                    elevation_m=item["elevation_m"],
                )
            )
    db.commit()
    return db.query(District).count()
