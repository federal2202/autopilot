import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GrowthPath from "@/components/GrowthPath";
import SectionDivider from "@/components/SectionDivider";
import Segments from "@/components/Segments";
import SingleServices from "@/components/SingleServices";
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
        <GrowthPath />
        <SectionDivider />
        <Segments />
        <SingleServices />
        <SectionDivider />
        <Partners />
        <Closing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
