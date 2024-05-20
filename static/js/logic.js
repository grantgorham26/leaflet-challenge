// create map object
let myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
  });
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// earthquake url
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

//perform a get requests to query the earthquake data
d3.json(url).then(function(data){
    createFeatures(data['features'])
});

function createFeatures(earthquakeData){
    console.log(earthquakeData);
    function onEachFeature(feature,layer){
        // add info about eah earthquake
        layer.bindPopup(`<h3> ${feature['properties']['place']}</h3><hr><p>${new Date(feature['properties']['time'])}</p><p>Magnitude: ${feature['properties']['mag']}</p> <p>Depth: ${feature['geometry']['coordinates'][2]}</p>`);
    }
    // add markers of each earthquake with radius and colorfill being dyanmic with geojson data
    function pointToLayer(feature,latlng){
        let markerCustom ={
            radius : feature['properties']['mag'] * 2.5,
            fillColor : color(feature['geometry']['coordinates'][2]),
            color : 'null',
            fillOpacity : 0.8
        };
        return L.circleMarker(latlng, markerCustom)
    }
    // usea  color scale for color of each marker
    let colorScale = d3.scaleSequential()
    // range of earthquake depth
    .domain([0,100])
    // chose color scale 
    .interpolator(d3.interpolateYlGnBu);
    function color(depth){
        return colorScale(depth)
    }
    // create geojson map layer with the abover functions as parameters
    L.geoJSON(earthquakeData,{
        pointToLayer : pointToLayer,
        onEachFeature : onEachFeature
    
    }).addTo(myMap);
}
