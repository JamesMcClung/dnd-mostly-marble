function trimMostTags(innerHTML) {
    while (innerHTML.trim().startsWith("<")) {
        innerHTML = innerHTML.substring(innerHTML.indexOf(">") + 1);
    }
    if (innerHTML.includes("<")) {
        innerHTML = innerHTML.substring(0, innerHTML.indexOf("<"))
    }
    return innerHTML.trim();
}

function getComparableContent(rows, col, idx) {
    return trimMostTags(rows[idx].children[col].innerHTML).toLowerCase();
}

function maybeNumerify(str) {
    if (str == "cantrip")
        return 0;
    const maybeLeadNumMatch = str.match(/(^\d+)(?:st|nd|rd|th)/);
    if (maybeLeadNumMatch)
        return Number(maybeLeadNumMatch[1])
    if (str && !isNaN(str))
        return Number(str)
    return str;
}

function getOrder(a, b) {
    a = maybeNumerify(a);
    b = maybeNumerify(b);
    return a < b ? 1 : (a == b ? 0 : -1);
}

function swapRows(rows, smallerIdx, greaterIdx) {
    if (smallerIdx == greaterIdx)
        return;
    const tbody = rows[smallerIdx].parentNode;
    if (smallerIdx != greaterIdx - 1)
        tbody.insertBefore(rows[smallerIdx], rows[greaterIdx]);
    tbody.insertBefore(rows[greaterIdx], rows[smallerIdx]);
}

function getInitialSortOrder(rows, col) {
    let initialSortOrder = 0;
    for (let i = 1; i < rows.length - 1; i++) {
        let thisSortOrder = getOrder(getComparableContent(rows, col, i), getComparableContent(rows, col, i + 1));
        if (thisSortOrder * initialSortOrder < 0)
            return 0;
        initialSortOrder |= thisSortOrder;
    }
    return initialSortOrder;
}

function quickSort(rows, col, leftIdx, rightIdx) {
    if (leftIdx < rightIdx) {
        const finalPivotIdx = quicksort_partition(rows, col, leftIdx, rightIdx);

        if (finalPivotIdx > 0) {
            quickSort(rows, col, leftIdx, finalPivotIdx - 1);
            quickSort(rows, col, finalPivotIdx + 1, rightIdx);
        }
    }
}

function quicksort_partition(rows, col, leftIdx, rightIdx) {
    const tbody = rows[leftIdx].parentNode;

    const initialPivotIdx = rightIdx; // a convenient, but effectively random, choice
    let finalPivotIdx = leftIdx; // everything to the right of this is going to be > pivotVal
    let allEquivalent = true; // check if everything is equivalent (if so, we can stop recursing)

    const pivotVal = getComparableContent(rows, col, initialPivotIdx);

    for (let i = leftIdx; i < rightIdx; i++) {
        let orderWrtPivot = getOrder(getComparableContent(rows, col, i), pivotVal)
        if (orderWrtPivot >= 0) {
            tbody.insertBefore(rows[i], rows[finalPivotIdx++]);
        }
        allEquivalent = allEquivalent && orderWrtPivot == 0;
    }
    tbody.insertBefore(rows[initialPivotIdx], rows[finalPivotIdx]);

    return allEquivalent ? -1 : finalPivotIdx;
}

function sortTableImpl(rows, col) {
    quickSort(rows, col, 1, rows.length - 1)
}

function reverseTableOrder(rows) {
    for (let i = 1; i < (rows.length + 1) / 2; i++) {
        swapRows(rows, i, rows.length - i)
    }
}

function sortTable(table, col) {
    const initialSortOrder = getInitialSortOrder(table.rows, col);
    if (initialSortOrder == 0)
        sortTableImpl(table.rows, col);
    else
        reverseTableOrder(table.rows)

    // manage symbols in table header that identify how it is sorted
    const upSymbolCode = 9650, downSymbolCode = 9660;
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        let cell = table.rows[0].getElementsByTagName("th")[i]
        let lastCharCode = cell.innerHTML.charCodeAt(cell.innerHTML.length - 1)
        if (lastCharCode == upSymbolCode || lastCharCode == downSymbolCode) {
            cell.innerHTML = cell.innerHTML.slice(0, -2) // remove 2 chars to include the space
        }
    }
    table.rows[0].getElementsByTagName("th")[col].innerHTML += ` &#${initialSortOrder > 0 ? upSymbolCode : downSymbolCode};`;
}