import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { UserButton, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { DarkModeToggle } from './DarkModeToggle';
import { Link } from '@tanstack/react-router';
import { LinkIcon } from 'lucide-react';

export function NavBar() {
  return (
    <div className="bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6" />
              <Link
                to="/"
                search={{ page: 1, term: undefined }}
                className="text-xl font-bold text-foreground hover:text-foreground transition-colors"
              >
                Barelinks - Save your links, plain and simple
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DarkModeToggle />

            <Unauthenticated>
              <SignInButton />
            </Unauthenticated>
            <Authenticated>
              <UserButton />
              <SignOutButton />
            </Authenticated>
            <AuthLoading>
              <p>Still loading</p>
            </AuthLoading>
          </div>
        </div>
      </header>
    </div>
  );
}
