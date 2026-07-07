import os
from typing import Dict, Any

class WeatherAdapter:
    def __init__(self):
        self.api_key = os.environ.get("WEATHER_API_KEY", "mock-weather-key")

    async def get_forecast(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Fetch weather details for journey planning and packing checklist advice."""
        if self.api_key == "mock-weather-key":
            return {
                "temperature": 24.5,
                "humidity": 60,
                "condition": "Partly Cloudy",
                "wind_speed": 4.5,
                "packing_suggestions": ["Sunglasses", "Light jacket", "Sunscreen"]
            }

        try:
            import requests
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={self.api_key}&units=metric"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                temp = data["main"]["temp"]
                cond = data["weather"][0]["main"]
                packing = ["Sunscreen"]
                if temp < 15:
                    packing.append("Warm coat")
                elif temp > 25:
                    packing.append("Swimwear")
                return {
                    "temperature": temp,
                    "condition": cond,
                    "packing_suggestions": packing
                }
            return {"error": response.text}
        except Exception as e:
            return {"error": str(e)}
