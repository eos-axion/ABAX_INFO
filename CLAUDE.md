# ABAX Info — Contexte AXION

## Identité client
- **Entreprise :** ABAX Info — informatique / IT — Suisse romande
- **Contact principal :** Eric Darien — Dirigeant — eric.darien@abaxinfo.com — +41 78 811 92 21 / +33 7 83 98 63 16
- **Autres interlocuteurs :** À compléter
- **Source :** À compléter

## Relation commerciale
- **Statut :** Prospect en cours de conversion
- **Offre en cours :** Proposition commerciale livrée — 3 piliers (Visibilité, Croissance, Opérations)
- **Montant :** À définir à la signature
- **Date signature :** En attente
- **Interlocuteur AXION :** Sébastien (+ Djemel)

## Projet en cours
- **Nom :** Discovery & Proposition commerciale ABAX Info — Projet Nexus
- **Objectif :** Convertir le prospect — signature d'un ou plusieurs piliers de l'offre AXION
- **Phase actuelle :** Atelier 3 (10 avril 2026, on-site chez Eric) — consolidation plan d'actions, présence digitale
- **Prochaines étapes :**
  1. Atelier 3 — 10 avril 2026 à 10h (on-site)
  2. Appels d'offres — discussion et planification (AO transmis par Eric le 3 avril)
  3. Signature et démarrage Pilier 1 — Visibilité

## Stack technique
- **Déploiement livrables :** Cloudflare Pages — repo `eos-axion/ABAX_INFO`, build output = `public/`
- **URL portail :** https://portal-abaxinfo.axion.supply (CNAME + Cloudflare Access à configurer)
- **Format livrables :** HTML scrollable + slide decks + Word (.docx) + PDF

## Conventions
- **Langue :** Français
- **Repo GitHub :** `eos-axion/ABAX_INFO`

## Portail client — Cloudflare Pages

**Structure `public/` (source de vérité — ne jamais dupliquer ailleurs) :**

```
public/
├── index.html                              ← portail client (5 onglets)
├── docs/
│   └── AXION_Offre_ABAX_INFO_Nexus_2026-001.pdf
├── fiches/                                 ← 21 fiches Capability Bricks individuelles
├── workshop-abaxinfo-presentation.html
├── workshop-abaxinfo-compte-rendu.html
├── compte-rendu-atelier-20260403.html
├── abaxinfo-plan-visibilite-9mois.html
├── abaxinfo-plan-croissance-90jours.html
├── abaxinfo-roadmap-v2.html               ← version actuelle
├── abaxinfo-roadmap-v1.html               ← archive
├── abaxinfo-roadmap.html                  ← archive v0
├── fiches-capability-bricks-v1.html
├── abaxinfo-lead-magnet-seo-geo.html
├── abaxinfo-pack-visibilite-l1.html
├── fiche-entreprise-abaxinfo.html
└── abaxinfo-competitive-intelligence-xefi.html
```

**Structure des onglets `index.html` :**
| Onglet | Icône | Contenu |
|--------|-------|---------|
| Ateliers | 📋 | Agendas + comptes rendus (badges Dernier/Archive) |
| Roadmap | 🗺️ | Roadmap v2 + fiches 21 briques + archives v1/v0 |
| Visibilité | 🔍 | Plan d'action 9 mois + diagnostic SEO + pack L1 |
| Croissance | 🌱 | Plan d'action 90 jours + analyse concurrentielle XEFI |
| Entreprise | 🏢 | Fiche entreprise + contrat PDF |

**Setup Cloudflare Pages (à faire) :**
1. Dashboard Cloudflare → Pages → Create a project → Connect to Git → `eos-axion/ABAX_INFO`
2. Build output directory : `public` — build command : vide
3. Domaine custom : `portal-abaxinfo` → CNAME vers `{slug}.pages.dev` (DNS Cloudflare, proxy activé)
4. Cloudflare Access : domaines `@abaxinfo.com` + `@axion.supply` — OTP email, session 7 jours

## Dossiers internes (non publiés)

```
workshop/
├── discovery-workshop-abaxinfo.md.docx    ← préparation atelier 1 (interne)

diagnostic/
├── abaxinfo-diagnostic-detaille-seo-geo.html    ← audit complet (payant, non partagé)
├── abaxinfo-diagnostic-detaille-seo-geo.md.docx
└── abaxinfo-lead-magnet-diagnostic-seo-geo.md.docx

proposition/
├── fiches-capability-bricks.html          ← v0 de référence (interne)
├── abaxinfo-competitive-intelligence-xefi.md    ← source markdown (interne)
├── AXION_Offre_ABAX_Acceleration_2026-001.docx  ← offre Word (interne)
└── build-offre-docx.js                    ← script build (interne)
```

## Historique
| Date | Événement |
|------|-----------|
| 05/03/2026 | Atelier 1 — Discovery Workshop — diagnostic SEO & GEO livré |
| 03/04/2026 | Atelier 2 — positionnement, méthodologie H/T, funnel CRM, offre AXION 3 piliers |
| 09/04/2026 | Livraison portail client (Cloudflare Pages), contrat PDF, restructuration repo |
| 10/04/2026 | Atelier 3 — on-site chez Eric, 10h — consolidation plan d'actions, présence digitale |

## Golden rules — Portail client (`public/index.html`)

1. **Layout colonnes** : chaque onglet utilise `.cols-2` avec deux colonnes nommées (`.col-label`). Jamais de liste verticale unique.
2. **Ordre chronologique strict** : dans chaque colonne, le document le plus récent est en haut. La date de référence est le **dernier commit git touchant le fichier** (`git log --format="%ai" -- <fichier> | head -1`).
3. **Dégradé d'opacité progressif** : 1.0 (plus récent) → 0.85 → 0.72 → 0.50 (plus ancien). Ne jamais mettre tous les items à la même opacité.
4. **Avant tout ajout de carte** : vérifier la date git du nouveau fichier, le positionner dans la colonne correspondante selon la règle 2, et recalculer les opacités de toute la colonne.
5. **Mise à jour de la date** : modifier la ligne "Mis à jour le…" dans le hero à chaque modification du portail.
6. **Structure `vcard`** : toutes les cartes du portail utilisent `vcard` (jamais `card` horizontal). Structure obligatoire : `vcard-icon`, `vcard-tag`, `vcard-title`, `vcard-desc`, `vcard-footer` (avec `vcard-arrow`).
7. **Commits et push** : toujours committer et pousser après modification du portail — Cloudflare Pages déploie automatiquement depuis `main`.

## Notes importantes
- **Attribution enregistrements :** Les compte-rendus générés depuis le laptop de Sébastien Fournier attribuaient parfois les propos d'Eric Darien à "Seb Fournier". Toujours vérifier et corriger en "Eric Darien" dans les sections 1-7 des compte-rendus.
- **Appels d'offres :** Eric a transmis des AO le 3 avril — à discuter à l'atelier 3 et planifier la semaine du 13 avril.
- **Spam :** Les emails AXION arrivent en spam chez ABAX Info (MailinBlack). Envoyer un WhatsApp en parallèle de chaque email important.

## Système de design AXION — Portail client (thème clair)

Le portail client (`public/index.html` et livrables associés) utilise le thème clair Inter :

```css
:root {
  --bg:#ffffff; --bg1:#f8fafc; --bg2:#f1f5f9;
  --border:#e2e8f0; --text:#0f172a; --text2:#475569; --text3:#94a3b8;
  --cyan:#0ea5e9;   /* accent principal */
  --green:#10b981;  --amber:#f59e0b;  --blue:#3b82f6;
  --purple:#8b5cf6; --orange:#f97316;
}
```

**Typographie :** `Inter` (Google Fonts)

## Système de design AXION — Livrables HTML internes (thème sombre)

```css
:root {
  --navy: #0A1628;       /* fond principal */
  --navy-light: #1A2A42; /* fond des cartes */
  --cyan: #00D4FF;       /* accent principal */
  --green: #00E68A;      --amber: #FFB800;  --red: #FF4757;
}
```

**Typographie :** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

**Langue :** Tout le contenu est en **français**.
