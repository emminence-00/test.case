'use client';

import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = "Add tags...",
  maxTags,
  allowDuplicates = false,
  className
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim();
    
    if (!trimmedTag) return;
    
    // Check for duplicates if not allowed
    if (!allowDuplicates && tags.includes(trimmedTag)) return;
    
    // Check max tags limit
    if (maxTags && tags.length >= maxTags) return;
    
    onTagsChange([...tags, trimmedTag]);
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check for comma and add tag if found
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      newTags.forEach(tag => addTag(tag));
      setInputValue('');
      return;
    }
    
    setInputValue(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags.length - 1);
    }
  };

  const handleInputBlur = () => {
    // Add tag on blur if there's content
    if (inputValue.trim()) {
      addTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className={cn("", className)}>
      <div className="flex flex-wrap items-center gap-2 px-3 border rounded-lg min-h-[50px] focus:bg-red-100 w-full">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => removeTag(index)}
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 border-0 p-0 focus-visible:ring-0 bg-transparent dark:bg-transparent focus-visible:ring-offset-0"
          disabled={maxTags ? tags.length >= maxTags : false}
        />
      </div>
      
      {maxTags && (
        <div className="text-sm text-muted-foreground">
          {tags.length}/{maxTags} tags
        </div>
      )}
      
      <div className="text-xs text-start m-1 text-muted-foreground">
        Press Enter or use commas to add tags
      </div>
    </div>
  );
};

export default TagInput;