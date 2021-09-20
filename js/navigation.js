// Some variables
const list = document.getElementById("pdf-list")
const div = list.getElementsByTagName("div");
const searchBox = document.getElementById("searchBox");
const optionMenu = document.getElementById("options-menu");
const optionList = document.getElementsByTagName("li");

var index = [];

var checkExist = setInterval(function() {
    if (list.childElementCount) {
        for (let i = 0; i < div.length; i++) {
            index.push(div[i]);
        }
        clearInterval(checkExist);
    }
}, 100);

function searchFocus() {
    var searchContainer = document.getElementById("search_container")
    searchContainer.firstElementChild.focus();
    searchContainer.classList.add("selected");
}

function searchBlur() {
    var searchContainer = document.getElementById("search_container")
    searchContainer.firstElementChild.blur();
    searchContainer.classList.remove("selected");
}

function updateSoftKey() {
    const lsk = document.getElementById("lsk");
    const csk = document.getElementById("csk");
    const rsk = document.getElementById("rsk");
    if (optionMenu.style.display == "") {
        lsk.innerHTML = "";
        csk.innerHTML = "Select"
        rsk.innerHTML = "";
    } else if (document.activeElement.tagName !== 'INPUT') {
        lsk.innerHTML = "Search";
        csk.innerHTML = "Open"
        rsk.innerHTML = "Options";
    } else {
        lsk.innerHTML = "";
        csk.innerHTML = ""
        rsk.innerHTML = "";
    }
}

searchFocus();

// Search
searchBox.addEventListener('input', (evt) => {
    var input = evt.target.value;
    var filter = input.toUpperCase();
    var hr = document.getElementsByTagName("hr");
    index = [];

    for (var i = 0; i < div.length; i++) {
        var textVal = div[i].firstElementChild.textContent;

        div[i].style.display = "none";
        hr[i].style.display = "none"

        if (textVal.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
            hr[i].style.display = ""
            index.push(div[i]);
        }
    }
});

// Navigation
var countRight = 0;
document.onkeydown = function(evt) {
    switch (evt.key) {
        case "ArrowDown":
            evt.preventDefault();
            if (document.activeElement.tagName == 'INPUT') {
                if (index.length !== 0) {
                    searchBlur();
                    index[0].classList.add("selected");
                }
            } else {
                arrowDown(evt);
            }
            updateSoftKey();
            break;
        case "ArrowUp":
            evt.preventDefault();
            if (document.activeElement.tagName == 'INPUT') {
                if (index.length !== 0) {
                    searchBlur();
                    index[index.length - 1].classList.add("selected");
                    document.getElementById("content").scrollTop = document.getElementById("content").scrollHeight;
                }
            } else {
                arrowUp(evt);
            }
            updateSoftKey();
            break;
        case "SoftLeft":
            if (document.activeElement.tagName !== 'INPUT' && optionMenu.style.display !== "") {
                for (let i = 0; i < index.length; i++) {
                    if (index[i].classList.contains("selected")) {
                        searchFocus();
                        index[i].classList.remove("selected");
                        document.getElementById("content").scrollTop = 0;
                    }
                }
            }
            updateSoftKey();
            break;
        case "SoftRight":
            if (document.activeElement.tagName !== 'INPUT') {
                if (optionMenu.style.display == "") {
                    return;
                } else if (countRight == 0) {
                    optionMenu.style.display = "";
                    tab = 0;
                    optionList[tab].focus();
                    countRight++;
                }
            }
            updateSoftKey();
            break;
        case "Enter":
            enterKey();
            break;
        case "5":
            easyRead();
            break;
        case "Backspace":
            Backspace(evt);
            break;
    }
}

var i;
var tab = 0;

function arrowDown(e) {
    if (optionMenu.style.display == "") {
        if (tab <= optionList.length - 1) {
            tab++;
            if (tab == optionList.length) {
                tab = 0;
                optionList[tab].focus();
            } else {
                optionList[tab].focus();
            }
        }
    } else if (index[index.length - 1].classList.contains("selected")) {
        index[index.length - 1].classList.remove("selected");
        searchFocus();
        document.getElementById("content").scrollTop = 0;
    } else {
        for (i = 0; i < index.length; i++) {
            if (index[i].classList.contains("selected")) {
                index[i].classList.remove("selected")
                i = i + 1;
                index[i].classList.add("selected")

                if (i >= 3) {
                    document.getElementById("content").scrollTop += 62;
                }
            }
        }
    }
}

function arrowUp(e) {
    if (optionMenu.style.display == "") {
        if (tab <= optionList.length - 1) {
            tab--;
            if (tab == -1) {
                tab = optionList.length - 1;
                optionList[tab].focus();
            } else {
                optionList[tab].focus();
            }
        }
    } else if (index[0].classList.contains("selected")) {
        index[0].classList.remove("selected");
        searchFocus();
    } else {
        for (i = 0; i < index.length; i++) {
            if (index[i].classList.contains("selected")) {
                index[i].classList.remove("selected")
                i = i - 1;
                index[i].classList.add("selected")

                if (i >= 3) {
                    document.getElementById("content").scrollTop -= 62;
                }
                if (i == 2) {
                    document.getElementById("content").scrollTop = 0;
                }
            }
        }
    }
}

function easyRead() {
    var path = "";
    for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains("selected")) {
            path = div[i].getAttribute("path");
        }
    }
    if (path) {
        var url = "easyRead.html?path=" + path;
        document.location.href = url;
    }
}

function enterKey() {
    var path = "";
    if (document.activeElement.tagName !== 'INPUT') {
        if (optionMenu.style.display == "none") {
            for (let i = 0; i < div.length; i++) {
                if (div[i].classList.contains("selected")) {
                    path = div[i].getAttribute("path");
                }
            }
            if (path) {
                var url = "pdfHandler.html?path=" + path;
                document.location.href = url;
            }
        } else {
            switch (tab) {
                case 0:
                    renameDoc();
                    break;
                case 1:
                    deleteDoc();
                    break;
                case 2:
                    getInfoDoc();
                    break;
                case 3:
                    sorting();
                    break;
            }
        }

    }
}

/**
 * Rename here it means making new file
 * with previous file content
 * and delete previous file
 */
function renameDoc() {
    var path = "";
    for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains("selected")) {
            path = div[i].getAttribute("path");
        }
    }

    var name = path.slice(path.lastIndexOf("/") + 1);
    var loc = path.split(name)[0]
    var newName = prompt("Enter new name");
    if (newName) {
        var sdcard = navigator.getDeviceStorage('sdcard');
        var request = sdcard.getEditable(path);

        request.onsuccess = function() {
            var fileReader = new FileReader();

            fileReader.onload = function() {
                var typedarray = new Uint8Array(this.result);
                var blob = new Blob([typedarray], { "type": "application/pdf" });

                var reqChange = sdcard.addNamed(blob, (loc + "" + newName + ".pdf"));

                reqChange.onsuccess = function() {
                    var reqDel = sdcard.delete(path);
                    reqDel.onsuccess = function() {
                        window.location.reload();
                    }
                }
                reqChange.onerror = function() {
                    console.log(this.error);
                    alert("Cannot rename file: \n" + this.error.name)
                }
            }
            fileReader.readAsArrayBuffer(this.result);
        }
    }
}

// Delete file
function deleteDoc() {
    var path = "";
    for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains("selected")) {
            path = div[i].getAttribute("path");
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
    var path = "";

    for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains("selected")) {
            path = div[i].getAttribute("path");
        }
    }
    Backspace();
    var url = "getInfo.html?path=" + path;
    document.location.href = url;
}

function sorting() {
    Backspace();
    document.location.href = "sort.html";
}

function Backspace(e) {
    if (document.activeElement.tagName !== 'INPUT') {
        if (optionMenu.style.display == "") {
            try {
                e.preventDefault();
            } catch (error) {
                console.log("Nothing happened!");
            }
            optionMenu.style.display = "none";
            countRight--;
        }
    }
    updateSoftKey();
}