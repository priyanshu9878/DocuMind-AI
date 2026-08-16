export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload your PDF",
      description:
        "Drag and drop any PDF document. We automatically extract and prepare the content.",
    },
    {
      number: "02",
      title: "We index it",
      description:
        "Embeddings are generated and stored securely so information can be retrieved instantly.",
    },
    {
      number: "03",
      title: "Ask anything",
      description:
        "Chat naturally with your document and receive accurate, source-backed answers.",
    },
  ];

  return (


<section
  id="how-it-works"
  className="
    min-h-screen
    flex
    items-center
    justify-center
    py-20
  "
>
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col items-center gap-16">

      {/* Heading */}
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
          Three steps to clarity
        </h2>

        <p className="text-xl text-zinc-400">
          From upload to answers in seconds.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 w-full">
        {steps.map((step) => (
          <div
            key={step.number}
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
            {/* Number Box */}
            <div
              className="
                w-14 h-14
                rounded-xl
                bg-green-500/10
                flex items-center justify-center
                mb-6
              "
            >
              <span className="text-green-400 font-bold text-lg">
                {step.number}
              </span>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-4">
              {step.title}
            </h3>

            <p className="text-zinc-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>


  );
}
