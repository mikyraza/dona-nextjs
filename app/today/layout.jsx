export const metadata = {
  title: "DONA Today — Fil d'actualité en continu & Analyses | DONA Magazine",
  description: "L'actualité décryptée en temps réel avec le prisme d'excellence éditoriale et économique de DONA Magazine.",
  openGraph: {
    title: "DONA Today — Fil d'actualité en continu & Analyses | DONA Magazine",
    description: "L'actualité décryptée en temps réel avec le prisme d'excellence éditoriale et économique de DONA Magazine.",
    type: 'website',
    images: [{ url: '/assets/core/img/featured_urgent.png' }],
    siteName: 'DONA Magazine'
  },
  twitter: {
    card: 'summary_large_image',
    title: "DONA Today — Fil d'actualité en continu & Analyses | DONA Magazine",
    description: "L'actualité décryptée en temps réel avec le prisme d'excellence éditoriale et économique de DONA Magazine.",
    images: ['/assets/core/img/featured_urgent.png']
  }
};

export default function TodayLayout({ children }) {
  return children;
}
