window.addEventListener("load", function() {
    document.getElementById("options").style.display = "none";
    document.getElementById("searchBox").focus();
})

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

var scroll = 0;
var op = 1
maxOp = 4
var i;

function arrowDown(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");
    const list = document.getElementById("list");
    const div = list.getElementsByTagName("div");
    const nav = document.getElementById("nav");

    if (document.getElementById("options").style.display == "") {
        if (op == maxOp) {
            document.getElementById("op" + op).classList.remove("active");
            op = 1
            document.getElementById("op" + op).classList.add("active")
        } else if (document.getElementById("op" + op).classList.contains("active")) {
            document.getElementById("op" + op).classList.remove("active")
            document.getElementById("op" + (
                op + 1
            )).classList.add("active")
            op++;
        }
    } else if (searching) {
        if (searchBox.matches(":focus")) {
            nav.classList.remove("active");
            searchBox.blur();

            index[0].classList.add("active")

            document.getElementById("softkey-center").innerHTML = 'OPEN';
            document.getElementById("softkey-right").innerHTML = 'Options';
        } else if (index[index.length - 1].classList.contains("active")) {
            index[index.length - 1].classList.remove("active")
            nav.classList.add("active");
            searchBox.focus();

            window.scrollTo(0, 0);
            document.getElementById("softkey-center").innerHTML = 'SEARCH';
            document.getElementById("softkey-right").innerHTML = 'Clear';
        } else {
            for (i = 0; i < index.length; i++) {
                if (index[i].classList.contains("active")) {
                    index[i].classList.remove("active")
                    i = i + 1;
                    index[i].classList.add("active")

                    if (i >= 3) {
                        scroll = window.pageYOffset + 65;
                        window.scrollTo(0, scroll);
                    }
                }
            }
        }
    } else if (searchBox.matches(":focus")) {
        nav.classList.remove("active");
        searchBox.blur();

        list.firstElementChild.classList.add("active")

        document.getElementById("softkey-center").innerHTML = 'OPEN';
        document.getElementById("softkey-right").innerHTML = 'Options';
    } else if (div[div.length - 1].classList.contains("active")) { // when last div active
        div[div.length - 1].classList.remove("active")
        nav.classList.add("active");
        searchBox.focus();

        window.scrollTo(0, 0);
        document.getElementById("softkey-center").innerHTML = 'SEARCH';
        document.getElementById("softkey-right").innerHTML = '';
    } else {
        for (i = 0; i < div.length; i++) {
            if (div[i].classList.contains("active")) {
                div[i].classList.remove("active")
                i = i + 1;
                div[i].classList.add("active")

                if (i >= 3) {
                    scroll = window.pageYOffset + 65;
                    window.scrollTo(0, scroll);
                }
            }
        }
    }
}

function arrowUp(event) {
    event.preventDefault();
    const searchBox = document.getElementById("searchBox");
    const list = document.getElementById("list");
    const div = list.getElementsByTagName("div");
    const nav = document.getElementById("nav");

    if (document.getElementById("options").style.display == "") {
        if (op == 1) {
            document.getElementById("op" + op).classList.remove("active");
            op = maxOp;
            document.getElementById("op" + op).classList.add("active")
        } else if (document.getElementById("op" + op).classList.contains("active")) {
            document.getElementById("op" + op).classList.remove("active")
            document.getElementById("op" + (
                op - 1
            )).classList.add("active")
            op--;
        }
    } else if (searching) {
        if (searchBox.matches(":focus")) {
            nav.classList.remove("active");
            searchBox.blur();
            index[index.length - 1].classList.add("active")

            window.scrollTo(0, document.body.scrollHeight);

            document.getElementById("softkey-center").innerHTML = 'OPEN';
            document.getElementById("softkey-right").innerHTML = 'Options';
        } else if (index[0].classList.contains("active")) {
            index[0].classList.remove("active");
            nav.classList.add("active")
            searchBox.focus();

            document.getElementById("softkey-center").innerHTML = 'SEARCH';
            document.getElementById("softkey-right").innerHTML = 'Clear';
        } else {
            for (i = 0; i < index.length; i++) {
                if (index[i].classList.contains("active")) {
                    index[i].classList.remove("active")
                    i = i - 1;
                    index[i].classList.add("active")

                    if (i >= 3) {
                        scroll = window.pageYOffset - 65;
                        window.scrollTo(0, scroll);
                    }
                    if (i == 2) {
                        window.scrollTo(0, 0);
                    }
                }
            }
        }
    } else if (searchBox.matches(":focus")) {
        nav.classList.remove("active");
        searchBox.blur();
        div[div.length - 1].classList.add("active")

        window.scrollTo(0, document.body.scrollHeight);

        document.getElementById("softkey-center").innerHTML = 'OPEN';
        document.getElementById("softkey-right").innerHTML = 'Options';
    } else if (list.firstElementChild.classList.contains("active")) {
        list.firstElementChild.classList.remove("active")
        nav.classList.add("active");
        searchBox.focus();

        document.getElementById("softkey-center").innerHTML = 'SEARCH';
        if (searching == true && searchBox.value != "") {
            document.getElementById("softkey-right").innerHTML = 'Clear';
        } else {
            document.getElementById("softkey-right").innerHTML = '';
        }
    } else {
        for (i = 0; i < div.length; i++) {
            if (div[i].classList.contains("active")) {
                div[i].classList.remove("active")
                i = i - 1;
                div[i].classList.add("active")

                if (i >= 3) {
                    scroll = window.pageYOffset - 65;
                    window.scrollTo(0, scroll);
                }
                if (i == 2) {
                    window.scrollTo(0, 0);
                }
            }
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

        request.onsuccess = function() {
            var fileReader = new FileReader();

            fileReader.onload = function() {
                var typedarray = new Uint8Array(this.result);
                var blob = new Blob([typedarray], { "type": "application/pdf" });

                var reqChange = sdcard.addNamed(blob, (newName + ".pdf"));

                reqChange.onsuccess = function() {
                    var reqDel = sdcard.delete(path);
                    reqDel.onsuccess = function() {
                        window.location.reload();
                    }
                }
                reqChange.onerror = function() {
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

        request.onsuccess = function() {
            window.location.reload();
        }

        request.onerror = function() {
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

var countRight = 0;

function SoftRight() { // Open options menu with (Rename, delete and path)
    if (!document.getElementById("searchBox").matches(":focus")) {
        const options = document.getElementById("options");
        if (options.style.display == "") {
            return;
        } else if (countRight == 0) {
            document.getElementById("op1").classList.add("active")
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
        document.getElementById("op" + op).classList.remove("active")
        op = 1;
        document.getElementById("softkey-left").innerHTML = '';
        document.getElementById("softkey-center").innerHTML = 'OPEN';
        document.getElementById("softkey-right").innerHTML = 'Options';
    } else {
        window.close();
    }
}