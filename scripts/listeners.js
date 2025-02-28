chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'copyOnlyTaskName') {
    copyTaskInfo(true);
  }

  if (message.action === 'copyTaskNameParentIncluded') {
    copyTaskInfo(false);
  }
});
