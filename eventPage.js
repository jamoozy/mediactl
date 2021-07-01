chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.tab || request.req) {
    // If sender.tab is true, this is a tab.  If request.req is truthy, then
    // the popup is requesting initial data.  Either way, send the data.
    chrome.storage.sync.get(['state'], val => sendResponse(val.state));
    return true;
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.permissions.request({
        permissions: ['scripting'],
        origins:     [tab.url],
      }, granted => {
        if (!granted) {
          return;
        }

        console.log('tab is: %O', tab);
        chrome.scripting.executeScript({
          target: {
            tabId: tab.id,
            allFrames: true,
          },
          function: script,
        }, res => {
          console.log('got result(s): %O', res);
        });
      });
    });

    chrome.storage.sync.set({state: request}, () => {
      if (chrome.runtime.lastError) {
        chrome.error("There was an error saving!");
        chrome.error(chrome.runtime.lastError);
      }
    });
  }
});

// This is the script we run in the actual page to enact some effect on the
// existing audio/video element(s).
function script() {
  return {
    video: document.getElementByTagName('video'),
    audio: document.getElementByTagName('audio'),
  };
}
