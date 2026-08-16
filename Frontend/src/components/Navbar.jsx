import { FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="
        sticky top-0 z-50
        border-b border-green-500/10
        bg-linear-to-r
        from-[#00130c]
        via-[#021a11]
        to-[#00130c]
        backdrop-blur-2xl
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="h-24 flex items-center justify-between">
          
          {/* Logo */}
         <div className="flex items-center gap-4">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-4 cursor-pointer "
            >
              <div
                className="
                  w-14 h-14
                  rounded-xl
                  bg-green-500/10
                  border border-green-500/20
                  shadow-[0_0_20px_rgba(34,197,94,0.15)]
                  flex items-center justify-center
                "
              >
                <FileText
                  size={24}
                  className="text-green-500"
                />
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white">
                DocuMind{" "}
                <span className="text-green-500">
                  AI
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-16">
            <a 
              href="#features"
              className="
              hover:text-white
                text-zinc-400
                font-medium
                transition
              "
            >
              Features
            </a>

            <a 
              href="#how-it-works"
              className="
                text-zinc-400
                hover:text-white
                transition
              "
            >
              How it works
            </a>

            <a  
              href="#pricing"
              className="
                text-zinc-400
                hover:text-white
                transition
              "
            >
              Pricing
            </a>
          </div>
          

        </div>
      </div>
    </nav>
   
  );
}