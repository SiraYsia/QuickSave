// src/hooks/useSearch.ts
import { useState, useEffect } from 'react';
import { SavedItem, Tag } from '../services/storageService';

export const useSearch = (items: SavedItem[], tags: Tag[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<SavedItem[]>(items);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item => {
      // Search in title
      const matchesTitle = item.title?.toLowerCase().includes(query);
      // Search in content
      const matchesContent = item.content.toLowerCase().includes(query);
      // Search in tags
      const matchesTags = tags
        .filter(tag => item.tagIds.includes(tag.id))
        .some(tag => tag.name.toLowerCase().includes(query));

      return matchesTitle || matchesContent || matchesTags;
    });

    setFilteredItems(filtered);
  }, [searchQuery, items, tags]);

  return { searchQuery, setSearchQuery, filteredItems };
};