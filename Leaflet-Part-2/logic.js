// Store our API endpoint as queryUrl.
let pUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";


// Perform a GET request to the query URL.
bonus = (earthquakes, CartoDB_DarkMatter, myMap) => d3.json(pUrl).then((data) => {
     console.log('data: ', data);


tectonic = L.geoJson(data.features, {
    onEachFeature: function(feature, layer) {
        //attach pop-up information
        layer.bindPopup(`<h3>Plate Name:  ${feature.properties.PlateName} </h3>`);
    },
            style: () => {
                return {
                color: "orange",
                fillOpacity: 0,

                };
            },
        });

        
        let openstreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
      
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

        // add 2012NASA night map using leaflet provider extension call
  let NASA2012night = L.tileLayer.provider('NASAGIBS.ViirsEarthAtNight2012')
  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": openstreet,
    "Topographic Map": opentopo,
    "USGS_USImagery Map": USGS_USImageryTopo,
    "Stamen_Terrain": Stamen_Terrain,
    "CartoDB_DarkMatter": CartoDB_DarkMatter,
    "NASA2012night": NASA2012night,
"Esri" : L.tileLayer.provider('Esri.WorldImagery')
  };

  // Create an overlays object.
  let overlayMaps = {
    Earthquakes: earthquakes,
    Tectonic_lines: tectonic

  };
  // Create a layer control that contains our baseMaps.
//   Be sure to add an overlay Layer that contains the earthquake GeoJSON.
let control = L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);
})
