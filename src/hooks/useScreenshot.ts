// In useScreenshot.ts
import { useState } from 'react';
import { storageService } from '../services/storageService';

export const useScreenshot = (onScreenshot: (imageData: string) => void) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreenshot = async (selectedTagIds: string[]) => {
    setIsCapturing(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const imageData = await chrome.tabs.captureVisibleTab();
      onScreenshot(imageData); // Pass the image data to parent instead of saving directly
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }
    setIsCapturing(false);
  };

  return { captureScreenshot, isCapturing };
};
