/**
 * Main routine.
 */
function main() {
    // View
    document.title = TITLE;
    mainNav();

    // Listeners
    addAllEventListenersForFileLoad();
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

    const filenameFromUrl = location.href.split('/').pop().split('.')[0];
    if (key === filenameFromUrl) {
        a.addClass('active');
    }

    let li = $('<li>');
    li.append(a);

    return li;
}

/**
 * Common Functions
 */
function addAllEventListenersForFileLoad() {
    $('input[type="file"]').each(function(ix, el){
        addEventListenerForFileLoad($(el).attr('id'));
    });
}

function addEventListenerForFileLoad(id) {
    let input = document.getElementById(id);
    let reader = new FileReader();

    input.on('change', function(){
        $fileContent = loadFormFile(reader);
    });
}
