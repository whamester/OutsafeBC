# WMDD-4885-Project

## Install app banner

This banner is only visible when you run https or localhost in a mobile device.

## Map Library - Leaflet

https://leafletjs.com/examples/quick-start/

## Repositoy Structure

### Feature Folder

```
[name-of-the-feature] (snake case)
- style.css (import variables and global styles in the feature css file)
- script.js
- index.html (import features css file and feature js file)
```

Working with a feature structure means that every feature folder will have the js and css related only to the specific feature

### Global files

- index.html
- js
  - global.js (To have some generic logic or settings, also all the js needed for the index.html page)
- styles
  - \_variables.css (imported inside \_global.css)
  - \_global.css (all files should have this styles)
  - [component].css (to avoid large css files and keep the classes organized we will create one file per component and import the component css file into the feature css file)
