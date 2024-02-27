function extractTaskInfoFromContentScript() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "extractTaskInfo"});
  });
}

function handleData() {
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message, 'test');
    if (message.action === "extractedTaskInfo") {
      console.log(message);
      console.log('extractedTaskInfo');
    }
  });
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('ttttt');
  handleData();

  if (button) {
    button.addEventListener('click', function() {
      extractTaskInfoFromContentScript();
    });
  }
});
