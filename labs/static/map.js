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

async function loadMarkersOrSamples(type) {
  try {
    const url = `/api/${type}/?in_bbox=${map.getBounds().toBBoxString()}`;
    const response = await fetch(url);
    const geojson = await response.json();
    return geojson;
  } catch (error) {
    console.error(`Error loading ${type}:`, error);
    return null;
  }
}

// Initialize layer groups for markers and samples
const markerLayerGroup = L.layerGroup().addTo(map);
const sampleLayerGroup = L.layerGroup().addTo(map);

// Function to render markers or samples on the map
async function renderData(data, selectedType) {
  if (data) {
    if (selectedType === "markers") {
      // Clear previous sample layer
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

      data.forEach(sample => {
        const coordinates = sample.collection_location.coordinates;

        const sampleMarker = L.marker([coordinates[1], coordinates[0]])
          .bindPopup(`<b>Sample Information</b><br>
                      Species: ${sample.species}<br>
                      ID: ${sample.ID}<br>
                      Sample Type: ${sample.sample_type}<br>
                      Host Organism/Environment: ${sample.host_organism_environment}<br>
                      Acquisition Date: ${sample.acquisition_date}<br>
                      Sampling Date: ${sample.sampling_date}`)
          .addTo(sampleLayerGroup);

        sampleMarker.on('click', function () {
          const sampleId = sample.ID; // Assuming sample ID is available in properties
          window.location.href = `/labs/sample_detail/?id=${sampleId}`;
          console.log('Fetching data for sample ID:', sampleId);
        });

        sampleMarker.on('mouseover', function () {
          this.openPopup();
        });

      });
    }

  }
}

async function loadAndRender() {
  const selectedType = document.getElementById("dataSelect").value;

  // Clear previous data on the map
  markerLayerGroup.clearLayers();
  sampleLayerGroup.clearLayers();

  // Load and render the selected type of data
  const data = await loadMarkersOrSamples(selectedType);
  if (selectedType === "markers") {
    renderData(data, "markers");
  } else if (selectedType === "samples") {
    renderData(data, "samples");
  }
}

// Initial load and render when the page loads
loadAndRender();
