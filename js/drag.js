// based on https://www.w3schools.com/howto/howto_js_draggable.asp
function toggleDraggable(element) {
    let lastCursorX, lastCursorY;
    let moved = false;
    let header = document.getElementById(element.id + "header");
    let content = document.getElementById(element.id + "content");

    element.onclick = (e) => { sendToTop(); e.stopPropagation(); }

    if (header.onmousedown) {
        // deactivate draggability
        header.onmousedown = null;
        element.classList.remove("draggable");
        element.style.removeProperty("top");
        element.style.removeProperty("left");
        if (content.style.visibility == "hidden") {
            toggleContentVisibility();
        }
        element.style.position = "absolute";
    } else {
        // activate draggability
        header.onmousedown = beginDrag;
        element.classList.add("draggable");
        var rect = element.getBoundingClientRect();
        element.style.position = "fixed";
        element.style.left = rect.left + "px"
        element.style.top = rect.top + "px"
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
        for (let ttt of document.getElementsByClassName("tooltiptext")) {
            ttt.style.zIndex = 8
        }
        element.style.zIndex = 10
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
        element.style.top = (element.offsetTop + deltaY) + "px";
        element.style.left = (element.offsetLeft + deltaX) + "px";
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