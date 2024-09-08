// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to retrieve the query url data
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data.features);
  // Create the base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
let features_array = [];

// Define color ranges based on magnitude levels
const getColor = (magnitude) => {
    if (magnitude < 1) {
        return 'yellow'; // Color for low magnitude earthquakes
    } else if (magnitude >= 1 && magnitude < 2) {
        return 'green'; // Color for medium magnitude earthquakes
    } else if (magnitude >= 2 && magnitude < 3) {
        return 'blue'; // Color for medium magnitude earthquakes
    } else if (magnitude >= 3 && magnitude < 4) {
        return 'orange'; // Color for medium magnitude earthquakes        
    } else {
        return 'red'; // Color for high magnitude earthquakes
    }
};

// Loop through each feature in the data
for (let i = 0; i < data.features.length; i++) {
    let feature = data.features[i];
    
    // Determine the radius of the circle marker based on the earthquake magnitude
    let radius = feature.properties.mag * 5; // Adjust the multiplier as needed for appropriate sizing
    
    // Get the color based on the magnitude range
    let color = getColor(feature.properties.mag);

    // Create a circle marker with the calculated radius and color
    let circleMarker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.5
    }).bindPopup(`<h1>${feature.properties.place}</h1><h3>Magnitude: ${feature.properties.mag}</h3>`);

    features_array.push(circleMarker);
}

let features_group = L.layerGroup(features_array);

let overlayMaps = {
    Earthquakes: features_group
};

// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, features_group]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Set up the legend.
let legend = L.control({ position: "bottomright" });

// Define the legend content and appearance
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let labels = ['< 1', '1 - 2', '2 - 3', '3 - 4', '>= 4']; // Legend labels for magnitude ranges

    // Add title or other legend information
    let legendInfo = "<h4>Magnitude Legend</h4>";

    div.innerHTML = legendInfo;
    
    // Define colors for each magnitude range
    let colors = ['yellow', 'green', 'blue', 'orange', 'red'];

    // Add legend items with colors based on magnitude ranges
    labels.forEach(function(label, index) {
        let color = colors[index]; 
        div.innerHTML += '<i style="background-color: ' + color + '"></i> ' + label + '<br>';
    });

    return div;
};

// Adding the legend to the map
legend.addTo(myMap);
});

