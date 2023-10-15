// let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
let data_load; //TODO: for testing, delete before submission

// utility round func
let rnd = (num, dec) => {
  return Math.round(num*(10**dec))/(10**dec);
}

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
    zoom: 5,
    layers: [background, markers]
  })

  // Create layer controls
  let legend = L.control({postion: "bottomleft"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6"];
    let colors = ["blue", "green", "yellowgreen", "yellow", "orange", "red"];
    let labels = [];

    div.innerHTML = `<h1>Colors of Magnitude</h1>`;
    limits.forEach((limit, index) => {
      labels.push(`<li style="display:flex"><div style="height: 1rem; width: 1rem; background-color: ${colors[index]}"></div>
      ${limit}</li>`)
    })
;
    div.innerHTML += `<ul style="list-style: none;">` + labels.join("") + `</ul>`

    return div;
  }

  legend.addTo(map)
}

// connect to geojson API with D3
d3.json(url).then((data) => {
  data_load = data;

  let markers = data.features.map((feature) => {
    let lat = feature.geometry.coordinates[1],
        lon = feature.geometry.coordinates[0],
        depth = feature.geometry.coordinates[2];

    // let icon = L.icon({
    //   iconUrl:
    //   "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    //   shadowUrl:
    //   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    //   iconSize: [25, 41],
    //   iconAnchor: [12, 41],
    //   popupAnchor: [1, -34],
    //   shadowSize: [41, 41]
    // });

    let marker = L.marker([lat, lon])
            .bindPopup(`<div class="alert" style="height: 2rem; width: 100%; color: transparent; background-color:${feature.properties.alert};">ALERT</div>
              <h2>${feature.properties.place}</h2>
              <table style="width: 100%;">
                <tr>
                  <td>Magnitude</td>
                  <td>${feature.properties.mag}</td>
                </tr>
                <tr>
                  <td>Depth</td>
                  <td>${depth}</td>
                </tr>
                <tr>
                  <td>Latitude</td>
                  <td>${rnd(lat, 4)}</td>
                </tr>
                <tr>
                  <td>Longitude</td>
                  <td>${rnd(lon, 4)}</td>
                </tr>
              </table>
            `);

    // add css class to change color
    let color;
    switch (true){
      case depth <1:
        color = "red";
        break;
      default:
        color = "black"
    }
    // color = `map-icon-color-${color}`
    // marker._icon.classList.add("color");
    // Does not work unless marker is already added to map

    return marker;
  });
  
  makeMap(L.layerGroup(markers));

})
