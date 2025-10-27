import { useMemo, useId, useState } from 'react';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { Search } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tag } from './Tag';

interface LinksSearchProps {
  tagsWithUsage: Array<{
    tag: Doc<'tags'>;
    count: number;
  }>;
  selectedTagId?: Id<'tags'> | null;
  onSelectTag?: (tagId: Id<'tags'> | null) => void;
  term?: string;
  onTermChange?: (value: string) => void;
}

export function LinksSearch({
  tagsWithUsage,
  selectedTagId = null,
  onSelectTag,
  term = '',
  onTermChange,
}: LinksSearchProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'term' | 'tag'>('term');
  const [tagFilter, setTagFilter] = useState('');
  const panelId = useId();

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

  const handleTagSelect = (tagId: Id<'tags'>) => {
    if (!onSelectTag) {
      return;
    }

    const nextSelection = selectedTagId === tagId ? null : tagId;
    onSelectTag(nextSelection);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-start gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={() => setIsVisible((previous) => !previous)}
          aria-expanded={isVisible}
          aria-controls={panelId}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">
            {isVisible ? 'Hide search options' : 'Show search options'}
          </span>
        </Button>
      </div>
      {isVisible && (
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
            <TabsContent value="term" className="pt-4">
              <Input
                placeholder="Search links by title or URL"
                value={term}
                onChange={(event) => onTermChange?.(event.target.value)}
              />
            </TabsContent>
            <TabsContent value="tag" className="pt-4 space-y-3">
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
      )}
    </div>
  );
}
