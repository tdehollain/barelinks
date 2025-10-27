import { type FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useMutation } from 'convex/react';

import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { tagColors } from '../lib/constants';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Tag } from './Tag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TagModalProps {
  open: boolean;
  onClose: () => void;
  linkTitle?: string | null;
  existingTags?: Array<{
    tag: Doc<'tags'>;
    count: number;
  }>;
  linkTags?: Doc<'tags'>[];
  linkId?: Id<'links'>;
}

export function TagModal({ open, onClose, linkTitle, existingTags, linkTags, linkId }: TagModalProps) {
  const [activeTab, setActiveTab] = useState<'existing' | 'create'>('existing');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(tagColors[0]?.value ?? 'gray');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const attachTagToLink = useMutation(api.tags.attachTagToLink);
  const createTag = useMutation(api.tags.createTag);

  const handleTabChange = (value: string) => {
    if (value === 'existing' || value === 'create') {
      setActiveTab(value);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveTab('existing');
      setSearchTerm('');
      setIsAttaching(false);
      setNewTagName('');
      setSelectedColor(tagColors[0]?.value ?? 'gray');
      setIsCreating(false);
      setCreateError(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const safeTitle = linkTitle?.trim() || 'Untitled link';
  const attachedTagIds = new Set(linkTags?.map((tag) => tag._id) ?? []);
  const availableTags = (existingTags ?? []).filter(({ tag }) => !attachedTagIds.has(tag._id));
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTags =
    normalizedSearch.length === 0
      ? availableTags.slice(0, 10)
      : availableTags.filter(({ tag }) => tag.name.toLowerCase().includes(normalizedSearch));
  const displayedTags = normalizedSearch.length === 0 ? filteredTags : filteredTags.slice(0, 10);
  const hasExistingTags = (existingTags?.length ?? 0) > 0;
  const hasAvailableTags = availableTags.length > 0;

  const handleTagClick = async (tagId: Id<'tags'>) => {
    if (!linkId || isAttaching) {
      return;
    }

    try {
      setIsAttaching(true);
      await attachTagToLink({ linkId, tagId });
      onClose();
    } catch (error) {
      console.error('Failed to attach tag to link:', error);
      setIsAttaching(false);
    }
  };

  const handleCreateTag = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCreating) {
      return;
    }

    const trimmedName = newTagName.trim();
    if (trimmedName.length === 0) {
      setCreateError('Tag name is required.');
      return;
    }

    if (trimmedName.length > 20) {
      setCreateError('Tag name must be 20 characters or fewer.');
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);
      const result = await createTag({
        name: trimmedName,
        color: selectedColor,
      });

      const createdTagId = result?.tagId;
      if (linkId && createdTagId) {
        await attachTagToLink({ linkId, tagId: createdTagId });
      }

      onClose();
    } catch (error) {
      console.error('Failed to create tag:', error);
      const message = error instanceof Error ? error.message : 'Failed to create tag.';
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-card p-6 shadow-xl flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add Tag</h2>
            <span className="mt-1 block text-sm text-muted-foreground">For: "{safeTitle}"</span>
          </div>
          <Button type="button" variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4 flex flex-1 flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="existing" className="flex-1 cursor-pointer">
              Existing Tag
            </TabsTrigger>
            <TabsTrigger value="create" className="flex-1 cursor-pointer">
              Create New Tag
            </TabsTrigger>
          </TabsList>
          <TabsContent value="existing" className="flex-1">
            <Card className="flex h-full min-h-[14rem] flex-col">
              <CardContent className="flex-1 overflow-y-auto">
                {hasExistingTags ? (
                  hasAvailableTags ? (
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder="Search tags..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        disabled={isAttaching}
                      />
                      {filteredTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {displayedTags.map(({ tag, count }) => (
                            <button
                              key={tag._id}
                              type="button"
                              onClick={() => handleTagClick(tag._id)}
                              disabled={isAttaching}
                              className="group inline-flex rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Tag
                                name={tag.name}
                                color={tag.color}
                                linkCount={count}
                                className="transition-transform group-hover:scale-[1.02]"
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags match "{searchTerm}".</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">All available tags are already attached to this link.</p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">You have not created any tags yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="create" className="flex-1">
            <Card className="flex h-full min-h-[14rem] flex-col">
              <CardContent className="flex-1 overflow-y-auto">
                <form className="flex h-full flex-col gap-3" onSubmit={handleCreateTag}>
                  <div className="space-y-2 mt-4">
                    <Input
                      id="new-tag-name"
                      placeholder="e.g. Inspiration"
                      value={newTagName}
                      onChange={(event) => {
                        setNewTagName(event.target.value);
                        if (createError) {
                          setCreateError(null);
                        }
                      }}
                      maxLength={20}
                      disabled={isCreating}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Max 20 characters</span>
                      <span>{newTagName.trim().length}/20</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center mt-2 gap-3 overflow-x-auto pb-1">
                      {tagColors.map((colorOption) => {
                        const isSelected = colorOption.value === selectedColor;
                        return (
                          <button
                            key={colorOption.value}
                            type="button"
                            onClick={() => setSelectedColor(colorOption.value)}
                            disabled={isCreating}
                            aria-label={colorOption.name}
                            aria-pressed={isSelected}
                            className={`h-9 w-9 rounded-full border-2 cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 ${
                              isSelected ? 'border-primary' : 'border-transparent hover:border-primary/60'
                            }`}
                          >
                            <span aria-hidden="true" className={`block h-full w-full rounded-full ${colorOption.class}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {createError && <p className="text-sm text-destructive">{createError}</p>}

                  <div className="mt-auto flex justify-end">
                    <Button type="submit" disabled={isCreating || newTagName.trim().length === 0}>
                      Create &amp; add tag
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
