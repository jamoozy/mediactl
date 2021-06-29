chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Got message: %O  from sender: %O", request, sender);
  if (sender.tab || request.req) {
    // If sender.tab is true, this is a tab.  If request.req is truthy, then
    // the popup is requesting initial data.  Either way, send the data.
    console.log("Trying to get update to send.");
    chrome.storage.sync.get(['state'], val => {
      console.log("Sending update: %O", val.state);
      sendResponse(val.state);
    });
    console.log("and now we wait for our promises to resolve ...");
    return true;
  } else {
    // This is an update.
    chrome.storage.sync.set({state: request}, () => {
      if (chrome.runtime.lastError) {
        chrome.error("There was an error saving!");
        chrome.error(chrome.runtime.lastError);
      } else {
        console.log("successfully saved %O", request);
      }
    });
  }
});
