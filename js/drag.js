// based on https://www.w3schools.com/howto/howto_js_draggable.asp
function toggleDraggable(element) {
    let lastCursorX, lastCursorY;
    let moved = false;
    let header = document.getElementById(element.id + "header");
    let content = document.getElementById(element.id + "content");

    element.onclick = (e) => e.stopPropagation();

    if (header.onmousedown) {
        header.onmousedown = null;
        element.classList.remove("draggable");
    } else {
        header.onmousedown = beginDrag;
        element.classList.add("draggable");
    }

    function toggleContentVisibility() {
        if (content.style.visibility == "hidden") {
            content.style.visibility = "visible";
            element.style.pointerEvents = "auto";
        } else {
            content.style.visibility = "hidden";
            element.style.pointerEvents = "none";
        }
    }

    function beginDrag(e) {
        lastCursorX = e.clientX;
        lastCursorY = e.clientY;
        header.onmouseup = endDrag;
        document.onmouseup = endDrag;
        document.onmousemove = doDrag;

        for (let ttt of document.getElementsByClassName("tooltiptext")) {
            ttt.style.zIndex = 8
        }
        element.style.zIndex = 10
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