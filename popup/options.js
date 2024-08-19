document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.sync.get("togglApiKey", function(data) {
    if (data.togglApiKey) {
      document.getElementById("togglApiKey").value = data.togglApiKey;
    }
  });

  document.getElementById("save").addEventListener("click", function() {
    const togglApiKey = document.getElementById("togglApiKey").value;

    chrome.storage.sync.set({ "togglApiKey": togglApiKey });
  });
});
