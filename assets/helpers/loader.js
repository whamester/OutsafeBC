import injectHTML from './inject-html.js';

const Loader = (loadingState=true) => {
  const LoaderElem = () => {
    return `
      <div id="loader">
        <div class="loader-wrapper">
          <div class="loader--img"></div>
          <h2 class="loader--txt text-heading-2">Loading...</h2>
        </div>
      </div>
    `;
  }

  if (loadingState) {
    document.body.style.overflowY = 'hidden';
    injectHTML([
      {
        func: LoaderElem,
        target: 'body'
      }
    ])
  } else {
    document.body.style.overflowY = 'auto';
    const loader = document.getElementById('loader');
    loader?.remove();
  }
}

export default Loader;
