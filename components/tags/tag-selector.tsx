"use client";

import { useState } from "react";
import { TagBadge } from "@/components/tags/tag-badge";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface TagOption {
  id: string;
  name: string;
}

interface TagSelectorProps {
  availableTags: TagOption[];
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagsChange,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((id) => id !== tagId));
  };

  const selectedTagObjects = availableTags.filter((tag) =>
    selectedTags.includes(tag.id)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTagObjects.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            onRemove={() => handleRemoveTag(tag.id)}
          />
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="gap-1">
              <IconPlus className="h-3 w-3" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => {
                        handleToggleTag(tag.id);
                        setOpen(false);
                      }}
                    >
                      {tag.name}
                      {selectedTags.includes(tag.id) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
