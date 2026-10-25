import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MusicToggle } from "@/components/MusicToggle";
import { Preloader } from "@/components/Preloader";
import { Projects } from "@/components/Projects";
import { Screens } from "@/components/Screens";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmokeBackground } from "@/components/SmokeBackground";
import { Tools } from "@/components/Tools";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <SmokeBackground />
      <ScrollProgress />
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
    </>
  );
}
