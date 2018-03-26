function stateChange(newState) {
  switch (newState) {
    case "installed":
      if (navigator.serviceWorker.controller) {
        // console.log("New or updated content is available.");
      } else {
        // console.log("Content is now available offline!");
      }
      break;

    case "redundant":
      // console.error("The installing service worker became redundant.");
      break;
  }
}
function onSwStateChange(installingWorker) {
  return function() {
    stateChange(installingWorker.state);
  };
}

function onSwUpdate(reg) {
  return function () {
    const installingWorker = reg.installing;
    installingWorker.onstatechange = onSwStateChange(installingWorker);
  };
}

function onSwSuccess(reg) {
  reg.onupdatefound = onSwUpdate(reg);
}

function onSwFail(e) {
  // console.error("Error during service worker registration:", e);
}

function onSwLoad() {
  navigator.serviceWorker.register("/service-worker.js").then(onSwSuccess).catch(onSwFail);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", onSwLoad);
}