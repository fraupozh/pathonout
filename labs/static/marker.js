document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const supplier = urlParams.get('supplier');
    const isolatesSelect = document.getElementById('isolates-select');
    const supplierNameElement = document.getElementById('supplier-name');
    const tableBody = document.querySelector('#isolates-table tbody');

    if (supplierNameElement) {
        supplierNameElement.textContent = `Samples for ${supplier}`;
    } else {
        console.error('Element with id "supplier-name" not found.');
    }

    fetch(`/api/markers/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Filter data based on supplier
            const supplierData = data.features.find(feature => feature.properties.name === supplier);
            const samples = supplierData ? supplierData.properties.samples : [];

            // Extract all sample types for the selected supplier
            const uniqueSampleTypes = [...new Set(samples.map(sample => sample.sample_type))];

            // Populate dropdown with unique sample types
            uniqueSampleTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                isolatesSelect.appendChild(option);
            });

            // Function to populate table rows based on selected sample type
            function populateTable(selectedType) {
                // Clear existing table rows
                tableBody.innerHTML = '';

                // Filter samples based on selected sample type
                const filteredSamples = samples.filter(sample => sample.sample_type === selectedType);

                // Create table rows for filtered samples
                filteredSamples.forEach(sample => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${sample.sample_type}</td>
                        <td>${sample.ID}</td>
                        <td>${sample.species}</td>
                        <td>${sample.host_organism_environment}</td>
                        <td>${sample.acquisition_date}</td>
                        <td>${sample.sampling_date}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            // Initial population of table with the first unique sample type
            if (uniqueSampleTypes.length > 0) {
                populateTable(uniqueSampleTypes[0]);
            }

            // Event listener for dropdown change
            isolatesSelect.addEventListener('change', function() {
                const selectedType = isolatesSelect.value;
                populateTable(selectedType);
            });

        })
        .catch(error => console.error('Error fetching or parsing data:', error));
});