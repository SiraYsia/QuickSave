// src/components/tagSelector.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Tag } from '../services/interfaces';

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: Tag[];
  onToggleTag: (tag: Tag) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onToggleTag,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unselected tags
  const availableTags = tags.filter((tag) => !selectedTags.includes(tag));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-3" ref={dropdownRef}>
      {/* Tag Selection */}
      <div className="grid grid-cols-2 gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onToggleTag(tag)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-blue-100 dark:bg-blue-900/20'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${tag.color.dot}`} />
            <span className="text-gray-700 dark:text-gray-200 truncate">{tag.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};