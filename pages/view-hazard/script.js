import { 
  Navbar, 
  GeoMap 
} from "../../assets/js/components/index.js";
import {
  Map,
  injectHTML
} from "../../assets/js/helpers/index.js";

injectHTML([Navbar, GeoMap]);

// get current geo-position of the user
const position = await Map.getCurrentLocation();
// initialize map constructor
new Map(position);
// pin users location on the map
const marker = Map.setMarkerOnMap(position.latitude, position.longitude, "You");

