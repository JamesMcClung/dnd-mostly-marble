function toggleSearch(table, col, event) {
    consumeEvent(event);
    let th = table.rows[0].getElementsByTagName("th")[col];
    th.getElementsByClassName("col-title")[0].classList.toggle("displaynone")
    let inputField = th.getElementsByClassName("searchbar")[0];
    if (!inputField.classList.toggle("displaynone")) {
        inputField.focus();
    } else {
        th.getElementsByClassName("searchbutton")[0].focus();
    }
}

function consumeEvent(event) {
    event.stopPropagation();
}

function popupSearch(el, searchval) {
    anchors = el.getElementsByClassName("popupAnchor");
    if (anchors.length > 0) {
        let popup = document.getElementById(anchors[0].onclick.toString().match(/popup\d+/)[0])
        return popup.innerText.toLowerCase().includes(searchval);
    }
    return false;
}

function updateFilter(table, col, input, event) {
    if (event.key === "Escape") {
        toggleSearch(table, col, event);
        return;
    }
    let searchval = input.value.toLowerCase();
    let doPopupSearch = searchval.startsWith("$");
    if (doPopupSearch) {
        searchval = searchval.slice(1);
    }

    for (let row of Array.prototype.slice.call(table.rows, 1)) {
        let matchedRow;

        if (doPopupSearch) {
            matchedRow = popupSearch(row.children[col], searchval);
        } else {
            let text = row.children[col].innerText.toLowerCase();
            matchedRow = text.includes(searchval) || searchval == "0" && text.includes("cantrip");
        }

        if (matchedRow) {
            row.classList.remove(`displaynone${col}`);
        } else {
            row.classList.add(`displaynone${col}`);
        }
    }
}