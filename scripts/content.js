const TASK_TITLE_SELECTOR = 'textarea.BaseTextarea.simpleTextarea--dynamic.simpleTextarea.AutogrowTextarea-input';
const PARENT_TASK_TITLE_SELECTOR = 'div.Breadcrumb.TaskAncestryBreadcrumb.TaskAncestry-taskAncestryBreadcrumb > a';
const HEADING_SELECTOR = 'div.TaskPaneToolbar.TaskPane-header.Stack.Stack--align-center.Stack--direction-row.Stack--display-block.Stack--justify-space-between';
const ALL_COMMENTS_SELECTOR = 'div.FeedBlockStory.TaskStoryFeed-blockStory';
const COMMENT_TEXT_DIV_SELECTOR = 'div.RichText3.TruncatedRichText-richText';
const COMMENT_BUTTON_DIV_SELECTOR = 'div.FeedBlockStory-actionsDropdownButton';
const PIN_TO_TOP_BUTTON_SELECTOR = '.TypographyPresentation.TypographyPresentation--overflowTruncate.TypographyPresentation--medium.LeftIconItemStructure-label';
const COMMENT_SECTION_CLASS_NAME = 'TaskStoryFeed';
const MR_DELIMITERS = ['MR: ', 'MR - '];
const COPY_BUTTON_ID = 'asana-task-name-extension-copy-button';
const TOGGL_REPORT_BUTTON_ID = 'asana-task-name-extension-toggl-report-button';
const START_TRACKING_BUTTON_ID = 'asana-task-name-extension-start-tracking-button';
const START_CODE_REVIEW_TRACKING_BUTTON_ID = 'asana-task-name-extension-start-code-review-tracking-button';
const TASK_PROJECT_SELECTOR = 'div.TaskProjectTokenPill-name';
const TASK_PROJECT_FALLBACK_SELECTOR = 'a.HiddenNavigationLink.TaskAncestry-ancestorProject';
const COPY_TASK_LINK_SELECTOR = 'div.TaskPaneToolbar-copyLinkButton';
const BASE_API_URL = 'https://backend.involve.cz/api/v1';
const TOGGL_REPORT_URL = 'https://track.toggl.com/reports/summary/1033184/description/__taskName__/period/last12Months';


const ICONS_TO_BUTTON = {
  [COPY_BUTTON_ID]: 'copy',
  [START_TRACKING_BUTTON_ID]: 'start',
  [START_CODE_REVIEW_TRACKING_BUTTON_ID]: 'start-cr',
}

function getSvgIcon(name) {
  const svgPath = chrome.runtime.getURL('icons/' + name + '.svg');

  return fetch(svgPath)
    .then(response => response.text())
    .catch(error => {
      console.error('Error loading SVG:', error);

      return '';
    });
}

const handleRunTracking = (apiKey, taskName, project, tags) => {
  fetch(BASE_API_URL + '/asana-extension/run-tracking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey,
      taskName,
      project,
      tags: tags
    })
  }).catch(err => console.error(err));
};

const getTaskInfo = async (apiKey, taskId) => {
  const response = await fetch(BASE_API_URL + '/asana-extension/task-information', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey,
      taskId,
    })
  });

  const jsonResponse = await response.json();

  return jsonResponse?.data
};

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

  if (taskProjectElement) {
    return taskProjectElement.textContent;
  }

  const taskProjectFallbackElement = document.querySelector(TASK_PROJECT_FALLBACK_SELECTOR);

  if (taskProjectFallbackElement) {
    return taskProjectFallbackElement.textContent;
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

const fetchData = async (taskId) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('asanaApiKey', async function (data) {
      if (data.asanaApiKey) {
        try {
          const taskInfo = await getTaskInfo(
            data.asanaApiKey,
            taskId
          );
          resolve(taskInfo);
        } catch (error) {
          reject(error);
        }
      } else {
        reject('API Key not found');
      }
    });
  });
};

const copyTaskInfo = async (shiftPressed, startTracking = false, tags = [], buttonId = null) => {
  const copyButton = document.querySelector(COPY_TASK_LINK_SELECTOR);
  copyButton.click();
  let link;
  let urlParts;

  try {
    const clipboardContents = await navigator.clipboard.read();

    if (!clipboardContents.length) {
      return;
    }

    const blob = await clipboardContents[0].getType("text/plain");
    link = await blob.text();
    urlParts = link?.replace('/f', '').split('/');
  } catch (error) {
    const taskIdElement = document.querySelector('[data-task-id]');

    if (!taskIdElement?.dataset?.taskId) {
      console.error(error); // Log any errors that occur

      return;
    }

    urlParts = [taskIdElement.dataset.taskId];
  }

  let taskId;

  if (!urlParts || !urlParts.length) {
    return;
  }

  taskId = urlParts.pop();

  const button = document.getElementById(buttonId || COPY_BUTTON_ID);

  try {
    button.innerHTML = await getSvgIcon('loader');

    const taskInfoApi = await fetchData(taskId);
    let taskInfo;

    if (shiftPressed) {
      taskInfo = taskInfoApi?.taskName
    } else {
      taskInfo = taskInfoApi?.wholeTaskName;
    }

    if (taskInfoApi && startTracking) {
      chrome.storage.sync.get('togglApiKey', function (data) {
        if (data.togglApiKey) {
          const project = taskInfoApi.project;
          const taskInfo = taskInfoApi.wholeTaskName;
          handleRunTracking(data.togglApiKey, taskInfo, project, tags);
        }
      });
    }

    if (taskInfo) {
      navigator.clipboard.writeText(taskInfo)
        .then(async () => {
          button.innerHTML = await getSvgIcon('check');

          console.log('Task info copied to clipboard:', taskInfo);
        })
        .catch(async err => {
          button.innerHTML = await getSvgIcon('cross');

          console.error('Failed to copy task info to clipboard:', err);
        })
        .finally(() => {
          setTimeout(async function () {
            const iconName = ICONS_TO_BUTTON[button.id];
            button.innerHTML = await getSvgIcon(iconName);
          }, 5000);
        });
    }
  } catch (error) {
    const iconName = ICONS_TO_BUTTON[button.id];
    button.innerHTML = await getSvgIcon(iconName);
    console.error(error); // Log any errors that occur
  }
};

/** @param {Node} elementToAppendButton */
const appendCopyButton = async (elementToAppendButton) => {
  chrome.storage.sync.get('copyButton', async function (data) {
    if (data.copyButton) {
      appendButton(
        elementToAppendButton,
        COPY_BUTTON_ID,
        await getSvgIcon('copy'),
        (e) => copyTaskInfo(e.shiftKey, false, [], COPY_BUTTON_ID),
        'Copy task name',
      );
    }
  });
};

/** @param {Node} elementToAppendButton */
const appendToggleButton = async (elementToAppendButton) => {
  chrome.storage.sync.get('togglReportButton', async function (data) {
    if (data.togglReportButton) {
      appendButton(
        elementToAppendButton,
        TOGGL_REPORT_BUTTON_ID,
        await getSvgIcon('analysis'),
        (e) => {
          const taskInfo = extractTaskInfo(e.shiftKey);

          if (taskInfo) {
            const url = TOGGL_REPORT_URL.replace('__taskName__', taskInfo);

            window.open(url, '_blank');
          }
        },
        'See report in Toggl',
      );
    }
  });
};

/** @param {Node} elementToAppendButton */
const appendTrackingButtons = (elementToAppendButton) => {
  chrome.storage.sync.get('togglApiKey', async function (data) {
    if (data.togglApiKey) {
      chrome.storage.sync.get('trackingButton', async function (data) {
        if (data.trackingButton) {
          appendButton(
            elementToAppendButton,
            START_TRACKING_BUTTON_ID,
            await getSvgIcon('start'),
            (e) => copyTaskInfo(e.shiftKey, true, [], START_TRACKING_BUTTON_ID),
            'Start tracking',
          );
        }
      });

      chrome.storage.sync.get('crTrackingButton', async function (data) {
        if (data.crTrackingButton) {
          appendButton(
            elementToAppendButton,
            START_CODE_REVIEW_TRACKING_BUTTON_ID,
            await getSvgIcon('start-cr'),
            (e) => copyTaskInfo(e.shiftKey, true, ['code review'], START_CODE_REVIEW_TRACKING_BUTTON_ID),
            'Start Code review tracking',
          );
        }
      });
    }
  });
};

const appendButton = (elementToAppendButton, id, svg, onClickCallback, title) => {
  const buttonExists = document.getElementById(id);
  let button = buttonExists;

  if (!button) {
    button = document.createElement('button');
  }

  button.id = id;
  button.innerHTML = svg;

  if (title) {
    button.title = title;
  }

  button.onclick = (e) => onClickCallback(e);

  if (!buttonExists) {
    const referenceElement = elementToAppendButton.children[3];

    elementToAppendButton.insertBefore(button, referenceElement);
  }
};

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
  matchingElementsForCopyButton.forEach(appendToggleButton);
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
      const commentText = commentTextDiv.innerHTML;
      const isIncluded = MR_DELIMITERS.some(delimiter => commentText.includes(delimiter));

      if (isIncluded) {
        commentButtonDiv.click();

        setTimeout(() => {
          const pinToTop = document.querySelector(PIN_TO_TOP_BUTTON_SELECTOR);

          if (pinToTop && pinToTop.textContent === 'Pin to top') {
            pinToTop.click();
          }

          commentButtonDiv.click();
        }, 1);
      }
    }
  });
}
