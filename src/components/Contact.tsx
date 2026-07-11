import { site } from "@/data/site";

export function Contact() {
  return (
    <section id="contato" className="section contact">
      <p className="eyebrow">05 // missao</p>
      <h2>bora construir algo?</h2>
      <div className="contact-layout">
        <div className="contact-copy">
          <p className="lead">
            Tem um processo para automatizar, um sistema para construir ou uma
            vaga em mente? Manda a missão. Respondo com clareza.
          </p>
          <p className="contact-note">
            <span className="status-live" />
            disponível para oportunidades e colaborações
          </p>
          <a className="contact-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="contact-channels">
          <a className="contact-channel" href={`mailto:${site.email}`}>
            <span className="contact-channel-meta">
              <span className="contact-channel-label">email</span>
              <span className="contact-channel-value">{site.email}</span>
            </span>
            <span className="contact-channel-action">abrir</span>
          </a>
          <a
            className="contact-channel"
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-channel-meta">
              <span className="contact-channel-label">whatsapp</span>
              <span className="contact-channel-value">{site.whatsapp}</span>
            </span>
            <span className="contact-channel-action">chat</span>
          </a>
          <a
            className="contact-channel"
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-channel-meta">
              <span className="contact-channel-label">linkedin</span>
              <span className="contact-channel-value">{site.linkedinHandle}</span>
            </span>
            <span className="contact-channel-action">perfil</span>
          </a>
          <a
            className="contact-channel"
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-channel-meta">
              <span className="contact-channel-label">github</span>
              <span className="contact-channel-value">{site.githubHandle}</span>
            </span>
            <span className="contact-channel-action">repos</span>
          </a>
        </div>
      </div>
    </section>
  );
}
