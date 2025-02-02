import json
from datetime import datetime, timezone
import requests
from dotenv import load_dotenv
import os
from loguru import logger
import uuid
import random

# Load environment variables
load_dotenv()

MIN_PLACES_FOR_COLLECTION = 2


def get_formatted_content_entity(places):
    formatted_entities = []
    for place in places:
        is_open_now = (place.get("opening_hours", {}).get("open_now", False),)
        formatted_entities.append(
            {
                "id": str(uuid.uuid4()),
                "title": place.get("name", "Unknown"),
                # FIXME: Generate a real description
                "description": place.get("vicinity", "Unknown"),
                "type": "shop",
                # FIXME: Randomly generated distnace, needs to be computed or replaced with an alternative user relevant fact
                "distance": f"{round(random.uniform(0.05, 0.99), 2)} km",
                # FIXME: Distinguish between Open Now, Closing Soon and Closed
                "availability": "Open Now" if is_open_now else "Closed",
                # FIXME: Show a real, beatified photo
                "image": f"https://picsum.photos/id/{random.randint(1, 100)}/200/300",
                # FIXME: Generate a real alt text
                "altText": f"A cute shop with a sign that says {place.get('name', 'Unknown')}",
            }
        )
    return formatted_entities


def get_content_entities(nearby_places):
    content_entities = {}
    for place_type, places in nearby_places.items():
        if len(places) < MIN_PLACES_FOR_COLLECTION:
            continue

        content_entities[place_type] = {
            "id": str(uuid.uuid4()),
            "title": f"{place_type.capitalize()}'s Nearby",
            "description": "Brief description coming soon..",
            "entities": get_formatted_content_entity(places),
            "type": "collection",
        }
    return content_entities


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
            "format": "json",
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
        "format": "json",
    }
    response = requests.get(wiki_url, params=params)
    data = response.json()
    pages = data.get("query", {}).get("pages", {})
    return pages.get(str(page_id), {}).get("extract", "No content found.")


def get_osm_metadata(latitude, longitude):
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {"lat": latitude, "lon": longitude, "format": "json", "addressdetails": 1}
    headers = {"User-Agent": "YourAppName/1.0 (your-email@example.com)"}
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()


def get_weather(latitude, longitude):
    api_key = os.getenv("WEATHER_API_KEY")
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"lat": latitude, "lon": longitude, "appid": api_key, "units": "metric"}
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
        "restaurant",
        "cafe",
        "park",
        "museum",
        "tourist_attraction",
        "bar",
        "shopping_mall",
        "art_gallery",
        "library",
        "night_club",
        "movie_theater",
        "book_store",
        "amusement_park",
        "aquarium",
        "bowling_alley",
        "casino",
        "home_goods_store",
        "jewelry_store",
        "zoo",
        "stadium",
        "shoe_store",
        "movie_rental",
    ]
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    filtered_places = {}

    for place_type in place_types:
        params = {
            "location": f"{latitude},{longitude}",
            "radius": radius,
            "type": place_type,
            "key": api_key,
            "opennow": True,
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
            logger.error(
                f"Error fetching data for type {place_type}: {response.status_code}"
            )

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
        logger.error(f"Error fetching elevation: {e}")

    # Collect nearby Wikipedia articles
    try:
        wiki_articles = get_wikipedia_nearby_events(latitude, longitude)
        data["wikipedia_articles"] = [
            {
                "title": article["title"],
                "distance": article["dist"],
                "content": get_wikipedia_article(article["pageid"]),
            }
            for article in wiki_articles
        ]
    except Exception as e:
        logger.error(f"Error fetching Wikipedia articles: {e}")

    # Collect OpenStreetMap metadata
    try:
        data["osm_metadata"] = get_osm_metadata(latitude, longitude)
    except Exception as e:
        logger.error(f"Error fetching OSM metadata: {e}")

    # Collect weather data
    try:
        data["weather"] = get_weather(latitude, longitude)
    except Exception as e:
        logger.error(f"Error fetching weather: {e}")

    # Collect nearby places data
    try:
        data["nearby_places"] = get_nearby_places_by_types(latitude, longitude)
    except Exception as e:
        logger.error(f"Error fetching nearby places: {e}")

    try:
        data["content_entities"] = get_content_entities(data["nearby_places"])
    except Exception as e:
        logger.error(f"Error fetching content entities: {e}")

    # Save the collected data to the context file
    try:
        with open(context_file, "w") as json_file:
            json.dump(data, json_file, indent=4)
        logger.success(f"Data successfully saved to {context_file}")
    except Exception as e:
        logger.info(f"Error saving data to {context_file}: {e}")

    # Return the collected data for further use
    return data
