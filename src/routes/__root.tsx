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
