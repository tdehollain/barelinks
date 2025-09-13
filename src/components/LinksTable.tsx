import { useState } from 'react';
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
  );
}
