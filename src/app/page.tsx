import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MusicToggle } from "@/components/MusicToggle";
import { Projects } from "@/components/Projects";
import { RevealObserver } from "@/components/RevealObserver";
import { Screens } from "@/components/Screens";
import { SkyBackground } from "@/components/SkyBackground";
import { Tools } from "@/components/Tools";

export default function HomePage() {
  return (
    <>
      <SkyBackground />
      <Header />
      <main id="topo">
        <Hero />
        <About />
        <Tools />
        <Projects />
        <Screens />
        <Contact />
      </main>
      <Footer />
      <MusicToggle />
      <RevealObserver />
    </>
  );
}
