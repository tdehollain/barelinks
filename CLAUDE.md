# Session Setup Instructions

**IMPORTANT:** At the start of each new session, immediately read these files to understand current project status:

- Read `docs/DEVELOPMENT.md` for current implementation status and next steps
- Read `docs/TODO.md` for pending tasks and priorities

## App description

This app allows users to save links for future reference.

- When the user enters a link's URL, the link appears in a list below (most recent first)
- Instead of showing the link's URL, the page's title is shown instead
- Users can add tags to each link

# Flow: adding a link

1. User submits URL via form
2. Frontend sends only URL to /api/links
3. Server fetches page title (new step 5)
4. Server saves URL + title to database
5. Tags will be added later by user (separate feature)

# App structure

- Links are saved in a cloud DB (Neon)
- The app is deployed on Vercel
- Authentication is provided by Clerk

# Authentication

This project uses Clerk to authenticate users and authorize API calls

- The user button is on the far right side of the nav bar
- When no user is signed it, there should be a button that says "Sign in"

# Database

Data for this app is stored on Neon DB.
Server function can connect to it using the following code:

```tsx
import { neon } from '@neondatabase/serverless';
const sql = neon(
  'postgresql://neondb_owner:NEON_DB_PASSWORD@ep-summer-mode-aga44vze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
);
```

Where NEON_DB_PASSWORD is an environment variable

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpx shadcn@latest add button
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router';
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).
