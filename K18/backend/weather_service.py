"""Weather Service
Fetches weather data based on location coordinates
"""
import requests
from typing import Dict, Optional

class WeatherService:
    def __init__(self, api_key: Optional[str] = None):
        # Using Open-Meteo (free, no API key needed)
        self.base_url = "https://api.open-meteo.com/v1/forecast"
    
    def get_weather(self, latitude: float, longitude: float) -> Dict:
        """
        Get current weather data for given coordinates
        Returns temperature (in Celsius), humidity, precipitation, and weather condition
        """
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code",
                "temperature_unit": "celsius"
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            
            return {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "precipitation": current.get("precipitation", 0),
                "weather_code": current.get("weather_code"),
                "condition": self._get_weather_condition(current.get("weather_code", 0)),
                "is_humid": current.get("relative_humidity_2m", 0) > 60,
                "is_dry": current.get("relative_humidity_2m", 0) < 30,
                "is_rainy": current.get("precipitation", 0) > 0
            }
        except Exception as e:
            print(f"Error fetching weather: {e}")
            return {
                "temperature": None,
                "humidity": None,
                "precipitation": 0,
                "condition": "unknown",
                "is_humid": False,
                "is_dry": False,
                "is_rainy": False
            }
    
    def _get_weather_condition(self, code: int) -> str:
        """Convert weather code to readable condition"""
        weather_codes = {
            0: "clear",
            1: "mainly_clear",
            2: "partly_cloudy",
            3: "overcast",
            45: "foggy",
            48: "foggy",
            51: "light_rain",
            53: "moderate_rain",
            55: "heavy_rain",
            61: "light_rain",
            63: "moderate_rain",
            65: "heavy_rain",
            71: "light_snow",
            73: "moderate_snow",
            75: "heavy_snow",
            80: "rain_showers",
            81: "rain_showers",
            82: "heavy_rain_showers",
            95: "thunderstorm",
            96: "thunderstorm",
            99: "thunderstorm"
        }
        return weather_codes.get(code, "unknown")
