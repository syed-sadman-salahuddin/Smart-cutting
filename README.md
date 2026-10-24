# Smart Cutting

Smart Cutting is a React dashboard for a garment-cutting management application, built for Dekko Isho Group. It includes an overview dashboard, profile management, account settings, and navigation for administration and cutting workflows.

## Features

- Responsive dashboard layout with a collapsible sidebar and breadcrumb navigation
- Overview cards, charts, quick actions, and recent activity
- Login page and protected application routes
- Profile viewing and editing, including profile photo upload (up to 2 MB)
- Settings page with account details and security options
- Change-password page that updates the demo account's login password
- Download history page with search, a rows-per-page selector, and pagination
- English and Bengali translations with a language switcher
- Appearance customization: theme colors, light/dark mode, and configurable rounded styles

## Requirements

- Node.js (a recent LTS version; 20.19 or newer is recommended)
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000). The development server supports client-side route fallback, so you can open any route directly.

Build for production:

```bash
npm run build
```

The production bundle is generated in the `dist/` directory.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the webpack development server on port 3000 |
| `npm run build` | Creates an optimized production build in `dist/` |

## Demo login

The app seeds a development account when no user credentials exist:

- **Email:** `superuser@test.com`
- **Password:** `123456`

These credentials are for local demonstration only. This project's authentication is client-side and is not suitable for production use.

If you change the password on the Change Password page, the new password is stored in your browser. To restore the default, delete the `st-users` entry from your browser's local storage and reload the page.

## Data and persistence

This project currently uses browser storage rather than a backend API:

- Profile and dashboard data are stored in `localStorage`.
- Appearance and language preferences are stored in `localStorage`.
- Demo user credentials are stored in `localStorage` (`st-users`).
- Download history is read from `localStorage` (`st-downloads`) and is empty by default.
- Login sessions use `localStorage` when "Remember me" is selected; otherwise they use `sessionStorage`.

Clearing the browser's site data removes the locally stored profile, credentials, and preferences.

### Trying the download history

The download history list is empty until reports exist. To preview it with sample rows, run this in the browser console while the app is open, then reload:

```js
localStorage.setItem('st-downloads', JSON.stringify([
  { id: 1, report: 'PO List', file: 'po-list.xlsx', status: 'completed', requestedAt: '2026-10-24T10:15:00', completedAt: '2026-10-24T10:16:30' },
  { id: 2, report: 'Employees', file: null, status: 'processing', requestedAt: '2026-10-24T11:02:00', completedAt: null }
]));
location.reload();
```

Supported statuses are `completed`, `processing`, `pending`, and `failed`.

## Project structure

```text
public/                 HTML template and public assets
src/
  components/           Shared layout, header, sidebar, footer, and breadcrumbs
  components/overview/  Dashboard widgets
  data/                 Seed data and menu definitions
  hooks/                Current-user and browser-storage hooks
  pages/                Route-level pages
  services/             Browser storage helpers and database seeding
  styles/               Page and component stylesheets
  translations/         English and Bengali translation resources
  utils/                Authentication and theme helpers
```

## Main routes

| Route | Description |
| --- | --- |
| `/login` | Sign-in page |
| `/logout` | Signs the user out |
| `/` | Overview dashboard |
| `/superuser` or `/profile` | User profile |
| `/superuser/edit` or `/profile/edit` | Edit profile |
| `/settings` | Settings |
| `/settings/change-password` | Change password |
| `/download` | Download history |

Routes other than the login and logout pages are protected and redirect unauthenticated visitors to the sign-in page. Any other route shows a placeholder page.

## Technology

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/)
- [Lucide React](https://lucide.dev/) icons
- [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/)

## License

No license is specified in this repository.
