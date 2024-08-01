const TASK_TITLE_SELECTOR = 'textarea.BaseTextarea.simpleTextarea--dynamic.simpleTextarea.AutogrowTextarea-input';
const PARENT_TASK_TITLE_SELECTOR = 'div.Breadcrumb.TaskAncestryBreadcrumb.TaskAncestry-taskAncestryBreadcrumb > a';
const HEADING_SELECTOR = 'div.TaskPaneToolbar.TaskPane-header.Stack.Stack--align-center.Stack--direction-row.Stack--display-block.Stack--justify-space-between';
const ALL_COMMENTS_SELECTOR = 'div.FeedBlockStory.TaskStoryFeed-blockStory';
const COMMENT_TEXT_DIV_SELECTOR = 'div.TypographyPresentation.TypographyPresentation--m.RichText3-paragraph--withVSpacingNormal.RichText3-paragraph';
const COMMENT_BUTTON_DIV_SELECTOR = 'div.ThemeableIconButtonPresentation--isEnabled.ThemeableIconButtonPresentation.ThemeableIconButtonPresentation--medium.SubtleIconButton--standardTheme.SubtleIconButton.BlockStoryDropdown.FeedBlockStory-actionsDropdownButton';
const PIN_TO_TOP_BUTTON_SELECTOR = '.TypographyPresentation.TypographyPresentation--overflowTruncate.TypographyPresentation--m.LeftIconItemStructure-label';
const COMMENT_SECTION_CLASS_NAME = 'TaskStoryFeed';
const MR_DELIMITERS = ['MR: ', 'MR - '];
const COPY_BUTTON_ID = 'asana-task-name-extension-copy-button';
const START_TRACKING_BUTTON_ID = 'asana-task-name-extension-start-tracking-button';
const START_CODE_REVIEW_TRACKING_BUTTON_ID = 'asana-task-name-extension-start-code-review-tracking-button';
const TASK_PROJECT_SELECTOR = 'div.TaskProjectTokenPill-name';
const BASE_API_URL = 'https://backend.involve.cz/api/v1';

function getSvgCheck() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="48px" height="48px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '<g><path style="opacity:0.99" fill="#30cb71" d="M 43.5,29.5 C 35.7637,43.6898 24.7637,46.8564 10.5,39C 7.88856,35.9104 5.55523,32.7437 3.5,29.5C 1.97806,9.85521 10.9781,1.35521 30.5,4C 41.2845,9.06684 45.6178,17.5668 43.5,29.5 Z"/></g>\n' +
    '<g><path style="opacity:1" fill="#e2edea" d="M 35.5,20.5 C 30.187,25.4783 24.8537,30.4783 19.5,35.5C 16.4802,32.811 13.4802,30.1444 10.5,27.5C 11.714,25.8514 13.0473,24.1848 14.5,22.5C 16.5,23.8333 18.1667,25.5 19.5,27.5C 23.8333,23.8333 27.8333,19.8333 31.5,15.5C 33.6114,16.6046 34.9447,18.2712 35.5,20.5 Z"/></g>\n' +
    '<g><path style="opacity:1" fill="#30b367" d="M 35.5,20.5 C 30.9145,26.7557 25.5812,32.4224 19.5,37.5C 15.7433,34.7488 12.7433,31.4154 10.5,27.5C 13.4802,30.1444 16.4802,32.811 19.5,35.5C 24.8537,30.4783 30.187,25.4783 35.5,20.5 Z"/></g>\n' +
    '<g><path style="opacity:0.815" fill="#27ad61" d="M 3.5,29.5 C 5.55523,32.7437 7.88856,35.9104 10.5,39C 24.7637,46.8564 35.7637,43.6898 43.5,29.5C 39.4554,42.8659 30.4554,48.0326 16.5,45C 9.22497,42.2743 4.89164,37.1076 3.5,29.5 Z"/></g>\n' +
    '</svg>\n';
}

function getSvgCopy() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="48px" height="48px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '<g><path style="opacity:1" fill="#4573d2" d="M 5.5,1.5 C 14.8333,1.5 24.1667,1.5 33.5,1.5C 33.5,4.16667 33.5,6.83333 33.5,9.5C 36.1667,9.5 38.8333,9.5 41.5,9.5C 41.5,21.5 41.5,33.5 41.5,45.5C 32.1667,45.5 22.8333,45.5 13.5,45.5C 13.5,42.8333 13.5,40.1667 13.5,37.5C 10.8333,37.5 8.16667,37.5 5.5,37.5C 5.5,25.5 5.5,13.5 5.5,1.5 Z M 9.5,5.5 C 16.1667,5.5 22.8333,5.5 29.5,5.5C 29.5,14.8333 29.5,24.1667 29.5,33.5C 22.8333,33.5 16.1667,33.5 9.5,33.5C 9.5,24.1667 9.5,14.8333 9.5,5.5 Z M 33.5,13.5 C 34.8333,13.5 36.1667,13.5 37.5,13.5C 37.5,22.8333 37.5,32.1667 37.5,41.5C 30.8333,41.5 24.1667,41.5 17.5,41.5C 17.5,40.1667 17.5,38.8333 17.5,37.5C 22.8333,37.5 28.1667,37.5 33.5,37.5C 33.5,29.5 33.5,21.5 33.5,13.5 Z"/></g>\n' +
    '<g><path style="opacity:1" fill="#4573d2" d="M 13.5,9.5 C 17.5,9.5 21.5,9.5 25.5,9.5C 25.5,10.8333 25.5,12.1667 25.5,13.5C 21.5,13.5 17.5,13.5 13.5,13.5C 13.5,12.1667 13.5,10.8333 13.5,9.5 Z"/></g>\n' +
    '<g><path style="opacity:1" fill="#4573d2" d="M 13.5,17.5 C 17.5,17.5 21.5,17.5 25.5,17.5C 25.5,18.8333 25.5,20.1667 25.5,21.5C 21.5,21.5 17.5,21.5 13.5,21.5C 13.5,20.1667 13.5,18.8333 13.5,17.5 Z"/></g>\n' +
    '<g><path style="opacity:1" fill="#4573d2" d="M 13.5,25.5 C 17.5,25.5 21.5,25.5 25.5,25.5C 25.5,26.8333 25.5,28.1667 25.5,29.5C 21.5,29.5 17.5,29.5 13.5,29.5C 13.5,28.1667 13.5,26.8333 13.5,25.5 Z"/></g>\n' +
    '</svg>\n';
}

function getSvgStart() {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#63E6BE" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>';
}

function getSvgStartCR() {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#f8c716" d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-223.1L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6l29.7 0c33.7 0 64.9 17.7 82.3 46.6l44.9 74.7c-16.1 17.6-28.6 38.5-36.6 61.5c-1.9-1.8-3.5-3.9-4.9-6.3L232 256.9 232 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-16 0zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm0 240a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM368 321.6l0 6.4c0 8.8 7.2 16 16 16s16-7.2 16-16l0-6.4c0-5.3 4.3-9.6 9.6-9.6l40.5 0c7.7 0 13.9 6.2 13.9 13.9c0 5.2-2.9 9.9-7.4 12.3l-32 16.8c-5.3 2.8-8.6 8.2-8.6 14.2l0 14.8c0 8.8 7.2 16 16 16s16-7.2 16-16l0-5.1 23.5-12.3c15.1-7.9 24.5-23.6 24.5-40.6c0-25.4-20.6-45.9-45.9-45.9l-40.5 0c-23 0-41.6 18.6-41.6 41.6z"/></svg>';
}

function getSvgCross() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="48px" height="48px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '<g><path style="opacity:1" fill="#fb3c5d" d="M 41.5,10.5 C 29.5,10.5 17.5,10.5 5.5,10.5C 9.65305,4.0561 15.653,1.0561 23.5,1.5C 31.347,1.0561 37.347,4.0561 41.5,10.5 Z"/></g>\n' +
    '<g><path style="opacity:0.975" fill="#f8365a" d="M 5.5,10.5 C 17.5,10.5 29.5,10.5 41.5,10.5C 42.4013,11.2905 43.0679,12.2905 43.5,13.5C 39.9581,13.1872 36.6248,13.5206 33.5,14.5C 32.5768,13.6971 31.5768,13.5304 30.5,14C 28.3171,16.3504 25.9837,18.517 23.5,20.5C 21.0163,18.517 18.6829,16.3504 16.5,14C 15.4232,13.5304 14.4232,13.6971 13.5,14.5C 10.3752,13.5206 7.04185,13.1872 3.5,13.5C 3.93205,12.2905 4.59872,11.2905 5.5,10.5 Z"/></g>\n' +
    '<g><path style="opacity:1" fill="#fe718f" d="M 33.5,14.5 C 31.5967,17.7485 29.2634,20.7485 26.5,23.5C 28.5211,26.1878 30.8544,28.5211 33.5,30.5C 33.5852,31.9953 32.9185,32.9953 31.5,33.5C 28.8333,31.1667 26.1667,28.8333 23.5,26.5C 20.8333,28.8333 18.1667,31.1667 15.5,33.5C 14.0815,32.9953 13.4148,31.9953 13.5,30.5C 16.1456,28.5211 18.4789,26.1878 20.5,23.5C 17.7366,20.7485 15.4033,17.7485 13.5,14.5C 14.4232,13.6971 15.4232,13.5304 16.5,14C 18.6829,16.3504 21.0163,18.517 23.5,20.5C 25.9837,18.517 28.3171,16.3504 30.5,14C 31.5768,13.5304 32.5768,13.6971 33.5,14.5 Z"/></g>\n' +
    '<g><path style="opacity:0.978" fill="#f1244c" d="M 3.5,13.5 C 7.04185,13.1872 10.3752,13.5206 13.5,14.5C 15.4033,17.7485 17.7366,20.7485 20.5,23.5C 18.4789,26.1878 16.1456,28.5211 13.5,30.5C 9.70159,29.5166 5.70159,29.1832 1.5,29.5C 1.33432,25.1539 1.50098,20.8206 2,16.5C 2.23209,15.2625 2.73209,14.2625 3.5,13.5 Z"/></g>\n' +
    '<g><path style="opacity:0.964" fill="#f1244c" d="M 43.5,13.5 C 45.0186,16.5256 45.6852,19.8589 45.5,23.5C 45.4966,26.0254 45.1633,28.3587 44.5,30.5C 40.8333,29.1667 37.1667,29.1667 33.5,30.5C 30.8544,28.5211 28.5211,26.1878 26.5,23.5C 29.2634,20.7485 31.5967,17.7485 33.5,14.5C 36.6248,13.5206 39.9581,13.1872 43.5,13.5 Z"/></g>\n' +
    '<g><path style="opacity:0.982" fill="#ec1641" d="M 33.5,30.5 C 37.1667,29.1667 40.8333,29.1667 44.5,30.5C 44.0023,33.3263 42.6689,35.6597 40.5,37.5C 29.1667,37.5 17.8333,37.5 6.5,37.5C 4.04531,35.3678 2.37864,32.7012 1.5,29.5C 5.70159,29.1832 9.70159,29.5166 13.5,30.5C 13.4148,31.9953 14.0815,32.9953 15.5,33.5C 18.1667,31.1667 20.8333,28.8333 23.5,26.5C 26.1667,28.8333 28.8333,31.1667 31.5,33.5C 32.9185,32.9953 33.5852,31.9953 33.5,30.5 Z"/></g>\n' +
    '<g><path style="opacity:0.979" fill="#e80736" d="M 6.5,37.5 C 17.8333,37.5 29.1667,37.5 40.5,37.5C 36.5382,43.6066 30.8715,46.2733 23.5,45.5C 16.0552,46.2568 10.3885,43.5901 6.5,37.5 Z"/></g>\n' +
    '</svg>\n';
}

const handleRunTracking = (apiKey, taskName, project, tags) => {
  console.log(apiKey, taskName);
  fetch( BASE_API_URL+ '/asana-extension/run-tracking', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey,
      taskName,
      project,
      tags: tags
    })
  })
    .then((resp) => resp.json())
    .then((json) => {
      console.log(json);
    })
    .catch(err => console.log(err,'err'));
}

function extractTaskInfo(onlyChildTask) {
  const taskTitleElement = document.querySelector(TASK_TITLE_SELECTOR);
  const parentTaskElements = document.querySelectorAll(PARENT_TASK_TITLE_SELECTOR);

  if (taskTitleElement) {
    const taskName = taskTitleElement.textContent.trim();
    const names = [];

    if (!onlyChildTask) {
      parentTaskElements.forEach((parent) => {
        names.push(parent.textContent.trim());
      });
    }

    names.push(taskName);

    return names.join(' || ');
  }

  return null;
}

function extractTaskProjectName() {
  const taskProjectElement = document.querySelector(TASK_PROJECT_SELECTOR);

  if (taskProjectElement){
    return taskProjectElement.textContent;
  }

  return null;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'copyOnlyTaskName') {
    copyTaskInfo(true);
  }

  if (message.action === 'copyTaskNameParentIncluded') {
    copyTaskInfo(false);
  }
});

const copyTaskInfo = (shiftPressed, startTracking = false, tags = []) => {
  const taskInfo = extractTaskInfo(shiftPressed);
  const button = document.getElementById(COPY_BUTTON_ID);

  if (taskInfo && startTracking){
    chrome.storage.sync.get("togglApiKey", function(data) {
      if (data.togglApiKey) {
        const project = extractTaskProjectName();
        handleRunTracking(data.togglApiKey, taskInfo, project, tags);
      }
    });
  }

  if (taskInfo) {
    navigator.clipboard.writeText(taskInfo)
      .then(() => {
        button.innerHTML = getSvgCheck();

        setTimeout(function () {
          button.innerHTML = getSvgCopy();
        }, 5000);

        console.log('Task info copied to clipboard:', taskInfo);
      })
      .catch(err => {
        button.innerHTML = getSvgCross();

        setTimeout(function () {
          button.innerHTML = getSvgCopy();
        }, 5000);

        console.error('Failed to copy task info to clipboard:', err);
      });
  }
};

/** @param {Node} elementToAppendButton */
const appendCopyButton = (elementToAppendButton) => {
  appendButton(
    elementToAppendButton,
    COPY_BUTTON_ID,
    getSvgCopy(),
    (e) => copyTaskInfo(e.shiftKey),
    'Copy task name',
  );
};

/** @param {Node} elementToAppendButton */
const appendTrackingButtons = (elementToAppendButton) => {
  appendButton(
    elementToAppendButton,
    START_TRACKING_BUTTON_ID,
    getSvgStart(),
    (e) => copyTaskInfo(e.shiftKey, true),
    'Start tracking',
  );

  appendButton(
    elementToAppendButton,
    START_CODE_REVIEW_TRACKING_BUTTON_ID,
    getSvgStartCR(),
    (e) => copyTaskInfo(e.shiftKey, true, ['code review']),
    'Start Code review tracking',
  );
};

const appendButton = (elementToAppendButton, id, svg, onClickCallback, title) => {
  const buttonExists = document.getElementById(id);
  let button = buttonExists;

  if (!button) {
    button = document.createElement('button');
  }

  button.id = id;
  button.innerHTML = svg;

  if (title){
    button.title = title;
  }

  button.onclick = (e) => onClickCallback(e);

  if (!buttonExists) {
    const referenceElement = elementToAppendButton.children[3];

    elementToAppendButton.insertBefore(button, referenceElement);
  }
}

/** @param {MutationRecord} mutation */
const addCopyButtonAfterMutation = (mutation) => {
  const matchingElementsForCopyButton = Array.from(mutation.addedNodes)
    .filter(addedNode => typeof addedNode.querySelector === 'function')
    .map(addedNode => addedNode.querySelector(HEADING_SELECTOR))
    .filter(addedNode => addedNode);

  if (!matchingElementsForCopyButton.length) {
    return;
  }

  matchingElementsForCopyButton.forEach(appendCopyButton);
  matchingElementsForCopyButton.forEach(appendTrackingButtons);
};

/** @param {MutationRecord} mutation */
const checkComments = (mutation) => {
  if (!mutation.target.classList.contains(COMMENT_SECTION_CLASS_NAME)) {
    return;
  }

  pinToTop();
};

/** @param {MutationRecord[]} mutations */
const handleBodyMutation = (mutations) => {
  mutations.forEach((mutation) => {
    addCopyButtonAfterMutation(mutation);
    checkComments(mutation);
  });
};

// Extract task info and send to background script when page is loaded
window.addEventListener('load', () => {
  const observer = new MutationObserver(handleBodyMutation);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

function pinToTop() {
  const allComments = document.querySelectorAll(ALL_COMMENTS_SELECTOR);

  allComments.forEach((comment) => {
    const commentTextDiv = comment.querySelector(COMMENT_TEXT_DIV_SELECTOR);
    const commentButtonDiv = comment.querySelector(COMMENT_BUTTON_DIV_SELECTOR);

    if (!commentTextDiv) {
      console.log('Comment not found on this task');
    }

    if (!commentButtonDiv) {
      console.log('Comment action button not found on this task');
    }

    if (commentTextDiv && commentButtonDiv) {
      const commentText = commentTextDiv.textContent;
      const isIncluded = MR_DELIMITERS.some(delimiter => commentText.includes(delimiter));

      if (isIncluded) {
        commentButtonDiv.click();

        const pinToTop = document.querySelector(PIN_TO_TOP_BUTTON_SELECTOR);

        if (pinToTop && pinToTop.textContent === 'Pin to top') {
          pinToTop.click();
        } else {
          commentButtonDiv.click();
        }
      }
    }
  });
}
