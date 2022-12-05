function toggleSearch(table, col, event) {
    consumeEvent(event);
    let th = table.rows[0].getElementsByTagName("th")[col];
    th.getElementsByTagName("span")[0].classList.toggle("displaynone")
    th.getElementsByTagName("input")[0].classList.toggle("displaynone")
}

function consumeEvent(event) {
    event.stopPropagation();
}

function updateFilter(table, col, input) {
    let searchval = input.value;
    for (let row of Array.prototype.slice.call(table.rows, 1)) {
        let text = row.children[col].innerText.toLowerCase();

        if (text.includes(searchval) || searchval == "0" && text.includes("cantrip")) {
            row.classList.remove(`displaynone${col}`);
        } else {
            row.classList.add(`displaynone${col}`);
        }
    }
}