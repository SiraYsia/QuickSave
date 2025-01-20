// src/utils/constants.ts

export const CHARACTER_LIMITS = {
    TAG_NAME: 18,
    TITLE: 30
  };

export interface TagColor {
    name: string;
    bg: string;
    text: string;
    dot: string;
  }
  
  export const EXPANDED_COLORS: TagColor[] = [
    { name: 'red', bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', dot: 'bg-red-500' },
    { name: 'blue', bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', dot: 'bg-blue-500' },
    { name: 'green', bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', dot: 'bg-green-500' },
    { name: 'purple', bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', dot: 'bg-purple-500' },
    { name: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', dot: 'bg-yellow-500' },
    { name: 'indigo', bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-200', dot: 'bg-indigo-500' },
    { name: 'pink', bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-800 dark:text-pink-200', dot: 'bg-pink-500' },
    { name: 'orange', bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', dot: 'bg-orange-500' }
  ];