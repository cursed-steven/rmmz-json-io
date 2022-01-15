/**
 * Globals
 */
let $objJson = null;
let $csv = null;
let $filenameFromUrl = '';

/**
 * Main routine
 */
function main() {
    $filenameFromUrl = location.href.split('/').pop().split('.')[0];

    // View
    document.title = TITLE;
    mainNav();
}

/**
 * Block Builders
 */
function mainNav() {
    for (let [key, val] of Object.entries(NAV)) {
        $('#nav-ul').append(navLink(key, val));
    }

}

function navLink(key, val) {
    let a = $('<a>');
    a.attr('href', key + '.html');
    a.text(val);

    if (key === $filenameFromUrl) {
        a.addClass('active');
    }

    let li = $('<li>');
    li.append(a);

    return li;
}

function encodeJsonData(json) {
    return encodeURIComponent(JSON.stringify(json));
}

function decodeJsonData(str) {
    return JSON.parse(decodeURIComponent(str));
}

 function ext(file) {
     let pos = file.name.lastIndexOf('.');
     if (pos === -1) return false;
     return file.name.slice(pos + 1);
 }