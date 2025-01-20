import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Tag } from '../services/storageService';
import { TagSelector } from './TagSelector';

export const TITLE_CHAR_LIMIT = 35;

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  note: string;
  tags: Tag[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onNoteChange: (note: string) => void;
  onSave: () => void;
  isEditing: boolean;
}

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  note,
  tags,
  selectedTags,
  onTagToggle,
  onTitleChange,
  onContentChange,
  onNoteChange,
  onSave,
  isEditing
}) => {
  const isImage = content.startsWith('data:image');
  
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
  
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
  
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
  
            if (width > height) {
              if (width > MAX_WIDTH) {
                height = height * (MAX_WIDTH / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = width * (MAX_HEIGHT / height);
                height = MAX_HEIGHT;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
  
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
  
            const resizedImage = canvas.toDataURL(file.type);
            onContentChange(resizedImage);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEditing ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value.slice(0, TITLE_CHAR_LIMIT))}
              required
              placeholder="Title"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end">
              <span className={`text-xs ${
                title.length >= TITLE_CHAR_LIMIT ? 'text-orange-500 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {title.length}/{TITLE_CHAR_LIMIT}
              </span>
            </div>
          </div>
          
          {isImage ? (
            <div className="space-y-4">
              <div className="h-40 overflow-auto bg-gray-100 dark:bg-gray-900 rounded-lg">
                <img 
                  src={content} 
                  alt={title || 'Saved content'}
                  className="w-full object-contain cursor-zoom-in"
                />
              </div>
              <textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                className="w-full h-24 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a note about this screenshot..."
              />
            </div>
          ) : (
            <div 
              className="relative h-40 overflow-auto"
              onPaste={handlePaste}
            >
              <textarea 
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type, paste text, or paste an image here..."
              />
              <div className="absolute bottom-2 right-2 text-gray-400 dark:text-gray-500">
                <ImageIcon size={20} />
              </div>
            </div>
          )}
          
          <TagSelector
            tags={tags}
            selectedTags={selectedTags}
            onToggleTag={onTagToggle}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!content.trim() || !title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;