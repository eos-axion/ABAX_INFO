# ABAX Info — Contexte AXION

## Identité client
- **Entreprise :** ABAX Info — informatique / IT — Suisse romande
- **Contact principal :** À compléter — prénom/nom — email — téléphone
- **Autres interlocuteurs :** À compléter
- **Source :** À compléter

## Relation commerciale
- **Statut :** Prospect en cours de conversion
- **Offre en cours :** Diagnostic SEO & GEO (livré) → Proposition commerciale à envoyer
- **Montant :** À définir (proposition en cours)
- **Date signature :** —
- **Interlocuteur AXION :** Sébastien

## Projet en cours
- **Nom :** Discovery & Proposition commerciale ABAX Info
- **Objectif :** Convertir le prospect suite au Discovery Workshop — vente d'une offre d'automatisation
- **Phase actuelle :** Proposition commerciale livrée → en attente de retour client
- **Prochaines étapes :**
  1. Suivi client suite à l'envoi de la proposition (3 piliers Visibilité / Croissance / Opérations)
  2. Signature et démarrage Pilier 1 — Visibilité

## Stack technique
- **Déploiement livrables :** Netlify (repo `eos-axion/ABAX_INFO`, publish = `client/`)
- **Format livrables :** HTML scrollable + slide decks + Word (.docx)

## Conventions
- **Langue :** Français
- **Repo GitHub :** `eos-axion/ABAX_INFO`

## Historique
| Date | Événement |
|------|-----------|
| 05/03/2026 | Discovery Workshop — diagnostic SEO & GEO livré (lead magnet + détaillé) |
| 03/04/2026 | Atelier Discovery #2 — positionnement, méthodologie H/T, funnel CRM, offre AXION 3 piliers |
| 09/04/2026 | Livraison compte-rendu atelier #2, plans d'action (Visibilité 9 mois, Croissance 90 jours), fiche entreprise |

---

## Structure du projet

```
workshop/           → Atelier Discovery du 5 mars 2026
diagnostic/         → Livrables SEO & GEO (lead magnet + détaillé)
proposition/        → Proposition commerciale (à venir)
```

**Nomenclature des fichiers :**
```
abaxinfo-[type]-[sujet].html          # Rapports HTML scrollables
abaxinfo-[type]-[sujet].md.docx       # Documents Word (depuis Markdown)
workshop-abaxinfo-[type].html         # Présentations en mode slide deck
```

**Deux modes HTML :**
- **Rapports scrollables** (`abaxinfo-*.html`) : conteneur `max-width: 900–960px`, scroll vertical classique
- **Slide decks** (`workshop-*.html`) : plein écran `overflow: hidden`, slides en `position: absolute` avec transitions opacity/transform, navigation clavier/clic

## Inventaire des livrables

### `workshop/`
| Fichier | Contenu | Statut |
|---------|---------|--------|
| `workshop-abaxinfo-presentation.html` | Slide deck de présentation (pré-atelier) | Utilisé le 5 mars |
| `workshop-abaxinfo-compte-rendu.html` | Compte rendu de l'atelier (post-workshop) | À envoyer au client |
| `discovery-workshop-abaxinfo.md.docx` | Document de préparation de l'atelier | Interne |
| `compte-rendu-atelier-20260403.html` | Compte rendu atelier #2 (3 avril) — positionnement, méthodologie, offre AXION | Partagé |

### `diagnostic/`
| Fichier | Contenu | Statut |
|---------|---------|--------|
| `abaxinfo-lead-magnet-seo-geo.html` | Diagnostic SEO & GEO simplifié (lead magnet) | Offert au client |
| `abaxinfo-lead-magnet-diagnostic-seo-geo.md.docx` | Version Word du lead magnet | Offert au client |
| `abaxinfo-diagnostic-detaille-seo-geo.html` | Audit SEO & GEO complet avec scores et plan d'action | Payant |
| `abaxinfo-diagnostic-detaille-seo-geo.md.docx` | Version Word du diagnostic détaillé | Payant |

### `proposition/`
| Fichier | Contenu | Statut |
|---------|---------|--------|
| `abaxinfo-roadmap.html` | Roadmap visuelle v0 — 3 opportunités × 5 périodes (Capability Bricks) | Référence v0 |
| `abaxinfo-roadmap-v1.html` | Roadmap v1 — +2 briques Pilier 1, dimension Type d'intervention | Référence v1 |
| `abaxinfo-roadmap-v2.html` | Roadmap v2 — numéros briques, reorder Q2, VOIP→Q3, Base connaissances→Q2, Accompagnement→Consulting | À partager |
| `fiches-capability-bricks.html` | Fiches détaillées v0 — 20 briques | Référence v0 |
| `fiches-capability-bricks-v1.html` | Fiches v1 (maj v2) — 21 briques, timings ajustés, Accompagnement fusionné dans Consulting | À partager |
| `fiches/` | 21 fiches individuelles (1 fichier HTML par brique, navigation prev/next) | À partager |
| `abaxinfo-plan-visibilite-9mois.html` | Plan d'action 9 mois — Offre Visibilité (Tourbillon 5A, score /100, 3 phases) | Partagé |
| `abaxinfo-plan-croissance-90jours.html` | Plan d'action 90 jours — Offre Croissance (5 canaux, 4 sprints, scoring) | Partagé |
| `fiche-entreprise-abaxinfo.html` | Fiche entreprise vivante — identité, positionnement, services, personas, concurrence | Partagé |
| `abaxinfo-offre-commerciale-v1.html` | Offre commerciale AXION — 3 piliers (Visibilité, Croissance, Opérations) | Partagé |
| `abaxinfo-competitive-intelligence-xefi.html` | Intelligence concurrentielle — analyse XEFI (10 sections) | Interne |

### `client/` — Publication Netlify
Contient uniquement les fichiers à partager avec le client (pas le diagnostic détaillé) :
- `index.html` — Page d'accueil branded avec liens vers les documents
- `workshop-abaxinfo-presentation.html` — Copie depuis `workshop/`
- `workshop-abaxinfo-compte-rendu.html` — Copie depuis `workshop/`
- `abaxinfo-lead-magnet-seo-geo.html` — Copie depuis `diagnostic/`
- `abaxinfo-roadmap.html` — Copie depuis `proposition/` (v0)
- `abaxinfo-roadmap-v1.html` — Copie depuis `proposition/` (v1)
- `abaxinfo-roadmap-v2.html` — Copie depuis `proposition/` (v2)
- `fiches-capability-bricks-v1.html` — Copie depuis `proposition/` (v1, mis à jour)
- `fiches/` — 21 fiches individuelles, copie depuis `proposition/fiches/`
- `compte-rendu-atelier-20260403.html` — Copie depuis `workshop/`
- `abaxinfo-plan-visibilite-9mois.html` — Copie depuis `proposition/`
- `abaxinfo-plan-croissance-90jours.html` — Copie depuis `proposition/`
- `fiche-entreprise-abaxinfo.html` — Copie depuis `proposition/`
- `abaxinfo-offre-commerciale-v1.html` — Copie depuis `proposition/`
- `abaxinfo-pack-visibilite-l1.html` — Pack Visibilité L1 (scan SEO)

**Important :** `client/` est la source de vérité pour Netlify. Si un fichier source est mis à jour, penser à le recopier dans `client/`.

## Déploiement Netlify

`netlify.toml` à la racine configure le dossier de publication : `publish = "client"`.

Pour connecter sur Netlify : importer le repo GitHub `eos-axion/ABAX_INFO` — Netlify détecte automatiquement `netlify.toml` et publie le dossier `client/`. Tout push sur `main` déclenche un redéploiement automatique.

## Système de design AXION (fichiers HTML)

Palette CSS à conserver sur tous les nouveaux livrables HTML :

```css
:root {
  --navy: #0A1628;          /* fond principal */
  --navy-light: #1A2A42;    /* fond des cartes */
  --slate: #2D3F5B;
  --cyan: #00D4FF;          /* accent principal */
  --green: #00E68A;         /* positif / succès */
  --amber: #FFB800;         /* avertissement */
  --red: #FF4757;           /* critique / négatif */
  --violet: #9B59FF;        /* accent optionnel */
  --white: #FFFFFF;
  /* Variantes alpha : --cyan-10, --white-80, etc. */
}
```

**Typographie :** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

**Cartes :** `background: var(--navy-light); border-radius: 14px; border: 1px solid rgba(255,255,255,0.06)` avec bordure top colorée (3px) selon la catégorie.

**Langue :** Tout le contenu est en **français**.
