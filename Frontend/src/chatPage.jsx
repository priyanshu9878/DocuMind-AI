import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function ChatPage() {
  const { fileId } = useParams();
  console.log("useParams =", useParams());
console.log("fileId =", fileId);
console.log("current url =", window.location.pathname);
  const { getToken } = useAuth();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    console.log(
    "Loading history for file:",
    fileId
  );
  loadChatHistory();
}, [fileId]);

const loadChatHistory = async () => {
  const token = await getToken();

  const res = await fetch(
    `${API_URL}/chat/${fileId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  if (res.status === 429) {
    setMessages((prev) => [
        ...prev,
        {
            role: "assistant",
            content: `That's it for now! \n\nYou've used your limit of 5 free questions for this period.. Come back in about ${data.remainingTime}.`,
        },
    ]);

    setQuestion("");
    setLoading(false);
    return;
}

  setMessages(data.messages || []);
};

const clearChat = async () => {
  setMessages([]);
};

const askQuestion = async () => {
  if (!question.trim() || rateLimited) return;

  setLoading(true);

  try {
    const token = await getToken();

    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileId,
        question,
      }),
    });

    const data = await res.json();

    // 🚫 Rate limit reached
    if (res.status === 429) {
      setRateLimited(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `That's it for now! \n\nYou've reached your limit of 5 questions for this period. Come back in about ${data.remainingTime}.`,
        },
      ]);

      setQuestion("");
      return;
    }

    // Other errors
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // Normal response
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
      {
        role: "assistant",
        content: data.answer,
      },
    ]);

    setQuestion("");

  } catch (error) {
    console.error("Chat error:", error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Something went wrong. Please try again.",
      },
    ]);

  } finally {
    setLoading(false);
  }
};

// console.log("Sending:", {
//   fileId,
//   question,
// });

  return (
  <div className="min-h-screen bg-black text-white flex flex-col ">

    {/* Header */}
    <div className="border-b border-zinc-800 px-6 py-4">
      <h1 className="text-2xl font-bold">
        📄 Chat With PDF
      </h1>

      <p className="text-zinc-400 text-sm mt-1">
        Ask questions about your uploaded document
      </p>
    </div>

    <button
    onClick={clearChat}
    className="px-4 py-2 rounded-lg w-36 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
  >
    Clear Chat
  </button>


    {/* Chat Messages */}
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6 overflow-y-auto">

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`
              max-w-[80%]
              px-5 
              py-3
              rounded-2xl
              ${
                msg.role === "user"
                  ? "bg-green-600 text-white "
                  : "bg-zinc-900 border border-zinc-800"
              }
            `}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3">
            Thinking...
          </div>
        </div>
      )}

    </div>

    {/* Input Area */}
    <div className="border-t border-zinc-800 p-4">
      <div className="max-w-4xl mx-auto flex gap-3">

        <input
  type="text"
  value={question}
  disabled={rateLimited}
  placeholder={
    rateLimited
      ? "Come back later..."
      : "Ask anything about this PDF..."
  }
  onChange={(e) => setQuestion(e.target.value)}
  className="
    flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed "/>

        <button
  onClick={askQuestion}
  disabled={loading || rateLimited}
  className="
    px-6
    py-3
    h-10
    w-24
    bg-green-600
    hover:bg-green-500
    rounded-xl
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  {rateLimited ? "Limit" : loading ? "..." : "Ask"}
</button>

      </div>
    </div>

  </div>
);
}