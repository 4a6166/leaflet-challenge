// let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
let data_load; //TODO: for testing, delete before submission
let limits_labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"],
    limits = [10, 30, 50, 70, 90],
    colors = ["blue", "green", "yellowgreen", "yellow", "orange", "red"];

// utility round func
let rnd = (num, dec) => {
  return Math.round(num*(10**dec))/(10**dec);
}

// add map
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
    center: [36.7783, -119.4179], // middle California (where more earthquakes are)
    // center: [39.9526, -75.1652], // Philadelphia
    zoom: 5,
    layers: [background]
  })

  // Create layer controls
  let legend = L.control({postion: "bottomleft"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let labels = [];

    div.innerHTML = `<h1>Colors of<br>Magnitude</h1>`;
    limits_labels.forEach((limit, index) => {
      labels.push(`<li style="display:flex; gap: 1rem;"><div style="height: 1rem; width: 1rem; background-color: ${colors[index]}"></div>
      ${limit}</li>`)
    }) ;

    div.innerHTML += `<ul style="list-style: none;">` + labels.join("") + `</ul>`
    div.innerHTML = `<div style="padding: .5rem; background: white; border-radius: 15px;">${div.innerHTML}</div>`

    return div;
  }

  legend.addTo(map)

// connect to geojson API with D3
d3.json(url).then((data) => {
  data_load = data;

  let markers = data.features.map((feature) => {
    let lat = feature.geometry.coordinates[1],
        lon = feature.geometry.coordinates[0],
        depth = feature.geometry.coordinates[2],
        mag = feature.properties.mag;

    let getColor = (depth) => {
      // limits.forEach((limit, index) => {
      //   if(depth < limit) { return colors[index]}
      // })
      if(depth<limits[0]){return colors[0]} else
      if(depth<limits[1]){return colors[1]} else
      if(depth<limits[2]){return colors[2]} else
      if(depth<limits[3]){return colors[3]} else
      if(depth<limits[4]){return colors[4]} else
      {return colors[5]}
    }

    let marker = L.circle([lat, lon], {
      fillOpacity: 0.8,
      color: "black",
      weight: .5,
      fillColor: getColor(depth),
      radius:mag * (10 ** 4.4)
    }).bindPopup(`<div class="alert" style="height: 2rem; width: 100%; color: transparent; background-color:${feature.properties.alert}; border:1px solid black; border-radius:5px;">ALERT</div>
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

    return marker;
  });
  
  L.layerGroup(markers).addTo(map)

})
