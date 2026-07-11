import { projects } from "@/data/projects";
import { site } from "@/data/site";

export function Projects() {
  return (
    <section id="projetos" className="section projects">
      <p className="eyebrow">03 // missões</p>
      <h2>projetos</h2>
      <p className="lead">
        Seleção do meu{" "}
        <a
          className="inline-link"
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        : sistemas web, automação, dados e experimentos com stack real.
      </p>

      <div className="project-list">
        {projects.map((project) => (
          <article className="project" key={project.index}>
            <p className="project-index">{project.index}</p>
            <div className="project-body">
              <p className="project-tags">{project.tags}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-links">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
