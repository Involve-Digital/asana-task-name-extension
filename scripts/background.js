chrome.commands.onCommand.addListener(function(command) {
  if (command === "copyOnlyTaskName") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "copyOnlyTaskName"});
    });
  }

  if (command === "copyTaskNameParentIncluded") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "copyTaskNameParentIncluded"});
    });
  }
});
