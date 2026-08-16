import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import cors from "cors";

import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import File from "./models/File.model.js";
import { clerkMiddleware,getAuth } from "@clerk/express";
import { syncUser } from "./middleware/syncUser.js";
import upload from "./middleware/upload.js";
import {indexing} from "./indexing.js";
import Chat from "./models/chat.js";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import {HumanMessage,AIMessage, SystemMessage} from "@langchain/core/messages";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());
app.use(syncUser);

app.post("/upload",upload.single("pdf"),
  async (req, res) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      console.log("Uploaded file:", req.file);

      await indexing(
        req.file.path,
        userId,
        req.file.originalname
      );

      const user = await User.findOne({
  clerkId: userId,
});
console.log("Mongo User:", user);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

// Save file metadata
const savedFile = await File.create({
  userId: user._id,
  fileName: req.file.originalname,
  filePath: req.file.path,
});

console.log("Saved File:", savedFile);

      res.status(200).json({
  success: true,
  message: "PDF uploaded and indexed",
  fileId: savedFile._id.toString(),
});
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  }
);

app.get("/files", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findOne({
      clerkId: userId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const files = await File.find({
      userId: user._id,
    }).sort({ uploadDate: -1 });

    res.json({
      success: true,
      files,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    // =========================
    // Authentication
    // =========================
    const { userId } = getAuth(req);

    console.log("Chat User:", userId);

    if (!userId) {
      return res.status(401).json({
        answer: "Unauthorized",
      });
    }

    // =========================
    // Request data
    // =========================
    const { fileId, question } = req.body;

    console.log("Question:", question);
    console.log("FileId:", fileId);

    if (!fileId) {
      return res.status(400).json({
        answer: "Missing fileId",
      });
    }

    if (!question) {
      return res.status(400).json({
        answer: "Missing question",
      });
    }

    // =========================
    // Find MongoDB user
    // =========================
    const mongoUser = await User.findOne({
      clerkId: userId,
    });

    if (!mongoUser) {
      return res.status(404).json({
        answer: "User not found",
      });
    }

    // =========================
    // Find file AND verify ownership
    // =========================
    const file = await File.findOne({
      _id: fileId,
      userId: mongoUser._id,
    });

    if (!file) {
      return res.status(404).json({
        answer: "File not found",
      });
    }

    console.log("File belongs to user:", file.fileName);

    // =========================
    // Find existing chat
    // =========================
    let chat = await Chat.findOne({
      userId: mongoUser._id,
      fileId,
    });

    // Create chat if it doesn't exist
    if (!chat) {
      chat = await Chat.create({
        userId: mongoUser._id,
        fileId,
        messages: [],
      });
    }

    // =========================
    // Generate embedding
    // =========================
    const embeddings =
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_PAID_API_KEY,
        model: "gemini-embedding-001",
      });

    const queryEmbedding =
      await embeddings.embedQuery(question);

    // =========================
    // Pinecone
    // =========================
    const pinecone = new Pinecone();

    const index = pinecone.Index(
      process.env.PINECONE_INDEX_NAME
    );

    const results = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,

      filter: {
        userId: userId,
        fileName: file.fileName,
      },
    });

    console.log(
      "Matches:",
      results.matches?.length
    );

    // =========================
    // Build context
    // =========================
    const context =
      results.matches
        ?.map((match) => match.metadata?.text)
        .join("\n\n") || "";

    // =========================
    // Get recent chat history
    // =========================
    const recentMessages =
      chat.messages.slice(-10);

    // =========================
    // Build Gemini conversation
    // =========================
    const history = [];

    history.push(
      new SystemMessage(`
You are DocuMind AI, a PDF question-answering assistant.

Answer ONLY using the provided context from the document.

Rules:
1. Do not use outside knowledge.
2. If the answer cannot be found in the context, reply exactly:
   "I could not find that information in this document."
3. Provide a clear, detailed answer in multiple sentences.
4. Explain important points, examples, and supporting details from the context whenever available.
5. Do not mention that you are using context or a PDF.
6. Do not invent facts that are not present in the document.
7. Keep answers between 80 and 150 words when sufficient information exists.
8. Use proper paragraphs and formatting for readability.

Context:
${context}
`)
    );

    // Add previous messages
    recentMessages.forEach((msg) => {
      if (msg.role === "user") {
        history.push(
          new HumanMessage(msg.content)
        );
      } else {
        history.push(
          new AIMessage(msg.content)
        );
      }
    });

    // Add current question
    history.push(
      new HumanMessage(question)
    );

    // =========================
    // Gemini
    // =========================
    const model =
      new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_PAID_API_KEY,
        model: "gemini-2.5-flash",
        temperature: 0.3,
      });

    const response =
      await model.invoke(history);

    // =========================
    // Save chat messages
    // =========================
    chat.messages.push(
      {
        role: "user",
        content: question,
      },
      {
        role: "assistant",
        content: response.content,
      }
    );

    await chat.save();

    // =========================
    // Response
    // =========================
    return res.json({
      answer: response.content,
    });

  } catch (error) {
    console.error(
      "Chat Error:",
      error
    );

    return res.status(500).json({
      answer: "Error generating answer",
    });
  }
});

app.get("/chat/:fileId", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        messages: [],
        message: "Unauthorized",
      });
    }

    const mongoUser = await User.findOne({
      clerkId: userId,
    });

    if (!mongoUser) {
      return res.status(404).json({
        messages: [],
        message: "User not found",
      });
    }

    const chat = await Chat.findOne({
      userId: mongoUser._id,
      fileId: req.params.fileId,
    });

    if (!chat) {
      return res.json({
        messages: [],
      });
    }

    return res.json({
      messages: chat.messages,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      messages: [],
    });
  }
});

app.delete("/files/:id", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const mongoUser = await User.findOne({
      clerkId: userId,
    });

    if (!mongoUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const file = await File.findOneAndDelete({
      _id: req.params.id,
      userId: mongoUser._id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
});

// MongoDB Connection
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(" MongoDB Connected");
} catch (err) {
  console.error(" MongoDB Error:", err);
  process.exit(1);
}

// Test Route
app.get("/", (req, res) => {
  res.send("DocuMind AI Backend Running");
});

app.use((err, req, res, next) => {
  console.error(" GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.get("/api/me", (req, res) => {
  const auth = getAuth(req);
  const { userId } = auth;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  res.json({
    success: true,
    userId,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});