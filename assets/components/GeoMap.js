export const GeoMap = () => {
  return `
    <div id="map"></div>
    <div id="map-controls">
      <div class="map-controls-recenter">
        <button id="recenterBtn" class="map-controls-recenter-btn"></button>
      </div>
      <div class="map-controls-zoom">
        <button class="map-controls-zoom-btn" id="mapZoomIn">
          <i class="icon-plus"></i>
        </button>
        <button class="map-controls-zoom-btn" id="mapZoomOut">
          <i class="icon-minus"></i>
        </button>
      </div>
    </div>
  `;
};

export default GeoMap;
