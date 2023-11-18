export const GeoMap = () => {
  return `
    <div id="map"></div>
    <div id="map-controls">
      <div class="map-controls-zoom">
        <button class="map-controls-zoom-btn" id="mapZoomIn">
          <img src="/assets/icons/plus.svg" alt="+" />
        </button>
        <button class="map-controls-zoom-btn" id="mapZoomOut">
          <img src="/assets/icons/minus.svg" alt="-" />
        </button>
      </div>

      <div class="map-controls-recenter">
        <button class="map-controls-recenter-btn">
          <img src="/assets/icons/recenter.svg" alt="R" />
        </button>
      </div>
    </div>
  `;
};

export default GeoMap;
