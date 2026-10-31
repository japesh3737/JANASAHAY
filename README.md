# JANASAHAY

A civic grievance prototype built with React, Vite, Tailwind CSS, and Base44. Citizens can prepare complaints in English or Telugu, review an AI-assisted draft, and track records stored in the platform. It is not an official government portal and does not forward records to government departments.

## Local frontend

Use Node.js 24 and npm. From the project root in PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev -- --host 127.0.0.1
```

Open the local URL printed by Vite. The existing Base44 Vite plugin proxies platform API requests to the URL in `VITE_BASE44_APP_BASE_URL`. This mode uses the hosted app's live backend; saving a grievance or changing a status changes live data. Keep credentials and tokens out of source control. The example environment file contains only public configuration.

## Local backend

For temporary local entity data and auth, follow the Base44 CLI workflow:

```powershell
npx --yes --package base44 base44 login
npx --yes --package base44 base44 link
npx --yes --package base44 base44 dev
```

The CLI requires authentication and a linked app; local backend execution also requires Deno. The config in `base44/config.jsonc` starts the frontend automatically. Local backend data is temporary.

## Validation and current status

```powershell
npm run build
npm run lint
npm run typecheck
```

- Production build and ESLint passed during restoration.
- Homepage and sign-in page rendered in the local browser.
- Type checking currently fails on component prop declarations and other types in the exported source. The type checker does not emit files.
- The app's public settings endpoint returned HTTP 403 with reason `not_deployed` during verification. Publish the app in the Base44 editor before testing backend flows.
- Login, registration, AI generation, uploads, stored grievances, and admin updates have not been verified end to end. No test grievance or other business data was created during verification.

## Publishing

Pushing to GitHub saves source code. Publish the app from the Base44 editor to make its hosted backend available. A GitHub push alone is not evidence of a successful Base44 deployment.

This source was recovered from two complementary exports. Missing components were restored, startup imports were repaired, and downloader-injected dummy database functions were replaced with the installed Base44 SDK client. Dependencies and generated build files are excluded from Git.
