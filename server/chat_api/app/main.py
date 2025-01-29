from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from loguru import logger
from app.local_service import collect_and_save_data
from app.chat_service import update_context, chat_with_context

app = FastAPI()

# Configure Loguru
logger.add("logs/app.log", rotation="1 MB", retention="10 days", level="INFO")

# Global variable to store chat context
chat_context = None


class GeoData(BaseModel):
    latitude: float
    longitude: float


class Query(BaseModel):
    question: str


@app.post("/local-info/")
async def local_info(geo_data: GeoData):
    global chat_context

    try:
        logger.info(f"Received location data: {geo_data}")
        
        # Collect and save data
        chat_context = collect_and_save_data(geo_data.latitude, geo_data.longitude)
        logger.info("Data collection successful, updating context.")

        # **Immediately update context in memory**
        update_context(chat_context)

        logger.success("Context updated successfully.")
        return {"message": "Data collected and context initialized successfully", "data": chat_context}
    except Exception as e:
        logger.error(f"Error collecting data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error collecting data: {str(e)}")


@app.post("/chat/")
async def chat(query: Query):
    try:
        logger.info(f"Received chat query: {query.question}")
        answer = chat_with_context(query.question)
        logger.success("Chat response generated successfully.")
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")


@app.get("/")
def root():
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the Chat API!"}
