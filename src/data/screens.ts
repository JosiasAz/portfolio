export type Screen = {
  href: string;
  chrome: string;
  image: string;
  alt: string;
  label: string;
  title: string;
};

// Prints feitos à mão; demos sem print aqui usam screenshot automático.
export const screenImages: Record<string, string> = {
  "https://sigps-frontend.vercel.app": "/assets/projects/sigps.png",
};
