import { Tag as TagIcon, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tagColors } from '../lib/constants';

interface TagProps {
  name: string;
  color: string;
  className?: string;
  showDelete?: boolean;
  onDelete?: () => void;
  linkCount?: number;
  linkId?: string;
  tagId?: number;
}

// API function to remove a tag from a link
const removeTagFromLink = async (linkId: string, tagId: number) => {
  const response = await fetch(`/api/link-tags?linkId=${linkId}&tagId=${tagId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to remove tag from link');
  }

  return response.json();
};

export function Tag({ name, color, className = '', showDelete = false, onDelete, linkCount, linkId, tagId }: TagProps) {
  const queryClient = useQueryClient();
  const colorClass = tagColors.find((c) => c.value === color)?.class || 'bg-gray-500';

  const removeTagMutation = useMutation({
    mutationFn: ({ linkId, tagId }: { linkId: string; tagId: number }) => removeTagFromLink(linkId, tagId),
    onSuccess: () => {
      toast.success('Tag removed from link');
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
      toast.error('Failed to remove tag', {
        description: error.message,
      });
    },
  });

  const handleDelete = () => {
    if (linkId && tagId) {
      removeTagMutation.mutate({ linkId, tagId });
    } else if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white rounded-full ${colorClass} ${className}`}>
      <TagIcon className="h-3 w-3" />
      {name}
      {linkCount !== undefined && ` (${linkCount})`}
      {showDelete && (
        <button 
          onClick={handleDelete} 
          disabled={removeTagMutation.isPending}
          className="cursor-pointer ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
