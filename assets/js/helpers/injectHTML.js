// injects the HTML string into the DOM
const injectHTML = (componentArray) => {
  const root = document.getElementById("root");
  root.insertAdjacentHTML(
    'beforeend', 
    componentArray.map(component => {
      if(typeof(component) === "function")
        return component()

      // argument passed to component
      return component[0](component[1]);
    })
  );
}

export default injectHTML;
