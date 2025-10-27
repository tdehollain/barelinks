import { useId, useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LinksSearch } from './LinksSearch';
import { Search } from 'lucide-react';

export function URLForm() {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchPanelId = useId();
  const createLink = useAction(api.linkActions.createLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createLink({
        url: trimmedUrl,
      });
      setUrl('');
    } catch (error) {
      console.error('Failed to create link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-16">
      <div className="mt-4 flex w-full items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-pointer shrink-0"
          onClick={() => setIsSearchVisible((previous) => !previous)}
          aria-expanded={isSearchVisible}
          aria-controls={searchPanelId}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">
            {isSearchVisible ? 'Hide search options' : 'Show search options'}
          </span>
        </Button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 items-center gap-3"
        >
          <Input
            type="url"
            placeholder="Enter a URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            required
          />
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            Add
          </Button>
        </form>
      </div>
      <div className="mt-4">
        <LinksSearch isVisible={isSearchVisible} panelId={searchPanelId} />
      </div>
    </div>
  );
}
