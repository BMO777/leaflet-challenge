// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then((data) => {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});
// 2.
createFeatures = (earthquakeData) => {

  function onEachFeature(feature, layer)  {

    layer.bindPopup(`<h3>${feature.properties.place} </br>Magnitude: ${feature.properties.mag} </br>Depth(km):${feature.geometry.coordinates[2]}</h3>\
    <hr><p>${new Date(feature.properties.time)}</p>`);
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return L.circle(latlng, {
        color : "#F60D1D",
        fillColor : "#F60D1D",
        radius : Math.sqrt(10**(feature.properties.mag)) * 200,
        fillOpacity: 0.5, 
        color: "black",
        stroke: true,
        weight: 0.5
        
      })  }
  //   pointToLayer: (feature, latlng) => {

  //     // Determine the style of markers based on properties
  // let markers = {
  //       radius: 20,
  //       fillColor: "#F60D1D",
  //       fillOpacity: 0.7,
  //       color: "black",
  //       stroke: true,
  //       weight: 0.5
  //     }
  //     return L.circle(latlng,markers);
  //   }
  
    });
// 3.
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}// createMap() takes the earthquake data and incorporates it into the visualization:

createMap = (earthquakes) => {
  // Create the base layers.
  let openstreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let opentopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

let Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});
let CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

  //add 2012NASA night map using leaflet provider extension call
  let NASA2012night = L.tileLayer.provider('NASAGIBS.ViirsEarthAtNight2012')
  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": openstreet,
    "Topographic Map": opentopo,
    "USGS_USImagery Map": USGS_USImageryTopo,
    "Stamen_Terrain": Stamen_Terrain,
    "CartoDB_DarkMatter": CartoDB_DarkMatter,
    "NASA2012night": NASA2012night
  };

  // Create an overlays object.
  let overlayMaps = {
    Earthquakes: earthquakes,

  };

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: [
      33, -100
    ],
    zoom: 5,
    layers: [CartoDB_DarkMatter, earthquakes]
  });

bonus(myMap, baseMaps)


  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);


}