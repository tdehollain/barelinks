import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useUser } from '@clerk/clerk-react';

import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { LINKS_PER_PAGE } from '@/lib/constants';
import { TagIcon, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tag } from './Tag';
import { TagModal } from './TagModal';

export function LinksTable() {
  const { isLoaded, isSignedIn } = useUser();
  const deleteLink = useMutation(api.links.deleteLink);
  const detachTagFromLink = useMutation(api.tags.detachTagFromLink);
  const [deletingId, setDeletingId] = useState<Id<'links'> | null>(null);
  const [tagModalLink, setTagModalLink] = useState<{
    id: Id<'links'>;
    title?: string | null;
    tags: Array<Doc<'tags'>>;
  } | null>(null);
  const [removingTagKey, setRemovingTagKey] = useState<string | null>(null);

  const queryResult = useQuery(
    api.links.getLinks,
    isLoaded && isSignedIn ? { pageSize: LINKS_PER_PAGE } : 'skip'
  );
  const tagsResult = useQuery(
    api.tags.getTagsWithUsage,
    isLoaded && isSignedIn ? {} : 'skip'
  );

  const links = queryResult?.links ?? [];
  const tagsWithUsage = tagsResult?.tags ?? [];

  if (!isLoaded) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 text-center text-muted-foreground">
        Please sign in to view your links.
      </div>
    );
  }

  if (!queryResult) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 text-center text-muted-foreground">
        Loading your links…
      </div>
    );
  }

  const handleDelete = async (linkId: Id<'links'>) => {
    if (deletingId) {
      return;
    }

    try {
      setDeletingId(linkId);
      await deleteLink({ linkId });
    } catch (error) {
      console.error('Failed to delete link:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDetachTag = async (linkId: Id<'links'>, tagId: Id<'tags'>) => {
    const key = `${linkId}:${tagId}`;
    if (removingTagKey === key) {
      return;
    }

    try {
      setRemovingTagKey(key);
      await detachTagFromLink({ linkId, tagId });
    } catch (error) {
      console.error('Failed to remove tag from link:', error);
    } finally {
      setRemovingTagKey((currentKey) =>
        currentKey === key ? null : currentKey
      );
    }
  };

  if (links.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 text-center text-muted-foreground">
        No links yet. Save your first link to get started.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-2">
      {links.map((link) => (
        <div key={link._id} className="flex items-center gap-3 mb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(link._id)}
            disabled={deletingId === link._id}
            className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 p-1 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground italic">
            {new Date(link.createdAtIso).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
          </span>
          <div className="flex flex-1 items-center gap-1 min-w-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground truncate text-sm"
            >
              {link.title}
            </a>
            {link.tags.length > 0 && (
              <div className="flex items-center gap-2 ml-2">
                {link.tags.map((tag) => (
                  <Tag
                    key={tag._id}
                    name={tag.name}
                    color={tag.color}
                    showDelete
                    onDelete={() => handleDetachTag(link._id, tag._id)}
                    isDeleting={removingTagKey === `${link._id}:${tag._id}`}
                  />
                ))}
              </div>
            )}
            {(!link.tags || link.tags?.length < 3) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setTagModalLink({
                    id: link._id,
                    title: link.title ?? null,
                    tags: link.tags ?? [],
                  })
                }
                className="cursor-pointer"
              >
                <TagIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <TagModal
        open={tagModalLink !== null}
        onClose={() => setTagModalLink(null)}
        linkTitle={tagModalLink?.title}
        existingTags={tagsWithUsage}
        linkTags={tagModalLink?.tags}
        linkId={tagModalLink?.id}
      />
    </div>
  );
}
