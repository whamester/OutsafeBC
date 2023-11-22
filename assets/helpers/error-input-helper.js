import AlertPopup from '../components/AlertPopup.js';

const errorInputHelper = () => {
  const formField = document.querySelectorAll('.form-field.error');

  formField.forEach((element) => {
    try {
      const icon = document.createElement('i');
      const input = element.querySelector('input') || element.querySelector('textarea');
      const inputContainer = element.querySelector('.form-field__input-container');
      const inputAttributes = [...input.attributes];
      const isDisabled = inputAttributes.find((value) => {
        return value.name === 'disabled';
      });

      if (isDisabled) {
        element.classList.remove('error');

        return;
      }

      icon.setAttribute('class', 'icon-exclamation-mark');
      icon.style.mask = `url(../../assets/icons/exclamation-mark.svg)`;
      icon.style['-webkit-mask-image'] = `url(../../assets/icons/exclamation-mark.svg)`;
      icon.style['mask-size'] = 'cover';
      icon.style['-webkit-mask-size'] = 'cover';
      inputContainer.appendChild(icon);
      input.style.paddingRight = '2.2rem';
    } catch (error) {
      console.error(error);
      AlertPopup.show('Error loading icons for the input', AlertPopup.error);
    }
  });
};

export default errorInputHelper;
