// src/services/interfaces.ts

  export type ItemType = 'text' | 'code' | 'screenshot';
  
  export interface SavedItem {
    id: string;
    content: string;
    type: ItemType;
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
  
  export interface ActionButtonsProps {
    onQuickSave: () => void;
    onScreenshot: (imageData: string) => void;
    selectedTagIds: string[];
  }

  export interface TagManagerProps {
    tags: Tag[];
    onAddTag: (name: string, color: any) => void;
    onDeleteTag: (tag: Tag) => void;
    onEditTag: (tag: Tag, newName: string) => void;
  }