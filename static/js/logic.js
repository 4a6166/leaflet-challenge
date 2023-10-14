let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
let data_load; //TODO: for testing, delete before submission

let makeMap = (markers) => {
  let target = {
    id: "map",
    type: "map",
    tag: "div"
  }

  background = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Load map
  let map = L.map(target.id, {
    center: [39.9526, -75.1652],
    zoom: 3,
    layers: [background, markers]
  })

  // Create layer controls
  // L.control.layers(background, markers, {collapsed: false})
  //   .addTo(map) 
}

// connect to geojson API with D3
d3.json(url).then((data) => {
  data_load = data;

  let markers = data.features.map((feature) => {
    let lat = feature.geometry.coordinates[1],
        lon = feature.geometry.coordinates[0];

    return L.marker([lat, lon])
            .bindPopup(`<h3>${feature.properties.place}<\h3>
              <h4>Magnitude: ${feature.properties.mag}</h4>
              <h4>Lat: ${lat}</h4>
              <h4>Lon: ${lon}</h4>`);
  });
  
  makeMap(L.layerGroup(markers));

})
