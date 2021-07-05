const tabRegistry = (() => {
  const registry = {};

  const reqButton = document.getElementById('permreq');
  reqButton.addEventListener('click', ev => tabRegistry.addTab());

  function getTab(cb) {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => cb(tab));
  }

  function addScript() {
    getTab(tab => {
      const alreadyGranted = chrome.permissions.contains({
        permissions: ['scripting'],
        origins:     [tab.url],
      }, granted => {
        if (!granted) {
          reqButton.classList.remove('hidden');
        } else {
          execScript(tab);
        }
      });
    });
  }

  function execScript(tab) {
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
  }

  // This is the script we run in the actual page to enact some effect on the
  // existing audio/video element(s).
  function script() {
    console.log('ran it');
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('got message: %O', request);
    });
    return true;
  }

  return {
    addTab: addScript,
  };
})();

const popup = (() => {
  const opts = document.getElementsByClassName("option"); // Options for playback rate.
  var state = {
    playbackRate: 1.0,
    controls: true,
    muted: false,
    volume: 85.0,
    auto: false,
  }

  // Updates the form.
  function updateForm(response) {
    if (!response) {
      console.debug('No previous data.');
      return;
    }

    state = Object.assign(state, response);

    ////////////////////////
    // update popup HTML

    for (const opt of opts) {
      const v = Number(opt.attributes['x-attr-value'].value);
      if (v === state.playbackRate) {
        opt.classList.add('active-option');
      } else {
        opt.classList.remove('active-option');
      }
    }

    document.getElementById('controls').checked = state.controls;
    document.getElementById('muted').checked = state.muted;
    document.getElementById('auto').checked = state.auto;
    document.getElementById('volume').value = state.volume;
  }

  function saveForm() {
    console.log('save state: %O', state);
    chrome.runtime.sendMessage(state);
  }

  // onclick handler for playback rate.
  function setPlaybackRate(ev) {
    for (const opt of opts) {
      opt.classList.remove('active-option');
    }
    ev.target.classList.add('active-option');
    state.playbackRate = Number(ev.target.attributes['x-attr-value'].value);
    saveForm()
  }

  // Handles the change event for all checkboxes.
  function handleCbChange(ev) {
    state[ev.target.attributes['id'].value] = ev.target.checked;
    saveForm();
  }

  function handleRangeChange(ev) {
    state[ev.target.attributes['id'].value] = ev.target.value;
    saveForm();
  }

  return {
    // Initialize the popup.
    init: ev => {
      for (const opt of opts) {
        opt.onclick = setPlaybackRate;
      }
      document.getElementById('controls').onchange = handleCbChange;
      document.getElementById('muted').onchange = handleCbChange;
      document.getElementById('auto').onchange = handleCbChange;
      document.getElementById('volume').onchange = handleRangeChange;

      chrome.runtime.sendMessage({req: true}, updateForm);

      tabRegistry.addTab();
    },
  };
})();

window.onload = popup.init;
