// src/services/storageService.ts

export interface SavedItem {
  id: string;
  content: string;
  type: 'text' | 'code' | 'screenshot';
  tagIds: string[];
  createdAt: number;
  url?: string;
  title?: string;
  note?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: {
    name: string;
    bg: string;
    text: string;
    dot: string;
  };
}

export interface StorageData {
  items: SavedItem[];
  tags: Tag[];
}

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getAllItems(): Promise<SavedItem[]> {
    const data = await this.getData();
    return data.items;
  }

  async getAllTags(): Promise<Tag[]> {
    const data = await this.getData();
    return data.tags;
  }

  async addItem(item: Omit<SavedItem, 'id' | 'createdAt'>): Promise<SavedItem> {
    const data = await this.getData();
    const newItem: SavedItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    data.items.unshift(newItem); // Add to beginning of array
    await this.setData(data);
    return newItem;
  }

  // Add this method to the StorageService class in storageService.ts

async updateItem(id: string, updates: Partial<Omit<SavedItem, 'id' | 'createdAt'>>): Promise<SavedItem> {
  const data = await this.getData();
  const existingItem = data.items.find(item => item.id === id);
  
  if (!existingItem) {
    throw new Error(`Item not found: ${id}`);
  }

  const updatedItem = {
    ...existingItem,
    ...updates,
  };

  data.items = data.items.map(item => 
    item.id === id ? updatedItem : item
  );

  await this.setData(data);
  return updatedItem;
}

  async addTag(tag: Omit<Tag, 'id'>): Promise<Tag> {
    const data = await this.getData();
    const newTag: Tag = {
      ...tag,
      id: crypto.randomUUID()
    };
    
    data.tags.push(newTag);
    await this.setData(data);
    return newTag;
  }

  async searchItems(query: string, tagIds?: string[]): Promise<SavedItem[]> {
    const data = await this.getData();
    let filteredItems = data.items;

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.content.toLowerCase().includes(searchTerm) ||
        item.title?.toLowerCase().includes(searchTerm) ||
        item.note?.toLowerCase().includes(searchTerm)
      );
    }

    if (tagIds && tagIds.length > 0) {
      filteredItems = filteredItems.filter(item =>
        tagIds.some(tagId => item.tagIds.includes(tagId))
      );
    }

    return filteredItems;
  }
  async deleteItem(id: string): Promise<void> {
    const data = await this.getData();
    data.items = data.items.filter(item => item.id !== id);
    await this.setData(data);
  }

  async clearAllItems(): Promise<void> {
    const data = await this.getData();
    data.items = [];
    await this.setData(data);
  }

  async deleteTag(id: string): Promise<void> {
    const data = await this.getData();
    data.tags = data.tags.filter(tag => tag.id !== id);
    await this.setData(data);
  }

  async updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>): Promise<Tag> {
    const data = await this.getData();
    const existingTag = data.tags.find(tag => tag.id === id);
    
    if (!existingTag) {
      throw new Error(`Tag not found: ${id}`);
    }

    const updatedTag = {
      ...existingTag,
      ...updates,
    };

    data.tags = data.tags.map(tag => 
      tag.id === id ? updatedTag : tag
    );

    await this.setData(data);
    return updatedTag;
  }
  private async getData(): Promise<StorageData> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['quicksaveData'], (result) => {
        const defaultData: StorageData = { items: [], tags: [] };
        resolve(result.quicksaveData || defaultData);
      });
    });
  }

  private async setData(data: StorageData): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ quicksaveData: data }, () => resolve());
    });
  }
}



export const storageService = StorageService.getInstance();