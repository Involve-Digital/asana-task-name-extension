const appendProgressBar = async () => {
  const dependencyDiv = document.querySelector(DEPENDENCIES_SELECTOR);

  if (!dependencyDiv) {
    return;
  }

  if (progressBarInterval) {
    clearInterval(progressBarInterval);
    progressBarInterval = null;
  }

  try {
    const progressBarActive = await getDataFromChromeStorage('progressBar')

    if (!progressBarActive) {
      return;
    }
  } catch (error) {
    console.error('Error retrieving progressBar:', error);

    return;
  }

  const taskIdElement = document.querySelector('#TaskPrintView[data-task-id]');

  if (!taskIdElement?.dataset?.taskId) {
    return;
  }

  const taskId = taskIdElement.dataset.taskId;

  const progressBarDiv = document.createElement('div');
  progressBarDiv.style.marginTop = '10px';
  progressBarDiv.style.marginBottom = '10px';
  progressBarDiv.style.width = '100%';
  progressBarDiv.style.display = 'flex';
  progressBarDiv.id = 'used-budget-bar';

  const usedBudget = await getUsedBudget(taskId)

  clearInterval(progressBarInterval);
  progressBarInterval = null;

  if (usedBudget !== null) {
    progressBarDiv.innerHTML = '<div id="percent-' + taskId + '" style="width: 20%">' + usedBudget + ' %</div><div style="height: 20px;width: 80%; background-color: #cccccc; border-radius: 5px; overflow: hidden; position: relative;"><div id="bar-width-' + taskId + '" style="width: ' + usedBudget + '%; height: 20px; background-color: #4caf50; transition: width 2s ease 0s;"></div></div>';

    dependencyDiv.after(progressBarDiv);

    if (usedBudget >= 75) {
      const barWidth = document.getElementById('bar-width-' + taskId);
      barWidth.style.backgroundColor = '#ee9314';
    }

    progressBarInterval = setInterval(() => {
      getUsedBudget(taskId)
        .then((usedBudget) => {
          const percentage = document.getElementById('percent-' + taskId);
          const barWidth = document.getElementById('bar-width-' + taskId);

          if (usedBudget !== null && percentage && barWidth) {
            percentage.textContent = usedBudget + ' %';
            barWidth.style.width = usedBudget + '%';

            if (usedBudget >= 75) {
              barWidth.style.backgroundColor = '#ee9314';
            }
          }
        });
    }, 1200000);
  }
};
