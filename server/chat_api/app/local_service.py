import json
from datetime import datetime, timezone
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def get_elevation(latitude, longitude):
    url = "https://api.open-elevation.com/api/v1/lookup"
    params = {"locations": f"{latitude},{longitude}"}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get("results", [])[0]
    else:
        response.raise_for_status()


def get_wikipedia_nearby_events(lat, lon, radius=1000):
    """
    Fetch all nearby Wikipedia articles based on geographic coordinates within a 1 km radius.
    """
    wiki_url = "https://en.wikipedia.org/w/api.php"
    articles = []
    continue_token = None

    while True:
        params = {
            "action": "query",
            "list": "geosearch",
            "gscoord": f"{lat}|{lon}",
            "gsradius": radius,
            "gslimit": 50,
            "format": "json"
        }
        if continue_token:
            params.update(continue_token)

        response = requests.get(wiki_url, params=params)
        data = response.json()

        # Collect articles
        articles.extend(data.get("query", {}).get("geosearch", []))

        # Check if there are more results to fetch
        if "continue" in data:
            continue_token = data["continue"]
        else:
            break

    return articles


def get_wikipedia_article(page_id):
    """
    Fetch the content of a Wikipedia article using its page ID.
    """
    wiki_url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "pageids": page_id,
        "prop": "extracts",
        "explaintext": True,
        "format": "json"
    }
    response = requests.get(wiki_url, params=params)
    data = response.json()
    pages = data.get("query", {}).get("pages", {})
    return pages.get(str(page_id), {}).get("extract", "No content found.")


def get_osm_metadata(latitude, longitude):
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "json",
        "addressdetails": 1
    }
    headers = {"User-Agent": "YourAppName/1.0 (your-email@example.com)"}
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()


def get_weather(latitude, longitude):
    api_key = os.getenv("WEATHER_API_KEY")
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": api_key,
        "units": "metric"
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()


def get_nearby_places_by_types(latitude, longitude, radius=1000, min_rating=4.0):
    """
    Fetch nearby places for hardcoded place types using the Google Places API.
    Apply rating filter only for restaurants, cafes, and bars.
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    place_types = [
        "restaurant", "cafe", "park", "museum", "tourist_attraction", "bar",
        "shopping_mall", "art_gallery", "library", "night_club",
        "movie_theater", "book_store", "amusement_park", "aquarium", "bowling_alley",
        "casino", "home_goods_store", "jewelry_store", "zoo", "stadium",
        "shoe_store", "movie_rental"
    ]
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    filtered_places = {}

    for place_type in place_types:
        params = {
            "location": f"{latitude},{longitude}",
            "radius": radius,
            "type": place_type,
            "key": api_key,
            "opennow": True
        }

        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            places = response.json().get("results", [])
            if place_type in ["restaurant", "cafe", "bar"]:
                filtered_places[place_type] = [
                    place for place in places if place.get("rating", 0) >= min_rating
                ]
            else:
                filtered_places[place_type] = places
        else:
            print(f"Error fetching data for type {place_type}: {response.status_code}")

    return filtered_places


def collect_and_save_data(latitude, longitude):
    # Define the base directory and context file path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "../data")
    context_file = os.path.join(data_dir, "context.json")

    # Ensure the data directory exists
    os.makedirs(data_dir, exist_ok=True)

    # Initialize the data dictionary
    current_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    data = {"timestamp": current_time}

    # Collect elevation data
    try:
        data["elevation"] = get_elevation(latitude, longitude)
    except Exception as e:
        print(f"Error fetching elevation: {e}")

    # Collect nearby Wikipedia articles
    try:
        wiki_articles = get_wikipedia_nearby_events(latitude, longitude)
        data["wikipedia_articles"] = [
            {
                "title": article["title"],
                "distance": article["dist"],
                "content": get_wikipedia_article(article["pageid"])
            }
            for article in wiki_articles
        ]
    except Exception as e:
        print(f"Error fetching Wikipedia articles: {e}")

    # Collect OpenStreetMap metadata
    try:
        data["osm_metadata"] = get_osm_metadata(latitude, longitude)
    except Exception as e:
        print(f"Error fetching OSM metadata: {e}")

    # Collect weather data
    try:
        data["weather"] = get_weather(latitude, longitude)
    except Exception as e:
        print(f"Error fetching weather: {e}")

    # Collect nearby places data
    try:
        data["nearby_places"] = get_nearby_places_by_types(latitude, longitude)
    except Exception as e:
        print(f"Error fetching nearby places: {e}")

    # Save the collected data to the context file
    try:
        with open(context_file, "w") as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Data successfully saved to {context_file}")
    except Exception as e:
        print(f"Error saving data to {context_file}: {e}")

    # Return the collected data for further use
    return data
