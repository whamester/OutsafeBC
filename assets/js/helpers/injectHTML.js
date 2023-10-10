// injects the HTML string into the DOM
const injectHTML = (componentArray, id) => {
  const root = document.getElementById(id ?? "root");
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
