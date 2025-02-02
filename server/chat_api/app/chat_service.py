import json
import os
from loguru import logger
from lmnt.api import Speech
from langchain.docstore.document import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_mistralai.chat_models import ChatMistralAI  # type: ignore
from dotenv import load_dotenv

load_dotenv()

# Configure Loguru logging
logger.add("logs/chat_service.log", rotation="1 MB", retention="10 days", level="INFO")

# Load API keys
mistral_api_key = os.getenv("MISTRAL_API_KEY")
lmnt_api_key = os.getenv("LMNT_API_KEY")

# Paths for data storage
base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base_dir, "../data")
data_path = os.path.join(data_dir, "context.json")

# Ensure data directory exists
os.makedirs(data_dir, exist_ok=True)

# Initialize variables for context and retriever
chat_context = None
retriever = None
chat_history = []

# Initialize HuggingFace Embeddings and Mistral model
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
model = ChatMistralAI(mistral_api_key=mistral_api_key)

# Chat prompt template
prompt = ChatPromptTemplate.from_template(
    """
You are a helpful assistant. Use the provided context to answer questions conversationally.

Chat History:
{{ '{{%' }} for message in chat_history {{ '%}}' }}
{{ '{{' }} message.sender {{ '}}' }}: {{ '{{' }} message.text {{ '}}' }}
{{ '{{%' }} endfor {{ '%}}' }}

Context:
{context}

User: {input}
"""
)


class LMNTtts:
    """Handles text-to-speech conversion using LMNT API."""

    def __init__(self, api_key: str, model: str = "blizzard", voice_id: str = "lily"):
        self.api_key = api_key
        self.voice_id = voice_id
        self.model = model
        self.output_file = os.path.join(data_dir, "response.mp3")

    async def synthesize(self, text: str) -> str:
        """Convert text to speech and save as an MP3 file."""
        async with Speech(self.api_key) as speech:
            synthesis = await speech.synthesize(text, self.voice_id, model=self.model)

        with open(self.output_file, "wb") as f:
            f.write(synthesis["audio"])

        logger.success(f"Audio response saved to {self.output_file}")
        return self.output_file


def load_existing_context():
    """Load context from the context.json file if it exists."""
    global chat_context, retriever

    if os.path.exists(data_path):
        logger.info(f"Found existing context file at {data_path}")
        try:
            with open(data_path, "r") as json_file:
                chat_context = json.load(json_file)

            if not chat_context:
                logger.warning("⚠️ Context file exists but is empty.")
                chat_context = None
                return

            logger.info("Loaded context.")

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500, chunk_overlap=50
            )
            documents = text_splitter.split_documents(
                [Document(page_content=json.dumps(chat_context))]
            )

            vector = FAISS.from_documents(documents, embeddings)
            retriever = vector.as_retriever(search_kwargs={"k": 3})
            logger.success("Context initialized successfully.")

        except Exception as e:
            logger.error(f"Error loading context: {e}")
            chat_context = None
    else:
        logger.warning(
            "⚠️ No existing context found. The server will start without context."
        )


def update_context(new_context):
    """Update the global context and initialize the retriever."""
    global chat_context, retriever

    chat_context = new_context

    # Save new context to file
    with open(data_path, "w") as json_file:
        json.dump(new_context, json_file, indent=4)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    documents = text_splitter.split_documents(
        [Document(page_content=json.dumps(new_context))]
    )

    vector = FAISS.from_documents(documents, embeddings)
    retriever = vector.as_retriever()
    logger.success("New context saved and initialized.")


async def chat_with_context(question):
    """Generate a response, save as MP3, and return the MP3 file path."""
    global chat_history, chat_context, retriever

    if chat_context is None or retriever is None:
        raise ValueError(
            "Context not initialized. Please call `/local-info/` first to provide location data."
        )

    try:
        logger.info(f"💬 Received chat question: {question}")

        chat_history.append({"sender": "User", "text": question})

        document_chain = create_stuff_documents_chain(model, prompt)
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        response = retrieval_chain.invoke(
            {
                "input": question,
                "template_variables": {"chat_history": chat_history, "context": ""},
            }
        )

        answer = response["answer"]
        chat_history.append({"sender": "Assistant", "text": answer})

        logger.success("Chat response generated successfully.")

        # Convert answer to speech and save
        tts = LMNTtts(api_key=os.getenv("LMNT_API_KEY"))
        mp3_file_path = await tts.synthesize(answer)

        return mp3_file_path  # Return the MP3 file path

    except Exception as e:
        logger.error(f"Chat processing error: {e}")
        raise ValueError(f"Error processing chat request: {str(e)}")


# Load existing context at startup
load_existing_context()
