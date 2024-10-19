import { runtime } from './utils/chromeApi';

let isRunning = false;
let settings = {
  shareInterval: 3600,
  itemsToShare: 50,
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function shareItems() {
  const shareButtons = document.querySelectorAll('.share-wrapper button');
  let sharedCount = 0;

  for (const button of shareButtons) {
    if (!isRunning) break;
    if (sharedCount >= settings.itemsToShare) break;

    try {
      button.click();
      await sleep(1000);
      const toFollowersButton = document.querySelector('.internal-share__link');
      if (toFollowersButton) {
        (toFollowersButton as HTMLElement).click();
        sharedCount++;
        runtime.sendMessage({ action: 'updateProgress', sharedCount });
        await sleep(Math.max(settings.shareInterval, 3600) * 1000);
      } else {
        throw new Error('Share to followers button not found');
      }
    } catch (error) {
      console.error('Error sharing item:', error);
      runtime.sendMessage({ action: 'error', message: error.message });
    }
  }

  runtime.sendMessage({ action: 'completed', totalShared: sharedCount });
}

// Listen for messages from the popup
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
      isRunning = true;
      settings = request.settings;
      shareItems();
    } else if (request.action === 'stop') {
      isRunning = false;
    }
  });
}