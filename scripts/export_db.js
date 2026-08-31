const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${str}'`;
}

function generateSqlDump() {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'lib', 'dona.db');
  const outputPath = path.join(process.cwd(), 'dona_database_export.sql');

  if (!fs.existsSync(dbPath)) {
    console.error('Database file not found at:', dbPath);
    return '';
  }

  const db = new DatabaseSync(dbPath);

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

-- -------------------------------------------------------
-- 1. Table structure for \`users\`
-- -------------------------------------------------------
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
  if (users.length > 0) {
    sql += `-- Dumping data for table \`users\` (${users.length} records)\n`;
    for (const u of users) {
      sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`status\`, \`plan\`, \`phone\`, \`last_login\`, \`avatar\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.password)}, ${escapeSql(u.role)}, ${escapeSql(u.status)}, ${escapeSql(u.plan)}, ${escapeSql(u.phone)}, ${escapeSql(u.last_login)}, ${escapeSql(u.avatar)}, ${escapeSql(u.created_at)}, ${escapeSql(u.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 2. Members
  sql += `-- -------------------------------------------------------
-- 2. Table structure for \`members\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`members\`;
CREATE TABLE \`members\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) DEFAULT NULL,
  \`avatar\` VARCHAR(500) DEFAULT NULL,
  \`plan\` VARCHAR(50) DEFAULT 'Essentiel',
  \`status\` VARCHAR(50) DEFAULT 'Active',
  \`joined\` VARCHAR(50) DEFAULT NULL,
  \`password\` VARCHAR(255) DEFAULT 'dona2026',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_members_email\` (\`email\`),
  KEY \`idx_members_plan\` (\`plan\`),
  KEY \`idx_members_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const members = db.prepare('SELECT * FROM members').all();
  if (members.length > 0) {
    sql += `-- Dumping data for table \`members\` (${members.length} records)\n`;
    for (const m of members) {
      sql += `INSERT INTO \`members\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`avatar\`, \`plan\`, \`status\`, \`joined\`, \`password\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSql(m.id)}, ${escapeSql(m.name)}, ${escapeSql(m.email)}, ${escapeSql(m.phone)}, ${escapeSql(m.avatar)}, ${escapeSql(m.plan)}, ${escapeSql(m.status)}, ${escapeSql(m.joined)}, ${escapeSql(m.password)}, ${escapeSql(m.created_at)}, ${escapeSql(m.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 3. Articles
  sql += `-- -------------------------------------------------------
-- 3. Table structure for \`articles\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`articles\`;
CREATE TABLE \`articles\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`slug\` VARCHAR(255) DEFAULT NULL,
  \`title\` VARCHAR(500) NOT NULL,
  \`author\` VARCHAR(255) DEFAULT 'Elena Moretti',
  \`category\` VARCHAR(255) DEFAULT '01. Intelligence',
  \`rubrique\` VARCHAR(255) DEFAULT 'The Brief',
  \`subcategory\` VARCHAR(255) DEFAULT 'The Brief',
  \`badge\` VARCHAR(100) DEFAULT 'ARTICLE',
  \`content\` LONGTEXT DEFAULT NULL,
  \`summary\` TEXT DEFAULT NULL,
  \`desc\` TEXT DEFAULT NULL,
  \`format\` VARCHAR(50) DEFAULT 'text',
  \`cover_image\` VARCHAR(500) DEFAULT NULL,
  \`image\` VARCHAR(500) DEFAULT NULL,
  \`article_gallery\` LONGTEXT DEFAULT NULL,
  \`video_url\` VARCHAR(500) DEFAULT NULL,
  \`audio_file\` VARCHAR(500) DEFAULT NULL,
  \`status\` VARCHAR(50) DEFAULT 'Published',
  \`is_vip_only\` TINYINT(1) DEFAULT 0,
  \`placement_target\` VARCHAR(100) DEFAULT 'STANDARD_FEED',
  \`meta\` VARCHAR(500) DEFAULT NULL,
  \`updated\` VARCHAR(100) DEFAULT 'RÉCENT',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_articles_category\` (\`category\`),
  KEY \`idx_articles_status\` (\`status\`),
  KEY \`idx_articles_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const articles = db.prepare('SELECT * FROM articles').all();
  if (articles.length > 0) {
    sql += `-- Dumping data for table \`articles\` (${articles.length} records)\n`;
    for (const a of articles) {
      sql += `INSERT INTO \`articles\` (\`id\`, \`slug\`, \`title\`, \`author\`, \`category\`, \`rubrique\`, \`subcategory\`, \`badge\`, \`content\`, \`summary\`, \`desc\`, \`format\`, \`cover_image\`, \`image\`, \`article_gallery\`, \`video_url\`, \`audio_file\`, \`status\`, \`is_vip_only\`, \`placement_target\`, \`meta\`, \`updated\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSql(a.id)}, ${escapeSql(a.slug)}, ${escapeSql(a.title)}, ${escapeSql(a.author)}, ${escapeSql(a.category)}, ${escapeSql(a.rubrique)}, ${escapeSql(a.subcategory)}, ${escapeSql(a.badge)}, ${escapeSql(a.content)}, ${escapeSql(a.summary)}, ${escapeSql(a.desc)}, ${escapeSql(a.format)}, ${escapeSql(a.cover_image)}, ${escapeSql(a.image)}, ${escapeSql(a.article_gallery)}, ${escapeSql(a.video_url)}, ${escapeSql(a.audio_file)}, ${escapeSql(a.status)}, ${escapeSql(a.is_vip_only)}, ${escapeSql(a.placement_target)}, ${escapeSql(a.meta)}, ${escapeSql(a.updated)}, ${escapeSql(a.created_at)}, ${escapeSql(a.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 4. Magazines
  sql += `-- -------------------------------------------------------
-- 4. Table structure for \`magazines\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`magazines\`;
CREATE TABLE \`magazines\` (
  \`id\` INT DEFAULT NULL,
  \`slug\` VARCHAR(255) NOT NULL,
  \`title\` VARCHAR(255) DEFAULT NULL,
  \`subtitle\` VARCHAR(500) DEFAULT NULL,
  \`desc\` TEXT DEFAULT NULL,
  \`theme_primary\` VARCHAR(50) DEFAULT '#a31835',
  \`theme_secondary\` VARCHAR(50) DEFAULT '#3d0c1b',
  \`gradient\` VARCHAR(500) DEFAULT NULL,
  \`hero_image\` VARCHAR(500) DEFAULT NULL,
  \`essence_image\` VARCHAR(500) DEFAULT NULL,
  \`hero_buttons\` LONGTEXT DEFAULT NULL,
  \`essence_title\` VARCHAR(255) DEFAULT NULL,
  \`tabs\` LONGTEXT DEFAULT NULL,
  \`sections\` LONGTEXT DEFAULT NULL,
  \`rubriques\` LONGTEXT DEFAULT NULL,
  \`config_data\` LONGTEXT DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const magazines = db.prepare('SELECT * FROM magazines').all();
  if (magazines.length > 0) {
    sql += `-- Dumping data for table \`magazines\` (${magazines.length} records)\n`;
    for (const m of magazines) {
      sql += `INSERT INTO \`magazines\` (\`id\`, \`slug\`, \`title\`, \`subtitle\`, \`desc\`, \`theme_primary\`, \`theme_secondary\`, \`gradient\`, \`hero_image\`, \`essence_image\`, \`hero_buttons\`, \`essence_title\`, \`tabs\`, \`sections\`, \`rubriques\`, \`config_data\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSql(m.id)}, ${escapeSql(m.slug)}, ${escapeSql(m.title)}, ${escapeSql(m.subtitle)}, ${escapeSql(m.desc)}, ${escapeSql(m.theme_primary)}, ${escapeSql(m.theme_secondary)}, ${escapeSql(m.gradient)}, ${escapeSql(m.hero_image)}, ${escapeSql(m.essence_image)}, ${escapeSql(m.hero_buttons)}, ${escapeSql(m.essence_title)}, ${escapeSql(m.tabs)}, ${escapeSql(m.sections)}, ${escapeSql(m.rubriques)}, ${escapeSql(m.config_data)}, ${escapeSql(m.created_at)}, ${escapeSql(m.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 5. Videos
  sql += `-- -------------------------------------------------------
-- 5. Table structure for \`videos\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`videos\`;
CREATE TABLE \`videos\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`title\` VARCHAR(500) NOT NULL,
  \`subtitle\` VARCHAR(500) DEFAULT NULL,
  \`category\` VARCHAR(255) DEFAULT 'Culture',
  \`magazine\` VARCHAR(255) DEFAULT NULL,
  \`label\` VARCHAR(100) DEFAULT 'VIDÉO',
  \`duration\` VARCHAR(50) DEFAULT NULL,
  \`is_vip_only\` TINYINT(1) DEFAULT 0,
  \`is_hd\` TINYINT(1) DEFAULT 0,
  \`is_featured\` TINYINT(1) DEFAULT 0,
  \`is_replay\` TINYINT(1) DEFAULT 0,
  \`source\` VARCHAR(50) DEFAULT 'url',
  \`video_url\` VARCHAR(500) DEFAULT NULL,
  \`thumbnail_url\` VARCHAR(500) DEFAULT NULL,
  \`published_at\` DATETIME DEFAULT NULL,
  \`status\` VARCHAR(50) DEFAULT 'Draft',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_videos_category\` (\`category\`),
  KEY \`idx_videos_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const videos = db.prepare('SELECT * FROM videos').all();
  if (videos.length > 0) {
    sql += `-- Dumping data for table \`videos\` (${videos.length} records)\n`;
    for (const v of videos) {
      sql += `INSERT INTO \`videos\` (\`id\`, \`title\`, \`subtitle\`, \`category\`, \`magazine\`, \`label\`, \`duration\`, \`is_vip_only\`, \`is_hd\`, \`is_featured\`, \`is_replay\`, \`source\`, \`video_url\`, \`thumbnail_url\`, \`published_at\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSql(v.id)}, ${escapeSql(v.title)}, ${escapeSql(v.subtitle)}, ${escapeSql(v.category)}, ${escapeSql(v.magazine)}, ${escapeSql(v.label)}, ${escapeSql(v.duration)}, ${escapeSql(v.is_vip_only)}, ${escapeSql(v.is_hd)}, ${escapeSql(v.is_featured)}, ${escapeSql(v.is_replay)}, ${escapeSql(v.source)}, ${escapeSql(v.video_url)}, ${escapeSql(v.thumbnail_url)}, ${escapeSql(v.published_at)}, ${escapeSql(v.status)}, ${escapeSql(v.created_at)}, ${escapeSql(v.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 6. TV Live
  sql += `-- -------------------------------------------------------
-- 6. Table structure for \`tv_live\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`tv_live\`;
CREATE TABLE \`tv_live\` (
  \`id\` VARCHAR(50) NOT NULL DEFAULT 'main',
  \`is_live\` TINYINT(1) DEFAULT 0,
  \`stream_url\` VARCHAR(500) DEFAULT NULL,
  \`hls_url\` VARCHAR(500) DEFAULT NULL,
  \`current_title\` VARCHAR(255) DEFAULT NULL,
  \`current_subtitle\` VARCHAR(255) DEFAULT NULL,
  \`current_guest\` VARCHAR(255) DEFAULT NULL,
  \`format\` VARCHAR(100) DEFAULT NULL,
  \`location\` VARCHAR(255) DEFAULT NULL,
  \`epg\` LONGTEXT DEFAULT NULL,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const tvLive = db.prepare('SELECT * FROM tv_live').all();
  if (tvLive.length > 0) {
    sql += `-- Dumping data for table \`tv_live\`\n`;
    for (const t of tvLive) {
      sql += `INSERT INTO \`tv_live\` (\`id\`, \`is_live\`, \`stream_url\`, \`hls_url\`, \`current_title\`, \`current_subtitle\`, \`current_guest\`, \`format\`, \`location\`, \`epg\`, \`updated_at\`) VALUES (${escapeSql(t.id)}, ${escapeSql(t.is_live)}, ${escapeSql(t.stream_url)}, ${escapeSql(t.hls_url)}, ${escapeSql(t.current_title)}, ${escapeSql(t.current_subtitle)}, ${escapeSql(t.current_guest)}, ${escapeSql(t.format)}, ${escapeSql(t.location)}, ${escapeSql(t.epg)}, ${escapeSql(t.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 7. Dossiers
  sql += `-- -------------------------------------------------------
-- 7. Table structure for \`dossiers\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`dossiers\`;
CREATE TABLE \`dossiers\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`title\` VARCHAR(500) NOT NULL,
  \`coordinator\` VARCHAR(255) DEFAULT 'Hélène de Ségur',
  \`description\` LONGTEXT DEFAULT NULL,
  \`summary\` TEXT DEFAULT NULL,
  \`cover_image\` VARCHAR(500) DEFAULT NULL,
  \`articles\` LONGTEXT DEFAULT NULL,
  \`is_vip_only\` TINYINT(1) DEFAULT 0,
  \`is_featured\` TINYINT(1) DEFAULT 0,
  \`category\` VARCHAR(255) DEFAULT 'Analyses & Enquêtes',
  \`magazine\` VARCHAR(255) DEFAULT NULL,
  \`label\` VARCHAR(100) DEFAULT 'DOSSIER SPÉCIAL',
  \`status\` VARCHAR(50) DEFAULT 'Published',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const dossiers = db.prepare('SELECT * FROM dossiers').all();
  if (dossiers.length > 0) {
    sql += `-- Dumping data for table \`dossiers\` (${dossiers.length} records)\n`;
    for (const d of dossiers) {
      sql += `INSERT INTO \`dossiers\` (\`id\`, \`title\`, \`coordinator\`, \`description\`, \`summary\`, \`cover_image\`, \`articles\`, \`is_vip_only\`, \`is_featured\`, \`category\`, \`magazine\`, \`label\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES (${escapeSql(d.id)}, ${escapeSql(d.title)}, ${escapeSql(d.coordinator)}, ${escapeSql(d.description)}, ${escapeSql(d.summary)}, ${escapeSql(d.cover_image)}, ${escapeSql(d.articles)}, ${escapeSql(d.is_vip_only)}, ${escapeSql(d.is_featured)}, ${escapeSql(d.category)}, ${escapeSql(d.magazine)}, ${escapeSql(d.label)}, ${escapeSql(d.status)}, ${escapeSql(d.created_at)}, ${escapeSql(d.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 8. Today Page Config
  sql += `-- -------------------------------------------------------
-- 8. Table structure for \`today_page_config\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`today_page_config\`;
CREATE TABLE \`today_page_config\` (
  \`id\` VARCHAR(50) NOT NULL DEFAULT 'main',
  \`hero\` LONGTEXT DEFAULT NULL,
  \`filters\` LONGTEXT DEFAULT NULL,
  \`news_items\` LONGTEXT DEFAULT NULL,
  \`editorial\` LONGTEXT DEFAULT NULL,
  \`values_list\` LONGTEXT DEFAULT NULL,
  \`france\` LONGTEXT DEFAULT NULL,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const todayConfig = db.prepare('SELECT * FROM today_page_config').all();
  if (todayConfig.length > 0) {
    sql += `-- Dumping data for table \`today_page_config\`\n`;
    for (const t of todayConfig) {
      sql += `INSERT INTO \`today_page_config\` (\`id\`, \`hero\`, \`filters\`, \`news_items\`, \`editorial\`, \`values_list\`, \`france\`, \`updated_at\`) VALUES (${escapeSql(t.id)}, ${escapeSql(t.hero)}, ${escapeSql(t.filters)}, ${escapeSql(t.news_items)}, ${escapeSql(t.editorial)}, ${escapeSql(t.values_list)}, ${escapeSql(t.france)}, ${escapeSql(t.updated_at)});\n`;
    }
    sql += '\n';
  }

  // 9. Settings
  sql += `-- -------------------------------------------------------
-- 9. Table structure for \`settings\`
-- -------------------------------------------------------
DROP TABLE IF EXISTS \`settings\`;
CREATE TABLE \`settings\` (
  \`key\` VARCHAR(100) NOT NULL,
  \`value\` LONGTEXT DEFAULT NULL,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  const settings = db.prepare('SELECT * FROM settings').all();
  if (settings.length > 0) {
    sql += `-- Dumping data for table \`settings\` (${settings.length} records)\n`;
    for (const s of settings) {
      sql += `INSERT INTO \`settings\` (\`key\`, \`value\`, \`updated_at\`) VALUES (${escapeSql(s.key)}, ${escapeSql(s.value)}, ${escapeSql(s.updated_at)});\n`;
    }
    sql += '\n';
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
`;

  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log('SQL Export successfully created at:', outputPath);
  console.log('Total users exported:', users.length);
  console.log('Total members exported:', members.length);
  console.log('Total articles exported:', articles.length);
  console.log('Total magazines exported:', magazines.length);
  console.log('Total videos exported:', videos.length);
  console.log('Total dossiers exported:', dossiers.length);
  console.log('Total settings exported:', settings.length);

  return sql;
}

if (require.main === module) {
  generateSqlDump();
}

module.exports = { generateSqlDump };
