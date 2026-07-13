# Matrice de Configuration Dynamique (Next.js & Base de Données)

Ce document dissèque les composants Front-End de Dona Magazine et définit le modèle de données associé pour permettre un contrôle total depuis l'interface d'administration (Back-End).

---

## 1. Configuration de l'Enveloppe Globale (Global Shell)
Cette section gère les éléments récurrents affichés sur l'ensemble du site (Header, Footer, Thèmes globaux).

### Composant : En-tête (`Header.jsx`)
- **Logo du Site** :
  - Champ : `site_logo_path` (VARCHAR) -> Chemin de l'image (ex: `/assets/core/img/logo.png`).
  - Champ : `site_logo_alt` (VARCHAR) -> Texte alternatif du logo (ex: `DONA Magazine`).
- **Liens de Navigation Principale** :
  - Table : `navigation_links`
    - `id` (INT, PK)
    - `label` (VARCHAR) -> Texte du lien (ex: `TODAY`, `NOS MAGAZINES`, `STUDIO`, `CLUB`, `ÉCOUTER`, `JEUX`).
    - `href` (VARCHAR) -> Route de destination (ex: `/today`, `/magazines`, `/studio`, `/club`, `/ecouter`, `/jeux`).
    - `order_index` (INT) -> Position d'affichage pour le tri.
    - `is_active` (BOOLEAN) -> Activation/Désactivation à la volée.
    - `has_submenu` (BOOLEAN) -> Indicateur de méga-menu associé.
- **Bouton d'Appel à l'Action Principal (CTA d'Abonnement)** :
  - Champ : `header_cta_text` (VARCHAR) -> Texte du bouton (ex: `S'ABONNER`).
  - Champ : `header_cta_link` (VARCHAR) -> Lien de destination (ex: `/abonnement`).
- **Thématique & Style** :
  - Champ : `active_theme_crimson_hex` (VARCHAR) -> Code couleur hexadécimal de l'accent Crimson de la marque (ex: `#A30626`).

---

## 2. Configuration de la Page d'Accueil & Identité Visuelle
Cette section configure les textes et les projecteurs de la page de garde (`page.js` de l'accueil).

### Composant : Vue Hero / Landing Viewport
- **Typographie et Textes Hero** :
  - Champ : `home_hero_title` (VARCHAR) -> Titre géant (ex: `DONA MAGAZINE`).
  - Champ : `home_hero_kicker` (VARCHAR) -> Texte chapeau en petites capitales (ex: `Plateforme éditoriale exclusive`).
  - Champ : `home_hero_description` (TEXT) -> Paragraphe d'introduction principal (ex: `Un espace dédié à l'excellence éditoriale...`).
- **Projecteur d'Édition Spéciale (Spotlight Volume)** :
  - Champ : `spotlight_magazine_id` (INT, FK) -> Référence vers l'ID du magazine mis à la Une (ex: ID relié à `Intelligence` ou `Power Lab`).
- **Footer Légal et Institutionnel** :
  - Champ : `footer_copyright_text` (VARCHAR) -> Droits d'auteur (ex: `© 2026 DONA Magazine. Tous droits réservés.`).
  - Champ : `footer_address_text` (VARCHAR) -> Adresse physique du siège.
  - Champ : `footer_background_watermark` (VARCHAR) -> Texte géant en filigrane (ex: `DONA.`).

---

## 3. Configuration des Modules Métiers (Core Modules)

### A. Nos Magazines (`/magazines`)
Chaque magazine (univers) et ses éléments associés (features, articles parus, outils exclusifs) doivent être paramétrables.

#### Table : `magazines`
Contient la configuration des 16 univers.
- `id` (INT, PK)
- `slug` (VARCHAR, UNIQUE) -> Identifiant d'URL unique (ex: `magazine-01-intelligence`).
- `title` (VARCHAR) -> Nom de l'univers (ex: `Intelligence`).
- `subtitle` (VARCHAR) -> Slogan thématique (ex: `Savoir & Décision`).
- `description` (TEXT) -> Résumé pour la carte de la grille.
- `theme_primary` (VARCHAR) -> Couleur primaire thématique (ex: `#a31835`).
- `theme_secondary` (VARCHAR) -> Couleur secondaire thématique (ex: `#3d0c1b`).
- `gradient_css` (VARCHAR) -> Dégradé CSS personnalisé (ex: `linear-gradient(135deg, #2b1126, #411d3d)`).
- `hero_image_path` (VARCHAR) -> Image d'en-tête de la page univers.
- `essence_image_path` (VARCHAR) -> Image du bloc "Essence" (présentation éditoriale).
- `essence_text` (TEXT) -> Texte éditorial principal rédigé par la direction de l'univers.
- `essence_quote` (TEXT) -> Citation éditoriale mise en avant.
- `icon_svg_raw` (TEXT) -> Code SVG brut pour l'icône dans la grille.
- `order_index` (INT) -> Position d'affichage dans le répertoire global.

#### Table : `magazine_features`
Blocs de fonctionnalités clés de chaque magazine (ex: "The Brief", "The Pulse").
- `id` (INT, PK)
- `magazine_id` (INT, FK) -> Référence vers `magazines(id)`.
- `title` (VARCHAR) -> Titre (ex: `The Brief`).
- `subtitle` (VARCHAR) -> Sous-titre (ex: `SYNTHÈSE QUOTIDIENNE STRATÉGIQUE`).
- `meta` (VARCHAR) -> Métadonnées (ex: `EST. 2024 • 08:00 CET`).
- `icon_name` (VARCHAR) -> Nom de l'icône Material Symbol (ex: `assignment`).

#### Table : `articles`
Tous les articles du site, rattachés ou non à un magazine.
- `id` (VARCHAR, PK) -> Slug d'article unique (ex: `dunning-kruger-management`).
- `magazine_id` (INT, FK, NULLABLE) -> Référence vers `magazines(id)`.
- `title` (VARCHAR) -> Titre de l'article.
- `summary` (TEXT) -> Chapeau / Teaser de l'article.
- `badge_text` (VARCHAR) -> e.g. `DEEP-DIVE`, `TRENDS`, `VOICES`.
- `meta_text` (VARCHAR) -> e.g. `DR. ANTOINE MOREAU • 12 MIN DE LECTURE`.
- `image_path` (VARCHAR) -> Image d'illustration de l'article.
- `content_html` (TEXT) -> Corps complet de l'article (formate avec lettrine, blocs citations, etc.).
- `is_vip_only` (BOOLEAN) -> Si coché, l'article masque la fin du texte derrière le Paywall de souscription.
- `created_at` (TIMESTAMP) -> Date de publication.

#### Table : `magazine_tools`
Outils interactifs exclusifs liés à un magazine.
- `id` (INT, PK)
- `magazine_id` (INT, FK) -> Référence vers `magazines(id)`.
- `title` (VARCHAR) -> Nom de l'outil (ex: `Simulation ROI`).
- `description` (TEXT) -> Rôle et description.
- `icon_name` (VARCHAR) -> Icône Material Symbol.
- `tool_config_json` (JSON) -> Paramètres spécifiques à l'outil (formules, limites).

---

### B. Studio Médias (`/studio`)
Ce module pilote les diffusions en direct, les podcasts audio et les archives documentaires vidéo.

#### Table : `studio_live`
Configuration de la diffusion en direct (Zone 1).
- `id` (INT, PK)
- `is_active` (BOOLEAN) -> Indique si un live est en cours (affiche le badge clignotant).
- `title` (VARCHAR) -> Titre de la diffusion (ex: `The Global Intelligence Summit`).
- `subtitle` (TEXT) -> Descriptif ou résumé du direct.
- `featured_guest` (VARCHAR) -> Invité d'honneur (ex: `Jean Nouvel`).
- `broadcast_format` (VARCHAR) -> Format (ex: `Keynote · Q&A`).
- `location` (VARCHAR) -> Lieu de tournage (ex: `Grand Palais, Paris`).
- `stream_url` (VARCHAR) -> URL du flux audio/vidéo brut à injecter dans le player persistant.
- `background_image_path` (VARCHAR) -> Image de couverture du direct.

#### Table : `podcast_episodes`
Archives audio des podcasts (Zone 2).
- `id` (VARCHAR, PK) -> Identifiant de l'épisode (ex: `ep-42`).
- `title` (VARCHAR) -> Titre de l'épisode.
- `subtitle` (TEXT) -> Descriptif de l'épisode.
- `series_tag` (VARCHAR) -> Série d'appartenance (ex: `THE BRIEF`, `MASTERCLASS`, `INSIGHTS`).
- `episode_label` (VARCHAR) -> Numéro de l'épisode (ex: `ÉP. 42`).
- `duration` (VARCHAR) -> Durée textuelle (ex: `45 MIN`).
- `duration_seconds` (INT) -> Durée exacte en secondes (pour la progression du lecteur).
- `audio_url` (VARCHAR) -> Lien vers le fichier média (ex: `/assets/core/audio/ep42.mp3`).
- `created_at` (TIMESTAMP)

#### Table : `video_archives`
Archives documentaires vidéo (Zone 3).
- `id` (INT, PK)
- `title` (VARCHAR) -> Titre de la vidéo.
- `subtitle` (TEXT) -> Sous-titre ou description.
- `label_text` (VARCHAR) -> Type de vidéo (ex: `ÉVÉNEMENT`, `DOCUMENTAIRE`, `TABLE RONDE`, `PORTRAITS`).
- `duration` (VARCHAR) -> Durée affichée (ex: `1H 24MIN`).
- `is_featured` (BOOLEAN) -> Vrai pour s'afficher en grand à la Une de la grille vidéo.
- `video_url` (VARCHAR) -> Lien de la vidéo (MP4, YouTube, Vimeo, etc.).
- `thumbnail_path` (VARCHAR) -> Image miniature.

---

### C. Espace Jeux (`/jeux`)
Gère l'énigme du jour, les catégories de jeux, et le classement des membres.

#### Table : `games`
Les types de jeux disponibles dans le Cercle (Zone 1).
- `id` (VARCHAR, PK) -> e.g. `simulations`, `echecs`, `enigmes`.
- `category_name` (VARCHAR) -> e.g. `SIMULATIONS STRATÉGIQUES`.
- `title` (VARCHAR) -> Titre du jeu (ex: `Théorie des Jeux`).
- `subtitle` (TEXT) -> Courte description de l'activité.
- `badge_text` (VARCHAR) -> e.g. `NOUVEAU`, `VIP`, `EXPERT`.
- `meta_text` (VARCHAR) -> e.g. `12 Cas Actifs`.
- `icon_svg_raw` (TEXT) -> Code SVG géométrique de la carte.

#### Table : `daily_riddle`
L'Énigme active du jour affichée en Hero.
- `id` (INT, PK)
- `title` (VARCHAR) -> Titre de l'énigme (ex: `Le Labyrinthe des Ambitions`).
- `description` (TEXT) -> Énoncé ou teaser de l'énigme.
- `difficulty` (VARCHAR) -> Difficulté (ex: `Expert`).
- `average_time` (VARCHAR) -> Temps moyen de résolution (ex: `14 min`).
- `success_rate` (INT) -> Pourcentage de réussite (ex: `12`).
- `players_count` (INT) -> Compteur de joueurs (ex: `3842`).
- `riddle_url` (VARCHAR) -> Lien vers l'interface de résolution.

#### Table : `game_rankings`
Classement des membres du club (Leaderboard).
- `id` (INT, PK)
- `rank` (INT) -> Position (1, 2, 3, etc.).
- `player_name` (VARCHAR) -> Nom d'utilisateur/Pseudo.
- `city_country` (VARCHAR) -> Localisation (ex: `Paris, FR`).
- `score_points` (INT) -> Score global.
- `delta_points` (VARCHAR) -> Évolution récente (ex: `+145`).

#### Table : `tournament_config`
Configuration de la zone "Tournoi des Décideurs" (Zone Crimson).
- `id` (INT, PK)
- `title` (VARCHAR) -> Titre du tournoi.
- `subtitle` (TEXT) -> Description et incitation.
- `rules_json` (JSON) -> Liste ordonnée des règles (numéros, titres, descriptions).
- `cta_text` (VARCHAR) -> Bouton d'inscription (ex: `Rejoindre le Tournoi`).

---

## D. Espace Lecture (`/espace-lecture`)
Cette section centralise la bibliothèque numérique disponible pour les membres VIP.

#### Table : `library_documents`
- `id` (INT, PK)
- `doc_type` (ENUM) -> Type de document (`ARTICLE`, `CAHIER`, `WORKBOOK`).
- `title` (VARCHAR) -> Titre du document (ex: `DONA Magazine : Édition Spéciale Intelligence`).
- `meta_text` (VARCHAR) -> Métadonnées affichées (ex: `Magazine • N° 01 • Renseignements`).
- `cta_text` (VARCHAR) -> Texte du bouton d'action (ex: `Lire le magazine`, `Télécharger le PDF (4.2 MB)`).
- `cta_icon` (VARCHAR) -> Icône Material Symbol associée (ex: `arrow_forward`, `menu_book`, `download`).
- `cta_href` (VARCHAR) -> Lien ou chemin de l'action.
- `image_path` (VARCHAR, NULLABLE) -> Miniature de couverture (les Workbooks peuvent ne pas en avoir).
- `file_path` (VARCHAR, NULLABLE) -> Chemin physique du PDF téléchargeable.
- `order_index` (INT) -> Ordre de tri par défaut.

---

## 4. Système Core & Tables Métiers (Core System & Business Tables)
Cette section définit le moteur de sécurité, de facturation et d'engagement utilisateur de Dona Magazine.

### A. Couche d'Authentification (Authentication Layer - NextAuth.js)
Ces tables sont modélisées pour s'intégrer directement avec NextAuth.js pour la gestion des sessions locales (Email/Mot de passe) et des connexions tierces (OAuth via Apple et Google).

#### Table : `users`
Utilisateurs inscrits sur la plateforme.
- `id` (VARCHAR, PK) -> Identifiant UUID généré.
- `name` (VARCHAR) -> Nom complet de l'utilisateur.
- `email` (VARCHAR, UNIQUE) -> Adresse email de connexion.
- `email_verified` (TIMESTAMP, NULLABLE) -> Date de vérification de l'email.
- `password_hash` (VARCHAR, NULLABLE) -> Empreinte du mot de passe (haché avec bcrypt/argon2, nul si inscription via OAuth).
- `image` (VARCHAR, NULLABLE) -> Chemin/URL de l'avatar.
- `role` (ENUM) -> Rôle de sécurité de l'utilisateur :
  - `ADMIN` : Accès complet au Back-End et gestion de la plateforme.
  - `VIP_SUBSCRIBER` : Membre abonné avec accès total à tous les contenus payants.
  - `FREE_USER` : Membre inscrit gratuitement, accès limité.
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Table : `accounts`
Comptes de fournisseurs OAuth liés aux utilisateurs (ex: Google, Apple).
- `id` (VARCHAR, PK) -> UUID.
- `user_id` (VARCHAR, FK) -> Référence vers `users(id)` avec suppression en cascade.
- `type` (VARCHAR) -> Type de compte (ex: `oauth`).
- `provider` (VARCHAR) -> Fournisseur d'identité (ex: `google`, `apple`).
- `provider_account_id` (VARCHAR) -> Identifiant unique renvoyé par le fournisseur.
- `refresh_token` (TEXT, NULLABLE) -> Jeton de rafraîchissement OAuth.
- `access_token` (TEXT, NULLABLE) -> Jeton d'accès OAuth.
- `expires_at` (INT, NULLABLE) -> Date d'expiration du jeton d'accès.
- `token_type` (VARCHAR, NULLABLE) -> Type de jeton (ex: `Bearer`).
- `scope` (VARCHAR, NULLABLE) -> Portée des autorisations accordées.
- `id_token` (TEXT, NULLABLE) -> Jeton d'identité OpenID.
- `session_state` (VARCHAR, NULLABLE) -> État de la session.

#### Table : `sessions`
Sessions actives des utilisateurs (pour la persistance de connexion).
- `id` (VARCHAR, PK) -> UUID.
- `session_token` (VARCHAR, UNIQUE) -> Jeton de session unique.
- `user_id` (VARCHAR, FK) -> Référence vers `users(id)` avec suppression en cascade.
- `expires` (TIMESTAMP) -> Date d'expiration de la session.

#### Table : `verification_tokens`
Jetons de vérification (pour les connexions par lien magique ou réinitialisations).
- `identifier` (VARCHAR) -> e.g. l'email.
- `token` (VARCHAR, UNIQUE) -> Jeton de vérification unique.
- `expires` (TIMESTAMP) -> Date d'expiration.
*Clé primaire composite sur (identifier, token).*

---

### B. Couche de Monétisation & Contrôle d'Accès (Monetization & Access Control)
Modélisation de la gestion des offres d'abonnements, de l'état de souscription des membres et des reçus de passerelles de paiement.

#### Table : `subscription_plans`
Grilles de tarifs paramétrables (ex: Essentiel, Premium, Élite).
- `id` (INT, PK)
- `name` (VARCHAR) -> Nom du forfait (ex: `Premium`).
- `price_monthly` (DECIMAL(10,2)) -> Prix pour la facturation mensuelle (ex: `89.00`).
- `price_yearly` (DECIMAL(10,2)) -> Prix pour la facturation annuelle (ex: `850.00`).
- `features_json` (JSON) -> Liste structurée des avantages associés.
- `is_active` (BOOLEAN) -> Statut d'activation de l'offre commerciale.

#### Table : `user_subscriptions`
Suivi des contrats d'abonnement actifs des utilisateurs.
- `id` (INT, PK)
- `user_id` (VARCHAR, FK) -> Référence vers `users(id)` avec suppression en cascade.
- `plan_id` (INT, FK) -> Référence vers `subscription_plans(id)`.
- `status` (ENUM) -> État de l'abonnement :
  - `active` : Abonnement valide et payé, accès total accordé.
  - `past_due` : Défaut de paiement détecté, relances en cours, accès temporairement maintenu.
  - `canceled` : Annulé par l'utilisateur mais actif jusqu'à la fin de la période facturée.
  - `expired` : Expiré, aucun droit d'accès VIP.
- `start_date` (TIMESTAMP) -> Début de l'abonnement.
- `end_date` (TIMESTAMP) -> Échéance de facturation / Fin des droits d'accès.
- `cancel_at_period_end` (BOOLEAN) -> Indique si l'abonnement doit s'arrêter à la prochaine échéance.
- `stripe_subscription_id` (VARCHAR, NULLABLE) -> Référence contrat Stripe.
- `monetbil_subscription_id` (VARCHAR, NULLABLE) -> Référence contrat Monetbil (Paiement Mobile).
- `cinpay_subscription_id` (VARCHAR, NULLABLE) -> Référence contrat Cinpay (Paiement Afrique centrale/ouest).

#### Table : `payment_transactions`
Historique et reçus des paiements pour la facturation et l'audit.
- `id` (INT, PK)
- `user_id` (VARCHAR, FK) -> Référence vers `users(id)` avec conservation d'historique (SET NULL sur suppression).
- `subscription_id` (INT, FK, NULLABLE) -> Contrat d'abonnement lié.
- `amount` (DECIMAL(10,2)) -> Montant facturé.
- `currency` (VARCHAR(3)) -> Devise de transaction (ex: `EUR`, `XAF`, `USD`).
- `status` (ENUM) -> État du paiement (`pending`, `succeeded`, `failed`).
- `gateway` (ENUM) -> Passerelle de paiement utilisée (`stripe`, `monetbil`, `cinpay`).
- `gateway_reference` (VARCHAR, UNIQUE) -> Numéro de reçu / ID de transaction unique renvoyé par la passerelle.
- `created_at` (TIMESTAMP) -> Date de transaction.

---

### C. Couche d'Engagement & Expérience Utilisateur (User Engagement)
Données comportementales et personnalisation de la lecture.

#### Table : `user_favorites`
Favoris et marque-pages (Espace Lecture & Articles).
- `id` (INT, PK)
- `user_id` (VARCHAR, FK) -> Référence vers `users(id)` avec suppression en cascade.
- `document_id` (INT, FK, NULLABLE) -> Référence vers `library_documents(id)` si favori de bibliothèque.
- `article_id` (VARCHAR, FK, NULLABLE) -> Référence vers `articles(id)` si favori d'article.
- `created_at` (TIMESTAMP)
*Note : Clé composite d'unicité sur (user_id, document_id) et (user_id, article_id) pour éviter les doublons.*

#### Table : `audio_progress`
Sauvegarde de l'état de lecture du lecteur audio persistant.
- `id` (INT, PK)
- `user_id` (VARCHAR, FK) -> Référence vers `users(id)` avec suppression en cascade.
- `episode_id` (VARCHAR, FK) -> Référence vers `podcast_episodes(id)`.
- `last_position_seconds` (INT) -> Seconde exacte à laquelle l'écoute a été suspendue (ex: `1240`).
- `updated_at` (TIMESTAMP) -> Date de dernière synchronisation de position (mise à jour fréquente via API).

---

## 5. Architecture de Sécurité & Flux d'Authentification JWT (Headless WordPress REST API)
Puisque WordPress fait office de moteur de base de données asynchrone sans thème visible, l'accès à notre interface d'administration Next.js (`/admin/*`) doit être protégé par un système de jetons JWT (JSON Web Tokens) interfacé avec l'API REST de WordPress.

### Processus d'Authentification et Flux de Données

```mermaid
sequenceDiagram
    participant Navigateur as Client Admin (Next.js App)
    participant NextJS as Serveur Next.js (Middleware)
    participant WP as WordPress REST API (Headless Core)

    Navigateur->>NextJS: 1. Soumet Login / MDP (/admin/login)
    NextJS->>WP: 2. POST /wp-json/jwt-auth/v1/token (avec identifiants)
    Note over WP: Validation des droits & Rôle (Administrator)
    WP-->>NextJS: 3. Retourne le Token JWT + Rôle + Métadonnées
    Note over NextJS: Chiffrement et stockage du JWT dans un cookie HTTP-Only sécurisé
    NextJS-->>Navigateur: 4. Connexion réussie, redirection vers /admin/dashboard
    
    Navigateur->>NextJS: 5. Requête vers route protégée (/admin/articles)
    Note over NextJS: Le Middleware Next.js intercepte et lit le cookie JWT
    NextJS->>WP: 6. Requête API REST + Header Authorization: Bearer {JWT}
    WP-->>NextJS: 7. Données renvoyées
    NextJS-->>Navigateur: 8. Rendu HTML de la page d'administration
```

### Détail des Points de Terminaison (Endpoints API)

1. **Génération du Jeton JWT (Login)** :
   * **Endpoint** : `POST /wp-json/jwt-auth/v1/token`
   * **Corps de la requête** :
     ```json
     {
       "username": "admin_dona",
       "password": "mot_de_passe_securise"
     }
     ```
   * **Réponse de succès (200 OK)** :
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user_email": "admin@dona-magazine.com",
       "user_nicename": "admin_dona",
       "user_display_name": "Direction DONA"
     }
     ```

2. **Validation du Jeton** :
   * **Endpoint** : `POST /wp-json/jwt-auth/v1/token/validate`
   * **Header** : `Authorization: Bearer <token_jwt>`
   * **Réponse de succès (200 OK)** :
     ```json
     {
       "code": "jwt_auth_valid_token",
       "data": {
         "status": 200
       }
     }
     ```

### Sécurisation de l'Interface Next.js Custom Admin
- **Cookie HTTP-Only** : Le jeton JWT renvoyé par WordPress est stocké par le serveur Next.js dans un cookie chiffré HTTP-Only (ex: `dona_admin_session`). Cela élimine les risques de vol de jetons par des scripts malveillants XSS.
- **Middleware Next.js** : Un fichier `middleware.js` ou une logique de routage dans `app/admin/layout.jsx` vérifie la présence du jeton à chaque chargement de route `/admin/*`. Si le jeton est manquant ou invalide (après requête de validation à l'API WordPress), l'utilisateur est immédiatement redirigé vers `/login`.
- **Rôles applicatifs** : Seuls les utilisateurs WordPress possédant la capacité `manage_options` (Rôle `Administrator`) peuvent obtenir un jeton valide pour les routes `/admin/*`. Les utilisateurs ayant le rôle `Subscriber` (liés à `VIP_SUBSCRIBER` en Front-End) sont systématiquement rejetés des routes d'administration.


