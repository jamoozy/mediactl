// All the keys we store.
var keys = ["pbRate", "controls", "muted", "volume"];

chrome.runtime.onMessage.addListener(
  function messageListener(request, sender, sendResponse) {
    console.log("Got message: %O  from sender: %O", request, sender);
    if (sender.tab || request.req) {
      // If sender.tab is true, this is a tab.  If request.req is truthy, then
      // the popup is requesting initial data.  Either way, send the data.
      console.log("Trying to get update to send.");
      chrome.storage.local.get(keys,
        function syncGet(items) {
          console.log("Sending update: %O", items);
          sendResponse(items);
        }
      );
    } else {
      // This is an update.
      chrome.storage.local.set(request,
        function syncSet() {
          if (chrome.runtime.lastError) {
            chrome.error("There was an error saving!");
            chrome.error(chrome.runtime.lastError);
          }
        }
      );
    }
  }
);
