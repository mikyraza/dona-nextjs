import { NextResponse } from 'next/server';

export async function GET() {
  /*
  // FUTURE WORDPRESS HEADLESS API FETCH INTEGRATION:
  try {
    // 1. Fetch game categories from CPT 'game' settings
    const responseGames = await fetch('http://localhost/wp-json/wp/v2/game?per_page=10', {
      headers: { 'Accept': 'application/json' }
    });
    const wpGames = await responseGames.json();

    // 2. Fetch the active daily riddle from Option Page / custom endpoint
    const responseRiddle = await fetch('http://localhost/wp-json/dona/v1/daily-riddle', {
      headers: { 'Accept': 'application/json' }
    });
    const riddle = await responseRiddle.json();

    // 3. Fetch Circle members high-scores (custom CPT / table)
    const responseRankings = await fetch('http://localhost/wp-json/dona/v1/game-rankings', {
      headers: { 'Accept': 'application/json' }
    });
    const rankings = await responseRankings.json();

    return NextResponse.json({
      categories: wpGames.map(game => ({
        id: game.slug,
        category: game.acf.category_name || '',
        title: game.title.rendered,
        subtitle: game.acf.subtitle || '',
        badge: game.acf.badge_text || '',
        meta: game.acf.meta_text || '',
        iconSvg: game.acf.icon_svg_raw || ''
      })),
      dailyRiddle: {
        id: riddle.id,
        title: riddle.title,
        description: riddle.description,
        difficulty: riddle.difficulty || 'Expert',
        averageTime: riddle.average_time || '14 min',
        successRate: riddle.success_rate || 12,
        playersCount: riddle.players_count || 0,
        riddleUrl: riddle.riddle_url || '#'
      },
      gameRankings: rankings
    });
  } catch (error) {
    console.error("WordPress API Fetch Error:", error);
    // Fallback to static mock below
  }
  */

  // Mock response mapping docs/dynamic-matrix.md
  return NextResponse.json({
    categories: [
      {
        id: 'simulations',
        category: 'SIMULATIONS STRATÉGIQUES',
        title: 'Théorie des Jeux',
        subtitle: 'Scénarios corporatifs et dilemmes historiques en temps réel.',
        badge: 'NOUVEAU',
        meta: '12 Cas Actifs',
        iconSvg: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8"><rect x="10" y="10" width="60" height="60" /><line x1="10" y1="35" x2="70" y2="35" /><line x1="10" y1="55" x2="70" y2="55" /><line x1="35" y1="10" x2="35" y2="70" /><circle cx="40" cy="22" r="6" /><circle cx="22" cy="62" r="4" /><circle cx="58" cy="45" r="5" /><circle cx="22" cy="45" r="3" /><circle cx="58" cy="62" r="4" /></svg>`
      },
      {
        id: 'echecs',
        category: 'ÉCHECS',
        title: 'Le Cercle des Maîtres',
        subtitle: 'Puzzles de niveau Grand Maître. Analyse des parties historiques.',
        badge: 'VIP',
        meta: 'Saison 4',
        iconSvg: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8"><rect x="8" y="8" width="64" height="64" /><circle cx="40" cy="32" r="12" /><line x1="40" y1="20" x2="40" y2="44" /><line x1="28" y1="32" x2="52" y2="32" /></svg>`
      },
      {
        id: 'enigmes',
        category: "ÉNIGMES & CRYPTOGRAMMES",
        title: "L'Atelier des Paradoxes",
        subtitle: "Réflexion pure. Seuls 12 % de nos membres trouvent la voie optimale.",
        badge: 'EXPERT',
        meta: 'N° 402 · 14 min',
        iconSvg: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8"><circle cx="40" cy="40" r="30" /><circle cx="40" cy="40" r="18" /><circle cx="40" cy="40" r="6" /><line x1="10" y1="40" x2="70" y2="40" /><line x1="40" y1="10" x2="40" y2="70" /></svg>`
      }
    ],
    dailyRiddle: {
      id: 101,
      title: "Le Labyrinthe des Ambitions",
      description: "Une réflexion géométrique sur l'ascension et la chute dans les structures de pouvoir complexes. Seuls 12 % de nos membres trouvent la voie optimale.",
      difficulty: "Expert",
      averageTime: "14 min",
      successRate: 12,
      playersCount: 3842,
      riddleUrl: "/jeux/resolution-labyrinthe"
    },
    gameRankings: [
      { rank: 1, name: 'Architect_M', city: 'Paris, FR', pts: 2450, delta: '+145' },
      { rank: 2, name: 'Vanguard.T',  city: 'London, UK', pts: 2380, delta: '+92' },
      { rank: 3, name: 'Stratagemma', city: 'Milan, IT',  pts: 2295, delta: '+78' },
      { rank: 4, name: 'J.Dumont',    city: 'Geneva, CH', pts: 2110, delta: '+31' },
      { rank: 5, name: 'K.Osei',      city: 'Accra, GH',  pts: 1980, delta: '+19' }
    ],
    tournamentConfig: {
      id: 1,
      title: "Le Tournoi des Décideurs",
      subtitle: "Compétez en direct avec les autres membres sur des cas complexes de théorie des jeux. Les 10 premiers accèdent à la Finale Annuelle.",
      ctaText: "Rejoindre le Tournoi",
      rules: [
        { n: '01', title: 'Accès sur Invitation', desc: "Réservé aux membres actifs du Cercle DONA ou sur parrainage d'un pair." },
        { n: '02', title: 'Scénarios sous Pression', desc: "Chaque manche alloue 90 secondes par décision. Le temps est une ressource." },
        { n: '03', title: 'Classement en Direct', desc: "Le tableau évolue après chaque partie. Les 10 premiers accèdent à la Finale Annuelle." }
      ]
    }
  });
}
