import { Link } from '@tanstack/react-router';
import { LinkIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/button';

interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6" />
              <Link
                to="/"
                className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors"
              >
                Barelinks
              </Link>
            </div>
            
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/"
                className="transition-colors hover:text-foreground/80 [&.active]:text-foreground"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="transition-colors hover:text-foreground/80 [&.active]:text-foreground"
              >
                About
              </Link>
            </nav>
          </div>

          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>
      <main className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
