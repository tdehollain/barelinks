## App description

This app allows users to save links for future reference.

- When the user enters a link's URL, the link appears in a list below (most recent first)
- Instead of showing the link's URL, the page's title is shown instead
- Users can add tags to each link

# App structure

- Links are saved in a cloud DB (Neon)
- The app is deployed on Vercel
- Authentication is provided by Clerk

# Authentication

This project uses Clerk to authenticate users and authorize API calls

- The user button is on the far right side of the nav bar
- When no user is signed it, there should be a button that says "Sign in"

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
