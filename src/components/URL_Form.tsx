import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function URLForm() {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="url"
          placeholder="Enter a URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
          Add
        </Button>
      </form>
    </div>
  );
}
