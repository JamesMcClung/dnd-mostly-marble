function sortTable(table, col) {
    // based on https://www.w3schools.com/howto/howto_js_sort_table.asp
    let madeChanges = false;
    let switching = true;
    let sortAscending = true;
    while (switching) {
        switching = false;
        let rows = table.rows;
        // loop through all table rows except the first, which contains table headers
        for (let i = 1; i < (rows.length - 1); i++) {
            let current = rows[i].getElementsByTagName("TD")[col].innerHTML.toLowerCase();
            let next = rows[i + 1].getElementsByTagName("TD")[col].innerHTML.toLowerCase();
            if (current == next) {
                continue
            }
            let inAscendingOrder;
            if (isNaN(current)) {
                inAscendingOrder = current < next;
            } else {
                inAscendingOrder = Number(current) < Number(next);
            }
            if (sortAscending != inAscendingOrder) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                madeChanges = true;
            }
        }
        if (sortAscending && !madeChanges) {
            sortAscending = false;
            switching = true;
        }
    }
    // manage symbols in table header that identify how it is sorted
    const upSymbolCode = 9650, downSymbolCode = 9660;
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        let cell = table.rows[0].getElementsByTagName("TH")[i]
        let lastCharCode = cell.innerHTML.charCodeAt(cell.innerHTML.length - 1)
        if (lastCharCode == upSymbolCode || lastCharCode == downSymbolCode) {
            cell.innerHTML = cell.innerHTML.slice(0, -2) // remove 2 chars to include the space
        }
    }
    table.rows[0].getElementsByTagName("TH")[col].innerHTML += ` &#${sortAscending ? downSymbolCode : upSymbolCode};`;
}