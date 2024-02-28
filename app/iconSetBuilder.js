/**
 * Main routine
 */
const ICON_SIZE = 32;

function iconSetBuilder() {
    const lines = 20;
    let tableDom = document.createElement("table");
    for (let i = 0; i < lines; i++) {
        const trDom = tr();
        tableDom.appendChild(trDom);
    }
    tableDom.setAttribute("style", "height: " + ICON_SIZE * lines + "px;");
    $('#iconTable').append(tableDom);

    let tableDom2 = document.createElement("table");
    tableDom2.appendChild(tr1());
    tableDom2.setAttribute("style", "height: " + ICON_SIZE + "px;");
    $('#simulator').append(tableDom2);

    const cells = document.getElementsByClassName("iconCell");
    // console.log(cells);
    for (let i = 1; i < cells.length; i++) {
        cells[i].setAttribute("id", "iconIndex-" + i);

        cells[i].addEventListener("dragover", (ev) => {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "copy";
            cells[i].classList.add("dragover");
        });

        cells[i].addEventListener("dragleave", (ev) => { 
            cells[i].classList.remove("dragover");
        });

        cells[i].addEventListener("drop", (ev) => { 
            ev.preventDefault();

            cells[i].classList.remove("dragover");
            organizeFiles(ev.dataTransfer.files, i);
        });

        cells[i].addEventListener("dblclick", (ev) => {
            cells[i].innerHTML = "";
            cells[i].appendChild(spacer());
        });            
    }
}

function tr() {
    const cols = 16;
    let trDom = document.createElement("tr");

    for (let i = 0; i < cols; i++) {
        let spacer = document.createElement("img");
        spacer.src = "images/spacer.gif";
        spacer.width = ICON_SIZE;
        spacer.height = ICON_SIZE;
        spacer.setAttribute("style", "vertical-align:bottom;margin:0;padding:0;");

        let tdDom = document.createElement("td");
        tdDom.setAttribute("class", "iconCell");
        tdDom.setAttribute("style", "margin:0;padding:0;max-width:32px;max-height:" + ICON_SIZE + "px;");
        tdDom.appendChild(spacer);
        trDom.appendChild(tdDom);
    }

    return trDom;
}

function spacer() {
    let spacer = document.createElement("img");
    spacer.src = "images/spacer.gif";
    spacer.width = ICON_SIZE;
    spacer.height = ICON_SIZE;
    spacer.setAttribute("style", "vertical-align:bottom;margin:0;padding:0;");

    return spacer;
}

function tr1() {
    let trDom = document.createElement("tr");

    let tdDom = document.createElement("td");
    tdDom.setAttribute("class", "iconCell");
    tdDom.setAttribute("style", "margin:0;padding:0;max-width:32px;max-height:" + ICON_SIZE + "px;");
    tdDom.appendChild(spacer());
    trDom.appendChild(tdDom);

    return trDom;
}

function organizeFiles(files, i) {
    // 複数ファイルを取り扱う予定はないので先頭だけ見る
    const file = files[0];

    if (!file || file.type.indexOf("image/") < 0) {
        return;
    }    

    if (i === 320) {
        outputAndOverlayFile(file, i);        
    } else {
        outputFile(file, i);        
    }
}

function outputFile(file, i) {
    // console.log({ file, i });

    let image = new Image();
    const blobUrl = URL.createObjectURL(file);
    image.src = blobUrl;
    image.setAttribute("style", "vertical-align:bottom;margin:0;padding:0;");

    image.addEventListener("load", () => { 
        URL.revokeObjectURL(blobUrl);
        const cell = document.getElementById("iconIndex-" + i);
        const child = cell.childNodes[0];
        cell.removeChild(child);
        cell.appendChild(image);
    });
}

function outputAndOverlayFile(file, i) {
    // console.log({ file, i });

    let image = new Image();
    const blobUrl = URL.createObjectURL(file);
    image.src = blobUrl;
    image.setAttribute("style", "position:absolute;vertical-align:bottom;margin:0;padding:0;");


    image.addEventListener("load", () => { 
        URL.revokeObjectURL(blobUrl);
        const cell = document.getElementById("iconIndex-" + i);
        const children = cell.childNodes;
        let zMax = 0;
        if (children.length === 1) {
            const child = cell.childNodes[0];
            if (child.getAttribute("src").includes("spacer.gif")) {
                cell.removeChild(child);
                image.style.zIndex = 0;
            } else {
                image.style.zIndex = 1;
            }
        } else {
            children.forEach((node, ni) => {
                if (zMax < node.style.zIndex) {
                    zMax = node.style.zIndex;
                }
            });
            // console.log({ zMax });

            image.style.zIndex = parseInt(zMax) + 1;
        }
        cell.appendChild(image);
    });
}