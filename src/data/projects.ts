export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  index: string;
  title: string;
  tags: string;
  description: string;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    index: "01",
    title: "FinancePilot",
    tags: "TypeScript · Gestão financeira",
    description:
      "Plataforma de gestão financeira para organizar movimentações, metas e contas. Um copiloto com visão clara do dinheiro.",
    links: [
      { label: "github", href: "https://github.com/JosiasAz/FinancePilot" },
    ],
  },
  {
    index: "02",
    title: "SIGPS",
    tags: "HTML · Python · Machine Learning",
    description:
      "Sistema de prioridade inteligente no atendimento em saúde. Front, backend e modelo de ML para cálculo de prioridade.",
    links: [
      { label: "frontend", href: "https://github.com/JosiasAz/SIGPS-Frontend" },
      { label: "backend", href: "https://github.com/JosiasAz/SIGPS-Backend" },
      {
        label: "ml",
        href: "https://github.com/JosiasAz/SIGPS-Machine-Learning",
      },
      { label: "demo", href: "https://sigps-frontend.vercel.app" },
    ],
  },
  {
    index: "03",
    title: "Gerenciador de Aviso",
    tags: "JavaScript · Automação · E-mail",
    description:
      "Automação pessoal para envio de avisos acadêmicos por e-mail, com lembretes diários até o prazo de entrega.",
    links: [
      {
        label: "github",
        href: "https://github.com/JosiasAz/Gerenciador-de-Aviso",
      },
    ],
  },
  {
    index: "04",
    title: "IntegraEdu",
    tags: "TypeScript · Angular",
    description:
      "Estudos e experimentação com Angular: arquitetura frontend, componentes reutilizáveis, performance e boas práticas.",
    links: [
      { label: "github", href: "https://github.com/JosiasAz/IntegraEdu" },
    ],
  },
  {
    index: "05",
    title: "Gráficos Dashboard",
    tags: "HTML · Chart.js · Dashboard",
    description:
      "Biblioteca de exemplos com Chart.js (barras, linhas, pizza, radar e mais) para estudo, reuso e referência rápida.",
    links: [
      {
        label: "github",
        href: "https://github.com/JosiasAz/graficos-dashboard",
      },
    ],
  },
];
