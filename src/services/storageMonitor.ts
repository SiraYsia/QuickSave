// src/services/storageMonitor.ts
export class StorageMonitor {
  private readonly WARNING_THRESHOLD = 0.9; // 90% of quota

  async checkStorageWarning(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.getBytesInUse(null, (bytesInUse) => {
        const usageRatio = bytesInUse / chrome.storage.local.QUOTA_BYTES;
        resolve(usageRatio >= this.WARNING_THRESHOLD);
      });
    });
  }
}

export const storageMonitor = new StorageMonitor();