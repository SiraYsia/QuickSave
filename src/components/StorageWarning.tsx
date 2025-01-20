// src/components/StorageWarning.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const StorageWarning: React.FC = () => {
  return (
    <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-2">
      <AlertCircle size={16} />
      <span>Storage space is nearly full. Please delete some items.</span>
    </div>
  );
};

export default StorageWarning;