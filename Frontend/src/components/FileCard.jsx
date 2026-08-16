import { FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FileCard({ file, onDelete }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    onClick={() => {
  console.log("FILE OBJECT:", file);
  console.log("FILE ID:", file._id);

  const url = `/chat/${file._id}`;

  console.log("Navigating to:", url);

  navigate(url);
}}
      className="
        bg-zinc-900/80
        backdrop-blur-md
        border
        border-zinc-800
        hover:border-green-500
        rounded-2xl
        p-5
        shadow-lg
        transition-all
        cursor-pointer
      "
    >
      <div className="flex justify-between items-start">
        <FileText
          className="text-green-500"
          size={30}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();

            if (onDelete) {
              onDelete(file._id);
            }
          }}
          className="
            text-zinc-500
            hover:text-red-500
            transition
          "
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="mt-4 font-semibold text-lg truncate">
        {file.fileName}
      </h3>

      <p className="text-zinc-500 text-sm mt-2">
        Click to start chatting
      </p>

      <div className="mt-4 pt-3 border-t border-zinc-800">
        <span
          className="
            text-xs
            bg-green-500/10
            text-green-400
            px-2
            py-1
            rounded-full
          "
        >
          Indexed
        </span>
      </div>
    </motion.div>
  );
}