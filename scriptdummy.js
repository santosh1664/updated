<main>
    <div>
        <label for="limit-select">Show:</label>
        <select id="limit-select">
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="0" selected>All</option>
        </select>
    </div>
    <div id="filter-toggle">
        <button id="toggle-button">Show Filters</button>
        <button id="clear-button" style="display: none;">Clear Filters</button>
        <div id="filter-container" style="display:none;"></div>
    </div>
    <div id="table-container"></div>
</main>

    document.addEventListener('DOMContentLoaded', function() {
        const limitSelect = document.getElementById('limit-select');
        const filterContainer = document.getElementById('filter-container');
        const tableContainer = document.getElementById('table-container');
        const toggleButton = document.getElementById('toggle-button');
        const clearButton = document.getElementById('clear-button');
        const filterToggle = document.getElementById('filter-toggle');

        const generateFilterOptions = function() {
            const headerRow = tableContainer.querySelector('.header-row');
            let filterHtml = '';
            headerRow.querySelectorAll('th').forEach((th, colIndex) => {
                const uniqueValues = Array.from(new Set(Array.from(tableContainer.querySelectorAll('tr:not(.header-row)')).map(row => row.querySelectorAll('td')[colIndex].textContent.trim())));
                filterHtml += `<div class="filter-select" style="display:none;"><label>${th.textContent}</label><select><option value="">All</option>`;
                uniqueValues.forEach(value => {
                    filterHtml += `<option value="${value}">${value}</option>`;
                });
                filterHtml += `</select></div>`;
            });
            filterContainer.innerHTML = filterHtml;
        };

        const applyFilters = function() {
            const filterSelects = filterContainer.querySelectorAll('.filter-select select');
            const rows = tableContainer.querySelectorAll('tr:not(.header-row)');
            rows.forEach(row => {
                let displayRow = true;
                filterSelects.forEach((select, colIndex) => {
                    const filterValue = select.value.toLowerCase();
                    const cell = row.querySelectorAll('td')[colIndex];
                    const cellValue = cell.textContent.trim().toLowerCase();
                    if (filterValue && filterValue !== 'all' && cellValue !== filterValue) {
                        displayRow = false;
                    }
                });
                if (displayRow) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        const toggleFilters = function() {
            if (filterContainer.style.display === 'none') {
                filterContainer.style.display = '';
                generateFilterOptions();
                toggleButton.textContent = 'Hide Filters';
                clearButton.style.display = '';
            } else {
                filterContainer.style.display = 'none';
                toggleButton.textContent = 'Show Filters';
                clearButton.style.display = 'none';
            }
        };

        const clearFilters = function() {
            const filterSelects = filterContainer.querySelectorAll('.filter-select select');
            filterSelects.forEach(select => {
                select.value = ''; // Reset all filter selections
            });
            applyFilters(); // Apply filters after clearing selections
        };

        const fetchDataAndRenderTable = function() {
            const limit = parseInt(limitSelect.value);
            fetch('https://raw.githubusercontent.com/santosh1664/egovern/csv/csv%20Files/Table4.csv')
                .then(response => response.text())
                .then(csv => {
                    let rows = csv.split('\n').slice(0);
                    if (limit !== 0) {
                        rows = rows.slice(0, limit);
                    }
                    let tableHtml = '<table>';
                    let i = 0;
                    let j = 0;
                    rows.forEach((row, rowIndex) => {
                        j = 0;
                        if (rowIndex === 0) {
                            const columns = row.split(',');
                            tableHtml += '<tr class="header-row">';
                            columns.forEach(column => {
                                tableHtml += `<th>${column}</th>`;
                            });
                            tableHtml += '</tr>';
                        } else {
                            const columns = row.split(',');
                            tableHtml += '<tr>';
                            columns.forEach((column, colIndex) => {
                                if (colIndex === 2) {
                                    tableHtml += `<td><a class="links" href="${column}">${column}</a></td>`;
                                } else {
                                    tableHtml += `<td>${column}</td>`;
                                }
                                j++;
                            });
                            tableHtml += '</tr>';
                        }
                        i++;
                    });
                    tableHtml += '</table>';
                    tableContainer.innerHTML = tableHtml;

                    // Generate filter dropdowns
                    const headerRow = tableContainer.querySelector('.header-row');
                    let filterHtml = '<tr class="filter-row">';
                    headerRow.querySelectorAll('th').forEach((th, colIndex) => {
                        const uniqueValues = Array.from(new Set(rows.map(row => row.split(',')[colIndex])));
                        filterHtml += `<td><select class="filter-select"><option value="">All</option>`;
                        uniqueValues.forEach(value => {
                            filterHtml += `<option value="${value}">${value}</option>`;
                        });
                        filterHtml += `</select></td>`;
                    });
                    filterHtml += '</tr>';
                    filterContainer.innerHTML = filterHtml;

                    // Add event listeners to filter dropdowns
                    const filterSelects = filterContainer.querySelectorAll('.filter-select');
                    filterSelects.forEach((select, colIndex) => {
                        select.addEventListener('change', applyFilters);
                    });
                })
                .catch(error => console.error('Error fetching CSV:', error));
        };

        // Initial data fetch and table rendering
        fetchDataAndRenderTable();

        // Event listener for select element change
        limitSelect.addEventListener('change', fetchDataAndRenderTable);

        // Toggle filter visibility
        toggleButton.addEventListener('click', toggleFilters);

        // Clear filters
        clearButton.addEventListener('click', clearFilters);
    });
