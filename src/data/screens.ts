export type Screen = {
  href: string;
  chrome: string;
  image: string;
  alt: string;
  label: string;
  title: string;
};

export const screens: Screen[] = [
  {
    href: "https://sigps-frontend.vercel.app",
    chrome: "sigps-frontend.vercel.app",
    image: "/assets/projects/sigps.png",
    alt: "Tela do SIGPS",
    label: "02 · demo",
    title: "SIGPS",
  },
  {
    href: "https://github.com/JosiasAz/Gerenciador-de-Aviso",
    chrome: "github.com/JosiasAz/Gerenciador-de-Aviso",
    image: "/assets/projects/avisos.png",
    alt: "Preview do Gerenciador de Aviso no GitHub",
    label: "03 · repo",
    title: "Gerenciador de Aviso",
  },
  {
    href: "https://github.com/JosiasAz/FinancePilot",
    chrome: "github.com/JosiasAz/FinancePilot",
    image: "/assets/projects/financepilot.png",
    alt: "Preview do FinancePilot no GitHub",
    label: "01 · repo",
    title: "FinancePilot",
  },
  {
    href: "https://github.com/JosiasAz/IntegraEdu",
    chrome: "github.com/JosiasAz/IntegraEdu",
    image: "/assets/projects/integraedu.png",
    alt: "Preview do IntegraEdu no GitHub",
    label: "04 · repo",
    title: "IntegraEdu",
  },
  {
    href: "https://github.com/JosiasAz/graficos-dashboard",
    chrome: "github.com/JosiasAz/graficos-dashboard",
    image: "/assets/projects/graficos.png",
    alt: "Preview do Gráficos Dashboard no GitHub",
    label: "05 · repo",
    title: "Gráficos Dashboard",
  },
];
