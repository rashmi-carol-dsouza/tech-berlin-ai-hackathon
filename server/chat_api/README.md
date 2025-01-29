# 🗺️ FastAPI Chat API with TTS & Local Info

This is a FastAPI-based chatbot API that provides **text-based responses** and **text-to-speech (TTS) audio responses** using **LMNT TTS API**. It also fetches **local information** (e.g., Wikipedia, weather, places) based on latitude and longitude.

## 🚀 Features
- **Chat API**: Retrieves contextual responses using LangChain & FAISS.
- **Local Info API**: Fetches weather, Wikipedia, and places based on latitude & longitude.
- **TTS Support**: Converts chat responses into **MP3 files** and streams them.

---

## 🔧 Installation

### **1️⃣ Install Poetry**
Ensure you have [Poetry](https://python-poetry.org/docs/#installation) installed.

```sh
curl -sSL https://install.python-poetry.org | python3 -
```

### **2️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### **3️⃣ Install Dependencies**

```sh
poetry install
```

### **4️⃣ Set Up Environment Variables**

```sh
MISTRAL_API_KEY=your_mistral_api_key
LMNT_API_KEY=your_lmnt_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_openweathermap_api_key
```

## 🚀 Running the API

### Using Makefile

A Makefile is included for convenience. You can run:

```sh
make run
```
or manually start using:


```sh
poetry run uvicorn app.main:app --reload
```

## 📡 API Endpoints

### **1️⃣ Get Local Information**
Endpoint: POST /local-info/

Description: Fetches Wikipedia articles, weather, and nearby places.

Request:
```sh
{
  "latitude": 52.531754,
  "longitude": 13.464689
}
```

Response
```sh
{
  "message": "Data collected and context initialized successfully",
  "data": { ... }
}
```

### **2️⃣ Chat API (Text & Audio)**

Endpoint: POST /chat/

Description: Sends a chat question and gets a text + MP3 response.

Request:
```sh
{
  "question": "What is the weather like?"
}
```

Response (MP3 Stream):

Returns an MP3 file for playback.

If using Postman, the response will auto-download as response.mp3.