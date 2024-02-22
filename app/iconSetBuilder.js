/**
 * Main routine
 */
const ICON_SIZE = 32;

function iconSetBuilder() {
    console.log("WORKING?");

    const lines = 20;
    let tableDom = document.createElement("table");
    for (let i = 0; i < lines; i++) {
        const trDom = tr();
        tableDom.appendChild(trDom);
    }
    tableDom.setAttribute("style", "height: " + ICON_SIZE * lines + "px;");

    $('#iconTable').append(tableDom);
}

function tr() {
    const cols = 16;
    let trDom = document.createElement("tr");

    for (let i = 0; i < cols; i++) {
        let tdDom = document.createElement("td");
        tdDom.setAttribute("class", "iconCell");
        tdDom.setAttribute("style", "margin: 0; padding: 0;min-height: " + ICON_SIZE + "px;");
        trDom.appendChild(tdDom);
    }

    return trDom;
}