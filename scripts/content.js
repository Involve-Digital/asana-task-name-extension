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
const COPY_TASK_LINK_SELECTOR = 'div.TaskPaneToolbar-copyLinkButton';
const DEPENDENCIES_SELECTOR = 'div#task_pane_dependencies_label';

const copyTaskInfo = async (shiftPressed, startTracking = false, tags = [], buttonId = null) => {
  const copyButton = document.querySelector(COPY_TASK_LINK_SELECTOR);
  const taskIdElement = document.querySelector('[data-task-id]');
  let link;
  let urlParts;

  if (taskIdElement?.dataset?.taskId) {
    urlParts = [taskIdElement.dataset.taskId];
  }

  if (!urlParts || !urlParts.length) {
    copyButton.click();

    try {
      const clipboardContents = await navigator.clipboard.read();

      if (!clipboardContents.length) {
        return;
      }

      const blob = await clipboardContents[0].getType("text/plain");
      link = await blob.text();
      urlParts = link?.replace('/f', '').split('/');
    } catch (error) {
      console.error(error); // Log any errors that occur

      return;
    }
  }

  let taskId;

  if (!urlParts || !urlParts.length) {
    return;
  }

  taskId = urlParts.pop();

  const button = document.getElementById(buttonId || COPY_BUTTON_ID);

  try {
    button.innerHTML = await getSvgIcon('loader');

    const taskInfoApi = await getTaskInfo(taskId);
    let taskInfo;

    if (shiftPressed) {
      taskInfo = taskInfoApi?.taskName
    } else {
      taskInfo = taskInfoApi?.wholeTaskName;
    }

    if (taskInfoApi && startTracking) {
      const project = taskInfoApi.project;
      const taskInfo = taskInfoApi.wholeTaskName;
      await handleRunTracking(taskInfo, project, tags);
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
  const copyButtonEnabled = await getDataFromChromeStorage('copyButton');

  if (copyButtonEnabled) {
    appendButton(
      elementToAppendButton,
      COPY_BUTTON_ID,
      await getSvgIcon('copy'),
      (e) => copyTaskInfo(e.shiftKey, false, [], COPY_BUTTON_ID),
      'Copy task name',
    );
  }
};

/** @param {Node} elementToAppendButton */
const appendToggleButton = async (elementToAppendButton) => {
  const togglReportButtonEnabled = await getDataFromChromeStorage('togglReportButton');

  if (togglReportButtonEnabled) {
    appendButton(
      elementToAppendButton,
      TOGGL_REPORT_BUTTON_ID,
      await getSvgIcon('analysis'),
      async (e) => {
        const taskIdElement = document.querySelector('[data-task-id]');

        if (!taskIdElement?.dataset?.taskId) {
          console.error('Task ID not found');

          return;
        }

        const taskId = taskIdElement.dataset.taskId;

        const taskInfoApi = await getTaskInfo(taskId);
        const taskInfo = taskInfoApi?.wholeTaskName;

        if (taskInfo) {
          const saveTaskInfo = encodeURIComponent(taskInfo);

          const url = TOGGL_REPORT_URL.replace('__taskName__', saveTaskInfo);

          window.open(url, '_blank');
        }
      },
      'See report in Toggl',
    );
  }
};

/** @param {Node} elementToAppendButton */
const appendTrackingButtons = async (elementToAppendButton) => {
  const togglApiKey = await getDataFromChromeStorage('togglApiKey');
  const trackingButtonEnabled = await getDataFromChromeStorage('trackingButton');
  const crTrackingButtonEnabled = await getDataFromChromeStorage('crTrackingButton');

  if (!togglApiKey) {
    return;
  }

  if (trackingButtonEnabled) {
    appendButton(
      elementToAppendButton,
      START_TRACKING_BUTTON_ID,
      await getSvgIcon('start'),
      (e) => copyTaskInfo(e.shiftKey, true, [], START_TRACKING_BUTTON_ID),
      'Start tracking',
    );
  }

  if (crTrackingButtonEnabled) {
    appendButton(
      elementToAppendButton,
      START_CODE_REVIEW_TRACKING_BUTTON_ID,
      await getSvgIcon('start-cr'),
      (e) => {
        copyTaskInfo(e.shiftKey, true, ['code review'], START_CODE_REVIEW_TRACKING_BUTTON_ID)
      },
      'Start Code review tracking',
    );
  }
};

/** @param {MutationRecord} mutation */
const addCopyButtonAfterMutation = async (mutation) => {
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

  await appendProgressBar();
};

/** @param {MutationRecord} mutation */
const checkComments = (mutation) => {
  if (!mutation.target.classList.contains(COMMENT_SECTION_CLASS_NAME)) {
    return;
  }

  pinToTop();
};

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

          setTimeout(() => {
            commentButtonDiv.click();
          }, 10)
        }, 1);
      }
    }
  });
}
