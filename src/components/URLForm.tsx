import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function URLForm() {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      console.log('Submitted URL:', url);
      // Handle URL submission logic here
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="url"
          placeholder="Enter a URL to shorten..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" className="cursor-pointer">
          Add
        </Button>
      </form>
    </div>
  );
}
