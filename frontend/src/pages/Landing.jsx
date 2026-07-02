import { useSelector } from "react-redux";
import Navbar from "../Components/landing/Navbar";
import Hero from "../Components/landing/Hero";
import Stats from "../Components/landing/Stats";
import Features from "../Components/landing/Features";
import Languages from "../Components/landing/Languages";
import CompanyPrep from "../Components/landing/CompanyPrep";
import WhyNixel from "../Components/landing/WhyNixel";
import Testimonials from "../Components/landing/Testimonials";
import FAQ from "../Components/landing/FAQ";
import CTA from "../Components/landing/CTA";
import Footer from "../Components/landing/Footer";

function Landing() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const startPath = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0B1120] text-[#F9FAFB] [font-family:Inter,ui-sans-serif,system-ui,sans-serif]">
      <Navbar startPath={startPath} />
      <main>
        <Hero startPath={startPath} />
        <Stats />
        <Features />
        <Languages />
        <CompanyPrep />
        <WhyNixel />
        <Testimonials />
        <FAQ />
        <CTA startPath={startPath} />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
