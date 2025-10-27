import { StrictMode } from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './hooks/useTheme';
import './styles.css';
=======
import { createRoot } from 'react-dom/client';
import './index.css';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { ThemeProvider } from './components/theme-provider.tsx';
import { RouterProvider, createRouter } from '@tanstack/react-router';
>>>>>>> preview

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

<<<<<<< HEAD
const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <ClerkProvider publishableKey={clerkPubKey}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ClerkProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
=======
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);
>>>>>>> preview
