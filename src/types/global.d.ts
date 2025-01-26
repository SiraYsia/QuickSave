export {};

declare global {
  interface Window {
    updateStorageIndicator: () => Promise<void>;
  }
}