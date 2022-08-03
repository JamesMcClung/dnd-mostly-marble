function toggleFixedPosition(element, options = {}) {
    if (options.event)
        options.event.stopPropagation()
    if (options.set == "fixed" || options.set != "absolute" && element.style.position != "fixed") {
        var rect = element.getBoundingClientRect();
        element.style.position = "fixed";
        element.style.left = rect.left + "px";
        element.style.top = rect.top + "px";
        element.querySelector(".dragheader").querySelector(".dragbuttongroup").querySelector(".dragbuttonsticky").innerHTML = "&#9679;"
    } else if (options.set == "absolute" || element.style.position != "absolute") {
        element.style.position = "absolute";
        element.style.left = element.offsetLeft + window.scrollX + "px";
        element.style.top = element.offsetTop + window.scrollY + "px";
        element.querySelector(".dragheader").querySelector(".dragbuttongroup").querySelector(".dragbuttonsticky").innerHTML = "&#9675;"
    }
}

// based on https://www.w3schools.com/howto/howto_js_draggable.asp
function toggleDraggable(element, options = {}) {
    if (options.event)
        options.event.stopPropagation();
    let lastCursorX, lastCursorY;
    let offsetRight = -1, maxOffsetRight = -1;
    let moved = false;
    let header = document.getElementById(element.id + "header");
    let content = document.getElementById(element.id + "content");
    let home = document.getElementById(element.id + "home");

    element.onclick = (e) => { sendToTop(); e.stopPropagation(); }

    if (header.onmousedown) {
        // deactivate draggability
        header.onmousedown = null;
        toggleFixedPosition(element, { set: "absolute" });
        element.classList.remove("draggable");
        element.style.removeProperty("top");
        element.style.removeProperty("left");
        element.style.removeProperty("right");
        if (content.style.visibility == "hidden") {
            toggleContentVisibility();
        }
        home.append(element);
    } else {
        // activate draggability
        var rect = element.getBoundingClientRect();
        element.style.left = rect.left + window.scrollX + "px";
        element.style.top = rect.top + window.scrollY + "px";
        document.getElementsByTagName("article")[0].append(element);
        header.onmousedown = beginDrag;
        element.classList.add("draggable");
    }

    function toggleContentVisibility() {
        if (content.style.visibility == "hidden") {
            content.style.removeProperty("visibility")
            element.style.pointerEvents = "auto";
        } else {
            content.style.visibility = "hidden";
            element.style.pointerEvents = "none";
        }
    }

    function sendToTop() {
        let scroll = content.firstElementChild.scrollTop;
        document.getElementsByTagName("article")[0].append(element);
        content.firstElementChild.scrollTop = scroll;

    }

    function beginDrag(e) {
        lastCursorX = e.clientX;
        lastCursorY = e.clientY;
        header.onmouseup = endDrag;
        document.onmouseup = endDrag;
        document.onmousemove = doDrag;
        sendToTop(e);
    }

    function doDrag(e) {
        var deltaX = e.clientX - lastCursorX;
        var deltaY = e.clientY - lastCursorY;
        lastCursorX = e.clientX;
        lastCursorY = e.clientY;
        var rect = element.getBoundingClientRect();
        element.style.top = (element.offsetTop + deltaY) + "px";
        if (rect.left + deltaX <= 0 || (maxOffsetRight > 0 && offsetRight + deltaX < maxOffsetRight)) {
            if (offsetRight < 0) {
                offsetRight = maxOffsetRight = rect.right;
            }
            offsetRight += deltaX;
            element.style.right = (screen.width - offsetRight) + "px";
            element.style.removeProperty("left");
        } else {
            element.style.left = (element.offsetLeft + deltaX) + "px";
            element.style.removeProperty("right");
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