# A.R. Euro Forêt — Astro + Decap CMS

Starter **Astro + Tailwind + Decap CMS (/admin)**.
- Pages et services gérés dans `src/content/**` via un CMS visuel (stockage Git).
- /admin intègre l'interface d'édition (login Netlify Identity ou GitHub/GitLab).
- Ajoutez/supprimez des **services** → le site génère automatiquement les pages `/services/[slug]`.
- Modifiez les textes clés de l'Accueil (titre, intro, bullets).

## Prérequis
- Node 18+
- Un dépôt Git (GitHub/GitLab/Bitbucket)
- Hébergeur : **Netlify** recommandé (Identity + Git Gateway en 2 clics) ou Vercel + OAuth GitHub

## Démarrage
```bash
npm install
npm run dev
```

## Formulaire de contact (SMTP)
Le formulaire `/contact` envoie les demandes via un handler `/api/contact` déployé sur Vercel (Nodemailer).

1. Définissez les variables dans `.env.local` (et dans Vercel → Project Settings → Environment Variables) :
   ```
   PUBLIC_CONTACT_ENDPOINT=api
   PUBLIC_FORMSUBMIT_EMAIL=adresse@secours.com   # fallback FormSubmit
   CONTACT_TO=votre-adresse@exemple.com
   CONTACT_FROM="A.R. Euro Forêt <expediteur@exemple.com>"
   SMTP_HOST=smtp.votre-fournisseur.com
   SMTP_PORT=465
   SMTP_USER=expediteur@exemple.com
   SMTP_PASS=mot-de-passe-ou-app-password
   ```
   - `SMTP_PORT=465` active un transport sécurisé (SSL). Utilisez `587` pour STARTTLS si besoin.
   - Gmail : activez la validation en 2 étapes puis créez un *mot de passe d’application*.
2. Lancez `npm run dev`, envoyez un formulaire test. En production sur Vercel, les mêmes variables doivent être présentes.
3. En cas de souci (SMTP indisponible), retirez `PUBLIC_CONTACT_ENDPOINT=api` pour repasser sur FormSubmit.

Le mail reçu inclut désormais :
- un sujet du type `[Lead A.R. Euro Forêt] Nom · Service · CP · PJ — #IDhorodaté`;
- un corps HTML structuré (actions rapides, tableau récap, bloc “Réponse client” repliable) et une version texte équivalente ;
- la liste des pièces jointes (fichiers transmis avec le message) et un `Reply-To` positionné sur l’email renseigné.

## Plans Basic / CMS (manuel)
1. Choisissez votre plan :
   - Basic : `cp .env.basic .env`
   - CMS : `cp .env.cms .env`
2. Lancez `npm run dev` pour tester ou `npm run build` pour générer le site.

Le script `scripts/sync-cms.mjs` est exécuté automatiquement via `predev`/`prebuild` pour copier ou retirer `/public/admin` à partir de `cms/admin` selon les variables d’environnement.

### Éditer en local
Dans un second terminal :
```bash
npm run cms:proxy
```
Puis ouvrez `http://localhost:4323/admin/` → "Login" (mode local sans OAuth).

## Déploiement Netlify (recommandé)
1. Push sur Git, connectez le repo à Netlify.
2. Activez **Identity** (invite des utilisateurs) + **Git Gateway**.
3. Ouvrez `/admin` → connexion → éditez, publiez. Chaque publication = commit + build.

## Déploiement Vercel

### Configuration minimale
1. **Installer les dépendances** : `npm install`
2. **Connecter le repo à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre dépôt Git
   - Vercel détectera automatiquement Astro grâce à `vercel.json`
   - **Note** : Le projet est en mode `output: 'hybrid'` avec l’adapter `@astrojs/vercel/serverless` pour supporter l’API `/api/contact`
3. **Variables d'environnement** (optionnel, pour activer le CMS) :
   - Dans les paramètres du projet Vercel, ajoutez :
     - `PUBLIC_ENABLE_CMS=true` (ou `PUBLIC_PLAN=cms`)

### Configuration du CMS pour Vercel
Pour utiliser le CMS sur Vercel, vous devez configurer l'authentification GitHub :

1. **Créer une OAuth App GitHub** :
   - Allez sur https://github.com/settings/developers
   - Cliquez sur "New OAuth App"
   - Remplissez :
     - **Application name** : Votre nom d'application
     - **Homepage URL** : `https://votre-site.vercel.app`
     - **Authorization callback URL** : `https://votre-site.vercel.app/api/auth`
   - Notez le **Client ID** et créez un **Client Secret**

2. **Mettre à jour la configuration CMS** :
   - Copiez `cms/admin/config.yml.vercel.example` vers `cms/admin/config.yml`
   - Modifiez les valeurs :
     - `repo` : votre repo GitHub (ex: `username/repo-name`)
     - `base_url` : votre URL Vercel (ex: `https://votre-site.vercel.app`)
   - Les variables d'environnement GitHub seront gérées automatiquement par Vercel

3. **Variables d'environnement Vercel** (pour le CMS) :
   - Dans les paramètres du projet Vercel → Variables d'environnement
   - Ajoutez (si nécessaire) :
     - `GITHUB_CLIENT_ID` : Votre Client ID GitHub
     - `GITHUB_CLIENT_SECRET` : Votre Client Secret GitHub

**Note** : Le site se déploiera sans CMS si vous ne configurez pas ces variables. Pour plus de détails, voir [la documentation Decap CMS](https://decapcms.org/docs/backend-overview/).

## Schéma de contenu
- **Services** : `src/content/services/*.md`
  - `title`, `slug`, `excerpt`, `price`, `startingFrom`, `order`, `featured`, `published`
  - `ctas[]`, `mainCard{title, body, price, startingFrom, ctas[]}`, `extraCards[]`
  - `imageCategoryKey`, `heroImage`, `galleryOverride`, `metaTitle`, `metaDescription`, `openGraphImage`
- **Accueil** : `src/content/pages/home.md`
  - `titleHero`, `intro`, `bullets[]`

## Services & CMS
- **Ajouter / modifier un service** : ouvrez `/admin`, collection "Services". Renseignez les champs obligatoires (titre, slug, extrait). Les CTA sont limités à 2 entrées par carte et par page. Utilisez "Carte principale" pour le contenu principal et "Cartes additionnelles" pour ajouter des blocs optionnels.
- **CTA** : le premier CTA défini est réutilisé pour les boutons de la page et des listes. Gardez au maximum deux liens (téléphone, devis, page interne).
- **Images & galeries** : la clé `imageCategoryKey` se connecte à `src/data/image-categories.ts`. Si la catégorie est vide ou absente, l’image `heroImage` (optionnelle) est utilisée en fallback. Vous pouvez surcharger ou compléter la galerie avec `galleryOverride`.
- **Ajouter une catégorie d’images** : éditez `src/data/image-categories.ts`, ajoutez un objet `{ id, title, images: [] }` pointant vers des fichiers présents dans `public/images`.
- **Utilitaires développeur** : `src/lib/services.ts` expose `getAllServices()`, `getServiceBySlug()` et `getServiceStaticPaths()` pour consommer les données enrichies (CTA, cartes, galerie).

## Où le CMS s’affiche
- `/admin` → interface Decap CMS
- Les images uploadées vont dans `public/uploads/`
- Les fichiers CMS sont stockés dans `cms/admin/` puis synchronisés manuellement.

## Personnaliser
- Coordonnées (téléphone/email/SIRET) : `src/data/site.ts`
- Styles : `src/styles/global.css`
- SEO : `src/components/Layout.astro` (balises, JSON-LD de base)

## Hooks de rebuild
- Netlify déclenche automatiquement un build après chaque publication.
- Autre hébergeur : ajoutez un webhook sur `push` du repo.

Bon build !
