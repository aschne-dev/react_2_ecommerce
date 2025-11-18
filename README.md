[![CI](https://github.com/aschne-dev/react_2_ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/aschne-dev/react_2_ecommerce/actions/workflows/ci.yml)

# tmp

# Ecommerce React + Vite

Ce projet est basé sur le tutoriel vidéo de [SuperSimpleDev](https://www.youtube.com/watch?v=TtPXvEcE11E&t=41327s). J’en ai gardé l’architecture générale, puis j’ai continué à iterer pour couvrir des cas plus proches d’un vrai projet front, notamment sur la gestion du panier, les requêtes réseau et quelques aspects CI-friendly.

## Déploiement

Frontend : [https://ecommerce-beta-smoky.vercel.app](https://ecommerce-beta-smoky.vercel.app)  
Backend : [`https://react-2-ecommerce-backend.onrender.com`](https://react-2-ecommerce-backend.onrender.com/) (Render met l’API en veille ; il faut ouvrir l’URL pour la réactiver avant de tester le front).

## Ce que j’ai ajouté / modifié

- **Gestion automatique des URLs** : les endpoints (dev vs prod) sont injectés depuis les variables d’environnement, ce qui permet de basculer sans toucher le code.
- **Backend déployé sur Render** : l’API est publiée sur [`react-2-ecommerce-backend.onrender.com`](https://react-2-ecommerce-backend.onrender.com/). Avant de tester le frontend, il faut “réveiller” ce backend en visitant l’URL (Render met les services en veille).
- **Centralisation du `loadCart` + tests adaptés** : la logique de chargement du panier a été recentrée pour éviter les duplications, et les tests unitaires ont été mis à jour pour suivre ce flow unique.
- **Recherche auto** : la barre de recherche met à jour la query string (et les résultats) de façon debounce, ce qui donne une UX fluide.
- **Pagination sur la Home** : la liste produits utilise une pagination/infinite scroll. Côté backend, quelques règles ont été ajustées (via IA) pour exposer les pages attendues.
- **Zustand à la place du `CartContext`** : remplacement complet par un `CartStore`.
- **React Query** : toute la logique serveur (produits, panier, livraison, paiement, commandes…) est gérée par React Query (caching, mutations, invalidations).

## Ce que j’ai voulu approfondir grâce au tutoriel

- **Architecture front e-commerce** : organiser la gestion du panier et des données serveur avec React Query + Zustand pour éviter les effets de bord.
- **Expérience utilisateur** : recherche automatique, pagination, états de chargement/erreur clairs pour illustrer un site réellement utilisable.
- **CI / déploiement** : garder un projet facile à tester (Vitest), à builder (Vite) et à déployer (Vercel + backend Render) sans modifications manuelles.

## Prérequis

- Node 18+
- `npm install`

## Scripts utiles

- `npm run dev` : lance le front en mode développement (Vite + HMR).
- `npm run build` : build de production.
- `npm run preview` : prévisualise le build.
- `npx vitest run` : exécute la suite de tests.
