// Default static fallback articles matching app/today/page.jsx
export const DEFAULT_ARTICLES = [
  {
    id: "news-1",
    numericId: "1",
    title: "Accord historique sur la parité salariale au sein de l'Union Européenne",
    desc: "Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.",
    content: "<p>Après des mois de négociations intenses, le Parlement européen a adopté ce matin une directive contraignante établissant de nouveaux standards de transparence salariale et de sanctions en cas d'écarts injustifiés entre les genres.</p><p>Cette avancée majeure marque un tournant décisif pour l'égalité économique en Europe, renforçant la compétitivité et la souveraineté économique des entreprises vertueuses.</p>",
    image: "/assets/core/img/featured_urgent.png",
    category: "ÉCONOMIE",
    time: "15:00",
    isFeatured: true
  },
  {
    id: "news-2",
    numericId: "2",
    title: "Nominations à la tête des grandes banques centrales",
    desc: "Trois femmes pressenties pour diriger les institutions clés en Asie et en Europe, un signal fort pour les marchés financiers.",
    content: "<p>Les institutions financières mondiales s'apprêtent à franchir un cap historique avec la nomination prochaine de figures féminines de premier plan à la direction des principales banques centrales.</p><p>Ce renouvellement des gouvernances intervient dans un contexte de refonte des politiques monétaires mondiales face à l'inflation et aux transformations technologiques.</p>",
    image: "/assets/core/img/home_alaune_side1_1782125709654.png",
    category: "ÉCONOMIE",
    time: "14:30",
    isNew: true
  },
  {
    id: "news-3",
    numericId: "3",
    title: "COP29 : Les initiatives climatiques portées par des entrepreneures",
    desc: "Le sommet met en lumière des solutions innovantes développées par des startups dirigées par des femmes dans les pays du Sud.",
    content: "<p>À l'occasion de la COP29, une délégation d'entrepreneures a présenté des projets pionniers mêlant transition énergétique, financement participatif et résilience locale.</p><p>Ces initiatives démontrent que le leadership durable est désormais un vecteur essentiel de rentabilité économique et de rayonnement international.</p>",
    image: "/assets/core/img/home_alaune_side2_1782125722981.png",
    category: "INNOVATION",
    time: "13:15"
  },
  {
    id: "news-4",
    numericId: "4",
    title: "Rétrospective : L'impact de l'architecture inclusive",
    desc: "Comment la nouvelle vague de designers redessine les espaces publics pour plus de sécurité et de convivialité urbaine.",
    content: "<p>L'urbanisme moderne intègre de plus en plus la notion d'espace partagé sécurisé et ergonomique. Les architectes contemporains conçoivent la ville comme un écosystème accueillant pour toutes les générations.</p>",
    image: "/assets/core/img/mag_hero_04.png",
    category: "SOCIÉTÉ",
    time: "11:45"
  },
  {
    id: "fr-1",
    numericId: "1",
    category: "POLITIQUE",
    time: "Il y a 45 min",
    title: "Loi Égalité Professionnelle : Le Sénat adopte le texte en première lecture",
    desc: "Les quotas dans les comités de direction des grandes entreprises seront renforcés dès 2026.",
    content: "<p>Le Sénat a validé le texte de loi renforçant la présence des femmes dans les comités exécutifs et de direction dès l'exercice 2026, avec des mécanismes d'audit indépendants.</p>",
    image: "/assets/core/img/france_1.png"
  },
  {
    id: "fr-2",
    numericId: "2",
    category: "ÉCONOMIE",
    time: "Il y a 2h",
    title: "CAC 40 : Les entreprises dirigées par des femmes surperforment",
    desc: "Une nouvelle étude démontre une rentabilité supérieure de 12% pour les groupes à parité.",
    content: "<p>Les entreprises du CAC 40 ayant instauré une gouvernance paritaire affichent une rentabilité sur capitaux propres supérieure de 12% sur les trois dernières années d'après le cabinet de prospective.</p>",
    image: "/assets/core/img/france_2.png"
  },
  {
    id: "fr-3",
    numericId: "3",
    category: "CULTURE",
    time: "Il y a 4h",
    title: "Cannes 2026 : Record historique de femmes réalisatrices en sélection officielle",
    desc: "Thierry Frémaux annonce une sélection paritaire pour la première fois dans l'histoire du festival.",
    content: "<p>La 79e édition du Festival de Cannes franchit une étape historique avec une parité parfaite en compétition officielle, célébrant une diversité de regards et de créations sans précédent.</p>",
    image: "/assets/core/img/france_3_1782121595894.png"
  }
];

export function normalizeArticle(item) {
  if (!item) return null;
  let img = item.image || item.coverImage || '/assets/core/img/featured_urgent.png';
  if (img && !img.startsWith('http') && !img.startsWith('/')) {
    img = '/' + img;
  }
  return {
    ...item,
    image: img,
    title: item.title || 'Actualité DONA',
    desc: item.desc || item.description || '',
    content: item.content || item.desc || '',
    category: item.category || 'Actualité'
  };
}

export function findMatchingArticle(list, slug) {
  if (!Array.isArray(list) || !slug) return null;
  const target = String(slug).trim().toLowerCase();
  const targetNum = target.replace(/\D/g, '');

  // 1. Direct ID match
  let found = list.find(a => String(a.id || '').toLowerCase() === target);
  if (found) return found;

  // 2. Numeric ID match (e.g. '1' matches 'news-1' or 'fr-1')
  if (targetNum) {
    found = list.find(a => {
      const aNum = String(a.id || '').replace(/\D/g, '');
      const numId = String(a.numericId || '').replace(/\D/g, '');
      return (aNum && aNum === targetNum) || (numId && numId === targetNum);
    });
    if (found) return found;
  }

  // 3. Slugified title match
  found = list.find(a => {
    const slugTitle = (a.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return slugTitle.includes(target) || target.includes(slugTitle);
  });
  return found || null;
}
