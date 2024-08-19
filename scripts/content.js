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
const TASK_PROJECT_FALLBACK_SELECTOR = 'div.TypographyPresentation.TypographyPresentation--colorWeak.TypographyPresentation--s.TaskAncestry-ancestorProjects>a.HiddenNavigationLink.TaskAncestry-ancestorProject';
const BASE_API_URL = 'https://backend.involve.cz/api/v1';

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
  }).catch(err => console.error(err, 'err'));
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

const copyTaskInfo = (shiftPressed, startTracking = false, tags = []) => {
  const taskInfo = extractTaskInfo(shiftPressed);
  const button = document.getElementById(COPY_BUTTON_ID);

  if (taskInfo && startTracking) {
    chrome.storage.sync.get('togglApiKey', function (data) {
      if (data.togglApiKey) {
        const project = extractTaskProjectName();
        handleRunTracking(data.togglApiKey, taskInfo, project, tags);
      }
    });
  }

  if (taskInfo) {
    navigator.clipboard.writeText(taskInfo)
      .then(async () => {
        button.innerHTML = await getSvgIcon('check');

        setTimeout(async function () {
          button.innerHTML = await getSvgIcon('copy');
        }, 5000);

        console.log('Task info copied to clipboard:', taskInfo);
      })
      .catch(async err => {
        button.innerHTML = await getSvgIcon('cross');

        setTimeout(async function () {
          button.innerHTML = await getSvgIcon('copy');
        }, 5000);

        console.error('Failed to copy task info to clipboard:', err);
      });
  }
};

/** @param {Node} elementToAppendButton */
const appendCopyButton = async (elementToAppendButton) => {
  appendButton(
    elementToAppendButton,
    COPY_BUTTON_ID,
    await getSvgIcon('copy'),
    (e) => copyTaskInfo(e.shiftKey),
    'Copy task name',
  );
};

/** @param {Node} elementToAppendButton */
const appendTrackingButtons = (elementToAppendButton) => {
  chrome.storage.sync.get('togglApiKey', async function (data) {
    if (data.togglApiKey) {
      appendButton(
        elementToAppendButton,
        START_TRACKING_BUTTON_ID,
        await getSvgIcon('start'),
        (e) => copyTaskInfo(e.shiftKey, true),
        'Start tracking',
      );

      appendButton(
        elementToAppendButton,
        START_CODE_REVIEW_TRACKING_BUTTON_ID,
        await getSvgIcon('start-cr'),
        (e) => copyTaskInfo(e.shiftKey, true, ['code review']),
        'Start Code review tracking',
      );
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
