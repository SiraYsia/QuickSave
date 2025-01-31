// src/components/actionButtons.tsx

import React from 'react';
import { Plus, Camera } from 'lucide-react';
import { ActionButtonsProps }  from '../services/interfaces';

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onQuickSave,
  onScreenshot,
  selectedTagIds
}) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onQuickSave}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} />
        Quick Save
      </button>
      
      <button
        onClick={async () => {
          try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab.id) {
              const imageData = await chrome.tabs.captureVisibleTab();
              onScreenshot(imageData);
            }
          } catch (error) {
            console.error('Error taking screenshot:', error);
          }
        }}
        className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Camera size={20} />
        Screenshot
      </button>
    </div>
  );
};

export default ActionButtons;