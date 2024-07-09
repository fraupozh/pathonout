// map.js

const copy =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>";
const url =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const layer = L.tileLayer(url, {
  attribution: copy,
});
const map = L.map("map", {
  layers: [layer],
  minZoom: 5,
  center: [0, 0],
  zoom: 5
});

map
  .locate()
  .on("locationfound", (e) =>
    map.setView(e.latlng, 8)
  )
  .on("locationerror", () =>
    map.setView([0, 0], 5)
  );

async function loadMarkersOrIsolates(type) {
  try {
    const url = `/api/markers/?in_bbox=${map.getBounds().toBBoxString()}`;
    const response = await fetch(url);
    const geojson = await response.json();
    return geojson;
  } catch (error) {
    console.error(`Error loading ${type}:`, error);
    return null;
  }
}

// Initialize layer groups for markers and isolates
const markerLayerGroup = L.layerGroup().addTo(map);
const sampleLayerGroup = L.layerGroup().addTo(map);

// Function to render markers or isolates on the map
async function renderData(data, selectedType) {
  if (data) {
    if (selectedType === "markers") {
      // Clear previous isolates layer
      sampleLayerGroup.clearLayers();

      L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          layer.on('mouseover', function () {
            this.openPopup();
          });
          layer.bindPopup(feature.properties.name);
          layer.on('click', function () {
            const supplier = feature.properties.name;
            window.location.href = `/labs/marker_detail/?supplier=${supplier}`;
          });
        }
      }).addTo(markerLayerGroup);

    } else if (selectedType === "samples") {
      // Clear previous markers layer
      markerLayerGroup.clearLayers();
  
      data.features.forEach(feature => {
        const samples = feature.properties.samples;
        samples.forEach(sample => {
          const coordinates = sample.collection_location.coordinates;

          const sampleMarker = L.marker([coordinates[1], coordinates[0]])
              .bindPopup(`<b>Sample Information</b><br>
                          ID: ${sample.ID}<br>
                          Sample Type: ${sample.sample_type}<br>
                          Acquisition Date: ${sample.acquisition_date}<br>
                          Sampling Date: ${sample.sampling_date}`)
              .addTo(sampleLayerGroup);

          // sampleMarker.on('click', function () {
          //     const sampleId = sample.ID; // Assuming isolate ID is available in properties
          //     window.location.href = `/labs/sample_detail/?id=${sampleId}`;
          //     console.log('Fetching data for sample ID:', sampleId);
          // });

          sampleMarker.on('mouseover', function () {
              this.openPopup();
          });
          
        });
      } );
    }
  }
}

async function loadAndRender() {
  const selectedType = document.getElementById("dataSelect").value;

  // Clear previous data on the map
  markerLayerGroup.clearLayers();
  sampleLayerGroup.clearLayers();

  // Load and render the selected type of data
  const data = await loadMarkersOrIsolates(selectedType);
  if (selectedType === "markers") {
    renderData(data, "markers");
  } else if (selectedType === "samples") {
    renderData(data, "samples");
  }
}

// Initial load and render when the page loads
loadAndRender();