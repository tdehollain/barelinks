<<<<<<< HEAD
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '../components/Header';

export const Route = createRootRoute({
  component: () => (
    <Header>
      <Outlet />
      <Toaster position="top-center" />
      <TanStackRouterDevtools />
    </Header>
  ),
});
=======
import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { NavBar } from '@/components/NavBar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <NavBar />
      <Outlet />
    </React.Fragment>
  );
}
>>>>>>> preview
