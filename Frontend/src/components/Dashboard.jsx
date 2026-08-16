import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import FileCard from "../components/FileCard.jsx";
import { UploadCloud } from "lucide-react";
import Landingpage from "../pages/Landingpage.jsx";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function Dashboard() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const token = await getToken();

      const res = await fetch(
        "http://localhost:3000/files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

    //  console.log("Files:", data);

      setFiles(data.files || []);
      console.log("Files received:", data.files);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  console.log("Selected:", file);
  setSelectedFile(file);
};

const uploadPdf = async () => {
  try {
    setUploading(true);
    setStatus("Uploading PDF...");

    const token = await getToken();

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    const res = await fetch(
      "http://localhost:3000/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    setStatus("Indexing document...");

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));

console.log("FILE:", data.file);
console.log("FILE ID:", data.file?._id);

    if (data.success) {
  navigate(`/chat/${data.fileId}`);
} else {
    console.log("FAILED");
      setStatus("❌ Upload failed");
    }
  } catch (err) {
    console.error(err);
    setStatus("❌ Upload failed");
  } finally {
    setUploading(false);
  }
};

const deleteFile = async (id) => {
  try {
    const token = await getToken();

    await fetch(
      `http://localhost:3000/files/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadFiles();
  } catch (error) {
    console.error(error);
  }
};



  
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-green-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-96 right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-175 h-75 rounded-full bg-green-500/5 blur-[200px] pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
      
          
          {/* Header Section */}
          <div className="text-center mb-6 mt-6">
           <div className="flex justify-center mb-6">
  <div className="inline-flex  gap-2 px-6 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
    ✨ AI Knowledge Base
  </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
              Your Document <span className="block text-green-400">Workspace</span>
            </h1>
            <p className="text-xl text-zinc-400  mx-auto mt-6 leading-relaxed justify-center flex">
              Upload PDFs, chat with your documents, and get citation-backed answers instantly.
            </p>
          </div>

        {/* FORCE SPACE */}
<div className="h-16"></div>

       
{/* Upload Card */}

<div className="flex justify-center relative">
  <div
    onClick={() => document.getElementById("pdfInput").click()}
    className="group w-150 p-8 rounded-3xl border border-green-500/20 bg-zinc-900/70 cursor-pointer transition-all hover:border-green-500/50 hover:scale-[1.01]"
  >
    <input
      id="pdfInput"
      type="file"
      accept=".pdf"
      className="hidden"
      onChange={handleFileChange}
    />

    <div className="flex gap-4 items-center justify-center">
      <UploadCloud
        size={64}
        className="text-green-400"
      />

      <h2 className="text-4xl font-bold">
        Upload New PDF
      </h2>
    </div>

    <p className="text-zinc-400 text-center mt-3 text-lg">
      Click here to upload your document
    </p>
  </div>
</div>

{/* FORCE SPACE */}
<div className="h-8"></div>

{/* Stats Grid */}
{/* Selected File Feedback */}
{selectedFile && (
  <div className="mt-6 flex flex-col items-center gap-4">
    <div className="text-green-400 font-medium">
      📄 {selectedFile.name}
    </div>

    <button
      onClick={uploadPdf}
      disabled={uploading}
      className="px-8 py-3 w-36 h-10 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition disabled:opacity-50"
    >
      {uploading ? "Uploading..." : "Confirm Upload"}
    </button>
  </div>
)}

{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16">

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 w-full">
    <p className="text-zinc-400 text-sm text-center">
      Documents
    </p>

    <h3 className="text-3xl font-bold mt-1 text-center">
      {files.length}
    </h3>
  </div>

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 w-full">
    <p className="text-zinc-400 text-sm text-center">
      Chats
    </p>

    <h3 className="text-3xl font-bold mt-1 text-center">
      --
    </h3>
  </div>

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 w-full">
    <p className="text-zinc-400 text-sm text-center">
      Status
    </p>

    <h3 className="text-green-400 font-semibold mt-1 text-center">
      Ready
    </h3>
  </div>

</div>
      </main>
    </div>
  );

}