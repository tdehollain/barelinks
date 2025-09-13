import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tag } from './Tag';
import { tagColors } from '../lib/constants';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
}

interface TagData {
  id: number;
  name: string;
  color: string;
  link_count: number;
}

// API function to fetch existing tags
const fetchTags = async () => {
  const response = await fetch('/api/tags', {
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

// API function to create a tag
const createTag = async (tagData: { name: string; color: string }) => {
  const response = await fetch('/api/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tagData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create tag');
  }

  return response.json();
};

// API function to link a tag to a link
const linkTagToLink = async (linkData: { linkId: string; tagId: number }) => {
  const response = await fetch('/api/link-tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(linkData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to link tag to link');
  }

  return response.json();
};

// Combined function to create tag and link it to a link
const createTagAndLink = async (data: { name: string; color: string; linkId: string }) => {
  // Step 1: Create the tag
  const tagResponse = await createTag({ name: data.name, color: data.color });

  // Step 2: Link it to the link
  await linkTagToLink({ linkId: data.linkId, tagId: tagResponse.tag.id });

  return tagResponse;
};

export function TagModal({ isOpen, onClose, linkId }: TagModalProps) {
  const queryClient = useQueryClient();
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Fetch existing tags
  const { data: existingTags = [], isLoading: tagsLoading } = useQuery<TagData[]>({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  const createTagMutation = useMutation({
    mutationFn: createTagAndLink,
    onMutate: async ({ name, color, linkId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['links'] });
      
      // Create temporary tag
      const tempTag = {
        id: Date.now(), // Temporary ID
        name,
        color
      };
      
      // Store previous data for rollback
      const previousData = new Map();
      
      // Update all link queries to add the new tag optimistically
      queryClient.getQueryCache().getAll().forEach((query) => {
        if (query.queryKey[0] === 'links' && query.queryKey.length === 5) {
          const data = query.state.data;
          if (data) {
            previousData.set(query.queryKey, data);
            queryClient.setQueryData(query.queryKey, (old: any) => {
              if (!old) return old;
              return {
                ...old,
                links: old.links.map((link: any) => 
                  link.id === linkId 
                    ? { 
                        ...link, 
                        tags: [...link.tags, tempTag] 
                      }
                    : link
                )
              };
            });
          }
        }
      });
      
      // Also add the new tag to the tags list optimistically
      const currentTags = queryClient.getQueryData(['tags']);
      if (currentTags) {
        previousData.set(['tags'], currentTags);
        queryClient.setQueryData(['tags'], (old: TagData[] | undefined) => {
          if (!old) return old;
          return [...old, { 
            id: tempTag.id, 
            name: tempTag.name, 
            color: tempTag.color, 
            link_count: 1 
          }];
        });
      }
      
      return { previousData, tempTag };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables, context) => {
      // Replace temporary tag with real data
      if (context?.tempTag) {
        // Update links data
        queryClient.getQueryCache().getAll().forEach((query) => {
          if (query.queryKey[0] === 'links' && query.queryKey.length === 5) {
            const queryData = query.state.data;
            if (queryData) {
              queryClient.setQueryData(query.queryKey, (old: any) => {
                if (!old) return old;
                return {
                  ...old,
                  links: old.links.map((link: any) => 
                    link.id === variables.linkId 
                      ? { 
                          ...link, 
                          tags: link.tags.map((tag: any) => 
                            tag.id === context.tempTag.id 
                              ? { id: data.tag.id, name: data.tag.name, color: data.tag.color }
                              : tag
                          )
                        }
                      : link
                  )
                };
              });
            }
          }
        });
        
        // Update tags list data
        queryClient.setQueryData(['tags'], (old: TagData[] | undefined) => {
          if (!old) return old;
          return old.map((tag) => 
            tag.id === context.tempTag.id 
              ? { ...tag, id: data.tag.id }
              : tag
          );
        });
      }
      
      // Invalidate queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      // Reset form and close modal
      setTagName('');
      setSelectedColor('');
      onClose();
    },
  });

  const linkExistingTagMutation = useMutation({
    mutationFn: linkTagToLink,
    onMutate: async ({ linkId, tagId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['links'] });
      
      // Find the tag to add
      const tagToAdd = existingTags.find((t) => t.id === tagId);
      if (!tagToAdd) return;
      
      // Store previous data for rollback
      const previousData = new Map();
      
      // Update all link queries to add the tag optimistically
      queryClient.getQueryCache().getAll().forEach((query) => {
        if (query.queryKey[0] === 'links' && query.queryKey.length === 5) {
          const data = query.state.data;
          if (data) {
            previousData.set(query.queryKey, data);
            queryClient.setQueryData(query.queryKey, (old: any) => {
              if (!old) return old;
              return {
                ...old,
                links: old.links.map((link: any) => 
                  link.id === linkId 
                    ? { 
                        ...link, 
                        tags: [...link.tags, { 
                          id: tagToAdd.id, 
                          name: tagToAdd.name, 
                          color: tagToAdd.color 
                        }] 
                      }
                    : link
                )
              };
            });
          }
        }
      });
      
      return { previousData, tagToAdd };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim() || !selectedColor) return;

    createTagMutation.mutate({
      name: tagName.trim(),
      color: selectedColor,
      linkId,
    });
  };

  const handleTagClick = (tagId: number) => {
    linkExistingTagMutation.mutate({
      linkId,
      tagId,
    });
    onClose();
  };

  const handleClose = () => {
    setTagName('');
    setSelectedColor('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="existing" className="pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Tags</TabsTrigger>
            <TabsTrigger value="create">Create New Tag</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-6 min-h-56">
            <div className="space-y-4">
              {tagsLoading ? (
                <p className="text-sm text-muted-foreground">Loading tags...</p>
              ) : existingTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No existing tags yet. Create your first tag using the "Create New Tag" tab!</p>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Your Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {existingTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id)}
                        disabled={linkExistingTagMutation.isPending}
                        className="cursor-pointer transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Tag name={tag.name} color={tag.color} linkCount={tag.link_count} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-6 min-h-56">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="tag-name" className="w-20">
                  Tag Name
                </Label>
                <div className="flex-1">
                  <Input
                    id="tag-name"
                    type="text"
                    placeholder="Enter tag name..."
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value.slice(0, 25))}
                    maxLength={25}
                    className="w-full"
                  />
                  {/* <div className="text-xs text-muted-foreground mt-1">{tagName.length}/25 characters</div> */}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Label htmlFor="tag-color" className="w-20 mt-1">
                  Color
                </Label>
                <div className="flex-1">
                  <div className="grid grid-cols-10 gap-2">
                    {tagColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-all hover:scale-110 ${color.class} ${
                          selectedColor === color.value ? 'ring-3 ring-blue-500' : 'hover:ring-3 hover:ring-blue-400'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6 min-h-6">
                <Label className="w-20">Preview</Label>
                <div className="flex-1 flex justify-center">
                  {tagName.trim() && selectedColor && <Tag name={tagName.trim()} color={selectedColor} />}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={!tagName.trim() || !selectedColor || createTagMutation.isPending} className="flex-1">
                  {createTagMutation.isPending ? 'Creating...' : 'Create Tag'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
