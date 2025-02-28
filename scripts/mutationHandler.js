let observer = null;
let progressBarInterval = null;

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const resetObserversAndIntervals = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log('Observer disconnected.');
  }

  console.log(progressBarInterval);

  if (progressBarInterval) {
    clearInterval(progressBarInterval);
    progressBarInterval = null;
    console.log('Progress bar interval cleared.');
  }
};

const handleReactPageUpdate = debounce(async () => {
  console.log('React page update detected.');
  resetObserversAndIntervals();
  await setupObserver();
}, 200);

const setupObserver = async () => {
  console.log('Setting up MutationObserver.');

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      addCopyButtonAfterMutation(mutation);
      checkComments(mutation);
    });
  });

  await appendProgressBar();

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

const initializeExtension = async () => {
  console.log('Initializing extension.');
  await setupObserver();

  window.addEventListener('load', handleReactPageUpdate);
};

initializeExtension().then(() => {
  console.log('Initialed')
});
