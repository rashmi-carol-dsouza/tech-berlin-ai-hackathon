import json
import os
from loguru import logger
from langchain.docstore.document import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_mistralai.chat_models import ChatMistralAI
from dotenv import load_dotenv

load_dotenv()

# Configure Loguru
logger.add("logs/chat_service.log", rotation="1 MB", retention="10 days", level="INFO")

# Load API key for ChatMistral
mistral_api_key = os.getenv("MISTRAL_API_KEY")

# Paths for data storage
base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base_dir, "../data")
data_path = os.path.join(data_dir, "context.json")

# Initialize variables for context and retriever
chat_context = None
retriever = None
chat_history = []

# Initialize HuggingFace Embeddings and Mistral model
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
model = ChatMistralAI(mistral_api_key=mistral_api_key)

# Chat prompt template
prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant. Use the provided context to answer questions conversationally.

Chat History:
{{ '{{%' }} for message in chat_history {{ '%}}' }}
{{ '{{' }} message.sender {{ '}}' }}: {{ '{{' }} message.text {{ '}}' }}
{{ '{{%' }} endfor {{ '%}}' }}

Context:
{context}

User: {input}
""")


def load_existing_context():
    """Load context from the context.json file if it exists; otherwise, set chat_context to None."""
    global chat_context, retriever

    if os.path.exists(data_path):
        logger.info(f"✅ Found existing context file at {data_path}")
        try:
            with open(data_path, "r") as json_file:
                chat_context = json.load(json_file)

            # Verify the content of chat_context
            if not chat_context:
                logger.warning("⚠️ Context file exists but is empty.")
                chat_context = None
                return

            logger.info(f"✅ Loaded context: {json.dumps(chat_context, indent=2)[:500]}...")

            # Split the new context into chunks
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
            documents = text_splitter.split_documents(
                [Document(page_content=json.dumps(chat_context))]
            )

            # Build a new FAISS vector store with the updated documents
            vector = FAISS.from_documents(documents, embeddings)
            retriever = vector.as_retriever()
            logger.success("✅ Context initialized successfully.")

        except Exception as e:
            logger.error(f"❌ Error loading context: {e}")
            chat_context = None
    else:
        logger.warning("⚠️ No existing context found. The server will start without context.")


def update_context(new_context):
    """Update the global context and initialize the retriever."""
    global chat_context, retriever

    chat_context = new_context

    # Ensure data directory exists
    os.makedirs(data_dir, exist_ok=True)

    # Save new context to file
    with open(data_path, "w") as json_file:
        json.dump(new_context, json_file, indent=4)

    # Split the new context into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    documents = text_splitter.split_documents(
        [Document(page_content=json.dumps(new_context))]
    )

    # Build a new FAISS vector store with the updated documents
    vector = FAISS.from_documents(documents, embeddings)
    retriever = vector.as_retriever()
    logger.success("✅ New context saved and initialized.")


def chat_with_context(question):
    """Respond to a user question using the updated context."""
    global chat_history, chat_context, retriever

    if chat_context is None or retriever is None:
        raise ValueError("Context not initialized. Please call `/local-info/` first to provide location data.")

    try:
        logger.info(f"💬 Received chat question: {question}")

        # Add the user question to the chat history
        chat_history.append({"sender": "User", "text": question})

        # Create the retrieval chain using the updated retriever
        document_chain = create_stuff_documents_chain(model, prompt)
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        # Retrieve the answer
        response = retrieval_chain.invoke({
            "input": question,
            "template_variables": {"chat_history": chat_history, "context": ""},
        })

        # Save the assistant's reply in chat history
        answer = response["answer"]
        chat_history.append({"sender": "Assistant", "text": answer})

        logger.success("✅ Chat response generated successfully.")
        return answer

    except Exception as e:
        logger.error(f"❌ Chat processing error: {e}")
        raise ValueError(f"Error processing chat request: {str(e)}")


# Attempt to load existing context on server startup
load_existing_context()
