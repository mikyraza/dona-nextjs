import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const JEUX_FILE = path.join(DATA_DIR, 'settings_jeux.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const DEFAULT_JEUX_CONFIG = {
  heroRiddle: {
    title: "Le Labyrinthe des Ambitions",
    subtitle: "Seuls 12 % de nos membres trouvent la voie optimale.",
    difficulty: "Expert",
    timeAvg: "14 min",
    question: "Quatre dirigeants siègent à des distances égales. Le premier contrôle la ressource, le deuxième détient l'information, le troisième possède l'influence. Où devez-vous vous placer pour diriger la décision sans jamais révéler votre rôle ?",
    answerKeyword: "centre",
    successRate: "12%"
  },
  gamesList: [
    {
      id: "simulations",
      category: "SIMULATIONS STRATÉGIQUES",
      title: "Théorie des Jeux",
      subtitle: "Scénarios corporatifs et dilemmes historiques en temps réel.",
      badge: "NOUVEAU",
      meta: "12 Cas Actifs"
    },
    {
      id: "echecs",
      category: "ÉCHECS",
      title: "Le Cercle des Maîtres",
      subtitle: "Puzzles de niveau Grand Maître. Analyse des parties historiques.",
      badge: "VIP",
      meta: "Saison 4"
    },
    {
      id: "enigmes",
      category: "ÉNIGMES & CRYPTOGRAMMES",
      title: "L'Atelier des Paradoxes",
      subtitle: "Réflexion pure. Seuls 12 % de nos membres trouvent la voie optimale.",
      badge: "EXPERT",
      meta: "N° 402 · 14 min"
    },
    {
      id: "mots-croises",
      category: "MOTS CROISÉS & FLECHÉS",
      title: "Mots Fléchés du Cercle",
      subtitle: "Grilles thématiques autour du luxe, de la haute couture et de l'économie.",
      badge: "POPULAIRE",
      meta: "Grille Hebdo"
    },
    {
      id: "rebus-visuel",
      category: "REBUS & ÉNIGMES VISUELLES",
      title: "Le Rebus des Symboles",
      subtitle: "Déchiffrez l'énigme visuelle composée de pictogrammes et métaphores.",
      badge: "LITTÉRAIRE",
      meta: "Défi Image"
    }
  ],
  tournoiConfig: {
    season: "Saison 4",
    nextDate: "28 Juillet 2026",
    status: "Ouvert",
    title: "Le Tournoi des Décideurs",
    desc: "Notre compétition mensuelle de prise de décision sous pression. Affrontez d'autres membres du Cercle dans des scénarios économiques simulés."
  }
};

export async function GET() {
  try {
    ensureDataDir();
    if (fs.existsSync(JEUX_FILE)) {
      const content = fs.readFileSync(JEUX_FILE, 'utf8');
      return NextResponse.json(JSON.parse(content));
    }
    return NextResponse.json(DEFAULT_JEUX_CONFIG);
  } catch (error) {
    console.error('Error GET /api/admin/jeux:', error);
    return NextResponse.json(DEFAULT_JEUX_CONFIG);
  }
}

export async function POST(req) {
  try {
    ensureDataDir();
    const settings = await req.json();
    fs.writeFileSync(JEUX_FILE, JSON.stringify(settings, null, 2), 'utf8');
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error POST /api/admin/jeux:', error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde des jeux" }, { status: 500 });
  }
}
