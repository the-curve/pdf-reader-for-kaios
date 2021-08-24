window.addEventListener("load", function () {
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
    if (element == null) { // Do nothing!!!
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

document.onkeydown = function (evt) {
    switch (evt.key) {
        case "Enter": enterKey();
            break;
        case "5": easyRead();
            break;
        case "ArrowDown": arrowDown(evt);
            break;
        case "ArrowUp": arrowUp(evt);
            break;
        case "SoftLeft": SoftLeft();
            break;
        case "SoftRight": SoftRight();
            break;
        case "Backspace": Backspace(evt);
            break;
    }
}

var nav = 1;
var scroll = 0;
var op = 1
maxOp = 4

function arrowDown(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");

    if (document.getElementById("options").style.display == "") {
        if (op == maxOp) {
            removeActive("op" + op);
            op = 1;
            makeActive("op" + op);
        } else if (isActive("op" + op)) {
            removeActive("op" + op);
            makeActive("op" + (
                op + 1
            ));
            op++;
        }

    } else if (nav == no_of_divs) {
        removeActive(nav)
        nav = 1;
        makeActive("nav");
        searchBox.focus();
        window.scrollTo(0, 0);
        document.getElementById("softkey-center").innerHTML = '';
        document.getElementById("softkey-right").innerHTML = '';
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
            scroll = window.pageYOffset + 65;
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
            removeActive("op" + op);
            op = maxOp;
            makeActive("op" + op);
        } else if (isActive("op" + op)) {
            removeActive("op" + op);
            makeActive("op" + (
                op - 1
            ));
            op--;
        }

    } else if (isActive("nav")) {
        nav = no_of_divs;
        removeActive("nav");
        searchBox.blur();
        makeActive(nav);
        window.scrollTo(0, document.body.scrollHeight);

        document.getElementById("softkey-center").innerHTML = 'OPEN';
        document.getElementById("softkey-right").innerHTML = 'Options';
    } else if (nav == 1 && ! searchBox.matches(":focus")) {
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
            scroll = window.pageYOffset - 65;
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
            case 1: renameDoc();
                break;
            case 2: deleteDoc();
                break;
            case 3: getInfoDoc();
                break;
            case 4: shareDoc();
                break;
        }
    }
}
/**
 * Rename here it means making new file
 * with previous file content
 * and delete previous file
 */
function renameDoc() {
    console.log("Renaming...");
    var path = "";
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains("active")) {
            path = list.children[i].getAttribute("path");
        }
    }

    var newName = prompt("Enter new name");
    if (newName) {
        var sdcard = navigator.getDeviceStorage('sdcard');
        var request = sdcard.getEditable(path);

        request.onsuccess = function () {
            var fileReader = new FileReader();

            fileReader.onload = function () {
                var typedarray = new Uint8Array(this.result);
                var blob = new Blob([typedarray], {"type": "application/pdf"});

                var reqChange = sdcard.addNamed(blob, (newName + ".pdf"));

                reqChange.onsuccess = function () {
                    var reqDel = sdcard.delete(path);
                    reqDel.onsuccess = function () {
                        window.location.reload();
                    }
                }
                reqChange.onerror = function () {
                    console.log(this.error);
                    alert("Cannot rename file")
                }
            }
            fileReader.readAsArrayBuffer(this.result);
        }
    }
}
// Delete file
function deleteDoc() {
    console.log("Deleting...");
    var path = "";
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains("active")) {
            path = list.children[i].getAttribute("path");
        }
    }
    var sdcard = navigator.getDeviceStorage('sdcard');

    var confirmation = confirm("Delete file?");

    if (confirmation) {
        var request = sdcard.delete(path);

        request.onsuccess = function () {
            window.location.reload();
        }

        request.onerror = function () {
            console.log(this.error);
            alert("Unable to delete the file");
        }
    }
}

function getInfoDoc() {
    console.log("Getting Info...");
    var path = "";

    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains("active")) {
            path = list.children[i].getAttribute("path");
        }
    }
    var url = "getInfo.html?path=" + path;
    document.location.href = url;
}

function shareDoc() {
    console.log("Sharing...");
    var path = "";

    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains("active")) {
            path = list.children[i].getAttribute("path");
        }
    }

    var sdcard = navigator.getDeviceStorage('sdcard');
    var request = sdcard.getEditable(path);

    request.onsuccess = function () {
        var fileReader = new FileReader();

        fileReader.onload = function () {
            var typedarray = new Uint8Array(this.result);
            var blob = new Blob([typedarray], {"type": "application/pdf"});
        }
        fileReader.readAsArrayBuffer(this.result);
    }
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

function SoftLeft() { // Change the theme...
}

var countRight = 0;

function SoftRight() { // Open options menu with (Rename, delete and path)
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
