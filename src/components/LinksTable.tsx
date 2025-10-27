import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { LINKS_PER_PAGE } from '@/lib/constants';
import { TagIcon, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tag } from './Tag';
import { TagModal } from './TagModal';
import { LinksSearch } from './LinksSearch';

export function LinksTable() {
  const { isLoaded, isSignedIn } = useUser();
  const deleteLink = useMutation(api.links.deleteLink);
  const detachTagFromLink = useMutation(api.tags.detachTagFromLink);
  const navigate = useNavigate({ from: '/' });
  const { page, term: searchParamTerm } = useSearch({ from: '/' });
  const currentPageIndex = Math.max(0, (page ?? 1) - 1);
  const [deletingId, setDeletingId] = useState<Id<'links'> | null>(null);
  const [tagModalLink, setTagModalLink] = useState<{
    id: Id<'links'>;
    title?: string | null;
    tags: Array<Doc<'tags'>>;
  } | null>(null);
  const [removingTagKey, setRemovingTagKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParamTerm ?? '');
  const [selectedTagId, setSelectedTagId] = useState<Id<'tags'> | null>(null);
  useEffect(() => {
    const normalized = searchParamTerm ?? '';
    setSearchTerm((current) => (current === normalized ? current : normalized));
  }, [searchParamTerm]);

  const queryResult = useQuery(
    api.links.getLinks,
    isLoaded && isSignedIn
      ? {
          page: currentPageIndex,
          pageSize: LINKS_PER_PAGE,
          tagId: selectedTagId ?? undefined,
          term: searchTerm.trim().length > 0 ? searchTerm.trim() : undefined,
        }
      : 'skip'
  );
  const tagsResult = useQuery(
    api.tags.getTagsWithUsage,
    isLoaded && isSignedIn ? {} : 'skip'
  );

  const isLoadingLinks = queryResult === undefined;
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

  const totalLinks = queryResult?.totalCount;
  const hasMore = queryResult?.hasMore ?? false;
  const totalPages =
    typeof totalLinks === 'number'
      ? Math.max(1, Math.ceil(totalLinks / LINKS_PER_PAGE))
      : currentPageIndex + 1 + (hasMore ? 1 : 0);
  const currentPageDisplay = currentPageIndex + 1;
  const trimmedSearchTerm = searchTerm.trim();
  const activeTag = selectedTagId
    ? tagsWithUsage.find(({ tag }) => tag._id === selectedTagId)?.tag ?? null
    : null;

  const handleTagFilterChange = (tagId: Id<'tags'> | null) => {
    setSelectedTagId(tagId);

    if (currentPageIndex !== 0) {
      navigate({
        to: '/',
        search: {
          page: 1,
          term: trimmedSearchTerm.length > 0 ? trimmedSearchTerm : undefined,
        },
      });
    }
  };

  const handleTermChange = (value: string) => {
    setSearchTerm(value);
    const normalizedValue = value.trim();
    navigate({
      to: '/',
      search: {
        page: 1,
        term: normalizedValue.length > 0 ? normalizedValue : undefined,
      },
    });
  };

  const noResultsMessage = (() => {
    if (trimmedSearchTerm.length > 0 && selectedTagId) {
      return `No links match "${trimmedSearchTerm}" with the selected tag.`;
    }

    if (trimmedSearchTerm.length > 0) {
      return `No links match "${trimmedSearchTerm}".`;
    }

    if (selectedTagId) {
      return 'No links match the selected tag yet.';
    }

    return 'No links yet. Save your first link to get started.';
  })();

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-3 mb-8">
      <LinksSearch
        tagsWithUsage={tagsWithUsage}
        selectedTagId={selectedTagId}
        onSelectTag={handleTagFilterChange}
        term={searchTerm}
        onTermChange={handleTermChange}
      />
      {trimmedSearchTerm.length > 0 && (
        <div className="flex flex-start items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing links matching
            {` "${trimmedSearchTerm}"`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => handleTermChange('')}
          >
            Clear
          </Button>
        </div>
      )}
      {activeTag && (
        <div className="flex flex-start items-center gap-2 text-sm text-muted-foreground">
          <span>Showing links with Tag</span>
          <Tag name={activeTag.name} color={activeTag.color} />
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => handleTagFilterChange(null)}
          >
            Clear
          </Button>
        </div>
      )}
      <div className="flex items-center justify-center gap-3 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            navigate({
              to: '/',
              search: {
                page: Math.max(1, currentPageIndex),
                term:
                  trimmedSearchTerm.length > 0 ? trimmedSearchTerm : undefined,
              },
            })
          }
          disabled={currentPageIndex === 0}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPageDisplay} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            navigate({
              to: '/',
              search: {
                page: currentPageIndex + 2,
                term:
                  trimmedSearchTerm.length > 0 ? trimmedSearchTerm : undefined,
              },
            })
          }
          disabled={!hasMore}
        >
          Next
        </Button>
      </div>
      {isLoadingLinks ? (
        <div className="w-full mt-4 text-center text-muted-foreground">
          Loading your links…
        </div>
      ) : links.length === 0 ? (
        <div className="w-full mt-4 text-center text-muted-foreground">
          {noResultsMessage}
        </div>
      ) : (
        links.map((link) => (
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
        ))
      )}
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
