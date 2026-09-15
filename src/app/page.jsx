import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PinnedTagline from "@/components/PinnedTagline";
import Marquee from "@/components/Marquee";
import Intro from "@/components/Intro";
import Showreel from "@/components/Showreel";
import ServicesList from "@/components/ServicesList";
import ProcessSteps from "@/components/ProcessSteps";
import Faq from "@/components/Faq";
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
        <Intro />
        <Marquee />
        <Showreel />
        <ServicesList />
        <ProcessSteps />
        <Faq />
        <Closing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
