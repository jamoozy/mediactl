var popup = (function popupScope() {
  // The keys we send and update.
  var keys = ["pbRate", "controls", "muted", "volume"];

  // Gets an element by "key" (DOM ID).
  function get(key) {
    var e = document.getElementById(key);
    if (!e) {
      console.error('Could not get key "%s".', key);
      return null;
    }
    return e
  }

  // Updates the form.
  function updateForm(response) {
    console.log("Updating form with: %O", response);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i]) {
        console.log("Updating %s to %s", keys[i], response[keys[i]]);
        get(keys[i]).setAttribute("value", response[keys[i]]);
      }
    }
  }

  // Sends the form.
  function sendForm(event) {
    var msg = {};
    for (var i = 0; i < keys.length; i++) {
      msg[keys[i]] = document.getElementById(keys[i]).getAttribute("value");
    }
    console.log("Sending: %O", msg);
    chrome.runtime.sendMessage(msg);
  }

  return {
    // Initialize the popup.
    init: function init(event) {
      console.log("init");
      chrome.runtime.sendMessage({req: true}, updateForm);
      get("submit").onclick = sendForm;
    },
  };
})();

window.onload = popup.init;
