const ICONS_TO_BUTTON = {
  [COPY_BUTTON_ID]: 'copy',
  [START_TRACKING_BUTTON_ID]: 'start',
  [START_CODE_REVIEW_TRACKING_BUTTON_ID]: 'start-cr',
}

const appendButton = (
  elementToAppendButton,
  id,
  svg,
  onClickCallback,
  title,
  childrenToInsertBeforeIndex = 3,
) => {
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
    const referenceElement = elementToAppendButton.children[childrenToInsertBeforeIndex];

    elementToAppendButton.insertBefore(button,referenceElement);
  }
};

const getSvgIcon = (name) => {
  const svgPath = chrome.runtime.getURL('icons/' + name + '.svg');

  return fetch(svgPath)
    .then(response => response.text())
    .catch(error => {
      console.error('Error loading SVG:', error);

      return '';
    });
}
