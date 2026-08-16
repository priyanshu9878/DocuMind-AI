import { Zap, Search, FileText } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: "Instant Indexing",
      description:
        "Upload a PDF and start asking questions within seconds. No waiting, no setup.",
    },
    {
      icon: Search,
      title: "Cited Answers",
      description:
        "Every answer is grounded in your document with references to the exact source.",
    },
    {
      icon: FileText,
      title: "Any Document",
      description:
        "Research papers, manuals, contracts, reports — DocuMind understands them all.",
    },
  ];

  return (
<section id="features" className="
    min-h-screen
    flex 
    items-center
    justify-center
    py-20
  "> 
  <div className="max-w-7xl mx-auto px-6">
    {/* Use flex-col and gap-16 to control vertical rhythm between heading and grid */}
    <div className="flex flex-col items-center gap-16">
      
      {/* Heading */}
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
          Built for serious reading
        </h2>
        <p className="text-xl text-zinc-400">
          Everything you need to extract knowledge from documents.
        </p>
      </div>

      {/* Cards Grid */}
      {/* Remove margin from here, use the parent's gap-16 */}
      <div className="
    grid
    md:grid-cols-3
    gap-8
    w-full
  ">
   {features.map((feature, index) => {
  const Icon = feature.icon;

  return (
    <div
      key={index}
      className="
        bg-[#03130d]
        border border-green-500/15
        rounded-3xl
        p-8
        
        flex flex-col
        items-center
        text-center
        hover:border-green-500/30
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      <div
        className="
          w-14 h-14
          rounded-xl
          bg-green-500/10
          flex items-center justify-center
          mb-6
        "
      >
        <Icon className="w-7 h-7 text-green-400" />
      </div>

      <h3 className="text-2xl font-semibold text-white mb-4">
        {feature.title}
      </h3>

      <p className="text-zinc-400 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
})}
      </div>
      
    </div>
  </div>
</section>
    
  );
}