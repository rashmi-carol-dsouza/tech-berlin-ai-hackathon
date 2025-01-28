from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.local_service import collect_and_save_data
from app.chat_service import chat_with_context

app = FastAPI()

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
        chat_context = collect_and_save_data(geo_data.latitude, geo_data.longitude)

        return {"message": "Data collected and context initialized successfully", "data": chat_context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error collecting data: {str(e)}")


@app.post("/chat/")
async def chat(query: Query):
    try:
        # Pass only the question from the request
        answer = chat_with_context(query.question)
        return {"answer": answer}
    except Exception as e:
        # Handle errors gracefully
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")


@app.get("/")
def root():
    return {"message": "Welcome to the Chat API!"}
