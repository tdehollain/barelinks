import { Tag as TagIcon, Trash2 } from 'lucide-react';
import { tagColors } from '../lib/constants';

interface TagProps {
  name: string;
  color: string;
  className?: string;
}

export function Tag({ name, color, className = '' }: TagProps) {
  const colorClass = tagColors.find((c) => c.value === color)?.class || 'bg-gray-500';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white rounded-full ${colorClass} ${className}`}>
      <TagIcon className="h-3 w-3" />
      {name}
      <Trash2 className="h-3 w-3" />
    </div>
  );
}
