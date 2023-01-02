function toggleSearch(table, col, event) {
    consumeEvent(event);
    const th = table.rows[0].getElementsByTagName("th")[col];
    th.getElementsByClassName("col-title")[0].classList.toggle("displaynone")
    const inputField = th.getElementsByClassName("searchbar")[0];
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
    const matches = typeof searchval === "string" ? (text => text.toLowerCase().includes(searchval)) : (text => searchval.exec(text));
    if (anchors.length > 0) {
        const popup = document.getElementById(anchors[0].onclick.toString().match(/popup\d+/)[0])
        const texts = popup.innerHTML
            .split(/<(?!\/?(?:i|b|a|s|span|mark)\b)[^>]*>/i)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => s.replace(/<[^>]*>/g, ""))
        for (const t of texts) {
            if (matches(t))
                return true;
        }
    }
    return false;
}

let lastSearch = "";
function updateFilter(table, col, input, event) {
    if (event.key === "Escape") {
        toggleSearch(table, col, event);
        return;
    }
    let searchval = input.value;
    if (searchval === lastSearch) {
        return;
    } else {
        lastSearch = searchval;
    }

    const doPopupSearch = searchval.startsWith("$");
    if (doPopupSearch) {
        searchval = searchval.slice(1);
    }

    const lastSlash = searchval.lastIndexOf("/");
    const doRegexSearch = searchval.startsWith("/") && lastSlash > 0;
    if (doRegexSearch) {
        searchval = RegExp(searchval.slice(1, lastSlash), searchval.slice(lastSlash + 1));
    } else {
        searchval = searchval.toLowerCase();
    }

    for (const row of Array.prototype.slice.call(table.rows, 1)) {
        let matchedRow;

        if (doPopupSearch) {
            matchedRow = popupSearch(row.children[col], searchval);
        } else {
            let text = row.children[col].innerText;
            if (doRegexSearch) {
                matchedRow = searchval.exec(text);
            } else {
                text = text.toLowerCase();
                matchedRow = text.includes(searchval) || searchval == "0" && text.includes("cantrip");
            }
        }

        if (matchedRow) {
            row.classList.remove(`displaynone${col}`);
        } else {
            row.classList.add(`displaynone${col}`);
        }
    }
}