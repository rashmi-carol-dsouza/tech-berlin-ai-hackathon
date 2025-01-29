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
# CREATE DUMMY DATABASE SCHEMA
# try:
#     # Create the "Book" collection schema
#     client.collections.create(
#         name="BookCollection",  # Collection name
#         properties=[
#             Property(name="title", data_type=DataType.TEXT, description="The title of the book"),
#             Property(name="author", data_type=DataType.TEXT, description="The author of the book"),
#             Property(name="publishedYear", data_type=DataType.INT, description="The year the book was published"),
#             Property(name="summary", data_type=DataType.TEXT, description="A brief summary of the book"),
#             Property(name="embedding", data_type=DataType.NUMBER_ARRAY, description="The embedding vector for the book"),
#         ],
#         vectorizer_config=[
#             Configure.NamedVectors.text2vec_cohere(name="cohereFirst"),
#             Configure.NamedVectors.text2vec_cohere(name="cohereSecond"),
#         ]
#     )
#     print("Schema created successfully!")

# except Exception as e:
#     print(f"Failed to create schema: {e}")

# finally:
#     client.close()

#  CHECK IF DATABASE CREATE SUCESSFULLY
# Retrieve details for a specific collection (optional)
collection_name = "BookCollection"  # Replace with your collection name
collection_schema = client.collections.get(name=collection_name)
print(f"Schema for {collection_name}:", collection_schema)


# # Delete a specific collection
# collection_name = "BookCollection"  # Replace with the name of the collection to delete
# try:
#     client.collections.delete(name=collection_name)  # Deletes the specified collection
#     print(f"Collection '{collection_name}' deleted successfully.")
# except Exception as e:
#     print(f"Failed to delete collection '{collection_name}': {e}")
# List existing collections

