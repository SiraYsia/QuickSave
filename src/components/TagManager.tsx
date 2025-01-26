// src/components/tagManager.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Tag as TagIcon, X, Edit2, Plus } from 'lucide-react';
import { Tag, TagManagerProps } from '../services/interfaces';


const MAX_TAGS = 6;
const TAG_NAME_LIMIT = 18;

const TAG_COLORS = [
  { name: 'blue', bg: 'bg-blue-600', text: 'text-white', dot: 'bg-blue-300' },
  { name: 'green', bg: 'bg-green-600', text: 'text-white', dot: 'bg-green-300' },
  { name: 'purple', bg: 'bg-purple-600', text: 'text-white', dot: 'bg-purple-300' },
  { name: 'red', bg: 'bg-red-600', text: 'text-white', dot: 'bg-red-300' },
  { name: 'yellow', bg: 'bg-yellow-600', text: 'text-white', dot: 'bg-yellow-300' },
  { name: 'indigo', bg: 'bg-indigo-600', text: 'text-white', dot: 'bg-indigo-300' }
];

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onAddTag,
  onDeleteTag,
  onEditTag
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);


  const getAvailableColors = () => {
    const usedColors = new Set(tags.map(tag => tag.color.name));
    return TAG_COLORS.filter(color => !usedColors.has(color.name));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setEditingTag(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const availableColors = getAvailableColors();
    if (availableColors.length > 0 && !availableColors.find(c => c.name === selectedColor.name)) {
      setSelectedColor(availableColors[0]);
    }
  }, [tags, selectedColor]);

  useEffect(() => {
    if (editingTag && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTag]);

  const handleCreateTag = () => {
    if (tags.length >= MAX_TAGS) {
      setError('Maximum number of tags reached (6)');
      return;
    }
  
    // Only trim leading/trailing spaces but preserve case
    const name = newTagName.trim();
    if (!name) {
      setError('Tag name cannot be empty');
      return;
    }
    // Case-insensitive comparison for duplicates
    if (tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
      setError('Tag already exists');
      return;
    }
    onAddTag(name, selectedColor);
    setNewTagName('');
    setError('');
    setIsCreating(false);
  };
  const handleEditTag = () => {
    if (!editingTag) return;
  
    const name = newTagName.trim();
    if (!name) {
      setError('Tag name cannot be empty');
      return;
    }
    if (tags.some(tag => tag.id !== editingTag.id && tag.name.toLowerCase() === name.toLowerCase())) {
      setError('Tag name already exists');
      return;
    }
  
    onEditTag(editingTag, name);
    setNewTagName('');
    setError('');
    setEditingTag(null);
  };
  
  const handleTagNameChange = (value: string) => {
    // Allow multiple words, trim multiple spaces, and limit total length
    const trimmedValue = value.replace(/\s+/g, ' ').slice(0, TAG_NAME_LIMIT);
    setNewTagName(trimmedValue);
    setError('');
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <TagIcon size={16} />
        <span>Tags</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 w-64 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="max-h-96 overflow-y-auto">
            {tags.map(tag => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {editingTag && editingTag.id === tag.id ? (
                  <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={newTagName}
                        onChange={(e) => handleTagNameChange(e.target.value)}
                        placeholder="New tag name"
                        className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <div className="flex justify-between text-xs">
                        <span className="text-red-500 dark:text-red-400">{error}</span>
                        <span className={newTagName.length >= TAG_NAME_LIMIT ? 'text-orange-500 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}>
                          {newTagName.length}/{TAG_NAME_LIMIT}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditTag}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingTag(null);
                          setError('');
                          setNewTagName('');
                        }}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className={`w-2 h-2 rounded-full ${tag.color.dot}`} />
                    <span className="text-gray-700 dark:text-gray-200 flex-1">{tag.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingTag(tag);
                          setNewTagName(tag.name);
                        }}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteTag(tag)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {tags.length < MAX_TAGS ? (
            !isCreating ? (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>{tags.length === 0 ? 'Create First Tag' : 'Create New Tag'}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => handleTagNameChange(e.target.value)}
                    placeholder="Tag name"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    autoFocus
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-red-500 dark:text-red-400">{error}</span>
                    <span className={newTagName.length >= TAG_NAME_LIMIT ? 'text-orange-500 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}>
                      {newTagName.length}/{TAG_NAME_LIMIT}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {getAvailableColors().map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full ${color.bg} ${
                        selectedColor.name === color.name ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-white dark:ring-offset-gray-800' : ''
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setError('');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTag}
                    disabled={!newTagName}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Maximum tags limit reached (6)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};