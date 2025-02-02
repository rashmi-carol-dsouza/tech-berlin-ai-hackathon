import weaviate
from weaviate.classes.init import Auth
from dotenv import load_dotenv
from loguru import logger
import os

# Load environment variables from .env file
load_dotenv()

# Fetch the credentials
weaviate_url = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")

# Ensure environment variables are set
if not weaviate_url or not weaviate_api_key:
    raise EnvironmentError("WEAVIATE_URL or WEAVIATE_API_KEY is not set in the environment variables.")

# Connect to Weaviate Cloud
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=weaviate_url,
    auth_credentials=Auth.api_key(weaviate_api_key),
)

# Check if the client is ready
try:
    logger.debug(client.is_ready())
finally:
    # Ensure the connection is properly closed
    client.close()