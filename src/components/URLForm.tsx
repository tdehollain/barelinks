import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';

// API function to save a link
const saveLink = async (url: string) => {
  console.log({ url });

  const response = await fetch('/api/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to save link');
  }

  return response.json();
};

export function URLForm() {
  const [url, setUrl] = useState('http://www.bbc.com/');

  const mutation = useMutation({
    mutationFn: saveLink,
    onSuccess: (data) => {
      console.log('Link saved successfully:', data);
      toast.success('Link saved successfully!', {
        description: data.data.title || data.data.url,
      });
      setUrl(''); // Clear form on success
    },
    onError: (error) => {
      console.error('Error saving link:', error);
      toast.error('Failed to save link', {
        description: error.message || 'Please try again later',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      mutation.mutate(url);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <form onSubmit={handleSubmit} className="flex gap-3">
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
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Adding...' : 'Add'}
        </Button>
      </form>
    </div>
  );
}
