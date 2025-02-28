document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("togglApiKey", function (data) {
    if (data.togglApiKey) {
      document.getElementById("togglApiKey").value = data.togglApiKey;
    }
  });

  chrome.storage.sync.get("asanaApiKey", function (data) {
    if (data.asanaApiKey) {
      document.getElementById("asanaApiKey").value = data.asanaApiKey;
    }
  });

  chrome.storage.sync.get("copyButton", function (data) {
    if (data.copyButton) {
      document.getElementById("copyButton").checked = data.copyButton;
    }
  });

  chrome.storage.sync.get("togglReportButton", function (data) {
    if (data.togglReportButton) {
      document.getElementById("togglReportButton").checked = data.togglReportButton;
    }
  });

  chrome.storage.sync.get("trackingButton", function (data) {
    if (data.trackingButton) {
      document.getElementById("trackingButton").checked = data.trackingButton;
    }
  });

  chrome.storage.sync.get("crTrackingButton", function (data) {
    if (data.crTrackingButton) {
      document.getElementById("crTrackingButton").checked = data.crTrackingButton;
    }
  });

  chrome.storage.sync.get("progressBar", function (data) {
    if (data.progressBar) {
      document.getElementById("progressBar").checked = data.progressBar;
    }
  });

  document.getElementById("save").addEventListener("click", function () {
    const togglApiKey = document.getElementById("togglApiKey").value;
    const asanaApiKey = document.getElementById("asanaApiKey").value;
    const copyButton = document.getElementById("copyButton").checked;
    const togglReportButton = document.getElementById("togglReportButton").checked;
    const trackingButton = document.getElementById("trackingButton").checked;
    const crTrackingButton = document.getElementById("crTrackingButton").checked;
    const progressBar = document.getElementById("progressBar").checked;

    chrome.storage.sync.set({
      "togglApiKey": togglApiKey,
      "asanaApiKey": asanaApiKey,
      "copyButton": copyButton,
      "togglReportButton": togglReportButton,
      "trackingButton": trackingButton,
      "crTrackingButton": crTrackingButton,
      "progressBar": progressBar,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });
});
