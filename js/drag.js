window.onload = function () {
    const popups = document.getElementsByClassName("popup");
    for (const popup of popups)
        sendToTop(popup);
}

function getClientCoords(element) {
    return element.getBoundingClientRect();
}

function getPageCoords(element) {
    const box = element.getBoundingClientRect();

    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

function setElementTopLeft(element, coords) {
    element.style.left = coords.left + "px";
    element.style.top = coords.top + "px";
}

function toggleFixedPosition(popup, options = {}) {
    if (options.event)
        options.event.stopPropagation()
    if (options.set == "fixed" || options.set != "absolute" && popup.style.position != "fixed") {
        const coords = getClientCoords(popup);
        popup.style.position = "fixed";
        setElementTopLeft(popup, coords);
        popup.querySelector(".popupHeader").querySelector(".popupHeaderButtongroup").querySelector(".popupHeaderButtonSticky").innerHTML = "&#9679;"
    } else if (options.set == "absolute" || popup.style.position != "absolute") {
        const coords = getPageCoords(popup);
        popup.style.position = "absolute";
        setElementTopLeft(popup, coords);
        popup.querySelector(".popupHeader").querySelector(".popupHeaderButtongroup").querySelector(".popupHeaderButtonSticky").innerHTML = "&#9675;"
    }
}

function sendToTop(popup) {
    const article = document.getElementsByTagName("article")[0];
    if (article.lastChild !== popup) {
        const content = popup.querySelector(".popupContent");
        const scroll = content.firstElementChild.scrollTop;
        article.append(popup);
        content.firstElementChild.scrollTop = scroll;
    }
}

// based on https://www.w3schools.com/howto/howto_js_draggable.asp
function toggleDragEnabled(popup, options = {}) {
    if (options.event)
        options.event.stopPropagation();
    let lastCursorX, lastCursorY;
    let offsetRight = -1, maxOffsetRight = -1;
    let moved = false;
    const header = popup.querySelector(".popupHeader");

    popup.onclick = (e) => { sendToTop(popup); e.stopPropagation(); }

    if (header.onmousedown) {
        // deactivate draggability
        header.onmousedown = null;
        toggleFixedPosition(popup, { set: "absolute" });
        popup.classList.remove("dragEnabled");
        popup.classList.remove("isCollapsed");
        const anchor = options.event.target;
        const anchorCoords = getPageCoords(anchor);
        setElementTopLeft(popup, { left: anchorCoords.left, top: anchorCoords.bottom });
        popup.style.removeProperty("right");
    } else {
        // activate draggability
        setElementTopLeft(popup, getPageCoords(popup));
        sendToTop(popup);
        header.onmousedown = beginDrag;
        popup.classList.add("dragEnabled");
    }

    function toggleContentVisibility() {
        if (popup.classList.contains("isCollapsed")) {
            popup.classList.remove("isCollapsed")
        } else {
            popup.classList.add("isCollapsed")
        }
    }

    function beginDrag(e) {
        lastCursorX = e.clientX;
        lastCursorY = e.clientY;
        header.onmouseup = endDrag;
        document.onmouseup = endDrag;
        document.onmousemove = doDrag;
        sendToTop(popup);
    }

    function doDrag(e) {
        var deltaX = e.clientX - lastCursorX;
        var deltaY = e.clientY - lastCursorY;
        lastCursorX = e.clientX;
        lastCursorY = e.clientY;
        const coords = getClientCoords(popup);
        popup.style.top = (popup.offsetTop + deltaY) + "px";
        if (coords.left + deltaX <= 0 || (maxOffsetRight > 0 && offsetRight + deltaX < maxOffsetRight)) {
            if (offsetRight < 0) {
                offsetRight = maxOffsetRight = coords.right;
            }
            offsetRight += deltaX;
            popup.style.right = (screen.width - offsetRight) + "px";
            popup.style.removeProperty("left");
        } else {
            popup.style.left = (popup.offsetLeft + deltaX) + "px";
            popup.style.removeProperty("right");
            offsetRight = maxOffsetRight = -1;
        }
        moved |= deltaX != 0 || deltaY != 0;
    }

    function endDrag() {
        header.onmouseup = null;
        document.onmouseup = null;
        document.onmousemove = null;
        if (!moved) {
            toggleContentVisibility()
        }
        moved = false;
    }
}

function showPopup(popup, anchor) {
    sendToTop(popup);

    popup.classList.add("visible");
    if (!popup.classList.contains("dragEnabled")) {
        const anchorCoords = getPageCoords(anchor);
        setElementTopLeft(popup, { left: anchorCoords.left, top: anchorCoords.bottom });
    }
}

function hidePopup(popup) {
    popup.classList.remove("visible");
}