//Constants
import { API_URL } from '../../constants.js';

//Components
import AlertPopup from './AlertPopup.js';
import ReportCardContainer from './ReportCardContainer.js';
import Modal from './Modal.js';

//Helpers
import showLoginModal from '../helpers/showLoginModal.js';
import { getUserSession } from '../helpers/storage.js';

const userSession = getUserSession();

const FLAGGED_BY_OTHERS_MESSAGE = 'This report has been flagged as fake by other users';
const FLAGGED_BY_OTHERS_AND_I_MESSAGE = 'This report has been flagged as fake by you and other users';
const FLAGGED_BY_ME_MESSAGE = 'This report has been flagged as fake by you';

class HazardDetailCard extends ReportCardContainer {
  constructor(data) {
    super(data);
    this.distance = data.distance;
    this.divContainer = null;
    this.createdByUserLoggedIn = userSession?.email === this.user.email;
  }

  showFakeReportConfirmationModal() {
    const modal = new Modal();

    const confirmButton = document.createElement('button');
    confirmButton.setAttribute('id', 'flag-confirmation-btn');
    confirmButton.setAttribute('class', 'btn btn-error');
    confirmButton.addEventListener('click', async () => {
      await this.flagAsFake();
      modal.close();
    });
    confirmButton.innerHTML = 'Flag Report';
    confirmButton.style.width = '7.875rem';
    confirmButton.style.justifyContent = 'center';

    const cancelButton = document.createElement('button');
    cancelButton.setAttribute('id', 'flag-cancel-btn');
    cancelButton.setAttribute('class', 'btn btn-secondary');
    cancelButton.addEventListener('click', async () => modal.close());
    cancelButton.innerHTML = 'Cancel';
    cancelButton.style.width = '7.875rem';
    cancelButton.style.justifyContent = 'center';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '1rem';

    actions.appendChild(cancelButton);
    actions.appendChild(confirmButton);

    modal.show({
      title: 'Are you sure you want to flag this report as fake?',
      description: 'Your decision helps us ensure the accuracy and reliability of our hazard reporting system.',
      icon: {
        name: 'icon-flag',
        color: 'var(--error-500)',
        size: '3.5rem',
      },
      actions,
      enableOverlayClickClose: true,
    });
  }

  async reportStillThere(option) {
    try {
      const response = await fetch(`${API_URL}/hazard-report-reaction?id=${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userSession?.id,
          still_there: option,
        }),
      });
      const { error, message } = await response.json();

      if (!!error) {
        AlertPopup.show(error, AlertPopup.error);
        console.error(error);
        return;
      }
      // Success alert
      AlertPopup.show(message, AlertPopup.success);
      this.enable_reaction = false;
      this.changeButtonState();
    } catch (error) {
      // Error alert
      AlertPopup.show('Unable to complete the action at the moment', AlertPopup.error);
      console.error(error);
    }
  }

  async flagAsFake() {
    try {
      const response = await fetch(`${API_URL}/hazard-report-flag?id=${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userSession?.id,
        }),
      });
      const { error, message } = await response.json();

      if (!!error) {
        AlertPopup.show(error, AlertPopup.error);
        console.error(error);
        return;
      }

      AlertPopup.show(message, AlertPopup.success);
      this.flagged_as_fake = true;
      this.changeButtonState();
    } catch (error) {
      // Error alert
      AlertPopup.show('Unable to complete the action at the moment', AlertPopup.error);
      console.error(error);
    }
  }

  changeButtonState() {
    //If I have already flagged the report
    if (!!this.flagged_as_fake) {
      // hide the flag report button
      this.divContainer.querySelector('#flagReportBtn').classList.add('hidden');
    } else {
      // show the flag report button
      this.divContainer.querySelector('#flagReportBtn').classList.remove('hidden');
    }

    // If I have flagged the report and others aswell
    if (this.flagged_as_fake && this.flagged_count > 0) {
      // show flagged by me and others the message
      this.divContainer.querySelector('#flagReportMessage').classList.remove('hidden');
      this.divContainer.querySelector('#flagReportMessage p').innerHTML = FLAGGED_BY_OTHERS_AND_I_MESSAGE;
    }
    // If I have flagged the report
    else if (this.flagged_as_fake) {
      // show flagged by me message
      this.divContainer.querySelector('#flagReportMessage').classList.remove('hidden');
      this.divContainer.querySelector('#flagReportMessage p').innerHTML = FLAGGED_BY_ME_MESSAGE;
    }
    // If others have flagged the report
    else if (this.flagged_count > 0) {
      // show flagged by others message
      this.divContainer.querySelector('#flagReportMessage').classList.remove('hidden');
      this.divContainer.querySelector('#flagReportMessage p').innerHTML = FLAGGED_BY_OTHERS_MESSAGE;
    }
    // If the report has not been flagged
    else {
      this.divContainer.querySelector('#flagReportMessage').classList.add('hidden');
    }

    // if enable reaction is false
    if (!this.enable_reaction) {
      // hide the reaction buttons
      this.divContainer.querySelector('#stillThereBtn').classList.add('hidden');
      this.divContainer.querySelector('#notThereBtn').classList.add('hidden');
    } else {
      // show the reaction buttons
      this.divContainer.querySelector('#stillThereBtn').classList.remove('hidden');
      this.divContainer.querySelector('#notThereBtn').classList.remove('hidden');
    }
  }

  hazardCardContent() {
    let divContainer = document.createElement('div');
    divContainer.setAttribute('id', `hazard-card__container`);
    let divOuter = document.createElement('div');
    divOuter.setAttribute('id', `hazard-card__outer`);
    divOuter.setAttribute('class', `report-card__outer`);
    let divInner = document.createElement('div');
    divInner.setAttribute('class', `report-card__inner`);

    divOuter.appendChild(super.getTopControls());
    divInner.appendChild(super.getHeading());
    divInner.appendChild(super.getDetailTopInfo());
    if (this.photos.length > 0) {
      divInner.appendChild(super.getGallery());
    }
    if (this.comment) {
      divInner.appendChild(super.getDescription());
    }
    divInner.appendChild(super.getReportedBy());
    divInner.appendChild(super.getReportFlagButtons());

    // TODO: We can add the edit button for the user if it's the author of the report

    divOuter.appendChild(divInner);
    divContainer.appendChild(divOuter);

    divContainer.querySelector('#stillThereBtn').addEventListener('click', () => {
      if (!userSession) {
        showLoginModal();
      } else {
        this.reportStillThere(true);
      }
    });

    divContainer.querySelector('#notThereBtn').addEventListener('click', () => {
      if (!userSession) {
        showLoginModal();
      } else {
        this.reportStillThere(false);
      }
    });

    divContainer.querySelector('#flagReportBtn').addEventListener('click', () => {
      if (!userSession) {
        showLoginModal();
      } else {
        this.showFakeReportConfirmationModal();
      }
    });

    this.divContainer = divContainer;

    this.changeButtonState();
    return divContainer;
  }
}

export default HazardDetailCard;
