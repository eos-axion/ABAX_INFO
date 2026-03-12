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
- **Phase actuelle :** Post-workshop → envoi compte rendu → élaboration proposition
- **Prochaines étapes :**
  1. Envoyer le compte rendu au client (`workshop-abaxinfo-compte-rendu.html`)
  2. Élaborer et envoyer la proposition commerciale (`proposition/`)

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

### `diagnostic/`
| Fichier | Contenu | Statut |
|---------|---------|--------|
| `abaxinfo-lead-magnet-seo-geo.html` | Diagnostic SEO & GEO simplifié (lead magnet) | Offert au client |
| `abaxinfo-lead-magnet-diagnostic-seo-geo.md.docx` | Version Word du lead magnet | Offert au client |
| `abaxinfo-diagnostic-detaille-seo-geo.html` | Audit SEO & GEO complet avec scores et plan d'action | Payant |
| `abaxinfo-diagnostic-detaille-seo-geo.md.docx` | Version Word du diagnostic détaillé | Payant |

### `proposition/`
Dossier réservé à la proposition commerciale en cours d'élaboration.

### `client/` — Publication Netlify
Contient uniquement les fichiers à partager avec le client (pas le diagnostic détaillé) :
- `index.html` — Page d'accueil branded avec liens vers les 3 documents
- `workshop-abaxinfo-presentation.html` — Copie depuis `workshop/`
- `workshop-abaxinfo-compte-rendu.html` — Copie depuis `workshop/`
- `abaxinfo-lead-magnet-seo-geo.html` — Copie depuis `diagnostic/`

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
