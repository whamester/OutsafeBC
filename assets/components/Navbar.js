import SearchBar from "./SearchBar.js";

const Navbar = (params) => {
  const { isSearchable } = params;
  return `
  <header class="position-fixed top-0 start-0 w-100" style="z-index:999">
    <nav class="z-index-master navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand fs-1 fw-bold mx-4" href="#">Outsafe BC</a>
      <div class="input-group">
    </nav>
    ${ isSearchable ? SearchBar(params): "" }
  </header>
  `;
};

export default Navbar;
