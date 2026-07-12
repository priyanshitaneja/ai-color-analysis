chrome.action.onClicked.addListener(async (tab) => {
  let host = '';
  try {
    host = new URL(tab.url ?? '').hostname;
  } catch {
    // chrome:// pages and similar — fall through to opening the app
  }

  if (host === 'myntra.com' || host.endsWith('.myntra.com')) {
    const { analysisResult } = await chrome.storage.local.get('analysisResult');
    if (!analysisResult) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html#/analyze') });
      return;
    }
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/badges.js'],
    });
    return;
  }

  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});
