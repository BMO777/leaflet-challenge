// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then((data) => {
  // console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});
//imports from RaimbowVisJS library to set spectrum of gradient
let rainbow = new Rainbow();
rainbow.setSpectrum('green', 'red');
rainbow.setNumberRange(0, 6);

//function that outputs gradient and hashtag according to number supplied
colorset = (ed) =>{
  //if else javascript shorthand
  return ed > 90 ? '#' + rainbow.colourAt(6) :
ed > 70 ? '#' + rainbow.colourAt(5) :
ed > 50 ? '#' + rainbow.colourAt(4) :
ed > 30 ? '#' + rainbow.colourAt(3) :
ed > 10 ? '#' + rainbow.colourAt(2) :
ed > 0 ? '#' + rainbow.colourAt(1) :
ed <= 0 ? '#' + rainbow.colourAt(0) : '#' + rainbow.colourAt(0)};
// 2.
createFeatures = (earthquakeData) => {

  function onEachFeature(feature, layer)  {

    layer.bindPopup(`<h3>${feature.properties.place} </br>Magnitude: ${feature.properties.mag} </br>Depth(km):${feature.geometry.coordinates[2]}</h3>\
    <hr><p>${new Date(feature.properties.time)} </br><a href='${feature.properties.url}'>USGS Website on this earthquake</a></p>`);
    
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      // create citcle markers and fill color by depth from third coordinate and radius influenced by magnitude 
      return L.circle(latlng, {
        fillColor : colorset(feature.geometry.coordinates[2]),
        radius : Math.sqrt(10**(feature.properties.mag)) * 300,
        fillOpacity: 0.5, 
        color: "black",
        stroke: true,
        weight: 0.5
        
      })  }

  
    });
// 3.
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}// createMap() takes the earthquake data and incorporates it into the visualization:

createMap = (earthquakes) => {
  // Create the base layer.

let CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: [
      33, -100
    ],
    zoom: 5,
    layers: [CartoDB_DarkMatter, earthquakes]
  });


let legend = L.control({position: "bottomright"});
legend.onAdd = () => {
  let div = L.DomUtil.create("div", "legend");
  let depth = [-10, 10, 30, 50, 70, 90];

  div.innerHTML += "<h4>Depth(km)</h4>"//reference legend h4 in css file

  for (let i in  depth) {//set background based on depth and if no number next to depth in array add + after last element
    div.innerHTML += `<i style='background: ${colorset(depth[i])}'></i><span>${depth[i]}${depth[+(i)+1] ? -depth[+(i)+1] :'+'} </span><br>`;
}
return div;
    }
legend.addTo(myMap);

bonus(earthquakes, CartoDB_DarkMatter, myMap);//reference to tectonic plate bonus overlay

}

