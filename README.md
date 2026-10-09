# JSG eCMS — Next.js functional prototype

Source converted from the supplied eCMS-PLUS project. Next.js App Router, TypeScript, Tailwind CSS, Recharts and Lucide icons. Uses the supplied official Judicial Service of Ghana logo and retains the navy/gold interface style.

## Run locally in VS Code

Install Node.js 22 or newer. Extract this archive and open the `ecms-nextjs` folder in VS Code. In Terminal → New Terminal:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Select a demo role, keep its prefilled email, and sign in with `Demo@123`.

| Role | Email |
| --- | --- |
| Registrar | emmanuel.mensah@jsg.gov.gh |
| Judge | justice.mensah@jsg.gov.gh |
| Lawyer | esi.amankwah@lawghana.org |
| Administrator | admin@jsg.gov.gh |

Other demo accounts are available through the role selector. All use the same demo password. The role switcher is for demonstrating workflows, not authorization.

## Included screens

- Login with demo email/password validation; sign out returns to login.
- Registrar, judge and lawyer dashboards.
- Existing electronic filing wizard, registrar intake, case assignment, case registry and case tracking.
- Hearing scheduling and cause list/calendar table.
- Demo invoices/payments and notifications.
- Virtual Court: hearing selector, waiting room, local camera/microphone controls, local hearing notes and an external HTTPS meeting link.
- Existing mobile preview.

## Demo workflow

1. Sign in as a lawyer and open E-Filing → New Filing. Complete the wizard using its sample parties and documents.
2. Switch to Registrar and open E-Filing → Intake Queue. Approve a filing to register a case.
3. Assign a judge; the assignment is saved to the case. Schedule a hearing; its date and time appear on the case.
4. Open Hearings & Calendar to view hearings; open Virtual Court to try the demo room.
5. Paste a meeting URL from your chosen provider into Virtual Court to open a real meeting separately.

## Checks

```bash
npm run typecheck
npm test
npm run build
npm start
```

## Scope and limitations

This is a functional prototype, not a production court system or a complete implementation of all manuals. Existing parts of the UI use static sample metrics, sample parties, document metadata and fixed illustrative dates. Some sidebar modules still show Phase 1 placeholders. The filing document step is illustrative; actual file upload/storage is not implemented. Payments are simulated. The login was revised to follow the supplied PDF layout, pale-blue/navy/gold palette and courthouse artwork. Other screens retain their existing styling.

Demo records persist in browser localStorage, are shared across demo roles in that browser, and are not synchronized between devices. Login validation is client-side only. Firebase, server authorization, real payments, SMS/email, SSO, official audit logs, legal fee rules, secure document storage and live multiparty video are not connected. Do not enter actual court records or personal information. The virtual camera is a local preview; it does not stream to other participants or record footage. Notes are local demo notes, not an official transcript.

## Project structure

- `app/layout.tsx`: page metadata and global styling.
- `app/page.tsx`: browser-only demo entry point (avoids localStorage hydration mismatch).
- `src/App.tsx`: screen navigation and demo role switching.
- `src/components/screens/`: screens and workflows.
- `src/components/layout/`: sidebar, header and branding.
- `src/data/caseRepository.ts`: local demo persistence and workflow operations.
- `src/data/mockData.ts`: fictional sample records and accounts.
- `src/types/index.ts`: shared TypeScript models.
- `public/jsg-logo.svg`: supplied official logo with a circular clipping mask; original artwork is embedded unchanged. The original JPEG is also retained.
- `tests/repository.test.ts`: intake, assignment and hearing regression check.

Replace the demo repository with a server-backed data layer progressively. Keep secrets on the server and implement authenticated, role-scoped access before using real records.

## Branding correction

The official logo now uses a circular SVG mask to remove only the outer white margin. The sidebar emblem is enlarged to 96px, with white sans-serif organisation text and a gold platform label. Next.js development indicators are hidden to prevent the dev badge from obscuring the sidebar profile avatar. Restart the dev server after updating next.config.mjs.
