document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("togglApiKey", function (data) {
    if (data.togglApiKey) {
      document.getElementById("togglApiKey").value = data.togglApiKey;
    }
  });

  chrome.storage.sync.get("asanaApiKey", function (data) {
    if (data.togglApiKey) {
      document.getElementById("asanaApiKey").value = data.togglApiKey;
    }
  });

  document.getElementById("save").addEventListener("click", function () {
    const togglApiKey = document.getElementById("togglApiKey").value;
    const asanaApiKey = document.getElementById("asanaApiKey").value;

    chrome.storage.sync.set({
      "togglApiKey": togglApiKey,
      "asanaApiKey": asanaApiKey,
    });
  });
});
