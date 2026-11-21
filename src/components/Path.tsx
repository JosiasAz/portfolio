const steps = [
  {
    when: "Agora",
    title: "Estagiário de Desenvolvimento em SCM",
    detail: "Supply chain",
    text: "Desenvolvimento dentro de supply chain: sistemas e automações que sustentam o processo, da regra de negócio até a tela que a operação usa.",
  },
  {
    when: "Prática",
    title: "LG Electronics",
    detail: "Experiência em empresa",
    text: "Experiência prática na LG Electronics, em rotina de desenvolvimento e processo.",
  },
  {
    when: "Projetos",
    title: "Instituto Eldorado e FPF Tech",
    detail: "LG AIX Academy",
    text: "Projetos com o Instituto Eldorado e a FPF Tech, na LG AIX Academy. Python, RPA e desenvolvimento de sistemas web e desktop.",
  },
];

export function Path() {
  return (
    <section id="trajetoria" className="section path">
      <h2>Trajetória</h2>
      <ol className="path-list">
        {steps.map((step) => (
          <li key={step.title}>
            <p className="path-when">{step.when}</p>
            <div>
              <h3>{step.title}</h3>
              <p className="path-detail">{step.detail}</p>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
