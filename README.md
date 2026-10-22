# El Oulfa Création

Boutique statique française de robes orientales, adaptée de la structure du site `RENOLIX/khadidja.github.io` à la demande de son propriétaire. Le dépôt d’origine n’est pas modifié.

Site : https://renolix.github.io/eloulfa.github.io/

Deux modèles : Kaftan Safran (terracotta et or) et Kaftan Améthyste (prune et or), chacun à 80 €, tailles paires de 34 à 58. Catégories : robes orientales, kaftans, cérémonie et grandes tailles. Destinations exclusivement européennes.

## Fonctionnement

Ouvrir avec `node scripts/serve.cjs`, puis http://127.0.0.1:4173/eloulfa.github.io/.

Contrôles : `node --check store.js`, `node scripts/check.cjs`, `git diff --check`.

Le site conserve l’accueil en mosaïque, le diaporama, la recherche, les fiches, les galeries, le choix de taille, le panier, le tiroir et les pages d’information de la boutique source. Les couleurs, textes, catégories, photos, prix et tailles sont adaptés à El Oulfa.

## Paiement en attente d’intégration

Le parcours est une simulation locale sans mention « démo » dans l’interface. Aucun débit, aucune transaction, aucune commande commerciale et aucun e-mail ne sont envoyés. Les champs de carte sont désactivés. Les coordonnées saisies ne sont ni transmises ni stockées. Seuls les identifiants des produits, tailles, quantités, sous-total, pays et référence de sélection restent dans le sessionStorage de l’onglet. Le panier reste dans localStorage.

Avant d’accepter des ventes : intégrer un prestataire de paiement via un backend sécurisé et des webhooks, stocker les commandes côté serveur, vérifier les prix côté serveur, fixer les tarifs et délais de livraison, confirmer composition et mensurations, compléter les coordonnées de l’entreprise et les conditions commerciales. Ne placer aucune clé secrète dans GitHub Pages.

Aucune connexion au Firebase, au catalogue dynamique, aux commandes ou au Meta Pixel de Khadidja n’est conservée.

## Visuels

Images créées avec l’outil intégré de génération d’images ; photos d’origine fournies pour le test non utilisées. Logo fourni détouré en PNG avec alpha. Les versions WebP sont optimisées pour le web ; les détails des robes sont des recadrages des visuels créés.

Fichiers dans `assets/` : `logo-transparent.png`, `campagne-orientale.webp`, `robe-safran.webp`, `robe-amethyste.webp`, `safran-detail.webp`, `amethyste-detail.webp`, `atelier.webp`.

Prompts :

- Logo : retirer entièrement le fond beige du logo fourni, préserver EO, les ornements et tous les textes, produire un PNG transparent.
- Campagne : photographie éditoriale d’une femme adulte en kaftan ivoire brodé d’or dans un riad crème, lumière douce, portrait en pied, sans texte.
- Safran : nouvelle robe orientale longue en satin terracotta, broderie dorée au col en V et aux manches, ceinture assortie, modèle adulte dans une niche de riad ivoire, portrait en pied.
- Améthyste : nouvelle robe orientale longue en satin prune, motifs végétaux dorés sur le devant et les manches, ceinture brodée, modèle adulte dans une niche de riad ivoire, portrait en pied.
- Atelier : nature morte d’étoffes ivoire et prune brodées d’or, fil et ciseaux de broderie, bois de cèdre sculpté, lumière chaude, sans texte.

Les images représentent une collection de présentation. Elles devront être remplacées par des photographies conformes aux produits effectivement vendus avant commercialisation.

Publication par GitHub Pages depuis la branche `main`, répertoire racine, sans domaine personnalisé. Le nom du dépôt ne crée pas le domaine `eloulfa.github.io` : l’adresse est celle d’un projet Pages du compte RENOLIX.
