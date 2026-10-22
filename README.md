# El Oulfa Création

Boutique statique française de robes orientales, adaptée de la structure du site `RENOLIX/khadidja.github.io` à la demande de son propriétaire. Le dépôt d’origine n’est pas modifié.

Site : https://renolix.github.io/eloulfa.github.io/

Deux modèles : Robe Safran (terracotta) et Robe Améthyste (prune et or), chacun à 80 €, tailles paires de 34 à 58. Les quatre photographies de produits sont celles fournies par le propriétaire. Catégories : robes orientales, kaftans, cérémonie et grandes tailles. Destinations exclusivement européennes.

## Fonctionnement

Ouvrir avec `node scripts/serve.cjs`, puis http://127.0.0.1:4173/eloulfa.github.io/.

Contrôles : `node --check store.js`, `node scripts/check.cjs`, `git diff --check`.

Le site conserve l’accueil en mosaïque, le diaporama, la recherche, les fiches, les galeries, le choix de taille, le panier, le tiroir et les pages d’information de la boutique source. Les couleurs, textes, catégories, photos, prix et tailles sont adaptés à El Oulfa. `product-cards.css` rétablit les dimensions et la typographie exactes des cartes Khadidja : cinq colonnes sur grand écran, quatre sous 1100 px, deux sous 680 px, images au ratio 3/4, écarts de 14 px sur PC et 11 px sur téléphone.

## Paiement en attente d’intégration

Le parcours est une simulation locale sans mention « démo » dans l’interface. Aucun débit, aucune transaction, aucune commande commerciale et aucun e-mail ne sont envoyés. Les champs de carte sont désactivés. Les coordonnées saisies ne sont ni transmises ni stockées. Seuls les identifiants des produits, tailles, quantités, sous-total, pays et référence de sélection restent dans le sessionStorage de l’onglet. Le panier reste dans localStorage.

Avant d’accepter des ventes : intégrer un prestataire de paiement via un backend sécurisé et des webhooks, stocker les commandes côté serveur, vérifier les prix côté serveur, fixer les tarifs et délais de livraison, confirmer composition et mensurations, compléter les coordonnées de l’entreprise et les conditions commerciales. Ne placer aucune clé secrète dans GitHub Pages.

Aucune connexion au Firebase, au catalogue dynamique, aux commandes ou au Meta Pixel de Khadidja n’est conservée.

## Visuels

Les quatre photos des robes fournies par le propriétaire sont utilisées uniquement pour les produits : cartes, galeries, panier et récapitulatif. Leur contenu n’a pas été modifié ; elles sont converties en WebP pour le web. Les bannières et les images de marque sont des créations orientales sans personnes, femmes, mannequins ou vêtements portés, réalisées avec l’outil intégré de génération d’images. Logo fourni détouré en PNG avec alpha.

Fichiers dans `assets/` : `logo-transparent.png`, `robe-safran-face.webp`, `robe-safran-pose.webp`, `robe-amethyste-face.webp`, `robe-amethyste-detail.webp`, `creation-orientale.webp`, `arche-orientale.webp`, `details-orientaux.webp`, `atelier.webp`.

Prompts :

- Logo : retirer entièrement le fond beige du logo fourni, préserver EO, les ornements et tous les textes, produire un PNG transparent.
- Campagne : création artistique sans personne, arche sculptée du Maghreb, rubans abstraits d’étoffes terracotta et prune, lanternes dorées, zellige et ombres végétales, espace central pour le texte.
- Arche : nature morte créative sans personne, arche terracotta, croissant et étoile sculptés en métal doré, étoffe prune, coffret en nacre, ombres de moucharabieh.
- Détails : nature morte créative sans personne, bijoux filigranés dorés, ciseaux de broderie, étoffes prune et terracotta, perles et plinthe ivoire sculptée.
- Atelier : nature morte d’étoffes ivoire et prune brodées d’or, fil et ciseaux de broderie, bois de cèdre sculpté, lumière chaude, sans texte.

Les visuels décoratifs illustrent l’univers de marque. Seules les photos fournies par le propriétaire illustrent les deux produits vendus.

Publication par GitHub Pages depuis la branche `main`, répertoire racine, sans domaine personnalisé. Le nom du dépôt ne crée pas le domaine `eloulfa.github.io` : l’adresse est celle d’un projet Pages du compte RENOLIX.
