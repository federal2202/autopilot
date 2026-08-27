import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import ScalingMedia from "@/components/ScalingMedia";
import ServicesList from "@/components/ServicesList";
import ProcessSteps from "@/components/ProcessSteps";
import Partners from "@/components/Partners";
import Closing from "@/components/Closing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <ScalingMedia />
        <ServicesList />
        <ProcessSteps />
        <Partners />
        <Closing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
