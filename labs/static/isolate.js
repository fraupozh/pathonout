document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const supplier = urlParams.get('supplier');
    const isolatesSelect = document.getElementById('isolates-select');
    const supplierNameElement = document.getElementById('supplier-name');
    const tableBody = document.querySelector('#isolates-table tbody');

    if (supplierNameElement) {
        supplierNameElement.textContent = `Isolates for ${supplier}`;
    } else {
        console.error('Element with id "supplier-name" not found.');
    }

    fetch('/api/markers/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Filter data based on supplier
            const supplierData = data.features.find(feature => feature.properties.name === supplier);
            const isolates = supplierData ? supplierData.properties.isolates : [];

            // Extract all isolation sources for the selected supplier
            const uniqueIsolationSources = [...new Set(isolates.map(isolate => isolate.isolation_source))];

            // Populate dropdown with unique isolation sources
            uniqueIsolationSources.forEach(source => {
                const option = document.createElement('option');
                option.value = source;
                option.textContent = source;
                isolatesSelect.appendChild(option);
            });

            // Function to populate table rows based on selected isolation source
            function populateTable(selectedSource) {
                // Clear existing table rows
                tableBody.innerHTML = '';

                // Filter isolates based on selected isolation source
                const filteredIsolates = isolates.filter(isolate => isolate.isolation_source === selectedSource);

                // Create table rows for filtered isolates
                filteredIsolates.forEach(isolate => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${isolate.isolation_source}</td>
                        <td>${isolate.ID}</td>
                        <td>${isolate.species}</td>
                        <td>${isolate.host_organism_environment}</td>
                        <td>${isolate.acquisition_date}</td>
                        <td>${isolate.analysis_date}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            // Initial population of table with the first unique isolation source
            if (uniqueIsolationSources.length > 0) {
                populateTable(uniqueIsolationSources[0]);
            }

            // Event listener for dropdown change
            isolatesSelect.addEventListener('change', function () {
                const selectedSource = isolatesSelect.value;
                populateTable(selectedSource);
            });

        })
        .catch(error => console.error('Error fetching or parsing data:', error));
});