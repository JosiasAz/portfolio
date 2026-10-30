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
import { getProjects } from "@/lib/github";

// Revalida a cada 60s: repos novos com o topic "portfolio" aparecem em ~1 min.
export const revalidate = 60;

export default async function HomePage() {
  const projects = await getProjects();

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
        <Projects projects={projects} />
        <Screens />
        <Contact />
      </main>
      <Footer />
      <MusicToggle />
    </>
  );
}
