import { Upload, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Hero() {
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    // User is not logged in
    if (!isSignedIn) {
      alert("Please register or sign in first to upload a PDF.");
      return;
    }

    // User is logged in
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const token = await getToken();

      if (!token) {
        alert("Please register or sign in first.");
        return;
      }

      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch(
        `${API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      console.log("UPLOAD RESPONSE =", data);

      if (!res.ok) {
        alert(data.message || "Upload failed.");
        return;
      }

      if (data.success) {
        const url = `/chat/${data.fileId}`;

        console.log("Navigating to:", url);

        navigate(url);
      }

    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong while uploading.");
    }

    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-black to-zinc-900 text-white min-h-screen flex items-center justify-center">

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Background Glow */}

      <div className="flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center px-5 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-sm font-medium">
          <Sparkles size={16} />
          Powered by retrieval-augmented AI
        </div>

        {/* Headings */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-20">
          Chat with any PDF.
        </h1>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-2 text-green-500 drop-shadow-[0_0_40px_rgba(34,197,94,0.7)]">
          Get instant answers.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mt-8 text-xl text-zinc-400 px-4 leading-8 mb-12">
          Drop a document, ask a question. DocuMind AI indexes your PDFs
          and returns sourced, citation-backed answers in seconds.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">

          <button
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-3 h-12 w-56 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 transition-all text-lg"
          >
            <Upload size={20} />
            <span>Upload your first PDF</span>
          </button>

          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 w-64 rounded-full border border-zinc-700 text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all text-lg"
          >
            See how it works
          </button>

        </div>
      </div>
    </section>
  );
}