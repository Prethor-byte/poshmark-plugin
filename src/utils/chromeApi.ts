// chromeApi.ts
const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

export const storage = {
  get: (keys: string | string[] | object, callback: (result: { [key: string]: any }) => void) => {
    if (isChromeExtension) {
      chrome.storage.sync.get(keys, callback);
    } else {
      // Mock storage for development
      const mockStorage: { [key: string]: any } = {
        settings: {
          shareInterval: 3600,
          itemsToShare: 50,
        },
        hasAcknowledged: false,
      };
      
      setTimeout(() => {
        if (typeof keys === 'string') {
          callback({ [keys]: mockStorage[keys] });
        } else if (Array.isArray(keys)) {
          const result: { [key: string]: any } = {};
          keys.forEach(key => {
            result[key] = mockStorage[key];
          });
          callback(result);
        } else {
          callback(mockStorage);
        }
      }, 0);
    }
  },
  set: (items: object, callback?: () => void) => {
    if (isChromeExtension) {
      chrome.storage.sync.set(items, callback);
    } else {
      console.log('Mock storage set:', items);
      if (callback) setTimeout(callback, 0);
    }
  },
};

export const tabs = {
  create: (options: object) => {
    if (isChromeExtension) {
      chrome.tabs.create(options);
    } else {
      console.log('Mock tab created with options:', options);
    }
  },
  sendMessage: (tabId: number, message: any) => {
    if (isChromeExtension) {
      chrome.tabs.sendMessage(tabId, message);
    } else {
      console.log('Mock message sent to tab:', tabId, message);
    }
  },
};

export const runtime = {
  sendMessage: (message: any) => {
    if (isChromeExtension) {
      chrome.runtime.sendMessage(message);
    } else {
      console.log('Mock runtime message sent:', message);
    }
  },
};