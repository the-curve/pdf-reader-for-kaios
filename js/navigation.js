window.addEventListener("load", function() {
    var list = document.getElementById("list");
    document.getElementById("searchBox").focus();
    makeActive("nav");
})

function makeActive(e) {
    var element = document.getElementById(e)
    element.classList.add("active");
}

function isActive(e) {
    var element = document.getElementById(e)
    if (element == null) {
        // Do nothing!!!
    } else if (element.classList.contains("active")) {
        return true;
    } else {
        return false;
    }
}

function removeActive(e) {
    var element = document.getElementById(e)
    if (element == null) {
        // Do nothing!!!
    } else {
        element.classList.remove("active");
    }
}

document.onkeydown = function(evt) {
    switch (evt.key) {
        case "Enter":
            enterKey();
            break;
        case "5":
            easyRead();
            break;
        case "ArrowDown":
            arrowDown(evt);
            break;
        case "ArrowUp":
            arrowUp(evt);
            break;
        case "SoftLeft":
            SoftLeft();
            break;
        case "SoftRight":
            SoftRight();
            break;
        case "Backspace":
            Backspace(evt);
            break;
    }
}

var nav = 1;
var scroll = 0;

function arrowDown(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");

    if (searchBox.matches(":focus")) {
        searchBox.blur();
        removeActive("nav");
        makeActive("1");
    } else if (isActive(nav)) {
        removeActive(nav);
        makeActive(nav + 1);
        nav++;

        if (nav > 3) {
            scroll = window.pageYOffset + 66;
            window.scrollTo(0, scroll);
        }

        //if nav is on end of life
        if (nav == no_of_divs) {
            //Element will be null if more down pressed
            nav = 0; // Brain!!!

            scroll = window.pageYOffset + 66;
            window.scrollTo(0, scroll);
        }
    }
    if (nav > 0) {
        document.getElementById("softkey-center").innerHTML = 'OPEN';
    }
}

function arrowUp(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");

    if (nav == 0 && !searchBox.matches(":focus")) {
        nav = no_of_divs;
    }
    if (nav == 1 && !searchBox.matches(":focus")) {
        document.getElementById("softkey-center").innerHTML = '';
        removeActive("1");
        searchBox.focus();
        makeActive("nav");
    } else if (isActive(nav)) {
        removeActive(nav);
        makeActive(nav - 1);
        nav--

        if (nav <= no_of_divs - 3) {
            scroll = window.pageYOffset - 66;
            window.scrollTo(0, scroll);
        }
    }
}

function enterKey() {
    var path = "";
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains("active")) {
            path = list.children[i].getAttribute("path");
        }
    }
    if (path) {
        var url = "pdfHandler.html?path=" + path;
        document.location.href = url;
    }
}

function easyRead() {
    var path = "";
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains("active")) {
            path = list.children[i].getAttribute("path");
        }
    }
    if (path) {
        var url = "easyRead.html?path=" + path;
        document.location.href = url;
    }
}

function SoftLeft() {
    // Open options menu with (Rename, delete and path)
}

function SoftRight() {
    // Change the theme...
}

function Backspace(event) {
    event.preventDefault();
    window.close();
}