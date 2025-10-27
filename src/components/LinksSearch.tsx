import { useMemo, useId, useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tag } from './Tag';

interface LinksSearchProps {
  isVisible: boolean;
  panelId?: string;
}

export function LinksSearch({
  isVisible,
  panelId: providedPanelId,
}: LinksSearchProps) {
  const navigate = useNavigate({ from: '/' });
  const searchParams = useSearch({ from: '/' });
  const { isLoaded, isSignedIn } = useUser();
  const selectedTagId = (searchParams.tag ?? null) as Id<'tags'> | null;
  const [searchTerm, setSearchTerm] = useState(searchParams.term ?? '');
  const [activeTab, setActiveTab] = useState<'term' | 'tag'>('term');
  const [tagFilter, setTagFilter] = useState('');
  const fallbackPanelId = useId();
  const panelId = providedPanelId ?? fallbackPanelId;

  useEffect(() => {
    const normalized = searchParams.term ?? '';
    setSearchTerm((current) => (current === normalized ? current : normalized));
  }, [searchParams.term]);

  const tagsResult = useQuery(
    api.tags.getTagsWithUsage,
    isLoaded && isSignedIn ? {} : 'skip'
  );
  const tagsWithUsage = useMemo(
    () => tagsResult?.tags ?? [],
    [tagsResult?.tags]
  );

  const filteredTags = useMemo(() => {
    const normalizedFilter = tagFilter.trim().toLowerCase();
    const filtered =
      normalizedFilter.length === 0
        ? tagsWithUsage
        : tagsWithUsage.filter(({ tag }) =>
            tag.name.toLowerCase().includes(normalizedFilter)
          );

    return [...filtered].sort((a, b) => b.count - a.count).slice(0, 10);
  }, [tagFilter, tagsWithUsage]);

  const trimmedSearchTerm = searchTerm.trim();

  const handleTermChange = (value: string) => {
    setSearchTerm(value);
    const normalizedValue = value.trim();
    navigate({
      to: '/',
      search: {
        page: 1,
        term: normalizedValue.length > 0 ? normalizedValue : undefined,
        tag: selectedTagId ?? undefined,
      },
    });
  };

  const handleTagSelect = (tagId: Id<'tags'>) => {
    const nextSelection = selectedTagId === tagId ? null : tagId;
    navigate({
      to: '/',
      search: {
        page: 1,
        term: trimmedSearchTerm.length > 0 ? trimmedSearchTerm : undefined,
        tag: nextSelection ?? undefined,
      },
    });
  };

  return isVisible ? (
    <div
      id={panelId}
      className="flex w-full flex-col gap-2 rounded-lg border border-border bg-card/70 p-4"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value === 'term' || value === 'tag') {
            setActiveTab(value);
          }
        }}
        className=""
      >
        <TabsList>
          <TabsTrigger value="term" className="cursor-pointer">
            By term
          </TabsTrigger>
          <TabsTrigger value="tag" className="cursor-pointer">
            By tag
          </TabsTrigger>
        </TabsList>
        <TabsContent value="term" className="">
          <Input
            placeholder="Search links by title or URL"
            value={searchTerm}
            onChange={(event) => handleTermChange(event.target.value)}
          />
        </TabsContent>
        <TabsContent value="tag" className="space-y-3">
          {tagsWithUsage.length > 0 ? (
            <>
              <Input
                placeholder="Filter tags by name"
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
              />
              {filteredTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(({ tag, count }) => {
                    const isSelected = selectedTagId === tag._id;
                    return (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => handleTagSelect(tag._id)}
                        className={`cursor-pointer inline-flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        aria-pressed={isSelected}
                      >
                        <Tag
                          name={tag.name}
                          color={tag.color}
                          linkCount={count}
                          className={isSelected ? 'ring-0' : ''}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tags match "{tagFilter}".
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You have not created any tags yet. Create a tag from a link to
              search by tag here.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  ) : null;
}
