var popup = (function popupScope() {
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

      //chrome.scripting.executeScript({
      //  target: {
    },
  };
})();

window.onload = popup.init;
