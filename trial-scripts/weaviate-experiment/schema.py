import weaviate

import os
import weaviate.classes as wvc
from weaviate.classes.config import Configure
from weaviate.classes.config import Property, DataType
from weaviate import connect_to_weaviate_cloud, AuthApiKey

import os
from dotenv import load_dotenv
# Load environment variables
load_dotenv()
# # Load environment variables
wcd_url = os.getenv("WEAVIATE_URL")
wcd_api_key = os.getenv("WEAVIATE_API_KEY")

# Connect to Weaviate Cloud
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=wcd_url,
    auth_credentials=AuthApiKey(api_key=wcd_api_key)
)

collection_name = "BookCollection"  # Replace with your collection name
collection_schema = client.collections.get(name=collection_name)
logger.debug(f"Schema for {collection_name}:", collection_schema)

