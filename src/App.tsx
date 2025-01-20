import React, { useState, useEffect } from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';
import { storageService, SavedItem, Tag } from './services/storageService';
import SearchBar from './components/SearchBar';
import ActionButtons from './components/ActionButtons';
import ItemList from './components/ItemList';
import { useSearch } from './hooks/useSearch';
import { useTags } from './hooks/useTags';
import { TagManager } from './components/TagManager';
import ItemModal, { TITLE_CHAR_LIMIT } from './components/ItemModal';
import { storageMonitor} from './services/storageMonitor';
import StorageWarning from './components/StorageWarning'



const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  // Items state
  const [items, setItems] = useState<SavedItem[]>([]);
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemNote, setNewItemNote] = useState('');

  // Initialize hooks
  const {
    tags,
    setTags,
    selectedTags,
    setSelectedTags,
    addTag,
    toggleTag,
  } = useTags();
  

  
  const { searchQuery, setSearchQuery, filteredItems } = useSearch(items, tags);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);


  
  const loadInitialData = async () => {
    try {
      const [loadedItems, loadedTags] = await Promise.all([
        storageService.getAllItems(),
        storageService.getAllTags()
      ]);
      setItems(loadedItems);
      setTags(loadedTags);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await storageService.clearAllItems();
      setShowClearConfirm(false);
      setItems([]);
    } catch (error) {
      console.error('Error clearing items:', error);
    }
  };


  // In App.tsx, add state for storage warning
const [showStorageWarning, setShowStorageWarning] = useState(false);

// Add effect to check storage
useEffect(() => {
  const checkStorage = async () => {
    const isNearlyFull = await storageMonitor.checkStorageWarning();
    setShowStorageWarning(isNearlyFull);
  };
  
  checkStorage();
  // Check every 5 minutes
  const interval = setInterval(checkStorage, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);

  // Rest of your existing functions...
  const handleDeleteTag = async (tag: Tag) => {
    try {
      const updatedItems = items.map(item => ({
        ...item,
        tagIds: item.tagIds.filter(id => id !== tag.id)
      }));

      for (const item of updatedItems) {
        await storageService.updateItem(item.id, { tagIds: item.tagIds });
      }

      await storageService.deleteTag(tag.id);
      
      setTags(prevTags => prevTags.filter(t => t.id !== tag.id));
      setSelectedTags(prevSelected => prevSelected.filter(t => t.id !== tag.id));
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleEditTag = async (tag: Tag, newName: string) => {
    try {
      if (!newName.trim() || newName === tag.name) return;
      
      if (tags.some(t => t.id !== tag.id && t.name.toLowerCase() === newName.toLowerCase())) {
        throw new Error('Tag name already exists');
      }

      const updatedTag = await storageService.updateTag(tag.id, { name: newName });
      setTags(prevTags => 
        prevTags.map(t => t.id === tag.id ? updatedTag : t)
      );
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const openNewItemModal = () => {
    setEditingItem(null);
    setNewItemTitle('');
    setNewItemContent('');
    setNewItemNote('');
    setSelectedTags([]);
    setShowItemModal(true);
  };

  const openEditItemModal = (item: SavedItem) => {
    setEditingItem(item);
    setNewItemTitle(item.title || '');
    setNewItemContent(item.content);
    setNewItemNote(item.note || '');
    setSelectedTags(tags.filter(tag => item.tagIds.includes(tag.id)));
    setShowItemModal(true);
  };

  const handleScreenshot = (imageData: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setNewItemContent(imageData);
      // Fix: Enforce character limit on screenshot title
      setNewItemTitle((tab?.title || 'Screenshot').slice(0, TITLE_CHAR_LIMIT));
      setNewItemNote('');
      setEditingItem(null);
      setSelectedTags([]);
      setShowItemModal(true);
    });
  };

  const handleSaveItem = async () => {
    const isScreenshot = editingItem?.type === 'screenshot' || newItemContent.startsWith('data:image');

    try {
      const itemData: Omit<SavedItem, 'id' | 'createdAt'> = {
        content: newItemContent,
        type: isScreenshot ? 'screenshot' : 'text',
        tagIds: selectedTags.map(tag => tag.id),
        title: newItemTitle.trim(),
        note: isScreenshot ? newItemNote : undefined
      };

      if (editingItem) {
        await storageService.updateItem(editingItem.id, itemData);
      } else {
        await storageService.addItem(itemData);
      }

      setShowItemModal(false);
      await loadInitialData();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await storageService.deleteItem(id);
      await loadInitialData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-auto">
      {showStorageWarning && <div className="px-4"><StorageWarning /></div>}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Clear All Items
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete all saved items? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">QuickSave</h1>
            <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
              Pro
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 text-gray-600 hover:bg-red-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-red-900/50 group"
              title="Clear all saved items"
            >
              <Trash2 size={20} className="group-hover:text-red-600 dark:group-hover:text-red-400" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <TagManager
              tags={tags}
              onAddTag={addTag}
              onDeleteTag={handleDeleteTag}
              onEditTag={handleEditTag}
            />
          </div>
        </div>

        <div className="px-4 pb-4 space-y-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <ActionButtons
            onQuickSave={openNewItemModal}
            selectedTagIds={selectedTags.map(tag => tag.id)}
            onScreenshot={handleScreenshot}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <ItemList
          items={filteredItems}
          tags={tags}
          onEdit={openEditItemModal}
          onDelete={handleDeleteItem}
        />
        
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-gray-400 dark:text-gray-500">No items saved yet</div>
          <button
            onClick={openNewItemModal}
            className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Add your first item
          </button>
        </div>
        )}
      </div>

      {/* Item Modal */}
      <ItemModal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={newItemTitle}
        content={newItemContent}
        note={newItemNote}
        tags={tags}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        onTitleChange={setNewItemTitle}
        onContentChange={setNewItemContent}
        onNoteChange={setNewItemNote}
        onSave={handleSaveItem}
        isEditing={!!editingItem}
      />
    </div>
  );
};

export default App;