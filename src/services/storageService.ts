// src/services/storageService.ts
import { SavedItem, Tag, StorageData } from './interfaces';

class StorageService {
  private static instance: StorageService;
  private cache: StorageData = { items: [], tags: [] };  // Initialize with empty data instead of null
  private lastFetchTime: number = 0;
  private readonly CACHE_TTL = 1000; // Cache time-to-live in milliseconds

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastFetchTime < this.CACHE_TTL;
  }

  private async getDataWithCache(): Promise<StorageData> {
    if (this.isCacheValid()) {
      return this.cache;
    }

    try {
      const result = await chrome.storage.local.get(['quicksaveData']);
      this.cache = result.quicksaveData || { items: [], tags: [] };
      this.lastFetchTime = Date.now();
      return this.cache;
    } catch (error) {
      console.error('Error reading from storage:', error);
      throw error;
    }
  }

  private async setDataAndUpdateCache(data: StorageData): Promise<void> {
    try {
      await chrome.storage.local.set({ quicksaveData: data });
      this.cache = data;
      this.lastFetchTime = Date.now();
    } catch (error) {
      // Reset cache timestamp but keep the last known good data
      this.lastFetchTime = 0;
      console.error('Error writing to storage:', error);
      throw error;
    }
  }

  async getAllItems(): Promise<SavedItem[]> {
    const data = await this.getDataWithCache();
    return data.items;
  }

  async getAllTags(): Promise<Tag[]> {
    const data = await this.getDataWithCache();
    return data.tags;
  }

  async addItem(item: Omit<SavedItem, 'id' | 'createdAt'>): Promise<SavedItem> {
    const newItem: SavedItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    const data = await this.getDataWithCache();
    data.items.unshift(newItem);
    await this.setDataAndUpdateCache(data);
    return newItem;
  }

  async updateItem(id: string, updates: Partial<Omit<SavedItem, 'id' | 'createdAt'>>): Promise<SavedItem> {
    const data = await this.getDataWithCache();
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

    await this.setDataAndUpdateCache(data);
    return updatedItem;
  }

  async addTag(tag: Omit<Tag, 'id'>): Promise<Tag> {
    const data = await this.getDataWithCache();
    const newTag: Tag = {
      ...tag,
      id: crypto.randomUUID()
    };
    
    data.tags.push(newTag);
    await this.setDataAndUpdateCache(data);
    return newTag;
  }

  async deleteItem(id: string): Promise<void> {
    const data = await this.getDataWithCache();
    data.items = data.items.filter(item => item.id !== id);
    await this.setDataAndUpdateCache(data);
  }

  async clearAllItems(): Promise<void> {
    const data = await this.getDataWithCache();
    data.items = [];
    await this.setDataAndUpdateCache(data);
  }

  async deleteTag(id: string): Promise<void> {
    const data = await this.getDataWithCache();
    data.tags = data.tags.filter(tag => tag.id !== id);
    await this.setDataAndUpdateCache(data);
  }

  async updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>): Promise<Tag> {
    const data = await this.getDataWithCache();
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

    await this.setDataAndUpdateCache(data);
    return updatedTag;
  }

  // Method to manually invalidate cache if needed
  invalidateCache(): void {
    this.cache = { items: [], tags: [] };
    this.lastFetchTime = 0;
  }
}

export const storageService = StorageService.getInstance();