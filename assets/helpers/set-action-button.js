export const showButtonLoading = (id) => {
  const thisButton = document.getElementById(id);
  console.log({ thisButton });
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

export const stopButtonLoading = (id) => {
  const thisButton = document.getElementById(id);
  const spinner = thisButton.querySelector('.spinner');
  const checkmark = thisButton.querySelector('.loading-finished-icon');
  const mainIcon = thisButton.querySelector('.main-icon');

  try {
    if (spinner) {
      spinner.classList.remove('loading');
    }
    if (checkmark) {
      checkmark.classList.remove('hidden');
    }
    if (mainIcon) {
      mainIcon.classList.add('hidden');
    }
  } catch (error) {}

  setTimeout(() => {
    try {
      checkmark.classList.add('hidden');
      mainIcon.classList.remove('hidden');
      if (thisButton) {
        thisButton.style.pointerEvents = 'auto';
      }
    } catch (error) {
      console.error(error);
    }
  }, 1000);
};

const setActionButton = (button) => {
  button.addEventListener('click', (event) => {
    const thisButton = document.getElementById(event.target.id);
    const spinner = event.target.querySelector('.spinner');
    const checkmark = event.target.querySelector('.loading-finished-icon');
    const mainIcon = event.target.querySelector('.main-icon');
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

    setTimeout(() => {
      try {
        spinner.classList.remove('loading');
        checkmark.classList.remove('hidden');
        mainIcon.classList.add('hidden');
      } catch (error) {}

      setTimeout(() => {
        try {
          checkmark.classList.add('hidden');
          mainIcon.classList.remove('hidden');
          if (thisButton) {
            thisButton.style.pointerEvents = 'auto';
          }
        } catch (error) {}
      }, 1000);
    }, 1000);
  });
};

export const setAllActionButtons = () => {
  const buttons = document.querySelectorAll('button.btn-action');

  buttons.forEach((button) => {
    setActionButton(button);
  });
};

export default setActionButton;
