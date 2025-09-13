import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Link {
  id: string;
  url: string;
  title: string;
  created_at: string;
  tags: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  isPending?: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface LinksResponse {
  links: Link[];
  pagination: PaginationInfo;
}

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
  const [url, setUrl] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveLink,
    onMutate: async (url) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['links'] });
      
      // Create temporary link with URL as title
      const tempId = `temp-${Date.now()}`;
      const tempLink: Link = {
        id: tempId,
        url: url,
        title: url, // Show URL until we get the real title
        created_at: new Date().toISOString(),
        tags: [],
        isPending: true
      };
      
      // Get all existing queries and update them
      const previousData = new Map();
      
      // Update all link queries to add the new link at the beginning
      queryClient.getQueryCache().getAll().forEach((query) => {
        if (query.queryKey[0] === 'links' && query.queryKey.length === 5) {
          const data = query.state.data as LinksResponse | undefined;
          if (data && query.queryKey[1] === 1) { // Only add to page 1
            previousData.set(query.queryKey, data);
            queryClient.setQueryData(query.queryKey, {
              ...data,
              links: [tempLink, ...data.links],
              pagination: {
                ...data.pagination,
                total: data.pagination.total + 1
              }
            });
          }
        }
      });
      
      return { tempId, previousData };
    },
    onError: (error, _, context) => {
      // Rollback on error - restore all previous data
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Error saving link:', error);
    },
    onSuccess: (data, _, context) => {
      console.log('Link saved successfully:', data);
      
      // Replace temporary link with real data in all queries
      if (context?.tempId) {
        queryClient.getQueryCache().getAll().forEach((query) => {
          if (query.queryKey[0] === 'links' && query.queryKey.length === 5) {
            const queryData = query.state.data as LinksResponse | undefined;
            if (queryData && query.queryKey[1] === 1) { // Only update page 1
              queryClient.setQueryData(query.queryKey, {
                ...queryData,
                links: queryData.links.map(link => 
                  link.id === context.tempId ? data.data : link
                )
              });
            }
          }
        });
      }
      
      setUrl(''); // Clear form on success
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      mutation.mutate(url);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-16">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input type="url" placeholder="Enter a URL..." value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" required />
        <Button type="submit" className="cursor-pointer" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Add'}
        </Button>
      </form>
    </div>
  );
}
