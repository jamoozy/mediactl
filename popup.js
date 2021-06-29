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
    console.log('response: %O', response);
    if (!response) {
      console.log('No previous data.');
      return;
    }

    state = Object.assign(state, response);
    console.log('state now: %O', state);

    ////////////////////////
    // update popup HTML

    console.log('state.playbackRate:', state.playbackRate);
    for (opt of opts) {
      const v = Number(opt.attributes['x-attr-value'].value);
      console.log('opt:%O --> %s', opt, v);
      if (v === state.playbackRate) {
        opt.classList.add('active-option');
      } else {
        opt.classList.remove('active-option');
      }
    }

    document.getElementById('controls').checked = state.controls;
    document.getElementById('muted').checked = state.muted;
    document.getElementById('auto').checked = state.auto;
    document.getElementById('volume').attributes['value'] = state.volume;
  }

  // Sends the form.
  function saveForm() {
    console.log('saveForm()');
    console.log("Sending: %O", state);
    chrome.runtime.sendMessage(state);
  }

  function setPlaybackRate(ev) {
    for (opt of opts) {
      opt.classList.remove('active-option');
    }
    ev.target.classList.add('active-option');
    state.playbackRate = Number(ev.target.attributes['x-attr-value'].value);
    saveForm()
  }

  return {
    // Initialize the popup.
    init: ev => {
      chrome.runtime.sendMessage({req: true}, updateForm);
      for (opt of opts) {
        opt.onclick = setPlaybackRate;
      }

      //chrome.scripting.executeScript({
      //  target: {
    },
  };
})();

window.onload = popup.init;
