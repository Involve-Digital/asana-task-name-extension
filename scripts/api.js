const BASE_API_URL = 'https://backend.involve.cz/api/v1';
const TOGGL_REPORT_URL = 'https://track.toggl.com/reports/summary/1033184/description/__taskName__/period/last12Months';

const handleRunTracking = async (taskName, project, tags) => {
  const togglApiKey = await getDataFromChromeStorage('togglApiKey');

  if (!togglApiKey){
    return;
  }

  fetch(BASE_API_URL + '/asana-extension/run-tracking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: togglApiKey,
      taskName,
      project,
      tags: tags
    })
  }).catch(err => console.error(err));
};

const getTaskInfo = async (taskId) => {
  const asanaApiKey = await getDataFromChromeStorage('asanaApiKey');

  if (!asanaApiKey){
    return;
  }

  const response = await fetch(BASE_API_URL + '/asana-extension/task-information', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: asanaApiKey,
      taskId,
    })
  });

  const jsonResponse = await response.json();

  return jsonResponse?.data
};

const getUsedBudget = async (taskId) => {
  const asanaApiKey = await getDataFromChromeStorage('asanaApiKey');
  const togglApiKey = await getDataFromChromeStorage('togglApiKey');

  if (!asanaApiKey || !togglApiKey){
    return;
  }

  const response = await fetch(BASE_API_URL + '/asana-extension/time-spent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: asanaApiKey,
      togglApiKey,
      taskId,
    })
  });

  const jsonResponse = await response.json();

  return jsonResponse?.data?.usedBudget ?? null;
};

const getDataFromChromeStorage = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, function (data) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (data[key]) {
        resolve(data[key]);
      } else {
        console.log('Could not get data for key: ' + key);
        resolve(null);
      }
    });
  });
};

