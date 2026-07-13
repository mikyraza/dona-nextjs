# Feuille de Route Back-End (WordPress Headless & Next.js Custom Admin)

Ce document décrit le plan d'action pour connecter notre application Front-End Next.js à un moteur de base de données WordPress Headless (déployé sur un serveur/VPS privé) et créer notre interface d'administration sur-mesure.

## Phase 1 : Configuration de WordPress Headless & API REST Custom
Mettre en place et configurer l'instance WordPress locale pour servir de base de données asynchrone sécurisée.

- [ ] **Initialisation de WordPress en Local** :
  - Configurer une installation WordPress vierge en local (avec base MySQL).
  - Désactiver l'affichage public du thème par défaut en redirigeant les requêtes publiques vers l'API REST ou un écran neutre (comportement purement Headless).
- [ ] **Installation des Extensions Clés (Plugins)** :
  - **Advanced Custom Fields (ACF Pro)** : Pour créer les champs personnalisés mappant la structure de `docs/dynamic-matrix.md`.
  - **JWT Authentication for WP REST API** : Pour gérer la sécurisation et les jetons d'accès.
  - **Custom Post Type UI (CPT UI)** ou déclaration dans un plugin custom pour enregistrer les types de contenus spécifiques (Magazines, Émissions/Podcasts, Vidéos, Jeux/Énigmes, Documents).
- [ ] **Création et Mappage des Custom Post Types & Champs ACF** :
  - CPT `magazine` + Champs ACF (Slogan, Couleurs primary/secondary, gradient, image de couverture, essence, icône SVG).
  - CPT `podcast` + Champs ACF (Série, Épisode, fichier audio MP3, durée, fichier d'illustration).
  - CPT `video` + Champs ACF (Type de vidéo, durée, statut Featured, lien vidéo, miniature).
  - CPT `game` + Champs ACF (Catégorie, Énigme du jour, scores, règles de tournois).
  - CPT `document` + Champs ACF (Type de fichier, lien de téléchargement PDF, couverture).
- [ ] **Développement des Endpoints REST Custom** :
  - Enregistrer des routes personnalisées d'API WordPress (ex: `/wp-json/dona/v1/homepage`, `/wp-json/dona/v1/jeux/rankings`) pour regrouper les données nécessaires en une seule requête HTTP et optimiser le temps de chargement du Front-End Next.js.

---

## Phase 2 : Authentification & Sécurisation JWT
Connecter NextAuth.js et notre logique de routage privée au moteur d'authentification WordPress.

- [ ] **Configuration de l'extension JWT dans WordPress** :
  - Configurer les clés de chiffrement de jetons JWT dans le fichier `wp-config.php` (`JWT_AUTH_SECRET_KEY`).
  - Tester la génération de jetons via Postman/curl sur `/wp-json/jwt-auth/v1/token`.
- [ ] **Mise en place de NextAuth.js (ou Middleware Custom) côté Next.js** :
  - Configurer les routes d'API Next.js pour capter les requêtes d'authentification et les relayer à WordPress.
  - Enregistrer le token JWT reçu dans un cookie HTTP-Only hautement sécurisé.
- [ ] **Création du Middleware de Sécurisation des Routes Admin** :
  - Implémenter le fichier `middleware.js` dans Next.js interceptant les accès à `/admin/*`.
  - Décoder et valider le jeton JWT auprès de WordPress.
  - Bloquer les utilisateurs n'ayant pas le rôle `Administrator` (redirection vers `/login`).

---

## Phase 3 : Conception de l'Interface d'Administration Next.js (Custom Admin Panel)
Construire l'application d'administration bespoke intégrée dans Next.js, sans aucun élément visuel WordPress.

- [ ] **Création du Layout et Shell Admin Next.js** :
  - Créer `app/admin/layout.jsx` : Un design épuré et minimaliste en phase avec la charte "Quiet Luxury" de DONA (Sidebar sombre, statistiques de ventes, état des inscriptions).
- [ ] **Développement des Dashboards Thématiques** :
  - **Dashboard Général** : Statistiques clés en temps réel (nombre d'abonnés actifs, volume de transactions, inscriptions récentes).
  - **Gestionnaire des Magazines** : Formulaire dynamique pour modifier les textes, images, couleurs et icônes des 16 univers.
  - **Médiathèque Studio** : Interface pour ajouter des épisodes de podcasts (téléchargement de fichiers MP3, réglages de durée) et référencer de nouvelles vidéos.
  - **Centre de Jeux & Classement** : Mise à jour de l'énigme active du jour et modification manuelle du classement des joueurs.
  - **Bibliothèque de Documents** : Table pour uploader des Workbooks PDF et définir les badges d'accès.
- [ ] **Mise en place des formulaires et requêtes CRUD** :
  - Connecter les formulaires de création et d'édition Next.js aux requêtes `POST`, `PUT`, `DELETE` de l'API REST WordPress en passant le token JWT dans l'en-tête `Authorization`.
  - Gérer les retours visuels d'erreurs et de succès (Toasts de notifications, états de chargement).
