const mysql = require('mysql2/promise');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

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
    console.error('Failed to create MySQL pool:', e.message);
    return null;
  }
}

async function syncAllToXampp() {
  const dbPath = path.join(process.cwd(), 'lib', 'dona.db');
  const sqliteDb = new DatabaseSync(dbPath);
  
  const pool = getMysqlPool();
  if (!pool) return;

  const conn = await pool.getConnection();
  try {
    // 1. Sync Users
    const users = sqliteDb.prepare('SELECT * FROM users').all();
    for (const u of users) {
      await conn.query(`
        INSERT INTO users (id, name, email, password, role, status, plan, phone, last_login, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password = VALUES(password),
          role = VALUES(role),
          status = VALUES(status),
          plan = VALUES(plan),
          phone = VALUES(phone),
          last_login = VALUES(last_login),
          avatar = VALUES(avatar)
      `, [u.id, u.name, u.email, u.password, u.role, u.status, u.plan, u.phone, u.last_login, u.avatar]);
    }

    // 2. Sync Members
    const members = sqliteDb.prepare('SELECT * FROM members').all();
    for (const m of members) {
      await conn.query(`
        INSERT INTO members (id, name, email, phone, avatar, plan, status, joined, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          phone = VALUES(phone),
          avatar = VALUES(avatar),
          plan = VALUES(plan),
          status = VALUES(status),
          joined = VALUES(joined),
          password = VALUES(password)
      `, [m.id, m.name, m.email, m.phone, m.avatar, m.plan, m.status, m.joined, m.password]);
    }

    // 3. Sync Articles
    const articles = sqliteDb.prepare('SELECT * FROM articles').all();
    for (const a of articles) {
      await conn.query(`
        INSERT INTO articles (id, slug, title, author, category, rubrique, subcategory, badge, content, summary, \`desc\`, format, cover_image, image, article_gallery, video_url, audio_file, status, is_vip_only, placement_target, meta, updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug = VALUES(slug),
          title = VALUES(title),
          author = VALUES(author),
          category = VALUES(category),
          rubrique = VALUES(rubrique),
          subcategory = VALUES(subcategory),
          badge = VALUES(badge),
          content = VALUES(content),
          summary = VALUES(summary),
          \`desc\` = VALUES(\`desc\`),
          format = VALUES(format),
          cover_image = VALUES(cover_image),
          image = VALUES(image),
          article_gallery = VALUES(article_gallery),
          video_url = VALUES(video_url),
          audio_file = VALUES(audio_file),
          status = VALUES(status),
          is_vip_only = VALUES(is_vip_only),
          placement_target = VALUES(placement_target),
          meta = VALUES(meta),
          updated = VALUES(updated)
      `, [a.id, a.slug, a.title, a.author, a.category, a.rubrique, a.subcategory, a.badge, a.content, a.summary, a.desc, a.format, a.cover_image, a.image, a.article_gallery, a.video_url, a.audio_file, a.status, a.is_vip_only, a.placement_target, a.meta, a.updated]);
    }

    // 4. Sync Magazines
    const magazines = sqliteDb.prepare('SELECT * FROM magazines').all();
    for (const m of magazines) {
      await conn.query(`
        INSERT INTO magazines (id, slug, title, subtitle, \`desc\`, theme_primary, theme_secondary, gradient, hero_image, essence_image, hero_buttons, essence_title, tabs, sections, rubriques, config_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id = VALUES(id),
          title = VALUES(title),
          subtitle = VALUES(subtitle),
          \`desc\` = VALUES(\`desc\`),
          theme_primary = VALUES(theme_primary),
          theme_secondary = VALUES(theme_secondary),
          gradient = VALUES(gradient),
          hero_image = VALUES(hero_image),
          essence_image = VALUES(essence_image),
          hero_buttons = VALUES(hero_buttons),
          essence_title = VALUES(essence_title),
          tabs = VALUES(tabs),
          sections = VALUES(sections),
          rubriques = VALUES(rubriques),
          config_data = VALUES(config_data)
      `, [m.id, m.slug, m.title, m.subtitle, m.desc, m.theme_primary, m.theme_secondary, m.gradient, m.hero_image, m.essence_image, m.hero_buttons, m.essence_title, m.tabs, m.sections, m.rubriques, m.config_data]);
    }

    // 5. Sync Videos
    const videos = sqliteDb.prepare('SELECT * FROM videos').all();
    for (const v of videos) {
      await conn.query(`
        INSERT INTO videos (id, title, subtitle, category, magazine, label, duration, is_vip_only, is_hd, is_featured, is_replay, source, video_url, thumbnail_url, published_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          subtitle = VALUES(subtitle),
          category = VALUES(category),
          magazine = VALUES(magazine),
          label = VALUES(label),
          duration = VALUES(duration),
          is_vip_only = VALUES(is_vip_only),
          is_hd = VALUES(is_hd),
          is_featured = VALUES(is_featured),
          is_replay = VALUES(is_replay),
          source = VALUES(source),
          video_url = VALUES(video_url),
          thumbnail_url = VALUES(thumbnail_url),
          published_at = VALUES(published_at),
          status = VALUES(status)
      `, [v.id, v.title, v.subtitle, v.category, v.magazine, v.label, v.duration, v.is_vip_only, v.is_hd, v.is_featured, v.is_replay, v.source, v.video_url, v.thumbnail_url, v.published_at, v.status]);
    }

    // 6. Sync TV Live
    const tvLive = sqliteDb.prepare('SELECT * FROM tv_live').all();
    for (const t of tvLive) {
      await conn.query(`
        INSERT INTO tv_live (id, is_live, stream_url, hls_url, current_title, current_subtitle, current_guest, format, location, epg)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          is_live = VALUES(is_live),
          stream_url = VALUES(stream_url),
          hls_url = VALUES(hls_url),
          current_title = VALUES(current_title),
          current_subtitle = VALUES(current_subtitle),
          current_guest = VALUES(current_guest),
          format = VALUES(format),
          location = VALUES(location),
          epg = VALUES(epg)
      `, [t.id, t.is_live, t.stream_url, t.hls_url, t.current_title, t.current_subtitle, t.current_guest, t.format, t.location, t.epg]);
    }

    // 7. Sync Dossiers
    const dossiers = sqliteDb.prepare('SELECT * FROM dossiers').all();
    for (const d of dossiers) {
      await conn.query(`
        INSERT INTO dossiers (id, title, coordinator, description, summary, cover_image, articles, is_vip_only, is_featured, category, magazine, label, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          coordinator = VALUES(coordinator),
          description = VALUES(description),
          summary = VALUES(summary),
          cover_image = VALUES(cover_image),
          articles = VALUES(articles),
          is_vip_only = VALUES(is_vip_only),
          is_featured = VALUES(is_featured),
          category = VALUES(category),
          magazine = VALUES(magazine),
          label = VALUES(label),
          status = VALUES(status)
      `, [d.id, d.title, d.coordinator, d.description, d.summary, d.cover_image, d.articles, d.is_vip_only, d.is_featured, d.category, d.magazine, d.label, d.status]);
    }

    // 8. Sync Today Page Config
    const todayConfig = sqliteDb.prepare('SELECT * FROM today_page_config').all();
    for (const t of todayConfig) {
      await conn.query(`
        INSERT INTO today_page_config (id, hero, filters, news_items, editorial, values_list, france)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          hero = VALUES(hero),
          filters = VALUES(filters),
          news_items = VALUES(news_items),
          editorial = VALUES(editorial),
          values_list = VALUES(values_list),
          france = VALUES(france)
      `, [t.id, t.hero, t.filters, t.news_items, t.editorial, t.values_list, t.france]);
    }

    // 9. Sync Settings
    const settings = sqliteDb.prepare('SELECT * FROM settings').all();
    for (const s of settings) {
      await conn.query(`
        INSERT INTO settings (\`key\`, value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          value = VALUES(value)
      `, [s.key, s.value]);
    }

    console.log('Successfully synced all 9 tables directly into live XAMPP MySQL!');
  } finally {
    conn.release();
  }
}

// Helper to execute a query on XAMPP MySQL asynchronously in the background
async function executeOnXampp(sql, params = []) {
  try {
    const pool = getMysqlPool();
    if (!pool) return;
    await pool.query(sql, params);
  } catch (err) {
    console.warn('[XAMPP MySQL live sync notice]:', err.message);
  }
}

if (require.main === module) {
  syncAllToXampp()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { syncAllToXampp, executeOnXampp };
