from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import asyncio
from app.local_service import collect_and_save_data
from app.chat_service import update_context, chat_with_context
from loguru import logger
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base_dir, "../data")
data_path = os.path.join(data_dir, "context.json")

app = FastAPI()

class GeoData(BaseModel):
    latitude: float
    longitude: float

class Query(BaseModel):
    question: str

@app.post("/local-info/")
async def local_info(geo_data: GeoData):
    try:
        chat_context = collect_and_save_data(geo_data.latitude, geo_data.longitude)
        update_context(chat_context)

        logger.info("✅ Location-based data collected and stored.")
        return {"message": "Data collected and context initialized successfully", "data": chat_context}
    except Exception as e:
        logger.error(f"❌ Error collecting data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error collecting data: {str(e)}")

@app.post("/chat/")
async def chat(query: Query):
    try:
        mp3_file_path = await chat_with_context(query.question)

        # Return the MP3 file directly as a response
        return FileResponse(mp3_file_path, media_type="audio/mpeg", filename="response.mp3")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")


@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """Endpoint to serve the audio file."""
    file_path = os.path.join(data_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found.")

    return FileResponse(file_path, media_type="audio/mpeg", filename=filename)

@app.get("/")
def root():
    return {"message": "Welcome to the Chat API!"}
