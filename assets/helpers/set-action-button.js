export const showButtonLoading = (id) => {
  const thisButton = document.getElementById(id);

  const spinner = thisButton.querySelector('.spinner');
  const checkmark = thisButton.querySelector('.loading-finished-icon');
  const mainIcon = thisButton.querySelector('.main-icon');

  if (spinner) {
    spinner.classList.add('loading');
  }
  if (mainIcon) {
    mainIcon.classList.add('hidden');
  }
  if (checkmark) {
    checkmark.classList.add('hidden');
  }
  if (thisButton) {
    thisButton.style.pointerEvents = 'none';
  }
};

export const stopButtonLoading = (id, { reset }) => {
  const thisButton = document.getElementById(id);
  const spinner = thisButton.querySelector('.spinner');
  const checkmark = thisButton.querySelector('.loading-finished-icon');
  const mainIcon = thisButton.querySelector('.main-icon');

  if (spinner) {
    spinner.classList.remove('loading');
  }
  if (checkmark) {
    checkmark.classList.remove('hidden');
  }
  if (mainIcon) {
    mainIcon.classList.add('hidden');
  }

  if (reset) {
    setTimeout(() => {
      try {
        if (checkmark) {
          checkmark.classList.add('hidden');
        }
        if (mainIcon) {
          mainIcon.classList.remove('hidden');
        }
        if (thisButton) {
          thisButton.style.pointerEvents = 'auto';
        }
      } catch (error) {
        console.error(error);
      }
    }, 1000);
  }
};
