class LoaderAnimation {
  static initialize() {
    this.loader = document.getElementById('loader');

    window.addEventListener('load', () => {
      this.loader.classList.toggle('loader-end');
    });
  }
}

export default LoaderAnimation;
