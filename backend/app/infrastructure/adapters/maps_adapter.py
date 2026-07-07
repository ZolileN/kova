import os
from typing import Dict, Any, List

class MapsAdapter:
    def __init__(self):
        self.api_key = os.environ.get("GOOGLE_MAPS_API_KEY", "mock-maps-key")

    async def get_places(self, query: str, location: str) -> List[Dict[str, Any]]:
        """Query Google Places API for points of interest, dining, and transit options."""
        if self.api_key == "mock-maps-key":
            return [
                {
                    "name": "Cathedral of Santa Maria del Fiore",
                    "address": "Piazza del Duomo, 50122 Firenze FI, Italy",
                    "rating": 4.8,
                    "place_id": "ch_florence_duomo"
                },
                {
                    "name": "Uffizi Gallery",
                    "address": "Piazzale degli Uffizi, 6, 50122 Firenze FI, Italy",
                    "rating": 4.7,
                    "place_id": "ch_florence_uffizi"
                }
            ]

        try:
            import requests
            url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&location={location}&key={self.api_key}"
            response = requests.get(url)
            if response.status_code == 200:
                results = response.json().get("results", [])
                return [
                    {
                        "name": r.get("name"),
                        "address": r.get("formatted_address"),
                        "rating": r.get("rating"),
                        "place_id": r.get("place_id")
                    } for r in results[:5]
                ]
            return []
        except Exception:
            return []
