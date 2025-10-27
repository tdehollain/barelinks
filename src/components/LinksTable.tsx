import { useState } from 'react';
<<<<<<< HEAD
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Trash2, Tag as TagIcon, Search } from 'lucide-react';
import { TagModal } from './TagModal';
import { Tag } from './Tag';
import { SearchBar } from './SearchBar';
import { LINKS_PER_PAGE } from '../lib/constants';

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

// API function to fetch links with pagination and search
const fetchLinks = async (page: number = 1, limit: number = 10, keyword: string = '', tagIds: number[] = []): Promise<LinksResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (keyword.trim()) {
    params.append('keyword', keyword.trim());
  }

  if (tagIds.length > 0) {
    params.append('tagIds', tagIds.join(','));
  }

  const response = await fetch(`/api/links?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  return response.json();
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
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(LINKS_PER_PAGE);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const { data, isLoading, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['links', currentPage, pageSize, searchKeyword, selectedTagIds],
    queryFn: () => fetchLinks(currentPage, pageSize, searchKeyword, selectedTagIds),
    enabled: isSignedIn, // Only fetch when user is signed in
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when returning to tab
  });

  const links = data?.links || [];
  const pagination = data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onMutate: async (deletedLinkId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['links'] });
      
      // Get current data and remove the link optimistically
      const previousData = queryClient.getQueryData(['links', currentPage, pageSize, searchKeyword, selectedTagIds]);
      
      queryClient.setQueryData(['links', currentPage, pageSize, searchKeyword, selectedTagIds], (old: LinksResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          links: old.links.filter((link: Link) => link.id !== deletedLinkId),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1
          }
        };
      });
      
      return { previousData };
    },
    onError: (err, _, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['links', currentPage, pageSize, searchKeyword, selectedTagIds], context.previousData);
      }
    },
    onSuccess: () => {
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (keyword: string, tagIds: number[]) => {
    setSearchKeyword(keyword);
    setSelectedTagIds(tagIds);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setSelectedTagIds([]);
    setCurrentPage(1);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <>
      {/* Search Toggle Button or SearchBar */}
      <div className="w-full max-w-5xl mx-auto my-4">
        {!showSearchBar ? (
          <div className="flex justify-end">
            <Button onClick={toggleSearchBar} variant="outline" size="sm" className="flex items-center gap-2 w-32">
              <Search className="h-4 w-4" />
              Show Search
            </Button>
          </div>
        ) : (
          <div className={`transition-all duration-300 overflow-hidden ${showSearchBar ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              toggleButton={
                <Button onClick={toggleSearchBar} variant="outline" size="sm" className="flex items-center gap-2 w-32">
                  <Search className="h-4 w-4" />
                  Hide Search
                </Button>
              }
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="w-full max-w-4xl mx-auto mt-8">
          <div className="text-center text-gray-500">{isSignedIn ? 'Loading your links...' : 'Please sign in to view your links'}</div>
        </div>
      ) : error ? (
        <div className="w-full max-w-4xl mx-auto mt-8">
          <div className="text-center text-red-500">Failed to load links</div>
        </div>
      ) : links.length === 0 ? (
        <div className="w-full max-w-4xl mx-auto mt-8">
          <div className="text-center text-gray-500">
            {searchKeyword || selectedTagIds.length > 0
              ? 'No links found matching your search criteria.'
              : 'No links saved yet. Add your first link above!'}
          </div>
        </div>
      ) : (
        <>
          <div className="w-full max-w-5xl mx-auto mt-8">
            {isFetching && !isPlaceholderData && <div className="text-center text-sm text-muted-foreground mb-2">Loading...</div>}
            <div className={`space-y-1 ${isPlaceholderData ? 'opacity-60' : ''}`}>
              {links.map((link: Link) => (
                <div key={link.id} className={`flex items-center gap-3 ${link.isPending ? 'opacity-50' : ''}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                    disabled={deleteMutation.isPending}
                    className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground italic">{new Date(link.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground truncate">
                      {link.title}
                    </a>
                    {link.tags && link.tags.length > 0 && (
                      <div className="flex gap-2 flex-shrink-0">
                        {link.tags.map((tag: { id: number; name: string; color: string }) => (
                          <Tag key={tag.id} name={tag.name} color={tag.color} showDelete={true} linkId={link.id} tagId={tag.id} />
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

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="w-full max-w-5xl mx-auto mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} links
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev || isFetching}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    if (pagination.totalPages <= 5) {
                      return pageNum;
                    }
                    // Show first 2, current page area, and last 2
                    if (pageNum <= 2 || pageNum >= pagination.totalPages - 1 || Math.abs(pageNum - currentPage) <= 1) {
                      return pageNum;
                    }
                    return null;
                  }).map((pageNum) => {
                    if (pageNum === null) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isFetching}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
=======
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

export function LinksTable() {
  const { isLoaded, isSignedIn } = useUser();
  const deleteLink = useMutation(api.links.deleteLink);
  const detachTagFromLink = useMutation(api.tags.detachTagFromLink);
  const navigate = useNavigate({ from: '/' });
  const {
    page,
    term: searchParamTerm,
    tag: searchParamTag,
  } = useSearch({ from: '/' });
  const currentPageIndex = Math.max(0, (page ?? 1) - 1);
  const [deletingId, setDeletingId] = useState<Id<'links'> | null>(null);
  const [tagModalLink, setTagModalLink] = useState<{
    id: Id<'links'>;
    title?: string | null;
    tags: Array<Doc<'tags'>>;
  } | null>(null);
  const [removingTagKey, setRemovingTagKey] = useState<string | null>(null);
  const selectedTagId = (searchParamTag ?? null) as Id<'tags'> | null;

  const queryResult = useQuery(
    api.links.getLinks,
    isLoaded && isSignedIn
      ? {
          page: currentPageIndex,
          pageSize: LINKS_PER_PAGE,
          tagId: selectedTagId ?? undefined,
          term:
            (searchParamTerm ?? '').length > 0 ? searchParamTerm : undefined,
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
  const trimmedSearchTerm = (searchParamTerm ?? '').trim();
  const activeTag = selectedTagId
    ? tagsWithUsage.find(({ tag }) => tag._id === selectedTagId)?.tag ?? null
    : null;

  const termForSearchParam =
    trimmedSearchTerm.length > 0 ? trimmedSearchTerm : undefined;
  const tagForSearchParam = selectedTagId ?? undefined;

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
    <div className="w-full max-w-5xl mx-auto space-y-3 mb-8">
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
            onClick={() =>
              navigate({
                to: '/',
                search: {
                  page: 1,
                  term: undefined,
                  tag: tagForSearchParam,
                },
              })
            }
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
            onClick={() =>
              navigate({
                to: '/',
                search: {
                  page: 1,
                  term: termForSearchParam,
                  tag: undefined,
                },
              })
            }
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
                term: termForSearchParam,
                tag: tagForSearchParam,
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
                term: termForSearchParam,
                tag: tagForSearchParam,
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
>>>>>>> preview
  );
}
