window.addEventListener("load", function() {
    document.getElementById("options").style.display = "none";
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
    if (element) {
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
var op = 1

function arrowDown(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");

    if (document.getElementById("options").style.display == "") {
        if (op == 4) {
            //Do nothing
        } else if (isActive("op" + op)) {
            removeActive("op" + op);
            makeActive("op" + (op + 1));
            op++;
        }

    } else if (searchBox.matches(":focus")) {
        searchBox.blur();
        removeActive("nav");
        makeActive("1");
        document.getElementById("softkey-center").innerHTML = 'OPEN';
        document.getElementById("softkey-right").innerHTML = 'Options';
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
            nav = 0;

            scroll = window.pageYOffset + 66;
            window.scrollTo(0, scroll);
        }

        if (nav > 0) {
            document.getElementById("softkey-center").innerHTML = 'OPEN';
            document.getElementById("softkey-right").innerHTML = 'Options';
        }
    }
}

function arrowUp(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");

    if (document.getElementById("options").style.display == "") {
        if (op == 1) {
            //Do nothing
        } else if (isActive("op" + op)) {
            removeActive("op" + op);
            makeActive("op" + (op - 1));
            op--;
        }

    } else if (nav == 0 && !searchBox.matches(":focus")) {
        nav = no_of_divs;
    } else if (nav == 1 && !searchBox.matches(":focus")) {
        document.getElementById("softkey-center").innerHTML = '';
        document.getElementById("softkey-right").innerHTML = '';

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
    if (document.getElementById("options").style.display == "none") {
        for (let i = 0; i < list.children.length; i++) {
            if (list.children[i].classList.contains("active")) {
                path = list.children[i].getAttribute("path");
            }
        }
        if (path) {
            var url = "pdfHandler.html?path=" + path;
            document.location.href = url;
        }
    } else {
        switch (op) {
            case 1:
                renameDoc();
                break;
            case 2:
                deleteDoc();
                break;
            case 3:
                getInfoDoc();
                break;
            case 4:
                shareDoc();
                break;
        }
    }
}

function renameDoc() {
    console.log("Renaming...");
    path = "";
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains("active")) {
            path = list.children[i].getAttribute("path");
        }
    }
    var l = path.lastIndexOf("/");
    var name = path.slice(l + 1);

    var newName = prompt("Enter new name");
    if (newName) {
        console.log("Changing name from " + name + " to " + newName);
    }
}

function deleteDoc() {
    console.log("Deleting...");
}

function getInfoDoc() {
    console.log("Getting Info...");
}

function shareDoc() {
    console.log("Sharing...");
}

function easyRead() {
    var path = "";
    if (document.getElementById("options").style.display == "none") {
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
}

function SoftLeft() {
    // Change the theme...
}

var countRight = 0;

function SoftRight() {
    // Open options menu with (Rename, delete and path)
    if (!document.getElementById("searchBox").matches(":focus")) {
        const options = document.getElementById("options");
        if (options.style.display == "") {
            return;
        } else if (countRight == 0) {
            makeActive("op1")
            options.style.display = "";
            document.getElementById("softkey-left").innerHTML = '';
            document.getElementById("softkey-center").innerHTML = 'SELECT';
            document.getElementById("softkey-right").innerHTML = '';
            countRight++;
        }
    }
}

function Backspace(event) {
    event.preventDefault();
    if (countRight == 1) {
        options.style.display = "none";
        countRight--;
        removeActive("op" + op);
        op = 1;
        document.getElementById("softkey-left").innerHTML = 'Dark-Mode';
        document.getElementById("softkey-center").innerHTML = 'OPEN';
        document.getElementById("softkey-right").innerHTML = 'Options';
    } else {
        window.close();
    }
}