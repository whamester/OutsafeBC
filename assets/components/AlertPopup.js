class AlertPopup {
  //default messages
  static SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong';
  //types
  static success = 'success';
  static error = 'error';
  static warning = 'warning';

  constructor() {}

  static show(message, type = AlertPopup.success, delay = 3000) {
    if (!message) {
      throw new Error('message is required');
    }

    const alert = `
    <div id="alert" class="hidden">
    <div id="alert-icon"></div>
      <p id="alert-message" class="text-body-2"></p>
    </div>
  `;

    const body = document.getElementsByTagName('body')?.[0];

    let alertContainer = document.getElementById('alert-portal');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.setAttribute('id', 'alert-portal');
    }
    alertContainer.innerHTML = alert;

    body.appendChild(alertContainer);

    this.message = message;
    this.type = type;
    this.delay = delay;

    const messageElement = document.getElementById('alert-message');
    messageElement.innerHTML = message;

    const iconElement = document.createElement('i');

    switch (type) {
      case AlertPopup.warning:
        iconElement.classList.add('icon-warning');
        break;

      case AlertPopup.error:
        iconElement.classList.add('icon-close-square');
        break;

      default:
        iconElement.classList.add('icon-checkmark');
        break;
    }

    document.getElementById('alert-icon').appendChild(iconElement);

    const alertElement = document.getElementById('alert');
    alertElement.classList.add(this.type);
    alertElement.classList.remove('hidden');

    setTimeout(() => {
      const alertElement = document.getElementById('alert');
      alertElement.classList.add('dismiss');
    }, delay);
  }
}

export default AlertPopup;
