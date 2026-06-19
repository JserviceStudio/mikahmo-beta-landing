# 📋 NOTE TECHNIQUE — Intégration Backend : MikahmoAI Beta Landing Page

**Destinataire :** Développeur Backend  
**Projet :** MikahmoAI Beta Landing Page  
**Hébergement frontend :** Hostinger  
**Date :** 2026-06-19  
**Priorité :** Haute

---

## Contexte

La landing page MikahmoAI Beta collecte les inscriptions des bêta-testeurs (email + numéro WhatsApp).  
Actuellement, les données sont stockées dans une base SQLite locale.  
L'objectif est de **migrer vers la base de données backend** que vous allez construire, afin de centraliser les inscrits dans votre système.

---

## Ce que doit fournir le Backend

### 1. Endpoint HTTP — Inscription d'un bêta-testeur

| Propriété | Valeur |
|---|---|
| **Méthode** | `POST` |
| **URL** | `/api/beta/register` (ou équivalent selon votre routing) |
| **Content-Type** | `application/json` |
| **Authentification** | Aucune (endpoint public) |

**Corps de la requête (JSON) :**
```json
{
  "email": "user@exemple.com",
  "whatsapp": "+22960000000"
}
```

**Réponses attendues :**

| Code | Cas | Corps JSON |
|---|---|---|
| `201` | Inscription réussie | `{ "message": "Inscription réussie ! Vous recevrez le lien via WhatsApp." }` |
| `400` | Données invalides | `{ "error": "Veuillez fournir une adresse email valide." }` |
| `409` | Email déjà existant | `{ "error": "Cet email est déjà inscrit à la liste d'attente." }` |
| `500` | Erreur serveur | `{ "error": "Une erreur interne est survenue. Veuillez réessayer plus tard." }` |

> ⚠️ **Important** : La contrainte d'unicité doit être sur le champ `email`. Un même email ne doit pas pouvoir s'inscrire deux fois.

---

### 2. Endpoint HTTP — Export des inscrits (Admin)

| Propriété | Valeur |
|---|---|
| **Méthode** | `GET` |
| **URL** | `/api/beta/export` (ou équivalent) |
| **Authentification** | Header ou query param avec mot de passe admin (à définir entre nous) |

**Réponse attendue :** Fichier CSV téléchargeable avec les colonnes :
```
ID, Email, WhatsApp, Date d'inscription
```

---

### 3. Variables d'environnement à nous fournir

Une fois votre API déployée, merci de nous communiquer les éléments suivants pour que nous les configurions côté Hostinger :

```env
# URL de base de votre API backend
NEXT_PUBLIC_API_BASE_URL=https://api.votre-domaine.com

# Clé d'authentification pour sécuriser les requêtes (si requise)
API_SECRET_KEY=xxxxxxxxxxxx
```

---

### 4. CORS — Configuration obligatoire

Le frontend sera hébergé sur Hostinger (domaine à confirmer, ex: `https://beta.mikhmoai.com`).  
Votre API doit autoriser les requêtes cross-origin depuis ce domaine.

```
Access-Control-Allow-Origin: https://beta.mikhmoai.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

### 5. Schéma de la table attendue

Si vous partez de zéro, voici le schéma minimum de la table `beta_subscribers` :

```sql
CREATE TABLE beta_subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL UNIQUE,
  whatsapp    TEXT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Adaptez les types selon votre SGBD (PostgreSQL, MySQL, etc.).

---

## Ce que fera le Frontend une fois les endpoints fournis

1. Remplacer les appels actuels vers `/api/register` (Next.js route interne) par des appels vers `NEXT_PUBLIC_API_BASE_URL/api/beta/register`.
2. Remplacer la route d'export interne par un lien vers votre endpoint sécurisé.
3. Supprimer la dépendance `better-sqlite3` et le fichier `subscribers.db` local.
4. Tester l'intégration complète avant déploiement final sur Hostinger.

---

## Contact

Pour toute question ou précision sur le contrat d'API, contacter le responsable frontend du projet MikahmoAI.

---
*Document généré le 2026-06-19 — MikahmoAI Beta Project*
