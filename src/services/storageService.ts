// src/services/storageService.ts
import { SavedItem, Tag, StorageData } from './interfaces';

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
    const newItem: SavedItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    const data = await this.getData();
    data.items.unshift(newItem);
    await this.setData(data);
    return newItem;
  }

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
    try {
      const result = await chrome.storage.local.get(['quicksaveData']);
      return result.quicksaveData || { items: [], tags: [] };
    } catch (error) {
      console.error('Error reading from storage:', error);
      throw error;
    }
  }

  private async setData(data: StorageData): Promise<void> {
    try {
      await chrome.storage.local.set({ quicksaveData: data });
    } catch (error) {
      console.error('Error writing to storage:', error);
      throw error;
    }
  }
}

export const storageService = StorageService.getInstance();