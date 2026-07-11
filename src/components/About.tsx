export function About() {
  return (
    <section id="sobre" className="section about">
      <p className="eyebrow">01 // status</p>
      <h2>quem sou</h2>
      <div className="about-layout">
        <div className="about-copy">
          <p className="lead">
            Sou desenvolvedor focado em automação e sistemas web. Construo
            fluxos que tiram trabalho repetitivo do caminho e APIs/interfaces
            que aguentam o uso real, do protótipo à entrega.
          </p>
          <p className="about-body">
            Prefiro stack enxuto e responsabilidade clara: linguagem certa,
            interface objetiva, API estável, dados organizados e operação
            previsível. Menos ruído, mais resultado.
          </p>
          <div className="about-stats" aria-label="Destaques">
            <div className="about-stat">
              <span className="about-stat-value">full stack</span>
              <span className="about-stat-label">atuação</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">remoto</span>
              <span className="about-stat-label">modo</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">entrega</span>
              <span className="about-stat-label">foco</span>
            </div>
          </div>
        </div>
        <dl className="status-board" aria-label="Status atual">
          <div className="status-row">
            <dt>classe</dt>
            <dd>dev · automação · full stack</dd>
          </div>
          <div className="status-row">
            <dt>foco</dt>
            <dd>processos · APIs · interfaces</dd>
          </div>
          <div className="status-row">
            <dt>stack</dt>
            <dd>python · angular · sql</dd>
          </div>
          <div className="status-row">
            <dt>modo</dt>
            <dd>
              <span className="status-live" /> aberto a missões
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
