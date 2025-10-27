import { Tag as TagIcon, Trash2 } from 'lucide-react';
<<<<<<< HEAD
import { useMutation, useQueryClient } from '@tanstack/react-query';
=======
// import { useMutation, useQueryClient } from '@tanstack/react-query';
>>>>>>> preview
import { tagColors } from '../lib/constants';

interface TagProps {
  name: string;
  color: string;
  className?: string;
  showDelete?: boolean;
<<<<<<< HEAD
  onDelete?: () => void;
=======
  onDelete?: () => void | Promise<void>;
  isDeleting?: boolean;
>>>>>>> preview
  linkCount?: number;
  linkId?: string;
  tagId?: number;
}

<<<<<<< HEAD
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
    onMutate: async ({ linkId, tagId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['links'] });
      
      // Store previous data for rollback
      const previousData = new Map();
      
      // Update all link queries to remove the tag optimistically
      queryClient.getQueryCache().getAll().forEach((query) => {
        if (query.queryKey[0] === 'links' && query.queryKey.length === 5) {
          const data = query.state.data;
          if (data) {
            previousData.set(query.queryKey, data);
            queryClient.setQueryData(query.queryKey, (old: any) => {
              if (!old) return old;
              return {
                ...old,
                links: old.links.map((link: any) => 
                  link.id === linkId 
                    ? { ...link, tags: link.tags.filter((tag: any) => tag.id !== tagId) }
                    : link
                )
              };
            });
          }
        }
      });
      
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
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
=======
export function Tag({
  name,
  color,
  className = '',
  showDelete = false,
  onDelete,
  isDeleting = false,
  linkCount,
}: TagProps) {
  // const queryClient = useQueryClient();
  const colorClass =
    tagColors.find((c) => c.value === color)?.class ||
    'bg-gradient-to-r from-slate-500 to-slate-700';

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white rounded-full ${colorClass} ${className}`}
    >
      <TagIcon className="h-3 w-3" />
      {name}
      {linkCount !== undefined && ` (${linkCount})`}
      {showDelete && onDelete && (
        <button
          onClick={() => {
            void onDelete();
          }}
          disabled={isDeleting}
          aria-label={`Remove tag ${name}`}
>>>>>>> preview
          className="cursor-pointer ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
