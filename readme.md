<div align="center">

# 🧠 <span style="color:#22c55e;">DocuMind AI</span>

### <span style="color:#a1a1aa;">AI-Powered PDF Interaction & RAG Assistant</span>

<p>
  <strong>Upload a PDF.</strong>&nbsp;&nbsp;
  <strong>Ask questions.</strong>&nbsp;&nbsp;
  <strong>Get intelligent, context-grounded answers.</strong>
</p>

<br>

<a href="https://documind-ai-git-main-priyanshu-p-projects14.vercel.app">
  <img src="https://img.shields.io/badge/🚀%20Live%20Demo-22c55e?style=for-the-badge&logo=vercel&logoColor=white" />
</a>

<br><br>

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white" />
<img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />

<br><br>

<a href="#-features">Features</a> • <a href="#-tech-stack">Tech Stack</a> • <a href="#-how-it-works">How It Works</a> • <a href="#-installation">Installation</a> • <a href="#-environment-variables">Environment Variables</a>

</div>

---

## 🚀 About The Project

**DocuMind AI** is an AI-powered PDF interaction platform that allows users to upload documents and ask questions about their content using **Retrieval-Augmented Generation (RAG)**.

Instead of sending the entire document directly to an LLM, DocuMind AI:

> 📄 Processes the PDF → ✂️ Splits it into chunks → 🧠 Generates embeddings → 📌 Stores vectors in Pinecone → 🔎 Retrieves relevant context → 🤖 Generates an answer with Gemini

The system is designed to provide answers based **only on the uploaded document context**, reducing hallucinations and improving document-specific question answering.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📄 PDF Upload

Upload PDF documents directly through the web interface.

### 🔎 Semantic Search

Uses vector embeddings to retrieve the most relevant document sections.

### 🤖 AI Question Answering

Ask natural-language questions and receive detailed answers powered by Google Gemini.

<td width="50%">

### 🔐 Authentication

Clerk authentication protects application features and API endpoints.

### 👤 User Isolation

Users can access only their own uploaded PDFs and conversations.

### 📚 RAG Pipeline

Retrieval-Augmented Generation provides document-grounded responses.

### ⚡ Modern UI

Responsive React interface with a dark theme and green accent design.

</td>
</tr>
</table>

---

## 🧠 How It Works

```text
                    ┌──────────────────┐
                    │    User Login    │
                    │      Clerk       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Upload PDF     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  PDF Processing  │
                    │   & Chunking     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Gemini Embeddings│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Pinecone      │
                    │  Vector Storage  │
                    └────────┬─────────┘
                             │
                 User Question
                             │
                             ▼
                    ┌──────────────────┐
                    │ Semantic Search  │
                    │ Top-K Retrieval  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Gemini 2.5 Flash │
                    │     LLM          │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Context-Grounded │
                    │     Answer       │
                    └──────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose             |
| --------------- | ------------------- |
| ⚛️ React        | User interface      |
| 🎨 Tailwind CSS | Styling             |
| 🧭 React Router | Client-side routing |
| 🔐 Clerk        | Authentication      |
| ✨ Lucide React  | Icons               |
|                 |                     |

### Backend

| Technology       | Purpose                |
| ---------------- | ---------------------- |
| 🟢 Node.js       | Runtime                |
| 🚂 Express.js    | REST API               |
| 🍃 MongoDB       | User, file & chat data |
| 🔐 Clerk         | Authentication         |
| 📌 Pinecone      | Vector database        |
| 💎 Google Gemini | Embeddings & LLM       |
| 🦜 LangChain     | AI/RAG integration     |
| 📄 Multer        | PDF upload handling    |

---

## 🔐 Authentication & Security

DocuMind AI uses **Clerk** for authentication.

Protected backend endpoints verify the authenticated Clerk user before allowing access.

The application also performs ownership checks so that users can only access their own documents.

For example:

```js
const file = await File.findOne({
  _id: fileId,
  userId: mongoUser._id,
});
```

This prevents one authenticated user from accessing another user's PDF using a different `fileId`.

### Protected operations

* PDF upload
* PDF listing
* PDF deletion
* Chat requests
* Chat history

---

## 💬 AI Assistant Behavior

DocuMind AI is instructed to answer questions using the retrieved document context.

If the requested information cannot be found, the assistant responds:

> **"I could not find that information in this document."**

This helps keep responses focused on the uploaded document rather than unrelated external knowledge.

---

## 📁 Project Structure

```text
Documind AI/
│
├── Backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── indexing.js
│   ├── querying.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── sections/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── .gitignore
└── readme.md
```

> 🔒 `.env` files are excluded from Git using `.gitignore`.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/priyanshu9878/DocuMind-AI.git
cd Documind-AI
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **Backend** folder:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

CLERK_SECRET_KEY=your_clerk_secret_key

GEMINI_PAID_API_KEY=your_gemini_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

Create a `.env` file inside the **Frontend** folder:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

⚠️ **Never commit your ****`.env`**** files or API keys to GitHub.**

---

## ▶️ Running Locally

### Start Backend

```bash
cd Backend
npm start
```

Backend:

```text
http://localhost:3000
```

### Start Frontend

```bash
cd Frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔄 RAG Pipeline

The core RAG workflow is:

```text
PDF
 ↓
Text Extraction
 ↓
Text Chunking
 ↓
Embedding Generation
 ↓
Pinecone Vector Database
 ↓
User Question
 ↓
Question Embedding
 ↓
Similarity Search
 ↓
Top Relevant Chunks
 ↓
Context + Conversation History
 ↓
Gemini 2.5 Flash
 ↓
Final Answer
```

---

## 📊 Data Storage

### MongoDB

MongoDB stores:

* Users
* Uploaded PDF metadata
* Chat conversations
* Messages

### Pinecone

Pinecone stores vector representations of document chunks along with metadata such as:

```text
userId
fileName
text
```

This allows queries to be filtered to the authenticated user's document.

---

## 🎯 Future Improvements

* [ ] PDF page-level citations
* [ ] Multi-document conversations
* [ ] Document preview
* [ ] Streaming AI responses
* [ ] File sharing
* [ ] Advanced chat search
* [x] Production deployment
* [ ] Usage analytics
* [ ] Subscription / billing system

---

## 👨‍💻 Author

<div align="center">

### <span style="color:#22c55e;">Priyanshu</span>

Building AI-powered applications with modern full-stack technologies.

<br>

⭐ **If you found this project useful, consider giving it a star!**

</div>

---

<div align="center">

### <span style="color:#22c55e;">DocuMind AI</span>

<span style="color:#71717a;">Upload • Retrieve • Ask • Understand</span>

</div>
