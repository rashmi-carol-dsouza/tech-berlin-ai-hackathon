import weaviate
from weaviate.auth import AuthApiKey
import os
from dotenv import load_dotenv
from loguru import logger
# Load environment variables
load_dotenv()
# Best practice: store your credentials in environment variables
wcd_url = os.getenv("WEAVIATE_URL")
wcd_api_key = os.getenv("WEAVIATE_API_KEY")

# Ensure environment variables are loaded correctly
if not wcd_url or not wcd_api_key:
    raise EnvironmentError("Ensure WCD_URL and WCD_API_KEY are set in your environment variables.")

# Connect to Weaviate Cloud
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=wcd_url,                                    # Your Weaviate Cloud URL
    auth_credentials=AuthApiKey(api_key=wcd_api_key)        # Weaviate Cloud API key
)

# Access the BookCollection
books = client.collections.get("BookCollection")

# Fetch objects and display the first one
try:
    response = books.query.fetch_objects(limit=1)  # Fetch the first entry
    logger.info(response)

except Exception as e:
    logger.error(f"Error retrieving the first entry: {e}")

finally:
    client.close()

