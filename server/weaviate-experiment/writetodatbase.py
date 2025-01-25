import json
import os
from dotenv import load_dotenv
from weaviate import connect_to_weaviate_cloud
from weaviate.auth import AuthApiKey

# Load environment variables
load_dotenv()

# Fetch Weaviate URL and API Key
wcd_url = os.getenv("WEAVIATE_URL")
wcd_api_key = os.getenv("WEAVIATE_API_KEY")

# Ensure environment variables are set
if not wcd_url or not wcd_api_key:
    raise EnvironmentError("WEAVIATE_URL or WEAVIATE_API_KEY is not set in the environment variables.")

# Connect to Weaviate Cloud
client = connect_to_weaviate_cloud(
    cluster_url=wcd_url,
    auth_credentials=AuthApiKey(api_key=wcd_api_key)
)

# Sample book data
books_data = [
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "publishedYear": 1960,
        "summary": "A novel about the moral growth of a young girl in the racially charged Deep South.",
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "publishedYear": 1949,
        "summary": "A dystopian novel depicting a totalitarian regime that employs surveillance and propaganda.",
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "publishedYear": 1813,
        "summary": "A romantic novel focusing on issues of marriage, morality, and social standing.",
    }
]

# Add vectors to data (for demonstration purposes; replace with real embeddings if available)
for book in books_data:
    book["vector"] = [0.1, 0.2, 0.3, 0.4, 0.5]  # Dummy vector embeddings

# Batch insert data
try:
    # Retrieve the BookCollection
    books = client.collections.get("BookCollection")

    # Use dynamic batch insertion
    with books.batch.dynamic() as batch:
        for book in books_data:
            batch.add_object(
                data_object={
                    "title": book["title"],
                    "author": book["author"],
                    "publishedYear": book["publishedYear"],
                    "summary": book["summary"],
                },
                vector=book.get("vector"),  # Add the embedding vector
                vector_name="cohereFirst"  # Explicitly specify the vector name
            )
    print("Books successfully added to BookCollection!")

except Exception as e:
    print(f"Error while adding books: {e}")

finally:
    # Ensure connection is properly closed
    client.close()
