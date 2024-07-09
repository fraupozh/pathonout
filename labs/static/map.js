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
    const url = `/api/${type}/?in_bbox=${map.getBounds().toBBoxString()}`;
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
const isolateLayerGroup = L.layerGroup().addTo(map);

// Function to render markers or isolates on the map
async function renderData(data, selectedType) {
  if (data) {
    if (selectedType === "markers") {
      // Clear previous isolates layer
      isolateLayerGroup.clearLayers();

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

    } else if (selectedType === "isolates") {
      

      // Clear previous markers layer
      markerLayerGroup.clearLayers();
  
      data.forEach(isolate => {
        const coordinates = isolate.collection_location.coordinates;
        const isolateInfo = isolate; // Directly use the isolate object for properties
      

        const isolateMarker = L.marker([coordinates[1], coordinates[0]])
            .bindPopup(`<b>Isolate Information</b><br>
                        Species: ${isolateInfo.species}<br>
                        ID: ${isolateInfo.ID}<br>
                        Isolation Source: ${isolateInfo.isolation_source}<br>
                        Host Organism/Environment: ${isolateInfo.host_organism_environment}<br>
                        Acquisition Date: ${isolateInfo.acquisition_date}<br>
                        Analysis Date: ${isolateInfo.analysis_date}`)
            .addTo(markerLayerGroup);

        isolateMarker.on('click', function () {
            const isolateId = isolateInfo.ID; // Assuming isolate ID is available in properties
            window.location.href = `/labs/isolate_detail/?id=${isolateId}`;
            console.log('Fetching data for isolate ID:', isolateId);
        });

        isolateMarker.on('mouseover', function () {
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
  isolateLayerGroup.clearLayers();

  // Load and render the selected type of data
  const data = await loadMarkersOrIsolates(selectedType);
  if (selectedType === "markers") {
    renderData(data, "markers");
  } else if (selectedType === "isolates") {
    renderData(data, "isolates");
  }
}

// Initial load and render when the page loads
loadAndRender();