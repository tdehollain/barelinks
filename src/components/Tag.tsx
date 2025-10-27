import { Tag as TagIcon, Trash2 } from 'lucide-react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagColors } from '../lib/constants';

interface TagProps {
  name: string;
  color: string;
  className?: string;
  showDelete?: boolean;
  onDelete?: () => void | Promise<void>;
  isDeleting?: boolean;
  linkCount?: number;
  linkId?: string;
  tagId?: number;
}

export function Tag({ name, color, className = '', showDelete = false, onDelete, isDeleting = false, linkCount }: TagProps) {
  // const queryClient = useQueryClient();
  const colorClass = tagColors.find((c) => c.value === color)?.class || 'bg-gradient-to-r from-slate-500 to-slate-700';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white rounded-full ${colorClass} ${className}`}>
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
          className="cursor-pointer ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
