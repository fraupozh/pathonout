document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const supplier = urlParams.get('supplier');
    const samplesSelect = document.getElementById('samples-select');
    const supplierNameElement = document.getElementById('supplier-name');
    const tableBody = document.querySelector('#samples-table tbody');
    const downloadButton = document.getElementById('download-button');
    
    if (supplierNameElement) {
        supplierNameElement.textContent = `${supplier}`;
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
                samplesSelect.appendChild(option);
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
                        <td><input type="checkbox" class="select-sample" data-id="${sample.ID}"></td>
                        <td>${sample.sample_type}</td>
                        <td>${sample.ID}</td>
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
            samplesSelect.addEventListener('change', function() {
                const selectedType = samplesSelect.value;
                populateTable(selectedType);
            });

            // Event listener for download button
            downloadButton.addEventListener('click', function() {
                const selectedIds = Array.from(document.querySelectorAll('.select-sample:checked')).map(checkbox => checkbox.dataset.id);
                const selectedRows = samples.filter(sample => selectedIds.includes(sample.ID));

                const worksheetData = selectedRows.map(sample => ({
                    'Sample Type': sample.sample_type,
                    'ID': sample.ID,
                    'Acquisition Date': sample.acquisition_date,
                    'Sampling Date': sample.sampling_date
                }));

                const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Samples');

                // Create a filename using the selected IDs
                const filename = selectedIds.join('_') + '.xlsx';

                XLSX.writeFile(workbook, filename);
            });

        })
        .catch(error => console.error('Error fetching or parsing data:', error));
});