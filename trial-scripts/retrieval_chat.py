from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_mistralai.chat_models import ChatMistralAI
from dotenv import load_dotenv
from loguru import logger
import os

# Load environment variables from .env
load_dotenv()

# Fetch the API key
mistral_api_key = os.getenv("MISTRAL_API_KEY")

# Step 1: Load data
loader = TextLoader("context.json")
docs = loader.load()

# Step 2: Split text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
documents = text_splitter.split_documents(docs)

# Step 3: Use Hugging Face Embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector = FAISS.from_documents(documents, embeddings)

# Step 4: Define Retriever
retriever = vector.as_retriever()

# Step 5: Define LLM (Mistral)
model = ChatMistralAI(mistral_api_key=mistral_api_key)

# Step 6: Define Chat History and Prompt Template
chat_history = []

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

# Step 7: Create the Retrieval and Generation Chain
document_chain = create_stuff_documents_chain(model, prompt)
retrieval_chain = create_retrieval_chain(retriever, document_chain)

# Step 8: Chat Function
def chat_with_context(question):
    global chat_history

    # Add the user query to the chat history
    chat_history.append({"sender": "User", "text": question})

    # Retrieve the context and get a response
    response = retrieval_chain.invoke({
        "input": question,
        "template_variables": {"chat_history": chat_history, "context": ""},
    })

    # Save the model's reply in chat history
    answer = response["answer"]
    chat_history.append({"sender": "Assistant", "text": answer})

    return answer

# Step 9: Example Chat
while True:
    user_question = input("You: ")
    if user_question.lower() in ["exit", "quit"]:
        break
    answer = chat_with_context(user_question)
    logger.info(f"Assistant: {answer}")
