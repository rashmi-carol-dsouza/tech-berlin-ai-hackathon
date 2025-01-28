from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_mistralai.chat_models import ChatMistralAI
from dotenv import load_dotenv
import os

load_dotenv()
# Adjust the path to reference the data directory
base_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(base_dir, "../data/context.json")

mistral_api_key = os.getenv("MISTRAL_API_KEY")

loader = TextLoader(data_path)
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
documents = text_splitter.split_documents(docs)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector = FAISS.from_documents(documents, embeddings)

retriever = vector.as_retriever()

model = ChatMistralAI(mistral_api_key=mistral_api_key)

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

document_chain = create_stuff_documents_chain(model, prompt)
retrieval_chain = create_retrieval_chain(retriever, document_chain)


def chat_with_context(question):
    global chat_history

    chat_history.append({"sender": "User", "text": question})

    response = retrieval_chain.invoke({
        "input": question,
        "template_variables": {"chat_history": chat_history, "context": ""},
    })

    answer = response["answer"]
    chat_history.append({"sender": "Assistant", "text": answer})

    return answer
