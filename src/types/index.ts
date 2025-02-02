// // src/types/index.ts

// export enum ContentType {
//   TEXT = 'text',
//   CODE = 'code',
//   SCREENSHOT = 'screenshot',
//   BOOKMARK = 'bookmark',
//   HTML = 'html',
//   CSS = 'css',
//   PYTHON = 'python',
//   SQL = 'sql',
//   JSON = 'json',
//   XML = 'xml',
//   MARKDOWN = 'markdown',
//   SHELL = 'shell',
//   MATH = 'math',
//   URL = 'url'
// }

// export interface DetectionScore {
//   type: ContentType;
//   score: number;
// }

// export interface Tag {
//   id: string;
//   name: string;
//   color?: string;
// }

// export interface Collection {
//   id: string;
//   name: string;
//   description?: string;
//   created: number;
//   modified: number;
//   parentId?: string; 
// }
// export type ItemType = 'text' | 'code' | 'screenshot';

// export interface SavedItem {
//   id: string;
//   content: string;
//   type: ItemType;
//   tagIds: string[];
//   createdAt: number;
//   url?: string;
//   title?: string;
//   note?: string;
// }

// export interface SearchOptions {
//   query?: string;
//   collections?: string[];
//   tags?: string[];
//   types?: ContentType[];
//   dateRange?: {
//     start: number;
//     end: number;
//   };
//   source?: string;
// }

// export interface Settings {
//   theme: 'light' | 'dark' | 'system';
//   defaultCollection?: string;
//   defaultTags?: string[];
//   screenshotFormat: 'jpeg' | 'png';
//   screenshotQuality: number; // 0-100 for JPEG
//   maxItems: number;
//   shortcuts: {
//     quickSave: string;
//     screenshot: string;
//     openPopup: string;
//   };
//   autoSync: boolean;
// }