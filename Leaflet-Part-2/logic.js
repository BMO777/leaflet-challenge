// Store our API endpoint as queryUrl.
let pUrl = "https://rawcdn.githack.com/fraxen/tectonicplates/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_plates.json";


// Perform a GET request to the query URL.
bonus = (myMap, baseMaps) => d3.json(pUrl).then((data) => {
    console.log('data: ', data);


tectonic = L.geoJson(data.features, {
    onEachFeature: function(feature, layer) {
        //attach pop-up information
        layer.bindPopup("<h3>Plate Name: " + feature.properties.PlateName + "</h3>");
    },
            style: () => {
                return {
                color: "yellow",
                weight: 5
                };
            },
        });
        
        L.control.layers({Tectonic_lines: tectonic}).addTo(myMap);
        })
