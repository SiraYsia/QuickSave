import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Tag } from '../services/storageService';

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
  const availableTags = tags.filter(tag => !selectedTags.includes(tag));

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
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className={`${tag.color.bg} px-3 py-1 rounded-full text-sm flex items-center gap-1 text-white`}
          >
            {tag.name}
            <button
              onClick={() => onToggleTag(tag)}
              className="hover:bg-white/20 rounded-full p-0.5 text-white"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        {/* Tag Selector Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left"
        >
          {selectedTags.length > 0 ? 'Add More Tags' : 'Add Tags'}
        </button>

        {/* Tag Selection Popup */}
        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2">
              {/* Tag grid */}
              <div className="grid grid-cols-2 gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => onToggleTag(tag)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${tag.color.dot}`} />
                    <span className="text-gray-700 dark:text-gray-200 truncate">{tag.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};