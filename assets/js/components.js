export const Navbar = () => {
  return `
  <header class="position-fixed top-0 start-0 w-100" style="z-index:999">
    <nav class="z-index-master navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand fs-1 fw-bold mx-4" href="#">CampBuddy</a>
      <div class="input-group">
    </nav>
    <div class="mt-4 mx-4">
      <div class="d-flex gap-1">
        <div class="form-control">
          <img src="/assets/img/icons/icon-search.png">
          <input class="search--input" placeholder="Search here..."/>
        </div>
        <button class="btn btn-light filter--btn"><img src="/assets/img/icons/icon-filter.png"></button>
      </div>
      <div class="container">
        <div class="mt-2 row flex-nowrap overflow-auto">
          <button class="col-xs-4 btn btn-light btn-tags">Wildfire</button>
          <button class="col-xs-4 btn btn-light btn-tags">Weather</button>
          <button class="col-xs-4 btn btn-light btn-tags">Wildlife</button>
          <button class="col-xs-4 btn btn-light btn-tags">Infrastructure</button>
        </div>
      </div>
    </div>
  </header>
  `
}

export const Map = () => {
  return `
    <div id="map"></div>
  `
}

export const injectComponent = (comps) => {
  let html = "";
  comps?.forEach(func => {
    html += func();
  })
  document.getElementById("root").innerHTML = html;
}