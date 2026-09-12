import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PinnedTagline from "@/components/PinnedTagline";
import Marquee from "@/components/Marquee";
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
        <PinnedTagline />
        <Marquee />
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
