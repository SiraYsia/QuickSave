import React, { useState } from 'react';
import { Edit2, X, ChevronDown, ChevronRight } from 'lucide-react';
import { SavedItem, Tag } from '../services/storageService';

interface ItemListProps {
  items: SavedItem[];
  tags: Tag[];
  onEdit: (item: SavedItem) => void;
  onDelete: (itemId: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, tags, onEdit, onDelete }) => {
  // Keep track of expanded items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderItem = (item: SavedItem) => {
    const isExpanded = expandedItems.has(item.id);
    const itemTags = tags.filter(tag => item.tagIds.includes(tag.id));

    return (
      <div key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div 
            className="flex items-center gap-2 cursor-pointer flex-grow"
            onClick={() => toggleItem(item.id)}
          >
            {isExpanded ? 
              <ChevronDown size={20} className="text-gray-400" /> : 
              <ChevronRight size={20} className="text-gray-400" />
            }
            <h3 className="font-medium text-gray-900 dark:text-white break-words whitespace-pre-wrap max-w-[calc(100%-80px)] overflow-hidden">
              {item.title || 'Untitled'}
            </h3>
          </div>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => onEdit(item)}
              className="text-gray-500 hover:text-blue-500 dark:text-gray-400"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pl-7 space-y-3">
            {item.type === 'screenshot' ? (
              <div className="space-y-2">
                <div className="h-40 overflow-hidden bg-gray-900 rounded-lg">
                  <img 
                    src={item.content} 
                    alt={item.title || 'Screenshot'} 
                    className="w-full object-contain cursor-zoom-in"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      console.error('Failed to load screenshot');
                    }}
                  />
                </div>
                {item.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic border-l-2 border-gray-300 dark:border-gray-600 pl-2 break-words whitespace-pre-wrap overflow-hidden">
                    {item.note}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 break-words whitespace-pre-wrap max-w-full overflow-hidden">
                {item.content}
              </p>
            )}

            {itemTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {itemTags.map(tag => (
                  <span
                    key={tag.id}
                    className={`px-2 py-1 text-xs rounded-full ${tag.color.bg} ${tag.color.text}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {items.map(renderItem)}
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">No items saved yet</div>
        </div>
      )}
    </div>
  );
};

export default ItemList;