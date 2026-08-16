import Navbar from "../components/Navbar.jsx";
import Hero from "../sections/hero.jsx";
import Features from "../sections/features.jsx";
import HowItWorks from "../sections/howitworks.jsx";
import Pricing from "../sections/pricing.jsx";

export default function Landing() {
  return (
    <div className="bg-black min-h-screen text-white ">
      <Navbar />
       <Hero/>
       <Features/>
       <HowItWorks/>
       <Pricing/>
    </div>
  );
} 