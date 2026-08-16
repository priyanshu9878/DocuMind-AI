import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function UploadDashboard() {
     const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const { getToken } = useAuth();

  const fetchFiles = async () => {
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

    if (data.success) {
      setFiles(data.files);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a PDF first");
      return;
    }

    const token = await getToken();

    const formData = new FormData();
    formData.append("pdf", file);

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

    const data = await res.json();

   if (data.success) {
  fetchFiles();

  console.log("Upload Response:", data);

  navigate(`/chat/${data.fileId}`);
}

    alert(data.message);
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={handleUpload}>
        Upload PDF
      </button>

      <h2>My Files</h2>

      {files.map((file) => (
  <div
    key={file._id}
    onClick={() => navigate(`/chat/${file._id}`)}
    style={{
      cursor: "pointer",
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ddd",
    }}
  >
    📄 {file.fileName}
  </div>
))}
    </div>
  );
}