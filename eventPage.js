chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('req: %O sndr: %O', request, sender);

  if (sender.tab || request.req) {
    // If sender.tab is true, this is a tab.  If request.req is truthy, then
    // the popup is requesting initial data.  Either way, send the data.
    chrome.storage.sync.get(['state'], val => sendResponse(val.state));
    return true;
  } else {
    chrome.storage.sync.set({state: request}, () => {
      if (chrome.runtime.lastError) {
        chrome.error("save err: %O", chrome.runtime.lastError);
      }
    });
  }
});


