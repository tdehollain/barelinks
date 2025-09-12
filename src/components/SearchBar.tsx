import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Tag } from './Tag';

interface SearchBarProps {
  onSearch: (keyword: string, selectedTags: number[]) => void;
  onClear: () => void;
  toggleButton?: React.ReactNode;
}

interface PopularTag {
  id: number;
  name: string;
  color: string;
  link_count: number;
}

// API function to fetch popular tags
const fetchPopularTags = async (): Promise<PopularTag[]> => {
  const response = await fetch('/api/tags?limit=8', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }

  const data = await response.json();
  return data.tags;
};

export function SearchBar({ onSearch, onClear, toggleButton }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  // Fetch popular tags
  const { data: popularTags = [] } = useQuery<PopularTag[]>({
    queryKey: ['popularTags'],
    queryFn: fetchPopularTags,
  });

  // Filter tags based on search query
  const filteredTags = popularTags.filter((tag) => tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()));

  // Handle search submission
  const handleSearch = () => {
    onSearch(keyword.trim(), selectedTags);
  };

  // Handle tag selection
  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  // Handle clear all
  const handleClear = () => {
    setKeyword('');
    setSelectedTags([]);
    setTagSearchQuery('');
    onClear();
  };

  // Auto-search when tags change
  useEffect(() => {
    if (selectedTags.length > 0) {
      onSearch(keyword, selectedTags);
    }
  }, [selectedTags, keyword, onSearch]);

  const hasActiveFilters = keyword.trim() || selectedTags.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="keyword" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-80 grid-cols-2">
            <TabsTrigger value="keyword" className="cursor-pointer px-2">
              Search by Keyword
            </TabsTrigger>
            <TabsTrigger value="tags" className="cursor-pointer px-2">
              Search by Tags
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button onClick={handleClear} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            {toggleButton}
          </div>
        </div>

        <Card className="py-4">
          <CardContent className="">
            <TabsContent value="keyword" className="mt-0">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search links by title or URL..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} size="sm">
                  Search
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tags" className="mt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Find tags:</span>
                  <Input
                    placeholder="Search tags..."
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    className="w-48 h-9"
                  />
                </div>

                {/* Popular/filtered tags */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleTagToggle(tag.id)}
                          className={`transition-all hover:scale-105 ${
                            selectedTags.includes(tag.id) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                          }`}
                        >
                          <Tag name={tag.name} color={tag.color} linkCount={tag.link_count} />
                        </button>
                      ))
                    ) : tagSearchQuery ? (
                      <span className="text-sm text-muted-foreground">No tags found matching "{tagSearchQuery}"</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags available</span>
                    )}
                  </div>

                  {/* Selected tags indicator */}
                  {selectedTags.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Selected tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedTags.map((tagId) => {
                          const tag = popularTags.find((t) => t.id === tagId);
                          if (!tag) return null;
                          return (
                            <button key={tagId} onClick={() => handleTagToggle(tagId)} className="relative group">
                              <Tag name={tag.name} color={tag.color} />
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                ×
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
