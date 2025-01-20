// src/hooks/useTags.ts
import { useState, useCallback } from 'react';
import { Tag, storageService } from '../services/storageService';
import { TagColor, EXPANDED_COLORS } from '../utils/constants';

export const useTags = (initialTags: Tag[] = []) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const addTag = useCallback(async (name: string, color: TagColor) => {
    if (name && !name.includes(' ')) {
      const newTag = await storageService.addTag({
        name,
        color
      });
      setTags(prev => [...prev, newTag]);
      return newTag;
    }
  }, []);

  const toggleTag = useCallback((tag: Tag) => {
    setSelectedTags(current =>
      current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag]
    );
  }, []);

  const getAvailableColors = useCallback(() => {
    const usedColors = new Set(tags.map(tag => tag.color.name));
    return EXPANDED_COLORS.filter(color => !usedColors.has(color.name));
  }, [tags]);

  return {
    tags,
    setTags,
    selectedTags,
    setSelectedTags,
    addTag,
    toggleTag,
    getAvailableColors
  };
};