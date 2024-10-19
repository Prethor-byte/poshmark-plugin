chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'index.html' });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    settings: {
      shareInterval: 3600,
      itemsToShare: 50,
    },
  });
});