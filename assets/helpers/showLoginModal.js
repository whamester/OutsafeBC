import Modal from '../components/Modal.js';

const showLoginModal = () => {
  const modal = new Modal();

  const loginBtn = document.createElement('button');
  loginBtn.setAttribute('id', 'open-modal-btn');
  loginBtn.setAttribute('class', 'btn btn-primary');
  loginBtn.addEventListener('click', () => window.location.assign(`/pages/login/index.html`));
  loginBtn.innerHTML = 'Log in';

  modal.show({
    title: 'Please log in to continue',
    description: 'Thank you for helping others have a safe outdoors experience.',
    icon: {
      name: 'icon-exclamation-mark',
      color: '#000000',
      size: '3.5rem',
    },
    actions: loginBtn,
    enableOverlayClickClose: true,
  });
};

export default showLoginModal;
