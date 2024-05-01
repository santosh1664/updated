document.addEventListener('DOMContentLoaded', function() {
    const limitSelect = document.getElementById('limit-select');
    const tableContainer = document.getElementById('table-container');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
    });

    const fetchDataAndRenderTable = function() {
        const limit = parseInt(limitSelect.value);
        fetch('https://raw.githubusercontent.com/santosh1664/Dummy/main/Book1.csv')
            .then(response => response.text())
            .then(csv => {
                let rows = csv.split('\n').slice(1); // Slice from 1 to exclude header row
                if (limit !== 0) {
                    rows = rows.slice(0, limit);
                }
                let tableHtml = '<table>';
                rows.forEach(row => {
                    const columns = row.split(',');
                    tableHtml += '<tr>';
                    columns.forEach(column => {
                        tableHtml += `<td>${column}</td>`;
                    });
                    tableHtml += '</tr>';
                });
                tableHtml += '</table>';
                tableContainer.innerHTML = tableHtml;
            })
            .catch(error => console.error('Error fetching CSV:', error));
    };

    // Initial data fetch and table rendering
    fetchDataAndRenderTable();

    // Event listener for select element change
    limitSelect.addEventListener('change', fetchDataAndRenderTable);
});
