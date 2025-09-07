import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Trash2, Tag as TagIcon } from 'lucide-react';
import { TagModal } from './TagModal';
import { Tag } from './Tag';

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
}

// API function to fetch links
const fetchLinks = async (): Promise<Link[]> => {
  const response = await fetch('/api/links', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  const data = await response.json();
  return data.links;
};

// API function to delete a link
const deleteLink = async (id: string) => {
  console.log('Deleting link with ID:', id);

  const response = await fetch(`/api/links?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({ id }),
  });

  console.log('Delete response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Delete failed:', errorData);
    throw new Error(errorData.error || 'Failed to delete link');
  }

  return response.json();
};

export function LinksTable() {
  const queryClient = useQueryClient();
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string>('');

  const {
    data: links = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['links'],
    queryFn: fetchLinks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      toast.success('Link deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      toast.error('Failed to delete link', {
        description: error.message,
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTag = (id: string) => {
    setSelectedLinkId(id);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setTagModalOpen(false);
    setSelectedLinkId('');
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="text-center text-gray-500">Loading your links...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="text-center text-red-500">Failed to load links</div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="text-center text-gray-500">No links saved yet. Add your first link above!</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="space-y-1">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(link.id)}
                disabled={deleteMutation.isPending}
                className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground italic">{new Date(link.created_at).toLocaleDateString()}</span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground truncate">
                  {link.title}
                </a>
                {link.tags && link.tags.length > 0 && (
                  <div className="flex gap-2 flex-shrink-0">
                    {link.tags.map((tag) => (
                      <Tag key={tag.id} name={tag.name} color={tag.color} />
                    ))}
                  </div>
                )}
              </div>
              {(!link.tags || link.tags.length < 3) && (
                <Button variant="ghost" size="sm" onClick={() => handleTag(link.id)} className="cursor-pointer">
                  <TagIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <TagModal isOpen={tagModalOpen} onClose={handleCloseTagModal} linkId={selectedLinkId} />
    </>
  );
}
