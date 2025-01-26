import { useState, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { TagColor, EXPANDED_COLORS } from '../utils/constants';
import { Tag } from '../services/interfaces';


export const useTags = (initialTags: Tag[] = []) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const addTag = useCallback(async (name: string, color: TagColor) => {
    // Trim the name and check if it's not just whitespace
    const trimmedName = name.trim();
    
    if (trimmedName) {
      // Additional validation to prevent duplicate tags case-insensitively
      const isDuplicate = tags.some(
        tag => tag.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        console.error('Tag already exists');
        return null;
      }

      const newTag = await storageService.addTag({
        name: trimmedName,
        color
      });
      
      setTags(prev => [...prev, newTag]);
      return newTag;
    }
    
    return null;
  }, [tags]);

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