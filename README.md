# SehaMaroc

EN | [FR](#francais)

SehaMaroc is a healthcare management web application built with Next.js. It provides two interfaces:

- A patient portal for profile management, medical requests, notifications, history, and certificates
- A provider portal for patient management, request handling, medical records, and certificate issuance

The project currently focuses on the frontend experience and dashboard workflows. Some parts already call external authentication APIs, while other features still rely on local mock data.

## Overview

### Main features

- Patient authentication and registration flow
- Provider authentication flow
- Patient dashboard
- Provider dashboard
- Patient profile management
- Provider profile management
- Medical request creation and tracking
- Medical record management
- Certificate generation and download views
- Notifications and consultation history pages
- Multilingual UI: English, French, and Arabic

### Tech stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Radix UI
- Lucide icons
- Vercel Analytics

## Project status

This repository is best described as a frontend application in active development.

- Authentication is connected to backend endpoints
- Several business screens still use mock data from `lib/mock-data.js`
- User session data is stored in `localStorage`
- No backend code is included in this repository

## Authentication services

The app expects external authentication services running locally:

- Patient auth API: `http://localhost:8081/api/auth`
- Provider auth API: `http://localhost:8082/api/auth`

If those services are not running, login and registration requests will fail.

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open `http://localhost:3000`.

### Production build

```bash
npm run build
npm run start
```

## Available scripts

- `npm run dev`: start the development server
- `npm run build`: build the application
- `npm run start`: run the production build
- `npm run lint`: run linting

## Project structure

```text
app/           Next.js app router pages
components/    Shared UI and feature components
contexts/      React context providers
hooks/         Reusable hooks
lib/           Utilities, translations, and mock data
public/        Static assets
styles/        Global styles
```

## Key application areas

### Public pages

- Landing page
- Patient authentication
- Provider authentication

### Patient area

- Dashboard
- Profile
- Requests
- Notifications
- Medical history
- Certifications

### Provider area

- Dashboard
- Patients
- Requests
- Medical records
- Certificates
- Profile

## Internationalization

The interface supports:

- English
- French
- Arabic

Translations are defined in `lib/translations.js`, and language preference is stored in `localStorage`.

## Notes and limitations

- This repository does not include a database or backend server
- Some pages use mock objects for demonstration and UI testing
- Provider registration exists in code history/comments but is currently disabled in the UI
- A few translated strings appear to have encoding issues and may need cleanup

## Suggested improvements

- Replace mock data with real API integration across all dashboards and pages
- Move authentication and session handling to a more secure approach
- Add environment variables for API base URLs
- Add tests and CI validation
- Document backend dependencies and contract formats

## License

No license file is currently included in this repository.

---

## Francais

SehaMaroc est une application web de gestion de sante construite avec Next.js. Elle propose deux espaces principaux :

- Un portail patient pour gerer le profil, les demandes medicales, les notifications, l'historique et les certificats
- Un portail professionnel de sante pour gerer les patients, traiter les demandes, administrer les dossiers medicaux et emettre des certificats

Le projet est actuellement centre sur l'experience frontend et les parcours applicatifs. Certaines parties utilisent deja des API d'authentification externes, tandis que d'autres fonctionnalites reposent encore sur des donnees mockees locales.

## Vue d'ensemble

### Fonctionnalites principales

- Authentification et inscription patient
- Authentification professionnel de sante
- Tableau de bord patient
- Tableau de bord professionnel
- Gestion du profil patient
- Gestion du profil professionnel
- Creation et suivi des demandes medicales
- Gestion des dossiers medicaux
- Generation et consultation des certificats
- Pages de notifications et d'historique medical
- Interface multilingue : anglais, francais et arabe

### Stack technique

- Next.js 16
- React 19
- Tailwind CSS 4
- Radix UI
- Lucide icons
- Vercel Analytics

## Etat du projet

Ce depot doit etre considere comme une application frontend en cours de developpement.

- L'authentification est connectee a des endpoints backend
- Plusieurs ecrans metier utilisent encore des donnees mockees depuis `lib/mock-data.js`
- Les donnees de session utilisateur sont stockees dans `localStorage`
- Aucun code backend n'est inclus dans ce depot

## Services d'authentification

L'application attend des services d'authentification externes executés en local :

- API auth patient : `http://localhost:8081/api/auth`
- API auth professionnel : `http://localhost:8082/api/auth`

Si ces services ne sont pas demarres, les actions de connexion et d'inscription echoueront.

## Demarrage rapide

### Prerequis

- Node.js 18+ recommande
- npm

### Installation

```bash
npm install
```

### Lancer le serveur de developpement

```bash
npm run dev
```

Puis ouvrir `http://localhost:3000`.

### Build de production

```bash
npm run build
npm run start
```

## Scripts disponibles

- `npm run dev` : lance le serveur de developpement
- `npm run build` : construit l'application
- `npm run start` : lance la version de production
- `npm run lint` : execute le lint

## Structure du projet

```text
app/           Pages Next.js App Router
components/    Composants UI et composants fonctionnels
contexts/      Providers React
hooks/         Hooks reutilisables
lib/           Utilitaires, traductions et donnees mockees
public/        Ressources statiques
styles/        Styles globaux
```

## Zones principales de l'application

### Pages publiques

- Page d'accueil
- Authentification patient
- Authentification professionnel

### Espace patient

- Tableau de bord
- Profil
- Demandes
- Notifications
- Historique medical
- Certificats

### Espace professionnel

- Tableau de bord
- Patients
- Demandes
- Dossiers medicaux
- Certificats
- Profil

## Internationalisation

L'interface prend en charge :

- Anglais
- Francais
- Arabe

Les traductions sont definies dans `lib/translations.js`, et la langue choisie est stockee dans `localStorage`.

## Remarques et limites

- Ce depot ne contient ni base de donnees ni serveur backend
- Certaines pages utilisent des objets mockes pour la demonstration et les tests UI
- L'inscription professionnel existe dans le code commente, mais elle est desactivee dans l'interface
- Quelques chaines de traduction semblent avoir des problemes d'encodage et meritent un nettoyage

## Ameliorations recommandees

- Remplacer les donnees mockees par de vraies integrations API sur l'ensemble des pages
- Renforcer la gestion de l'authentification et de la session
- Ajouter des variables d'environnement pour les URLs d'API
- Ajouter des tests et une validation CI
- Documenter les dependances backend et les contrats d'API

## Licence

Aucun fichier de licence n'est actuellement inclus dans ce depot.
