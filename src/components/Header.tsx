import { Link } from '@tanstack/react-router';
import { LinkIcon, Sun, Moon } from 'lucide-react';
import { UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/button';

interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6" />
              <Link
                to="/"
                className="text-xl font-bold text-foreground hover:text-foreground transition-colors"
              >
                Barelinks
              </Link>
            </div>

            <nav className="flex items-center ml-4 space-x-2 text-sm font-medium">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="[&.active]:font-bold">
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/about" className="[&.active]:font-bold">
                  About
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="cursor-pointer"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            ) : (
              <SignInButton>
                <Button
                  variant="secondary"
                  size="sm"
                  className="cursor-pointer"
                >
                  Sign in
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>
      <main className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
