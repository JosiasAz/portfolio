import { About } from "@/components/About";
import { ChristmasAscii } from "@/components/ChristmasAscii";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MusicToggle } from "@/components/MusicToggle";
import { Hero } from "@/components/Hero";
import { Path } from "@/components/Path";
import { Projects } from "@/components/Projects";
import { Screens } from "@/components/Screens";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Tools } from "@/components/Tools";
import { getProjects, getScreens } from "@/lib/github";

// Revalida a cada 60s: repos novos com o topic "portfolio" aparecem em ~1 min.
export const revalidate = 60;

export default async function HomePage() {
  const projects = await getProjects();
  const screens = await getScreens(projects);

  return (
    <>
      <ScrollProgress />
      <MusicToggle />
      <Header />
      <main id="topo">
        <Hero />
        <ChristmasAscii />
        <About projectCount={projects.length} />
        <Tools />
        <Projects projects={projects} />
        <Screens screens={screens} />
        <Path />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
