class LoaderAnimation {
  constructor() {
    this.loader = document.getElementById('loader');
    this.initialize();
  }

  initialize() {
    window.addEventListener('load', () => {
      this.loader.classList.toggle('loader-end');
    });
  }
}

export default LoaderAnimation;
