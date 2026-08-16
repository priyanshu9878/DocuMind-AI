import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      popular: false,
      features: [
        "5 PDFs per month",
        "100 questions",
        "Basic citations",
      ],
    },
    {
      name: "Pro",
      price: "$19",
      popular: true,
      features: [
        "Unlimited PDFs",
        "Unlimited questions",
        "Page-level citations",
        "Multi-doc chat",
        "Priority processing",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-16">

          {/* Heading */}
          <div className="text-center max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Simple Pricing
            </h2>

            <p className="text-xl text-zinc-400">
              Start free and upgrade when you need more power.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">

          {plans.map((plan) => (
  <div
    key={plan.name}
    className={`
      relative bg-[#03130d] rounded-3xl p-10 border transition-all duration-300 
      hover:-translate-y-1 flex flex-col items-center text-center 
      ${plan.popular 
        ? "border-green-500 shadow-[0_0_60px_rgba(34,197,94,0.12)]" 
        : "border-green-500/15"
      }
    `}
  >
    {/* Popular Badge */}
    {plan.popular && (
      <div className="absolute -top-4 px-4 py-1.5 rounded-full bg-green-400 text-black font-semibold text-sm">
        Popular
      </div>
    )}

    {/* Plan Name & Price */}
    <div className="mb-8">
      <h3 className={`text-2xl mb-4 ${plan.popular ? "text-green-400" : "text-zinc-300"}`}>
        {plan.name}
      </h3>

      <div className="flex items-center justify-center gap-1">
        <span className="text-6xl font-bold text-white">
          {plan.price}
        </span>
        {plan.name === "Pro" && (
          <span className="text-2xl text-zinc-400">/mo</span>
        )}
      </div>
    </div>

    {/* Centered Features List */}
    <ul className="space-y-5 w-full flex flex-col items-center">
      {plan.features.map((feature) => (
        <li
          key={feature}
          className="flex items-center justify-center gap-3 text-lg text-white"
        >
          <Check size={20} className="text-green-400 shrink-0" />
          {feature}
        </li>
      ))}
    </ul>

    {/* Centered Button */}
    <button
      className={`
        mt-10 w-full max-w-50 h-10 rounded-xl font-semibold transition-all flex items-center justify-center
        ${plan.popular 
          ? "bg-green-500 text-black hover:bg-green-400" 
          : "border border-zinc-700 text-white hover:border-zinc-500"
        }
      `}
    >
      {plan.name === "Free" ? "Get Started" : "Upgrade to Pro"}
    </button>
  </div>
))}

          </div>
        </div>
      </div>

       <div className="h-16"></div>
    </section>
  );
}


