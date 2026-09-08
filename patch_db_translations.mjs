
import fs from 'fs';

const translations = {
  'VIP test': 'VIP test',
  'Seen by every one': 'Seen by everyone',
  'REJOICE\'S TEST': 'REJOICE\\'S TEST',
  'REJOICE WROTE THIS TO TEST.': 'REJOICE WROTE THIS TO TEST.',
  'Analyse prospective : Signaux faibles et souverainet': 'Foresight analysis: Weak signals and sovereignty',
  'Contenu d\\'analyse stratgique pour Intelligence - The Pulse.': 'Strategic analysis content for Intelligence - The Pulse.',
  'TEST 1 nouvelle interface': 'TEST 1 new interface',
  'Essaie article intelligence': 'Intelligence article test',
  'La base de données devait être implémentée à la Phase 1 de la feuille de route Back-End (task-backend.md).Pourquoi elle n\\'est pas encore en place : Jusqu\\'ici, l': 'The database was to be implemented in Phase 1 of the Back-End roadmap (task-backend.md). Why it is not yet in place: So far, the',
  'L’Aube de la Souveraineté Quantique': 'The Dawn of Quantum Sovereignty',
  'Une exploration exclusive sur les disruptions majeures du calcul quantique dans l’économie de 2026.': 'An exclusive exploration into the major disruptions of quantum computing in the 2026 economy.',
  'La Métamorphose du Pouvoir à l\\'Ère des Algorithmes': 'The Metamorphosis of Power in the Age of Algorithms',
  'Une analyse prospective sur la manière dont les modèles d\\'intelligence synthétique redéfinissent la diplomatie et les réseaux d\\'influence globale.': 'A prospective analysis on how synthetic intelligence models are redefining diplomacy and global influence networks.',
  'Géoéconomie de la Transition Énergétique': 'Geoeconomics of the Energy Transition',
  'Les batailles silencieuses pour le contrôle des métaux rares et des chaînes de valeur de demain.': 'The silent battles for the control of rare metals and tomorrow\\'s value chains.',
  'Biotechnologie & Transhumanisme : Les Frontières Éthiques': 'Biotechnology & Transhumanism: The Ethical Frontiers',
  'Enquête sur les laboratoires secrets et les régulations émergentes autour de l\\'édition génomique humaine.': 'Investigation into secret laboratories and emerging regulations surrounding human genomic editing.',
  'Décoder la Complexité : Les nouveaux paradigmes de la souveraineté numérique': 'Decoding Complexity: The new paradigms of digital sovereignty',
  'Une enquête approfondie sur la manière dont l\\'intelligence artificielle redéfinit les frontières géopolitiques traditionnelles.': 'An in-depth investigation into how artificial intelligence is redefining traditional geopolitical boundaries.',
  'Le retour de la pensée systémique dans la stratégie d\\'entreprise': 'The return of systemic thinking in corporate strategy',
  'Comment les approches holistiques transforment la prise de décision face à des crises interconnectées.': 'How holistic approaches transform decision-making in the face of interconnected crises.',
  'Interview : Les défis du renseignement moderne par Jean-Luc Aris': 'Interview: The challenges of modern intelligence by Jean-Luc Aris',
  'Un entretien exclusif avec l\\'ancien directeur de la prospective stratégique.': 'An exclusive interview with the former director of strategic foresight.',
  'Intelligence Économique & Géopolitique Féminine': 'Economic Intelligence & Female Geopolitics',
  'Une enquête exclusive sur les réseaux d’influence et le leadership des femmes décideuses en Europe.': 'An exclusive investigation into the networks of influence and leadership of female decision-makers in Europe.',
  'L\\'Empire du Silicium : Les Dessous de la Révolution Tech': 'The Silicon Empire: Behind the Tech Revolution',
  'Une enquête exclusive sur la géopolitique des semi-conducteurs et le rôle de l\\'Europe dans la course mondiale.': 'An exclusive investigation into the geopolitics of semiconductors and Europe\\'s role in the global race.',
  'L\\'Architecture du Silence : Esthétique & Épure Contemporaine': 'The Architecture of Silence: Aesthetics & Contemporary Purity',
  'Une exploration visuelle et architecturale des sanctuaires urbains et du design néo-minimaliste.': 'A visual and architectural exploration of urban sanctuaries and neo-minimalist design.',
  'Longevity & Santé Préventive : Repousser les Limites du Vivant': 'Longevity & Preventive Health: Pushing the Limits of the Living',
  'Innovations biomédicales, protocoles de longévité cellulaire et médecine régénérative de pointe.': 'Biomedical innovations, cellular longevity protocols, and cutting-edge regenerative medicine.',
  'Gouvernance & Impact : Le Leadership Éthique du XXIe Siècle': 'Governance & Impact: Ethical Leadership in the 21st Century',
  'Comment les grandes dynasties et fonds d\\'investissement réinventent le capitalisme d\\'utilité publique.': 'How great dynasties and investment funds are reinventing capitalism of public utility.',
  'Live depuis le Grand Palais — Interviews exclusives avec les grandes figures de l\\'économie mondiale': 'Live from the Grand Palais — Exclusive interviews with major figures of the global economy',
  'Keynote du Grand Palais — Jean Nouvel en conversation': 'Grand Palais Keynote — Jean Nouvel in conversation',
  'Architectures du Silence': 'Architectures of Silence',
  'Documentaire exclusif — 4 épisodes sur l\\'architecture contemporaine africaine': 'Exclusive documentary — 4 episodes on contemporary African architecture',
  'Le Luxe & l\\'Identité Africaine': 'Luxury & African Identity',
  'Table ronde — Paris Fashion Week 2026': 'Round table — Paris Fashion Week 2026',
  'Bâtisseurs de Demain': 'Builders of Tomorrow',
  'Portrait de cinq visionnaires africains qui redéfinissent l\\'innovation mondiale': 'Portrait of five African visionaries redefining global innovation',
  'Géopolitique de la Mode': 'Geopolitics of Fashion',
  'Comment les capitales africaines dictent les nouvelles tendances globales': 'How African capitals dictate new global trends',
  'Santé & Bien-Être : Les Nouvelles Frontières': 'Health & Wellbeing: The New Frontiers',
  'Médecines traditionnelles africaines et science moderne : le dialogue inévitable': 'Traditional African medicines and modern science: the inevitable dialogue',
  'Forum Économique de Dakar': 'Dakar Economic Forum',
  'Replay complet de la 12e édition — Investissement & Souveraineté': 'Full replay of the 12th edition — Investment & Sovereignty',
  'Masterclass : L\\'Art de la Négociation': 'Masterclass: The Art of Negotiation',
  'Avec Amira Youssef, diplomatique et stratège internationale': 'With Amira Youssef, international diplomat and strategist'
};

const path = 'lib/i18n/masterDictionary.js';
let content = fs.readFileSync(path, 'utf8');

let insertionPoint = content.lastIndexOf('}');
if (insertionPoint === -1) {
  console.log('Error finding insertion point.');
  process.exit(1);
}

let extraLines = [];
for (const [fr, en] of Object.entries(translations)) {
  if (!content.includes(JSON.stringify(fr))) {
    extraLines.push(\  \: \,\);
  }
}

if (extraLines.length > 0) {
  // Check if there is a trailing comma before the last bracket
  const beforeEnd = content.slice(0, insertionPoint).trimEnd();
  const needsComma = !beforeEnd.endsWith(',');
  
  let newContent = beforeEnd + (needsComma ? ',' : '') + '\n' + extraLines.join('\n') + '\n};';
  fs.writeFileSync(path, newContent, 'utf8');
  console.log('Added ' + extraLines.length + ' translations to dictionary.');
} else {
  console.log('No new translations to add.');
}

