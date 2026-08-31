import { writeAtomicSync, writeJsonAtomicSync } from './atomicFile.js';
import mysql from 'mysql2/promise';

let _mysqlPool = null;
function getMysqlPool() {
  if (_mysqlPool) return _mysqlPool;
  try {
    _mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'dona_db',
      port: Number(process.env.MYSQL_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });
    return _mysqlPool;
  } catch (e) {
    return null;
  }
}

export async function liveSyncXampp(sql, params = []) {
  try {
    const pool = getMysqlPool();
    if (!pool) return;
    await pool.query(sql, params);
  } catch (e) {
    // If XAMPP MySQL is temporarily stopped, continue smoothly without failing
  }
}

import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'lib', 'dona.db');

let _dbInstance = null;

export function getDatabase() {
  if (_dbInstance) return _dbInstance;

  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const db = new DatabaseSync(DB_PATH);

    // Enable WAL mode and foreign keys for high concurrency & ACID compliance
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      PRAGMA synchronous = NORMAL;
      PRAGMA foreign_keys = ON;
    `);

    // 1. Articles Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        slug TEXT,
        title TEXT NOT NULL,
        author TEXT,
        category TEXT,
        rubrique TEXT,
        subcategory TEXT,
        badge TEXT,
        content TEXT,
        summary TEXT,
        desc TEXT,
        format TEXT DEFAULT 'text',
        cover_image TEXT,
        image TEXT,
        article_gallery TEXT,
        video_url TEXT,
        audio_file TEXT,
        status TEXT DEFAULT 'Published',
        is_vip_only INTEGER DEFAULT 0,
        placement_target TEXT DEFAULT 'STANDARD_FEED',
        meta TEXT,
        updated TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
      CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    `);

    // 2. Magazines Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS magazines (
        id INTEGER,
        slug TEXT PRIMARY KEY,
        title TEXT,
        subtitle TEXT,
        desc TEXT,
        theme_primary TEXT,
        theme_secondary TEXT,
        gradient TEXT,
        hero_image TEXT,
        essence_image TEXT,
        hero_buttons TEXT,
        essence_title TEXT,
        tabs TEXT,
        sections TEXT,
        rubriques TEXT,
        config_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_magazines_id ON magazines(id);
    `);

    // 3. Videos Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        category TEXT,
        magazine TEXT,
        label TEXT,
        duration TEXT,
        is_vip_only INTEGER DEFAULT 0,
        is_hd INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        is_replay INTEGER DEFAULT 0,
        source TEXT DEFAULT 'url',
        video_url TEXT,
        thumbnail_url TEXT,
        published_at DATETIME,
        status TEXT DEFAULT 'Draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
      CREATE INDEX IF NOT EXISTS idx_videos_magazine ON videos(magazine);
      CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
    `);

    // 4. TV Live Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tv_live (
        id TEXT PRIMARY KEY,
        is_live INTEGER DEFAULT 0,
        stream_url TEXT,
        hls_url TEXT,
        current_title TEXT,
        current_subtitle TEXT,
        current_guest TEXT,
        format TEXT,
        location TEXT,
        epg TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Dossiers Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS dossiers (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        coordinator TEXT,
        description TEXT,
        summary TEXT,
        cover_image TEXT,
        articles TEXT,
        is_vip_only INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        category TEXT,
        magazine TEXT,
        label TEXT,
        status TEXT DEFAULT 'Published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Users Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        role TEXT NOT NULL DEFAULT 'Journaliste',
        status TEXT DEFAULT 'Actif',
        plan TEXT DEFAULT 'Essentiel',
        phone TEXT,
        last_login TEXT DEFAULT 'Jamais connecté',
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    `);

    // Dynamic column migrations for users
    const userColumns = db.prepare('PRAGMA table_info(users)').all().map(c => c.name);
    if (!userColumns.includes('plan')) {
      db.exec("ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'Essentiel';");
    }
    if (!userColumns.includes('phone')) {
      db.exec("ALTER TABLE users ADD COLUMN phone TEXT;");
    }

    // 7. Members Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        avatar TEXT,
        plan TEXT DEFAULT 'Essentiel',
        status TEXT DEFAULT 'Active',
        joined TEXT,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
      CREATE INDEX IF NOT EXISTS idx_members_plan ON members(plan);
      CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
    `);

    // 8. Today Page Configuration Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS today_page_config (
        id TEXT PRIMARY KEY,
        hero TEXT,
        filters TEXT,
        news_items TEXT,
        editorial TEXT,
        values_list TEXT,
        france TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. Settings Table (Global & Brand Settings)
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    _dbInstance = db;

    // Run initial data migration & seeding
    migrateLegacyJsonData(db);

    return db;
  } catch (err) {
    console.error('Fatal Database initialization error:', err);
    throw err;
  }
}

function migrateLegacyJsonData(db) {
  try {
    // 1. Migrate articles_db.json
    const articlesCount = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    if (articlesCount.count === 0) {
      const articlesJsonPath = path.join(process.cwd(), 'lib', 'articles_db.json');
      if (fs.existsSync(articlesJsonPath)) {
        const raw = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf8'));
        if (Array.isArray(raw) && raw.length > 0) {
          const insertStmt = db.prepare(`
            INSERT OR REPLACE INTO articles (
              id, slug, title, author, category, rubrique, subcategory, badge,
              content, summary, desc, format, cover_image, image, article_gallery,
              video_url, audio_file, status, is_vip_only, placement_target, meta, updated
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?
            )
          `);

          for (const a of raw) {
            insertStmt.run(
              String(a.id || `art-${Date.now()}`),
              a.slug || null,
              a.title || 'Article sans titre',
              a.author || 'Elena Moretti',
              a.category || '01. Intelligence',
              a.rubrique || a.subcategory || 'The Brief',
              a.subcategory || a.rubrique || 'The Brief',
              a.badge || 'ARTICLE',
              a.content || '',
              a.summary || a.desc || '',
              a.desc || a.summary || '',
              a.format || 'text',
              a.coverImage || a.image || '/assets/core/img/mag_hero_03.png',
              a.image || a.coverImage || '/assets/core/img/mag_hero_03.png',
              JSON.stringify(a.articleGallery || a.galerie_photos || []),
              a.videoUrl || '',
              a.audioFile || '',
              a.status || 'Published',
              a.isVipOnly ? 1 : 0,
              a.placementTarget || 'STANDARD_FEED',
              a.meta || '',
              a.updated || 'RÉCENT'
            );
          }
          console.log(`[DB Migration] Successfully imported ${raw.length} articles into SQLite DBMS.`);
        }
      }
    }

    // 2. Migrate magazines_db.json
    const magsCount = db.prepare('SELECT COUNT(*) as count FROM magazines').get();
    if (magsCount.count === 0) {
      const magsJsonPath = path.join(process.cwd(), 'lib', 'magazines_db.json');
      if (fs.existsSync(magsJsonPath)) {
        const raw = JSON.parse(fs.readFileSync(magsJsonPath, 'utf8'));
        if (Array.isArray(raw) && raw.length > 0) {
          const insertStmt = db.prepare(`
            INSERT OR REPLACE INTO magazines (
              id, slug, title, subtitle, desc, theme_primary, theme_secondary,
              gradient, hero_image, essence_image, hero_buttons, essence_title,
              tabs, sections, rubriques, config_data
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?
            )
          `);

          for (const m of raw) {
            insertStmt.run(
              m.id || null,
              m.slug,
              m.title || '',
              m.subtitle || '',
              m.desc || '',
              m.themePrimary || '#a31835',
              m.themeSecondary || '#3d0c1b',
              m.gradient || '',
              m.heroImage || '',
              m.essenceImage || '',
              JSON.stringify(m.heroButtons || []),
              m.essenceTitle || '',
              JSON.stringify(m.tabs || []),
              JSON.stringify(m.sections || []),
              JSON.stringify(m.rubriques || []),
              JSON.stringify(m)
            );
          }
          console.log(`[DB Migration] Successfully imported ${raw.length} magazines into SQLite DBMS.`);
        }
      }
    }

    // 3. Migrate videos_db.json
    const videosCount = db.prepare('SELECT COUNT(*) as count FROM videos').get();
    if (videosCount.count === 0) {
      const videosJsonPath = path.join(process.cwd(), 'lib', 'videos_db.json');
      if (fs.existsSync(videosJsonPath)) {
        const raw = JSON.parse(fs.readFileSync(videosJsonPath, 'utf8'));
        if (Array.isArray(raw) && raw.length > 0) {
          const insertStmt = db.prepare(`
            INSERT OR REPLACE INTO videos (
              id, title, subtitle, category, magazine, label, duration,
              is_vip_only, is_hd, is_featured, is_replay, source, video_url,
              thumbnail_url, published_at, status
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?
            )
          `);

          for (const v of raw) {
            insertStmt.run(
              String(v.id || `vid-${Date.now()}`),
              v.title || '',
              v.subtitle || '',
              v.category || 'Culture',
              v.magazine || '',
              v.label || 'VIDÉO',
              v.duration || '',
              v.isVipOnly ? 1 : 0,
              v.isHD ? 1 : 0,
              v.isFeatured ? 1 : 0,
              v.isReplay ? 1 : 0,
              v.source || 'url',
              v.videoUrl || '',
              v.thumbnailUrl || '',
              v.publishedAt || new Date().toISOString(),
              v.status || 'Draft'
            );
          }
          console.log(`[DB Migration] Successfully imported ${raw.length} videos into SQLite DBMS.`);
        }
      }
    }

    // 4. Migrate tvlive_db.json
    const tvCount = db.prepare('SELECT COUNT(*) as count FROM tv_live').get();
    if (tvCount.count === 0) {
      const tvJsonPath = path.join(process.cwd(), 'lib', 'tvlive_db.json');
      let tvData = { isLive: false, epg: [] };
      if (fs.existsSync(tvJsonPath)) {
        try {
          tvData = JSON.parse(fs.readFileSync(tvJsonPath, 'utf8'));
        } catch (e) {}
      }
      db.prepare(`
        INSERT OR REPLACE INTO tv_live (
          id, is_live, stream_url, hls_url, current_title, current_subtitle,
          current_guest, format, location, epg
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'main',
        tvData.isLive ? 1 : 0,
        tvData.streamUrl || '',
        tvData.hlsUrl || '',
        tvData.currentTitle || '',
        tvData.currentSubtitle || '',
        tvData.currentGuest || '',
        tvData.format || '',
        tvData.location || '',
        JSON.stringify(tvData.epg || [])
      );
    }

    // 5. Seed Core Admin Team into users table if empty
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (usersCount.count === 0) {
      const initialTeam = [
        { id: "u-1", name: "Elena Moretti", email: "elena@donamagazine.com", role: "Super-Admin", status: "Actif", lastLogin: "15/07/2026 10:14" },
        { id: "u-2", name: "Marc Dubois", email: "marc@donamagazine.com", role: "Éditeur", status: "Actif", lastLogin: "14/07/2026 18:32" },
        { id: "u-3", name: "Sophie Laurent", email: "sophie@donamagazine.com", role: "Journaliste", status: "Actif", lastLogin: "15/07/2026 09:44" },
        { id: "u-4", name: "Ahmed Al-Farsi", email: "ahmed@donamagazine.com", role: "Traducteur", status: "Actif", lastLogin: "12/07/2026 11:20" },
        { id: "u-5", name: "Thomas Bernard", email: "thomas@donamagazine.com", role: "Journaliste", status: "Suspendu", lastLogin: "Jamais connecté" },
        { id: "usr-admin-1", name: "Nora Patrius", email: "admin@dona.com", role: "Super-Admin", status: "Actif", lastLogin: "À l'instant" }
      ];

      const insertUserStmt = db.prepare(`
        INSERT OR REPLACE INTO users (
          id, name, email, password, role, status, last_login
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const u of initialTeam) {
        insertUserStmt.run(
          u.id,
          u.name,
          u.email.toLowerCase(),
          'dona2026',
          u.role,
          u.status,
          u.lastLogin
        );
      }
      console.log(`[DB Migration] Successfully initialized ${initialTeam.length} team users into SQLite DBMS.`);
    }

    // 6. Seed Initial Members into members table if empty
    const membersCount = db.prepare('SELECT COUNT(*) as count FROM members').get();
    if (membersCount.count === 0) {
      const initialMembers = [
        { id: "mem-1", name: "Marc Aubry", email: "marc@aubry.com", plan: "Premium", status: "Active", joined: "12/03/2026" },
        { id: "mem-2", name: "Hélène de Ségur", email: "vip@dona.com", plan: "Élite", status: "Active", joined: "01/05/2026" },
        { id: "mem-3", name: "Claire Martin", email: "free@dona.com", plan: "Essentiel", status: "Inactive", joined: "10/06/2026" }
      ];

      const insertMemStmt = db.prepare(`
        INSERT OR REPLACE INTO members (
          id, name, email, phone, avatar, plan, status, joined, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const m of initialMembers) {
        insertMemStmt.run(
          m.id,
          m.name,
          m.email.toLowerCase(),
          m.phone || '',
          m.avatar || null,
          m.plan || 'Essentiel',
          m.status || 'Active',
          m.joined || '15/07/2026',
          'dona2026'
        );
      }
      console.log(`[DB Migration] Successfully initialized ${initialMembers.length} members into SQLite DBMS.`);
    }

    // 7. Seed Initial Dossiers if empty
    const dossiersCount = db.prepare('SELECT COUNT(*) as count FROM dossiers').get();
    if (dossiersCount.count === 0) {
      const initialDossiers = [
        {
          id: 'dos-01',
          title: 'Intelligence Économique & Géopolitique Féminine',
          coordinator: 'Hélène de Ségur',
          description: 'Une enquête exclusive sur les réseaux d’influence et le leadership des femmes décideuses en Europe.',
          summary: 'Analyse approfondie des leviers de pouvoir contemporains et stratégies d\'influence mondiale.',
          cover_image: '/assets/core/img/vault-1.png',
          articles: ['art-1740000000001', 'art-1'],
          is_vip_only: 1,
          is_featured: 1,
          category: 'Analyses & Enquêtes',
          magazine: 'magazine-01-intelligence',
          label: 'DOSSIER SPÉCIAL',
          status: 'Published'
        },
        {
          id: 'dos-02',
          title: 'L\'Empire du Silicium : Les Dessous de la Révolution Tech',
          coordinator: 'Dr. Antoine Moreau',
          description: 'Une enquête exclusive sur la géopolitique des semi-conducteurs et le rôle de l\'Europe dans la course mondiale.',
          summary: 'Comprendre les enjeux de souveraineté technologique et les chaînes de valeur de l\'IA.',
          cover_image: '/assets/core/img/mag_hero_02.png',
          articles: ['art-2', 'art-1740000000002'],
          is_vip_only: 0,
          is_featured: 1,
          category: 'Technologie & Stratégie',
          magazine: 'magazine-02-power-lab',
          label: 'ENQUÊTE EXCLUSIVE',
          status: 'Published'
        },
        {
          id: 'dos-03',
          title: 'L\'Architecture du Silence : Esthétique & Épure Contemporaine',
          coordinator: 'Elena Moretti',
          description: 'Une exploration visuelle et architecturale des sanctuaires urbains et du design néo-minimaliste.',
          summary: 'Redéfinir le luxe par l\'espace, la lumière et la matière brute.',
          cover_image: '/assets/core/img/mag_hero_03.png',
          articles: ['art-3'],
          is_vip_only: 1,
          is_featured: 0,
          category: 'Design & Architecture',
          magazine: 'magazine-06-art-de-vivre',
          label: 'DOSSIER CURATION',
          status: 'Published'
        },
        {
          id: 'dos-04',
          title: 'Longevity & Santé Préventive : Repousser les Limites du Vivant',
          coordinator: 'Dr. Antoine Moreau',
          description: 'Innovations biomédicales, protocoles de longévité cellulaire et médecine régénérative de pointe.',
          summary: 'L\'impact des thérapies géniques et de la nutrition avancée sur l\'espérance de vie en bonne santé.',
          cover_image: '/assets/core/img/vault-2.png',
          articles: [],
          is_vip_only: 0,
          is_featured: 0,
          category: 'Sciences & Bien-Être',
          magazine: 'magazine-09-longevity',
          label: 'DOSSIER RECHERCHE',
          status: 'Published'
        },
        {
          id: 'dos-05',
          title: 'Gouvernance & Impact : Le Leadership Éthique du XXIe Siècle',
          coordinator: 'Marc Aubry',
          description: 'Comment les grandes dynasties et fonds d\'investissement réinventent le capitalisme d\'utilité publique.',
          summary: 'Études de cas sur les modèles hybrides conjuguant rentabilité financière et impact sociétal positif.',
          cover_image: '/assets/core/img/mag_hero_01.png',
          articles: [],
          is_vip_only: 1,
          is_featured: 0,
          category: 'Leadership & RSE',
          magazine: 'magazine-10-impact',
          label: 'DOSSIER STRATÉGIQUE',
          status: 'Published'
        }
      ];

      for (const d of initialDossiers) {
        dbUpsertDossier(d);
      }
      console.log(`[DB Migration] Successfully initialized dossiers.`);
    }

    // 8. Seed Today Page Config if empty
    const todayCount = db.prepare('SELECT COUNT(*) as count FROM today_page_config').get();
    if (todayCount.count === 0) {
      const initialTodayConfig = {
        hero: {
          id: 'hero',
          status: 'Published',
          title: "DONA : La\nRenaissance\nde la Femme Solaire",
          subtitle: "\"Une femme affirmée, positive, ambitieuse et rayonnante,\nen harmonie avec son époque.\"",
          button1Label: "DÉCOUVRIR DONA",
          button1Url: "#",
          button2Label: "LIRE LE MANIFESTE",
          button2Url: "#",
          image: "/assets/core/img/hero_solaire.png",
          updated: "À l'instant"
        },
        filters: [
          { id: 'f1', label: "TOUTES", url: "#", updated: "—" },
          { id: 'f2', label: "GÉOPOLITIQUE", url: "#", updated: "—" },
          { id: 'f3', label: "ÉCONOMIE", url: "#", updated: "—" },
          { id: 'f4', label: "BUSINESS", url: "#", updated: "—" },
          { id: 'f5', label: "INNOVATION", url: "#", updated: "—" },
          { id: 'f6', label: "SOCIÉTÉ", url: "#", updated: "—" },
          { id: 'f7', label: "CULTURE", url: "#", updated: "—" }
        ],
        newsItems: [
          { 
            id: 'news-1', 
            status: 'Published', 
            isFeatured: true, 
            isNew: true, 
            time: "15:00", 
            title: "Accord historique sur la parité salariale au sein de l'Union Européenne", 
            desc: "Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.", 
            content: "<p>Après des mois de négociations intenses, le Parlement a adopté ce matin une directive contraignante, marquant un tournant décisif pour l'égalité économique.</p>", 
            image: "/assets/core/img/featured_urgent.png", 
            updated: "À l'instant" 
          },
          { id: 'news-2', status: 'Published', isFeatured: false, isNew: true, time: "14:30", title: "Nominations à la tête des grandes banques centrales", desc: "Trois femmes pressenties pour diriger les institutions clés en Asie et en Europe.", content: "", updated: "À l'instant" },
          { id: 'news-3', status: 'Published', isFeatured: false, isNew: false, time: "13:15", title: "COP29 : Les initiatives climatiques portées par des entrepreneures", desc: "Le sommet met en lumière des solutions innovantes développées par des startups.", content: "", updated: "À l'instant" },
          { id: 'news-4', status: 'Published', isFeatured: false, isNew: false, time: "11:45", title: "Rétrospective : L'impact de l'architecture inclusive", desc: "Comment la nouvelle vague de designers redessine les espaces publics.", content: "", updated: "À l'instant" }
        ],
        editorial: {
          id: 'editorial',
          status: 'Published',
          sectionLabel: "NOTRE ÉDITORIAL",
          title: "Notre Vision\nRéconciliée",
          content: "<p>Le magazine DONA porte une vision réconciliée de la femme moderne. Loin des clivages épuisants, nous célébrons une féminité qui embrasse la réussite professionnelle sans sacrifier la grâce, l'élégance et l'accomplissement personnel.</p>",
          points: [
            { id: 1, title: "L'Harmonie plutôt que le combat", desc: "Cultiver sa force intérieure dans la sérénité." },
            { id: 2, title: "L'Ambition assumée", desc: "Viser l'excellence dans toutes les sphères de la vie." }
          ],
          quote: "\"L'élégance n'est pas de se faire remarquer, mais de s'en souvenir. C'est cette trace lumineuse que laisse la femme DONA.\"",
          image: "/assets/core/img/vision_portrait.png",
          updated: "—"
        },
        values: [
          { id: 'val-1', status: 'Published', title: "Heureuse", desc: "Cultiver la joie quotidienne comme une discipline de vie et un moteur de créativité.", updated: "—" },
          { id: 'val-2', status: 'Published', title: "Affirmée", desc: "Posséder une voix claire, poser des limites saines et assumer ses convictions.", updated: "—" },
          { id: 'val-3', status: 'Published', title: "Ambitieuse", desc: "Vouloir plus grand, sans s'excuser, et se donner les moyens d'atteindre l'excellence.", updated: "—" },
          { id: 'val-4', status: 'Published', title: "Rayonnante", desc: "Être une source d'inspiration lumineuse pour son entourage et sa communauté.", updated: "—" }
        ],
        france: [
          { id: 'fr-1', status: 'Published', category: "POLITIQUE", time: "Il y a 45 min", title: "Loi Égalité Professionnelle : Le Sénat adopte le texte en première lecture", desc: "Les quotas dans les comités de direction des grandes entreprises seront renforcés dès 2026.", content: "", image: "/assets/core/img/france_1.png", updated: "—" },
          { id: 'fr-2', status: 'Published', category: "ÉCONOMIE", time: "Il y a 2h", title: "CAC 40 : Les entreprises dirigées par des femmes surperforment", desc: "Une nouvelle étude démontre une rentabilité supérieure de 12% pour les groupes à parité.", content: "", image: "/assets/core/img/france_2.png", updated: "—" },
          { id: 'fr-3', status: 'Published', category: "CULTURE", time: "Il y a 4h", title: "Cannes 2026 : Record historique de femmes réalisatrices en sélection officielle", desc: "Thierry Frémaux annonce une sélection paritaire pour la première fois dans l'histoire du festival.", content: "", image: "/assets/core/img/france_3.png", updated: "—" }
        ]
      };

      dbUpdateTodayPageConfig(initialTodayConfig);
      console.log(`[DB Migration] Successfully initialized Today page config into SQLite.`);
    }

    // 9. Seed Global Settings if empty
    const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
    if (settingsCount.count === 0) {
      const defaultSettings = [
        { key: 'logoPath', value: '/assets/core/img/logo.png' },
        { key: 'ctaText', value: "S'ABONNER" },
        { key: 'ctaLink', value: '/abonnement' },
        { key: 'crimsonThemeHex', value: '#A30626' },
        { key: 'heroTitle', value: 'DONA MAGAZINE' },
        { key: 'heroSubtitle', value: 'Plateforme éditoriale exclusive' },
        { key: 'heroDescription', value: "Un espace dédié à l'excellence éditoriale, à la curation architecturale et aux privilèges exclusifs des femmes de pouvoir." },
        { key: 'footerLegalText', value: '© 2026 DONA Magazine. Tous droits réservés.' },
        { key: 'footerAddressText', value: 'Paris, France' },
        { key: 'footerBackgroundWatermark', value: 'DONA.' }
      ];

      for (const s of defaultSettings) {
        dbSetSetting(s.key, s.value);
      }
      console.log(`[DB Migration] Successfully initialized ${defaultSettings.length} platform settings into SQLite.`);
    }
  } catch (e) {
    console.error('Error during legacy JSON migration:', e);
  }
}

// -------------------------------------------------------------
// Articles Relational CRUD API
// -------------------------------------------------------------
export function dbGetArticles(options = {}) {
  const db = getDatabase();
  let query = 'SELECT * FROM articles';
  const conditions = [];
  const params = [];

  if (options.status && options.status !== 'all') {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  if (options.limit) {
    query += ' LIMIT ?';
    params.push(Number(options.limit));
  }

  const rows = db.prepare(query).all(...params);
  return rows.map(mapArticleFromDb);
}

export function dbGetArticleById(id) {
  if (!id) return null;
  const db = getDatabase();
  const strId = String(id);
  const row = db.prepare('SELECT * FROM articles WHERE id = ? OR slug = ?').get(strId, strId);
  return row ? mapArticleFromDb(row) : null;
}

export function dbUpsertArticle(art) {
  const db = getDatabase();
  const id = String(art.id || `art-${Date.now()}`);

  const stmt = db.prepare(`
    INSERT INTO articles (
      id, slug, title, author, category, rubrique, subcategory, badge,
      content, summary, desc, format, cover_image, image, article_gallery,
      video_url, audio_file, status, is_vip_only, placement_target, meta, updated, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      author = excluded.author,
      category = excluded.category,
      rubrique = excluded.rubrique,
      subcategory = excluded.subcategory,
      badge = excluded.badge,
      content = excluded.content,
      summary = excluded.summary,
      desc = excluded.desc,
      format = excluded.format,
      cover_image = excluded.cover_image,
      image = excluded.image,
      article_gallery = excluded.article_gallery,
      video_url = excluded.video_url,
      audio_file = excluded.audio_file,
      status = excluded.status,
      is_vip_only = excluded.is_vip_only,
      placement_target = excluded.placement_target,
      meta = excluded.meta,
      updated = excluded.updated,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    id,
    art.slug || null,
    art.title || 'Nouvel Article',
    art.author || 'Elena Moretti',
    art.category || '01. Intelligence',
    art.rubrique || art.subcategory || 'The Brief',
    art.subcategory || art.rubrique || 'The Brief',
    art.badge || (art.rubrique || 'ARTICLE').toUpperCase(),
    art.content || '',
    art.summary || art.desc || '',
    art.desc || art.summary || '',
    art.format || 'text',
    art.coverImage || art.image || '/assets/core/img/mag_hero_03.png',
    art.image || art.coverImage || '/assets/core/img/mag_hero_03.png',
    JSON.stringify(art.articleGallery || art.galerie_photos || []),
    art.videoUrl || '',
    art.audioFile || '',
    art.status === 'Draft' ? 'Draft' : 'Published',
    art.isVipOnly ? 1 : 0,
    art.placementTarget || 'STANDARD_FEED',
    art.meta || `${(art.author || 'RÉDACTION').toUpperCase()} • ${art.updated || 'RÉCENT'}`,
    art.updated || "À l'instant"
  );

  // Live sync directly to XAMPP MySQL
  liveSyncXampp(`
    INSERT INTO articles (id, slug, title, author, category, rubrique, subcategory, badge, content, summary, \`desc\`, format, cover_image, image, article_gallery, video_url, audio_file, status, is_vip_only, placement_target, meta, updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      slug = VALUES(slug), title = VALUES(title), author = VALUES(author), category = VALUES(category),
      rubrique = VALUES(rubrique), subcategory = VALUES(subcategory), badge = VALUES(badge),
      content = VALUES(content), summary = VALUES(summary), \`desc\` = VALUES(\`desc\`), format = VALUES(format),
      cover_image = VALUES(cover_image), image = VALUES(image), article_gallery = VALUES(article_gallery),
      video_url = VALUES(video_url), audio_file = VALUES(audio_file), status = VALUES(status),
      is_vip_only = VALUES(is_vip_only), placement_target = VALUES(placement_target), meta = VALUES(meta),
      updated = VALUES(updated), updated_at = CURRENT_TIMESTAMP
  `, [id, art.slug || null, art.title || 'Nouvel Article', art.author || 'Elena Moretti', art.category || '01. Intelligence', art.rubrique || art.subcategory || 'The Brief', art.subcategory || art.rubrique || 'The Brief', art.badge || (art.rubrique || 'ARTICLE').toUpperCase(), art.content || '', art.summary || art.desc || '', art.desc || art.summary || '', art.format || 'text', art.coverImage || art.image || '/assets/core/img/mag_hero_03.png', art.image || art.coverImage || '/assets/core/img/mag_hero_03.png', JSON.stringify(art.articleGallery || art.galerie_photos || []), art.videoUrl || '', art.audioFile || '', art.status === 'Draft' ? 'Draft' : 'Published', art.isVipOnly ? 1 : 0, art.placementTarget || 'STANDARD_FEED', art.meta || `${(art.author || 'RÉDACTION').toUpperCase()} • ${art.updated || 'RÉCENT'}`, art.updated || "À l'instant"]);

  return dbGetArticleById(id);
}

export function dbDeleteArticle(id) {
  if (!id) return false;
  const db = getDatabase();
  const strId = String(id);
  const info = db.prepare('DELETE FROM articles WHERE id = ? OR slug = ?').run(strId, strId);
  liveSyncXampp('DELETE FROM users WHERE id = ?', [String(id)]);
  return info.changes > 0;
}

function mapArticleFromDb(row) {
  let gallery = [];
  try {
    gallery = JSON.parse(row.article_gallery || '[]');
  } catch (e) {}

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author,
    category: row.category,
    rubrique: row.rubrique,
    subcategory: row.subcategory,
    badge: row.badge,
    content: row.content,
    summary: row.summary,
    desc: row.desc,
    format: row.format,
    coverImage: row.cover_image,
    image: row.image || row.cover_image,
    articleGallery: gallery,
    galerie_photos: gallery,
    videoUrl: row.video_url,
    audioFile: row.audio_file,
    status: row.status,
    isVipOnly: Boolean(row.is_vip_only),
    placementTarget: row.placement_target,
    meta: row.meta,
    updated: row.updated,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// -------------------------------------------------------------
// Magazines Relational CRUD API
// -------------------------------------------------------------
export function dbGetMagazines() {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM magazines ORDER BY id ASC').all();
  return rows.map(mapMagazineFromDb);
}

export function dbGetMagazineBySlug(slug) {
  if (!slug) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM magazines WHERE slug = ? OR slug = ?').get(
    slug,
    slug.replace(/^magazine-\d{2}-/, '')
  );
  return row ? mapMagazineFromDb(row) : null;
}

export function dbUpsertMagazine(slug, data) {
  const db = getDatabase();
  const targetSlug = slug || data.slug;

  const stmt = db.prepare(`
    INSERT INTO magazines (
      id, slug, title, subtitle, desc, theme_primary, theme_secondary,
      gradient, hero_image, essence_image, hero_buttons, essence_title,
      tabs, sections, rubriques, config_data, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(slug) DO UPDATE SET
      id = excluded.id,
      title = excluded.title,
      subtitle = excluded.subtitle,
      desc = excluded.desc,
      theme_primary = excluded.theme_primary,
      theme_secondary = excluded.theme_secondary,
      gradient = excluded.gradient,
      hero_image = excluded.hero_image,
      essence_image = excluded.essence_image,
      hero_buttons = excluded.hero_buttons,
      essence_title = excluded.essence_title,
      tabs = excluded.tabs,
      sections = excluded.sections,
      rubriques = excluded.rubriques,
      config_data = excluded.config_data,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    data.id || null,
    targetSlug,
    data.title || '',
    data.subtitle || '',
    data.desc || '',
    data.themePrimary || '#a31835',
    data.themeSecondary || '#3d0c1b',
    data.gradient || '',
    data.heroImage || '',
    data.essenceImage || '',
    JSON.stringify(data.heroButtons || []),
    data.essenceTitle || '',
    JSON.stringify(data.tabs || []),
    JSON.stringify(data.sections || []),
    JSON.stringify(data.rubriques || []),
    JSON.stringify(data)
  );

  return dbGetMagazineBySlug(targetSlug);
}

export function dbDeleteMagazine(slug) {
  if (!slug) return false;
  const db = getDatabase();
  const info = db.prepare('DELETE FROM magazines WHERE slug = ? OR slug = ?').run(
    slug,
    slug.replace(/^magazine-\d{2}-/, '')
  );
  return info.changes > 0;
}

function mapMagazineFromDb(row) {
  let heroButtons = [];
  let tabs = [];
  let sections = [];
  let rubriques = [];
  let rawConfig = {};

  try { heroButtons = JSON.parse(row.hero_buttons || '[]'); } catch (e) {}
  try { tabs = JSON.parse(row.tabs || '[]'); } catch (e) {}
  try { sections = JSON.parse(row.sections || '[]'); } catch (e) {}
  try { rubriques = JSON.parse(row.rubriques || '[]'); } catch (e) {}
  try { rawConfig = JSON.parse(row.config_data || '{}'); } catch (e) {}

  return {
    ...rawConfig,
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    desc: row.desc,
    themePrimary: row.theme_primary,
    themeSecondary: row.theme_secondary,
    gradient: row.gradient,
    heroImage: row.hero_image,
    essenceImage: row.essence_image,
    heroButtons,
    essenceTitle: row.essence_title,
    tabs,
    sections,
    rubriques,
    updatedAt: row.updated_at
  };
}

// -------------------------------------------------------------
// Videos Relational CRUD API
// -------------------------------------------------------------
export function dbGetVideos(filters = {}) {
  const db = getDatabase();
  let query = 'SELECT * FROM videos';
  const conditions = [];
  const params = [];

  if (filters.category && filters.category !== 'all') {
    conditions.push('category = ?');
    params.push(filters.category);
  }
  if (filters.magazine && filters.magazine !== 'all') {
    conditions.push('magazine = ?');
    params.push(filters.magazine);
  }
  if (filters.status && filters.status !== 'all') {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters.featured === true || filters.featured === 'true') {
    conditions.push('is_featured = 1');
  }
  if (filters.replay === true || filters.replay === 'true') {
    conditions.push('is_replay = 1');
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY published_at DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(Number(filters.limit));
  }

  const rows = db.prepare(query).all(...params);
  return rows.map(mapVideoFromDb);
}

export function dbGetVideoById(id) {
  if (!id) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM videos WHERE id = ?').get(String(id));
  return row ? mapVideoFromDb(row) : null;
}

export function dbUpsertVideo(v) {
  const db = getDatabase();
  const id = String(v.id || `vid-${Date.now()}`);

  const stmt = db.prepare(`
    INSERT INTO videos (
      id, title, subtitle, category, magazine, label, duration,
      is_vip_only, is_hd, is_featured, is_replay, source, video_url,
      thumbnail_url, published_at, status, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      subtitle = excluded.subtitle,
      category = excluded.category,
      magazine = excluded.magazine,
      label = excluded.label,
      duration = excluded.duration,
      is_vip_only = excluded.is_vip_only,
      is_hd = excluded.is_hd,
      is_featured = excluded.is_featured,
      is_replay = excluded.is_replay,
      source = excluded.source,
      video_url = excluded.video_url,
      thumbnail_url = excluded.thumbnail_url,
      published_at = excluded.published_at,
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    id,
    v.title || '',
    v.subtitle || '',
    v.category || 'Culture',
    v.magazine || '',
    v.label || 'VIDÉO',
    v.duration || '',
    v.isVipOnly ? 1 : 0,
    v.isHD ? 1 : 0,
    v.isFeatured ? 1 : 0,
    v.isReplay ? 1 : 0,
    v.source || 'url',
    v.videoUrl || '',
    v.thumbnailUrl || '',
    v.publishedAt || new Date().toISOString(),
    v.status || 'Draft'
  );

  return dbGetVideoById(id);
}

export function dbDeleteVideo(id) {
  if (!id) return false;
  const db = getDatabase();
  const info = db.prepare('DELETE FROM videos WHERE id = ?').run(String(id));
  return info.changes > 0;
}

function mapVideoFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category,
    magazine: row.magazine,
    label: row.label,
    duration: row.duration,
    isVipOnly: Boolean(row.is_vip_only),
    isHD: Boolean(row.is_hd),
    isFeatured: Boolean(row.is_featured),
    isReplay: Boolean(row.is_replay),
    source: row.source,
    videoUrl: row.video_url,
    thumbnailUrl: row.thumbnail_url,
    publishedAt: row.published_at,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// -------------------------------------------------------------
// TV Live Relational CRUD API
// -------------------------------------------------------------
export function dbGetTvLive() {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM tv_live WHERE id = 'main'").get();
  if (!row) return { isLive: false, epg: [] };

  let epg = [];
  try { epg = JSON.parse(row.epg || '[]'); } catch (e) {}

  return {
    isLive: Boolean(row.is_live),
    streamUrl: row.stream_url,
    hlsUrl: row.hls_url,
    currentTitle: row.current_title,
    currentSubtitle: row.current_subtitle,
    currentGuest: row.current_guest,
    format: row.format,
    location: row.location,
    epg,
    updatedAt: row.updated_at
  };
}

export function dbUpdateTvLive(data) {
  const db = getDatabase();
  const current = dbGetTvLive();

  const isLive = data.isLive !== undefined ? (data.isLive ? 1 : 0) : (current.isLive ? 1 : 0);
  const streamUrl = data.streamUrl !== undefined ? data.streamUrl : current.streamUrl;
  const hlsUrl = data.hlsUrl !== undefined ? data.hlsUrl : current.hlsUrl;
  const currentTitle = data.currentTitle !== undefined ? data.currentTitle : current.currentTitle;
  const currentSubtitle = data.currentSubtitle !== undefined ? data.currentSubtitle : current.currentSubtitle;
  const currentGuest = data.currentGuest !== undefined ? data.currentGuest : current.currentGuest;
  const format = data.format !== undefined ? data.format : current.format;
  const location = data.location !== undefined ? data.location : current.location;
  const epg = data.epg !== undefined ? data.epg : current.epg;

  db.prepare(`
    INSERT INTO tv_live (
      id, is_live, stream_url, hls_url, current_title, current_subtitle,
      current_guest, format, location, epg, updated_at
    ) VALUES (
      'main', ?, ?, ?, ?, ?,
      ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      is_live = excluded.is_live,
      stream_url = excluded.stream_url,
      hls_url = excluded.hls_url,
      current_title = excluded.current_title,
      current_subtitle = excluded.current_subtitle,
      current_guest = excluded.current_guest,
      format = excluded.format,
      location = excluded.location,
      epg = excluded.epg,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    isLive,
    streamUrl || '',
    hlsUrl || '',
    currentTitle || '',
    currentSubtitle || '',
    currentGuest || '',
    format || '',
    location || '',
    JSON.stringify(epg || [])
  );

  return dbGetTvLive();
}

// -------------------------------------------------------------
// Dossiers Relational CRUD API
// -------------------------------------------------------------
export function dbGetDossierById(id) {
  if (!id) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM dossiers WHERE id = ?').get(String(id));
  return row ? mapDossierFromDb(row) : null;
}

export function dbGetDossiers() {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM dossiers ORDER BY created_at DESC').all();
  return rows.map(mapDossierFromDb);
}

export function dbUpsertDossier(d) {
  const db = getDatabase();
  const id = String(d.id || `dos-${Date.now()}`);

  const stmt = db.prepare(`
    INSERT INTO dossiers (
      id, title, coordinator, description, summary, cover_image,
      articles, is_vip_only, is_featured, category, magazine, label, status, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      coordinator = excluded.coordinator,
      description = excluded.description,
      summary = excluded.summary,
      cover_image = excluded.cover_image,
      articles = excluded.articles,
      is_vip_only = excluded.is_vip_only,
      is_featured = excluded.is_featured,
      category = excluded.category,
      magazine = excluded.magazine,
      label = excluded.label,
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    id,
    d.title || '',
    d.coordinator || 'Hélène de Ségur',
    d.description || d.summary || '',
    d.summary || d.description || '',
    d.coverImage || d.cover_image || '/assets/core/img/vault-1.png',
    JSON.stringify(d.articles || []),
    d.isVipOnly || d.is_vip_only ? 1 : 0,
    d.isFeatured || d.is_featured ? 1 : 0,
    d.category || 'Analyses & Enquêtes',
    d.magazine || '',
    d.label || 'DOSSIER SPÉCIAL',
    d.status || 'Published'
  );

  const row = db.prepare('SELECT * FROM dossiers WHERE id = ?').get(id);
  return row ? mapDossierFromDb(row) : null;
}

export function dbDeleteDossier(id) {
  if (!id) return false;
  const db = getDatabase();
  const info = db.prepare('DELETE FROM dossiers WHERE id = ?').run(String(id));
  return info.changes > 0;
}

function mapDossierFromDb(row) {
  let articles = [];
  try { articles = JSON.parse(row.articles || '[]'); } catch (e) {}

  return {
    id: row.id,
    title: row.title,
    coordinator: row.coordinator,
    description: row.description,
    summary: row.summary,
    coverImage: row.cover_image,
    articles,
    isVipOnly: Boolean(row.is_vip_only),
    isFeatured: Boolean(row.is_featured),
    category: row.category,
    magazine: row.magazine,
    label: row.label,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// -------------------------------------------------------------
// Users Relational CRUD API (for Team Management & NextAuth)
// -------------------------------------------------------------
export function dbGetUsers(filters = {}) {
  const db = getDatabase();
  let query = 'SELECT * FROM users';
  const conditions = [];
  const params = [];

  if (filters.role && filters.role !== 'all') {
    conditions.push('role = ?');
    params.push(filters.role);
  }
  if (filters.status && filters.status !== 'all') {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters.search) {
    conditions.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at ASC';

  const rows = db.prepare(query).all(...params);
  return rows.map(mapUserFromDb);
}

export function dbGetUserByEmail(email) {
  if (!email) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(String(email).trim());
  return row ? mapUserFromDb(row) : null;
}

export function dbGetUserById(id) {
  if (!id) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(String(id));
  return row ? mapUserFromDb(row) : null;
}

export function dbUpsertUser(u) {
  const db = getDatabase();
  const email = String(u.email || '').trim().toLowerCase();
  if (!email) return null;

  const existing = dbGetUserByEmail(email) || (u.id ? dbGetUserById(u.id) : null);
  const id = existing ? existing.id : String(u.id || `u-${Date.now()}`);
  const password = u.password || existing?.password || 'dona2026';
  const role = u.role || existing?.role || 'USER';
  const status = u.status || existing?.status || 'Actif';
  const plan = u.plan || existing?.plan || 'Essentiel';
  const phone = u.phone !== undefined ? u.phone : (existing?.phone || '');
  const avatar = u.avatar !== undefined ? u.avatar : (existing?.avatar || null);
  const lastLogin = u.lastLogin || existing?.lastLogin || 'Jamais connecté';

  const stmt = db.prepare(`
    INSERT INTO users (
      id, name, email, password, role, status, plan, phone, last_login, avatar, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      password = excluded.password,
      role = excluded.role,
      status = excluded.status,
      plan = excluded.plan,
      phone = excluded.phone,
      avatar = excluded.avatar,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    id,
    u.name || existing?.name || 'Utilisateur',
    email,
    password,
    role,
    status,
    plan,
    phone,
    lastLogin,
    avatar
  );

  // Live sync directly to XAMPP MySQL
  liveSyncXampp(`
    INSERT INTO users (id, name, email, password, role, status, plan, phone, last_login, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name), password = VALUES(password), role = VALUES(role),
      status = VALUES(status), plan = VALUES(plan), phone = VALUES(phone),
      avatar = VALUES(avatar), updated_at = CURRENT_TIMESTAMP
  `, [id, u.name || existing?.name || 'Utilisateur', email, password, role, status, plan, phone, lastLogin, avatar]);

  return dbGetUserByEmail(email);
}

export function dbToggleUserStatus(id) {
  if (!id) return null;
  const db = getDatabase();
  const user = dbGetUserById(id);
  if (!user) return null;

  const nextStatus = user.status === 'Actif' ? 'Suspendu' : 'Actif';
  db.prepare('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(nextStatus, String(id));
  return dbGetUserById(id);
}

export function dbDeleteUser(id) {
  if (!id) return false;
  const db = getDatabase();
  const info = db.prepare('DELETE FROM users WHERE id = ?').run(String(id));
  return info.changes > 0;
}

export function dbUpdateUserLastLogin(idOrEmail) {
  if (!idOrEmail) return false;
  const db = getDatabase();
  const nowStr = new Date().toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  db.prepare('UPDATE users SET last_login = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? OR lower(email) = lower(?)')
    .run(nowStr, String(idOrEmail), String(idOrEmail).trim());
  return true;
}

function mapUserFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    status: row.status,
    plan: row.plan || 'Essentiel',
    phone: row.phone || '',
    lastLogin: row.last_login,
    avatar: row.avatar,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// -------------------------------------------------------------
// Members Relational CRUD API (Platform Subscribers / Cercle)
// -------------------------------------------------------------
export function dbGetMembers(filters = {}) {
  const db = getDatabase();
  let query = 'SELECT * FROM members';
  const conditions = [];
  const params = [];

  if (filters.plan && filters.plan !== 'all') {
    conditions.push('plan = ?');
    params.push(filters.plan);
  }
  if (filters.status && filters.status !== 'all') {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters.search) {
    conditions.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params);
  return rows.map(mapMemberFromDb);
}

export function dbGetMemberById(id) {
  if (!id) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM members WHERE id = ?').get(String(id));
  return row ? mapMemberFromDb(row) : null;
}

export function dbGetMemberByEmail(email) {
  if (!email) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM members WHERE lower(email) = lower(?)').get(String(email).trim());
  return row ? mapMemberFromDb(row) : null;
}

export function dbUpsertMember(m) {
  const db = getDatabase();
  const email = String(m.email || '').trim().toLowerCase();
  if (!email) return null;

  const existing = dbGetMemberByEmail(email) || (m.id ? dbGetMemberById(m.id) : null);
  const id = existing ? existing.id : String(m.id || `mem-${Date.now()}`);
  const joined = m.joined || existing?.joined || new Date().toLocaleDateString('fr-FR');
  const password = m.password || existing?.password || 'dona2026';
  const plan = m.plan || existing?.plan || 'Essentiel';
  const status = m.status || existing?.status || 'Active';
  const phone = m.phone !== undefined ? m.phone : (existing?.phone || '');
  const avatar = m.avatar !== undefined ? m.avatar : (existing?.avatar || null);

  const stmt = db.prepare(`
    INSERT INTO members (
      id, name, email, phone, avatar, plan, status, joined, password, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      phone = excluded.phone,
      avatar = excluded.avatar,
      plan = excluded.plan,
      status = excluded.status,
      joined = excluded.joined,
      password = excluded.password,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    id,
    m.name || existing?.name || 'Nouveau Membre',
    email,
    phone,
    avatar,
    plan,
    status,
    joined,
    password
  );

  // Live sync directly to XAMPP MySQL
  liveSyncXampp(`
    INSERT INTO members (id, name, email, phone, avatar, plan, status, joined, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name), phone = VALUES(phone), avatar = VALUES(avatar),
      plan = VALUES(plan), status = VALUES(status), joined = VALUES(joined),
      password = VALUES(password), updated_at = CURRENT_TIMESTAMP
  `, [id, m.name || existing?.name || 'Nouveau Membre', email, phone, avatar, plan, status, joined, password]);

  return dbGetMemberByEmail(email);
}

export function dbDeleteMember(id) {
  if (!id) return false;
  const db = getDatabase();
  const info = db.prepare('DELETE FROM members WHERE id = ?').run(String(id));
  return info.changes > 0;
}

function mapMemberFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    avatar: row.avatar,
    plan: row.plan || 'Essentiel',
    status: row.status || 'Active',
    joined: row.joined,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// -------------------------------------------------------------
// Today Page Configuration Relational API
// -------------------------------------------------------------
export function dbGetTodayPageConfig() {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM today_page_config WHERE id = 'main'").get();
  if (!row) return null;

  let hero = {};
  let filters = [];
  let newsItems = [];
  let editorial = {};
  let values = [];
  let france = [];

  try { hero = JSON.parse(row.hero || '{}'); } catch (e) {}
  try { filters = JSON.parse(row.filters || '[]'); } catch (e) {}
  try { newsItems = JSON.parse(row.news_items || '[]'); } catch (e) {}
  try { editorial = JSON.parse(row.editorial || '{}'); } catch (e) {}
  try { values = JSON.parse(row.values_list || '[]'); } catch (e) {}
  try { france = JSON.parse(row.france || '[]'); } catch (e) {}

  return {
    hero,
    filters,
    newsItems,
    editorial,
    values,
    france,
    updatedAt: row.updated_at
  };
}

export function dbUpdateTodayPageConfig(data) {
  const db = getDatabase();
  const current = dbGetTodayPageConfig() || {};

  const hero = data.hero !== undefined ? data.hero : current.hero;
  const filters = data.filters !== undefined ? data.filters : current.filters;
  const newsItems = data.newsItems !== undefined ? data.newsItems : current.newsItems;
  const editorial = data.editorial !== undefined ? data.editorial : current.editorial;
  const values = data.values !== undefined ? data.values : current.values;
  const france = data.france !== undefined ? data.france : current.france;

  db.prepare(`
    INSERT INTO today_page_config (
      id, hero, filters, news_items, editorial, values_list, france, updated_at
    ) VALUES (
      'main', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      hero = excluded.hero,
      filters = excluded.filters,
      news_items = excluded.news_items,
      editorial = excluded.editorial,
      values_list = excluded.values_list,
      france = excluded.france,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    JSON.stringify(hero || {}),
    JSON.stringify(filters || []),
    JSON.stringify(newsItems || []),
    JSON.stringify(editorial || {}),
    JSON.stringify(values || []),
    JSON.stringify(france || [])
  );

  // Live sync directly to XAMPP MySQL
  liveSyncXampp(`
    INSERT INTO today_page_config (id, hero, filters, news_items, editorial, values_list, france)
    VALUES ('main', ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      hero = VALUES(hero), filters = VALUES(filters), news_items = VALUES(news_items),
      editorial = VALUES(editorial), values_list = VALUES(values_list), france = VALUES(france),
      updated_at = CURRENT_TIMESTAMP
  `, [
    JSON.stringify(hero || {}),
    JSON.stringify(filters || []),
    JSON.stringify(newsItems || []),
    JSON.stringify(editorial || {}),
    JSON.stringify(values || []),
    JSON.stringify(france || [])
  ]);

  return dbGetTodayPageConfig();
}

// -------------------------------------------------------------
// Global Settings Relational API
// -------------------------------------------------------------
export function dbGetSetting(key, fallback = null) {
  if (!key) return fallback;
  const db = getDatabase();
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(String(key));
  return row ? row.value : fallback;
}

export function dbSetSetting(key, value) {
  if (!key) return false;
  const db = getDatabase();
  db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP
  `).run(String(key), String(value !== null && value !== undefined ? value : ''));
  return true;
}

export function dbGetAllSettings() {
  const db = getDatabase();
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const result = {};
  rows.forEach(r => {
    result[r.key] = r.value;
  });
  return result;
}

// -------------------------------------------------------------
// Real-time Dashboard Dynamic Metrics
// -------------------------------------------------------------
export function dbGetDashboardStats() {
  const db = getDatabase();

  const articlesPublished = db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'Published'").get()?.count || 0;
  const totalArticles = db.prepare("SELECT COUNT(*) as count FROM articles").get()?.count || 0;
  const activeMembers = db.prepare("SELECT COUNT(*) as count FROM members WHERE status = 'Active'").get()?.count || 0;
  const totalMembers = db.prepare("SELECT COUNT(*) as count FROM members").get()?.count || 0;
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get()?.count || 0;
  const totalVideos = db.prepare("SELECT COUNT(*) as count FROM videos").get()?.count || 0;
  const tvLive = dbGetTvLive();

  // Recent activities dynamically from articles
  const recentArticles = db.prepare("SELECT id, title, author, format, status, updated_at FROM articles ORDER BY updated_at DESC LIMIT 5").all();
  const typeMap = { text: "Article", video: "Vidéo", audio: "Podcast" };

  const activities = recentArticles.map(a => ({
    id: a.id,
    type: typeMap[a.format] || "Article",
    title: a.title,
    author: a.author || "Rédaction",
    status: a.status || "Published",
    updated: a.updated_at || "Récemment"
  }));

  return {
    articlesPublished,
    totalArticles,
    activeMembers: 1281 + activeMembers,
    rawMembersCount: totalMembers,
    totalUsers,
    totalVideos,
    tvLive,
    activities
  };
}

// -------------------------------------------------------------
// Standalone SQL Dump Exporter for XAMPP / MySQL / phpMyAdmin
// -------------------------------------------------------------
function escapeSqlVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${str}'`;
}

export function exportDatabaseToSqlFile() {
  try {
    const db = getDatabase();
    const outputPath = path.join(process.cwd(), 'dona_database_export.sql');

    let sql = `-- =======================================================
-- DONA Platform - Full Database Export for XAMPP / MySQL / phpMyAdmin
-- Generated At: ${new Date().toISOString()}
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS \`dona_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`dona_db\`;

-- 1. Users
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`password\` VARCHAR(255) DEFAULT 'dona2026',
  \`role\` VARCHAR(100) NOT NULL DEFAULT 'Journaliste',
  \`status\` VARCHAR(50) DEFAULT 'Actif',
  \`plan\` VARCHAR(50) DEFAULT 'Essentiel',
  \`phone\` VARCHAR(50) DEFAULT NULL,
  \`last_login\` VARCHAR(100) DEFAULT 'Jamais connecté',
  \`avatar\` VARCHAR(500) DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_users_email\` (\`email\`),
  KEY \`idx_users_role\` (\`role\`),
  KEY \`idx_users_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;
    const users = db.prepare('SELECT * FROM users').all();
    for (const u of users) {
      sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`status\`, \`plan\`, \`phone\`, \`last_login\`, \`avatar\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSqlVal(u.id)}, ${escapeSqlVal(u.name)}, ${escapeSqlVal(u.email)}, ${escapeSqlVal(u.password)}, ${escapeSqlVal(u.role)}, ${escapeSqlVal(u.status)}, ${escapeSqlVal(u.plan)}, ${escapeSqlVal(u.phone)}, ${escapeSqlVal(u.last_login)}, ${escapeSqlVal(u.avatar)}, ${escapeSqlVal(u.created_at)}, ${escapeSqlVal(u.updated_at)});\n`;
    }

    // 2. Members
    sql += `\n-- 2. Members\nDROP TABLE IF EXISTS \`members\`;\nCREATE TABLE \`members\` (\n  \`id\` VARCHAR(100) NOT NULL,\n  \`name\` VARCHAR(255) NOT NULL,\n  \`email\` VARCHAR(255) NOT NULL,\n  \`phone\` VARCHAR(50) DEFAULT NULL,\n  \`avatar\` VARCHAR(500) DEFAULT NULL,\n  \`plan\` VARCHAR(50) DEFAULT 'Essentiel',\n  \`status\` VARCHAR(50) DEFAULT 'Active',\n  \`joined\` VARCHAR(50) DEFAULT NULL,\n  \`password\` VARCHAR(255) DEFAULT 'dona2026',\n  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`id\`),\n  UNIQUE KEY \`uniq_members_email\` (\`email\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const members = db.prepare('SELECT * FROM members').all();
    for (const m of members) {
      sql += `INSERT INTO \`members\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`avatar\`, \`plan\`, \`status\`, \`joined\`, \`password\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSqlVal(m.id)}, ${escapeSqlVal(m.name)}, ${escapeSqlVal(m.email)}, ${escapeSqlVal(m.phone)}, ${escapeSqlVal(m.avatar)}, ${escapeSqlVal(m.plan)}, ${escapeSqlVal(m.status)}, ${escapeSqlVal(m.joined)}, ${escapeSqlVal(m.password)}, ${escapeSqlVal(m.created_at)}, ${escapeSqlVal(m.updated_at)});\n`;
    }

    // 3. Articles
    sql += `\n-- 3. Articles\nDROP TABLE IF EXISTS \`articles\`;\nCREATE TABLE \`articles\` (\n  \`id\` VARCHAR(100) NOT NULL,\n  \`slug\` VARCHAR(255) DEFAULT NULL,\n  \`title\` VARCHAR(500) NOT NULL,\n  \`author\` VARCHAR(255) DEFAULT 'Elena Moretti',\n  \`category\` VARCHAR(255) DEFAULT '01. Intelligence',\n  \`rubrique\` VARCHAR(255) DEFAULT 'The Brief',\n  \`subcategory\` VARCHAR(255) DEFAULT 'The Brief',\n  \`badge\` VARCHAR(100) DEFAULT 'ARTICLE',\n  \`content\` LONGTEXT DEFAULT NULL,\n  \`summary\` TEXT DEFAULT NULL,\n  \`desc\` TEXT DEFAULT NULL,\n  \`format\` VARCHAR(50) DEFAULT 'text',\n  \`cover_image\` VARCHAR(500) DEFAULT NULL,\n  \`image\` VARCHAR(500) DEFAULT NULL,\n  \`article_gallery\` LONGTEXT DEFAULT NULL,\n  \`video_url\` VARCHAR(500) DEFAULT NULL,\n  \`audio_file\` VARCHAR(500) DEFAULT NULL,\n  \`status\` VARCHAR(50) DEFAULT 'Published',\n  \`is_vip_only\` TINYINT(1) DEFAULT 0,\n  \`placement_target\` VARCHAR(100) DEFAULT 'STANDARD_FEED',\n  \`meta\` VARCHAR(500) DEFAULT NULL,\n  \`updated\` VARCHAR(100) DEFAULT 'RÉCENT',\n  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const articles = db.prepare('SELECT * FROM articles').all();
    for (const a of articles) {
      sql += `INSERT INTO \`articles\` (\`id\`, \`slug\`, \`title\`, \`author\`, \`category\`, \`rubrique\`, \`subcategory\`, \`badge\`, \`content\`, \`summary\`, \`desc\`, \`format\`, \`cover_image\`, \`image\`, \`article_gallery\`, \`video_url\`, \`audio_file\`, \`status\`, \`is_vip_only\`, \`placement_target\`, \`meta\`, \`updated\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSqlVal(a.id)}, ${escapeSqlVal(a.slug)}, ${escapeSqlVal(a.title)}, ${escapeSqlVal(a.author)}, ${escapeSqlVal(a.category)}, ${escapeSqlVal(a.rubrique)}, ${escapeSqlVal(a.subcategory)}, ${escapeSqlVal(a.badge)}, ${escapeSqlVal(a.content)}, ${escapeSqlVal(a.summary)}, ${escapeSqlVal(a.desc)}, ${escapeSqlVal(a.format)}, ${escapeSqlVal(a.cover_image)}, ${escapeSqlVal(a.image)}, ${escapeSqlVal(a.article_gallery)}, ${escapeSqlVal(a.video_url)}, ${escapeSqlVal(a.audio_file)}, ${escapeSqlVal(a.status)}, ${escapeSqlVal(a.is_vip_only)}, ${escapeSqlVal(a.placement_target)}, ${escapeSqlVal(a.meta)}, ${escapeSqlVal(a.updated)}, ${escapeSqlVal(a.created_at)}, ${escapeSqlVal(a.updated_at)});\n`;
    }

    // 4. Magazines
    sql += `\n-- 4. Magazines\nDROP TABLE IF EXISTS \`magazines\`;\nCREATE TABLE \`magazines\` (\n  \`id\` INT DEFAULT NULL,\n  \`slug\` VARCHAR(255) NOT NULL,\n  \`title\` VARCHAR(255) DEFAULT NULL,\n  \`subtitle\` VARCHAR(500) DEFAULT NULL,\n  \`desc\` TEXT DEFAULT NULL,\n  \`theme_primary\` VARCHAR(50) DEFAULT '#a31835',\n  \`theme_secondary\` VARCHAR(50) DEFAULT '#3d0c1b',\n  \`gradient\` VARCHAR(500) DEFAULT NULL,\n  \`hero_image\` VARCHAR(500) DEFAULT NULL,\n  \`essence_image\` VARCHAR(500) DEFAULT NULL,\n  \`hero_buttons\` LONGTEXT DEFAULT NULL,\n  \`essence_title\` VARCHAR(255) DEFAULT NULL,\n  \`tabs\` LONGTEXT DEFAULT NULL,\n  \`sections\` LONGTEXT DEFAULT NULL,\n  \`rubriques\` LONGTEXT DEFAULT NULL,\n  \`config_data\` LONGTEXT DEFAULT NULL,\n  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`slug\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const magazines = db.prepare('SELECT * FROM magazines').all();
    for (const m of magazines) {
      sql += `INSERT INTO \`magazines\` (\`id\`, \`slug\`, \`title\`, \`subtitle\`, \`desc\`, \`theme_primary\`, \`theme_secondary\`, \`gradient\`, \`hero_image\`, \`essence_image\`, \`hero_buttons\`, \`essence_title\`, \`tabs\`, \`sections\`, \`rubriques\`, \`config_data\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSqlVal(m.id)}, ${escapeSqlVal(m.slug)}, ${escapeSqlVal(m.title)}, ${escapeSqlVal(m.subtitle)}, ${escapeSqlVal(m.desc)}, ${escapeSqlVal(m.theme_primary)}, ${escapeSqlVal(m.theme_secondary)}, ${escapeSqlVal(m.gradient)}, ${escapeSqlVal(m.hero_image)}, ${escapeSqlVal(m.essence_image)}, ${escapeSqlVal(m.hero_buttons)}, ${escapeSqlVal(m.essence_title)}, ${escapeSqlVal(m.tabs)}, ${escapeSqlVal(m.sections)}, ${escapeSqlVal(m.rubriques)}, ${escapeSqlVal(m.config_data)}, ${escapeSqlVal(m.created_at)}, ${escapeSqlVal(m.updated_at)});\n`;
    }

    // 5. Videos
    sql += `\n-- 5. Videos\nDROP TABLE IF EXISTS \`videos\`;\nCREATE TABLE \`videos\` (\n  \`id\` VARCHAR(100) NOT NULL,\n  \`title\` VARCHAR(500) NOT NULL,\n  \`subtitle\` VARCHAR(500) DEFAULT NULL,\n  \`category\` VARCHAR(255) DEFAULT 'Culture',\n  \`magazine\` VARCHAR(255) DEFAULT NULL,\n  \`label\` VARCHAR(100) DEFAULT 'VIDÉO',\n  \`duration\` VARCHAR(50) DEFAULT NULL,\n  \`is_vip_only\` TINYINT(1) DEFAULT 0,\n  \`is_hd\` TINYINT(1) DEFAULT 0,\n  \`is_featured\` TINYINT(1) DEFAULT 0,\n  \`is_replay\` TINYINT(1) DEFAULT 0,\n  \`source\` VARCHAR(50) DEFAULT 'url',\n  \`video_url\` VARCHAR(500) DEFAULT NULL,\n  \`thumbnail_url\` VARCHAR(500) DEFAULT NULL,\n  \`published_at\` DATETIME DEFAULT NULL,\n  \`status\` VARCHAR(50) DEFAULT 'Draft',\n  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const videos = db.prepare('SELECT * FROM videos').all();
    for (const v of videos) {
      sql += `INSERT INTO \`videos\` (\`id\`, \`title\`, \`subtitle\`, \`category\`, \`magazine\`, \`label\`, \`duration\`, \`is_vip_only\`, \`is_hd\`, \`is_featured\`, \`is_replay\`, \`source\`, \`video_url\`, \`thumbnail_url\`, \`published_at\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSqlVal(v.id)}, ${escapeSqlVal(v.title)}, ${escapeSqlVal(v.subtitle)}, ${escapeSqlVal(v.category)}, ${escapeSqlVal(v.magazine)}, ${escapeSqlVal(v.label)}, ${escapeSqlVal(v.duration)}, ${escapeSqlVal(v.is_vip_only)}, ${escapeSqlVal(v.is_hd)}, ${escapeSqlVal(v.is_featured)}, ${escapeSqlVal(v.is_replay)}, ${escapeSqlVal(v.source)}, ${escapeSqlVal(v.video_url)}, ${escapeSqlVal(v.thumbnail_url)}, ${escapeSqlVal(v.published_at)}, ${escapeSqlVal(v.status)}, ${escapeSqlVal(v.created_at)}, ${escapeSqlVal(v.updated_at)});\n`;
    }

    // 6. TV Live
    sql += `\n-- 6. TV Live\nDROP TABLE IF EXISTS \`tv_live\`;\nCREATE TABLE \`tv_live\` (\n  \`id\` VARCHAR(50) NOT NULL DEFAULT 'main',\n  \`is_live\` TINYINT(1) DEFAULT 0,\n  \`stream_url\` VARCHAR(500) DEFAULT NULL,\n  \`hls_url\` VARCHAR(500) DEFAULT NULL,\n  \`current_title\` VARCHAR(255) DEFAULT NULL,\n  \`current_subtitle\` VARCHAR(255) DEFAULT NULL,\n  \`current_guest\` VARCHAR(255) DEFAULT NULL,\n  \`format\` VARCHAR(100) DEFAULT NULL,\n  \`location\` VARCHAR(255) DEFAULT NULL,\n  \`epg\` LONGTEXT DEFAULT NULL,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const tvLive = db.prepare('SELECT * FROM tv_live').all();
    for (const t of tvLive) {
      sql += `INSERT INTO \`tv_live\` (\`id\`, \`is_live\`, \`stream_url\`, \`hls_url\`, \`current_title\`, \`current_subtitle\`, \`current_guest\`, \`format\`, \`location\`, \`epg\`, \`updated_at\`) VALUES (${escapeSqlVal(t.id)}, ${escapeSqlVal(t.is_live)}, ${escapeSqlVal(t.stream_url)}, ${escapeSqlVal(t.hls_url)}, ${escapeSqlVal(t.current_title)}, ${escapeSqlVal(t.current_subtitle)}, ${escapeSqlVal(t.current_guest)}, ${escapeSqlVal(t.format)}, ${escapeSqlVal(t.location)}, ${escapeSqlVal(t.epg)}, ${escapeSqlVal(t.updated_at)});\n`;
    }

    // 7. Dossiers
    sql += `\n-- 7. Dossiers\nDROP TABLE IF EXISTS \`dossiers\`;\nCREATE TABLE \`dossiers\` (\n  \`id\` VARCHAR(100) NOT NULL,\n  \`title\` VARCHAR(500) NOT NULL,\n  \`coordinator\` VARCHAR(255) DEFAULT 'Hélène de Ségur',\n  \`description\` LONGTEXT DEFAULT NULL,\n  \`summary\` TEXT DEFAULT NULL,\n  \`cover_image\` VARCHAR(500) DEFAULT NULL,\n  \`articles\` LONGTEXT DEFAULT NULL,\n  \`is_vip_only\` TINYINT(1) DEFAULT 0,\n  \`is_featured\` TINYINT(1) DEFAULT 0,\n  \`category\` VARCHAR(255) DEFAULT 'Analyses & Enquêtes',\n  \`magazine\` VARCHAR(255) DEFAULT NULL,\n  \`label\` VARCHAR(100) DEFAULT 'DOSSIER SPÉCIAL',\n  \`status\` VARCHAR(50) DEFAULT 'Published',\n  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const dossiers = db.prepare('SELECT * FROM dossiers').all();
    for (const d of dossiers) {
      sql += `INSERT INTO \`dossiers\` (\`id\`, \`title\`, \`coordinator\`, \`description\`, \`summary\`, \`cover_image\`, \`articles\`, \`is_vip_only\`, \`is_featured\`, \`category\`, \`magazine\`, \`label\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSqlVal(d.id)}, ${escapeSqlVal(d.title)}, ${escapeSqlVal(d.coordinator)}, ${escapeSqlVal(d.description)}, ${escapeSqlVal(d.summary)}, ${escapeSqlVal(d.cover_image)}, ${escapeSqlVal(d.articles)}, ${escapeSqlVal(d.is_vip_only)}, ${escapeSqlVal(d.is_featured)}, ${escapeSqlVal(d.category)}, ${escapeSqlVal(d.magazine)}, ${escapeSqlVal(d.label)}, ${escapeSqlVal(d.status)}, ${escapeSqlVal(d.created_at)}, ${escapeSqlVal(d.updated_at)});\n`;
    }

    // 8. Today Page Config
    sql += `\n-- 8. Today Page Config\nDROP TABLE IF EXISTS \`today_page_config\`;\nCREATE TABLE \`today_page_config\` (\n  \`id\` VARCHAR(50) NOT NULL DEFAULT 'main',\n  \`hero\` LONGTEXT DEFAULT NULL,\n  \`filters\` LONGTEXT DEFAULT NULL,\n  \`news_items\` LONGTEXT DEFAULT NULL,\n  \`editorial\` LONGTEXT DEFAULT NULL,\n  \`values_list\` LONGTEXT DEFAULT NULL,\n  \`france\` LONGTEXT DEFAULT NULL,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const todayConfig = db.prepare('SELECT * FROM today_page_config').all();
    for (const t of todayConfig) {
      sql += `INSERT INTO \`today_page_config\` (\`id\`, \`hero\`, \`filters\`, \`news_items\`, \`editorial\`, \`values_list\`, \`france\`, \`updated_at\`) VALUES (${escapeSqlVal(t.id)}, ${escapeSqlVal(t.hero)}, ${escapeSqlVal(t.filters)}, ${escapeSqlVal(t.news_items)}, ${escapeSqlVal(t.editorial)}, ${escapeSqlVal(t.values_list)}, ${escapeSqlVal(t.france)}, ${escapeSqlVal(t.updated_at)});\n`;
    }

    // 9. Settings
    sql += `\n-- 9. Settings\nDROP TABLE IF EXISTS \`settings\`;\nCREATE TABLE \`settings\` (\n  \`key\` VARCHAR(100) NOT NULL,\n  \`value\` LONGTEXT DEFAULT NULL,\n  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (\`key\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    const settings = db.prepare('SELECT * FROM settings').all();
    for (const s of settings) {
      sql += `INSERT INTO \`settings\` (\`key\`, \`value\`, \`updated_at\`) VALUES (${escapeSqlVal(s.key)}, ${escapeSqlVal(s.value)}, ${escapeSqlVal(s.updated_at)});\n`;
    }

    sql += `\nSET FOREIGN_KEY_CHECKS = 1;\nCOMMIT;\n`;

    writeAtomicSync(outputPath, sql, 'utf8');
    return sql;
  } catch (e) {
    console.error('Error during SQL export:', e);
    return '';
  }
}


// -------------------------------------------------------------
// Media Usage & Orphan Protection
// -------------------------------------------------------------
export function dbFindMediaUsage(mediaUrl) {
  if (!mediaUrl) return { inUse: false, count: 0, usages: [] };
  const db = getDatabase();
  const usages = [];

  // Normalize search targets (e.g. "/assets/core/uploads/img.jpg" or "img.jpg")
  const fileName = path.basename(mediaUrl);

  // 1. Check Articles
  const articles = db.prepare('SELECT id, title, slug, cover_image, image, article_gallery, content FROM articles').all();
  for (const a of articles) {
    let matched = false;
    let location = [];

    if (a.cover_image && (a.cover_image.includes(mediaUrl) || a.cover_image.includes(fileName))) {
      matched = true;
      location.push('Image de couverture');
    }
    if (a.image && (a.image.includes(mediaUrl) || a.image.includes(fileName))) {
      matched = true;
      location.push('Image principale');
    }
    if (a.article_gallery && (a.article_gallery.includes(mediaUrl) || a.article_gallery.includes(fileName))) {
      matched = true;
      location.push('Galerie photo');
    }
    if (a.content && (a.content.includes(mediaUrl) || a.content.includes(fileName))) {
      matched = true;
      location.push('Contenu éditorial');
    }

    if (matched) {
      usages.push({
        type: 'Article',
        id: a.id,
        title: a.title || 'Article sans titre',
        url: `/magazines/magazine-01-intelligence/articles/${a.slug || a.id}`,
        locations: location
      });
    }
  }

  // 2. Check Magazines
  const magazines = db.prepare('SELECT slug, title, hero_image, essence_image FROM magazines').all();
  for (const m of magazines) {
    let matched = false;
    let location = [];

    if (m.hero_image && (m.hero_image.includes(mediaUrl) || m.hero_image.includes(fileName))) {
      matched = true;
      location.push('Image Hero');
    }
    if (m.essence_image && (m.essence_image.includes(mediaUrl) || m.essence_image.includes(fileName))) {
      matched = true;
      location.push('Image Essence');
    }

    if (matched) {
      usages.push({
        type: 'Magazine',
        id: m.slug,
        title: m.title || m.slug,
        url: `/magazines/${m.slug}`,
        locations: location
      });
    }
  }

  // 3. Check Dossiers
  const dossiers = db.prepare('SELECT id, title, cover_image FROM dossiers').all();
  for (const d of dossiers) {
    if (d.cover_image && (d.cover_image.includes(mediaUrl) || d.cover_image.includes(fileName))) {
      usages.push({
        type: 'Dossier',
        id: d.id,
        title: d.title || 'Dossier spécial',
        locations: ['Couverture dossier']
      });
    }
  }

  // 4. Check Videos
  const videos = db.prepare('SELECT id, title, thumbnail_url FROM videos').all();
  for (const v of videos) {
    if (v.thumbnail_url && (v.thumbnail_url.includes(mediaUrl) || v.thumbnail_url.includes(fileName))) {
      usages.push({
        type: 'Vidéo',
        id: v.id,
        title: v.title || 'Vidéo',
        locations: ['Miniature vidéo']
      });
    }
  }

  // 5. Check Today Page Config
  const todayRow = db.prepare('SELECT * FROM today_page_config WHERE id = ?').get('main');
  if (todayRow) {
    const raw = JSON.stringify(todayRow);
    if (raw.includes(mediaUrl) || raw.includes(fileName)) {
      usages.push({
        type: 'Page Today',
        id: 'main',
        title: 'Configuration Page Today (Hero / Édito)',
        locations: ['Section Today']
      });
    }
  }

  return {
    inUse: usages.length > 0,
    count: usages.length,
    usages
  };
}

export function dbReplaceMediaUrl(oldUrl, newUrl = '/assets/core/img/mag_hero_03.png') {
  if (!oldUrl) return { affected: 0 };
  const db = getDatabase();
  const fileName = path.basename(oldUrl);
  let affected = 0;

  // 1. Replace in Articles
  const articles = db.prepare('SELECT id, cover_image, image, article_gallery, content FROM articles').all();
  for (const a of articles) {
    let changed = false;
    let newCover = a.cover_image;
    let newImg = a.image;
    let newGallery = a.article_gallery;
    let newContent = a.content;

    if (newCover && (newCover.includes(oldUrl) || newCover.includes(fileName))) {
      newCover = newUrl;
      changed = true;
    }
    if (newImg && (newImg.includes(oldUrl) || newImg.includes(fileName))) {
      newImg = newUrl;
      changed = true;
    }
    if (newGallery && (newGallery.includes(oldUrl) || newGallery.includes(fileName))) {
      newGallery = newGallery.replaceAll(oldUrl, newUrl).replaceAll(fileName, path.basename(newUrl));
      changed = true;
    }
    if (newContent && (newContent.includes(oldUrl) || newContent.includes(fileName))) {
      newContent = newContent.replaceAll(oldUrl, newUrl).replaceAll(fileName, path.basename(newUrl));
      changed = true;
    }

    if (changed) {
      db.prepare('UPDATE articles SET cover_image = ?, image = ?, article_gallery = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newCover, newImg, newGallery, newContent, a.id);
      
      liveSyncXampp('UPDATE articles SET cover_image = ?, image = ?, article_gallery = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newCover, newImg, newGallery, newContent, a.id]);
      
      affected++;
    }
  }

  // 2. Replace in Magazines
  const magazines = db.prepare('SELECT slug, hero_image, essence_image FROM magazines').all();
  for (const m of magazines) {
    let changed = false;
    let newHero = m.hero_image;
    let newEssence = m.essence_image;

    if (newHero && (newHero.includes(oldUrl) || newHero.includes(fileName))) {
      newHero = newUrl;
      changed = true;
    }
    if (newEssence && (newEssence.includes(oldUrl) || newEssence.includes(fileName))) {
      newEssence = newUrl;
      changed = true;
    }

    if (changed) {
      db.prepare('UPDATE magazines SET hero_image = ?, essence_image = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
        .run(newHero, newEssence, m.slug);
      
      liveSyncXampp('UPDATE magazines SET hero_image = ?, essence_image = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?',
        [newHero, newEssence, m.slug]);
      
      affected++;
    }
  }

  // 3. Replace in Dossiers
  const dossiers = db.prepare('SELECT id, cover_image FROM dossiers').all();
  for (const d of dossiers) {
    if (d.cover_image && (d.cover_image.includes(oldUrl) || d.cover_image.includes(fileName))) {
      db.prepare('UPDATE dossiers SET cover_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newUrl, d.id);
      liveSyncXampp('UPDATE dossiers SET cover_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newUrl, d.id]);
      affected++;
    }
  }

  // 4. Replace in Videos
  const videos = db.prepare('SELECT id, thumbnail_url FROM videos').all();
  for (const v of videos) {
    if (v.thumbnail_url && (v.thumbnail_url.includes(oldUrl) || v.thumbnail_url.includes(fileName))) {
      db.prepare('UPDATE videos SET thumbnail_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newUrl, v.id);
      liveSyncXampp('UPDATE videos SET thumbnail_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newUrl, v.id]);
      affected++;
    }
  }

  // Auto export
  try { exportDatabaseToSqlFile(); } catch (e) {}

  return { affected };
}
