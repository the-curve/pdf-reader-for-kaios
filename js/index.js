window.addEventListener("load", function() {
    document.getElementById("softkey-left").innerHTML = 'Dark-Mode';
    document.getElementById("softkey-center").innerHTML = '';
    document.getElementById("softkey-right").innerHTML = '';
});

var screenMode;
if (window.matchMedia("(orientation: portrait)").matches) {
    screenMode = "portrait";
} else {
    screenMode = "landscape";
}

var no_of_divs = 0;
var count = 1;

searchFiles();

function searchFiles() {
    var sdcards = navigator.getDeviceStorages("sdcard");
    var storageAmount = sdcards.length;
    console.log("Storages: " + storageAmount);

    for (let i = 0; i < storageAmount; i++) {
        var fileCursor = sdcards[i].enumerate();

        fileCursor.onsuccess = function() {
            if (fileCursor.result && fileCursor.result.name !== null) {
                let files = fileCursor.result;

                if (files.type == "application/pdf") {

                    //make div element then append with lists with attributes
                    var div = document.createElement("div");
                    div.setAttribute("path", files.name);
                    div.setAttribute("id", count);
                    div.setAttribute("size", files.size);
                    div.setAttribute("lastModified", files.lastModifiedDate);
                    count++;

                    //slice it to get only file name
                    var l = files.name.lastIndexOf("/");
                    var temp = files.name.slice(l + 1);
                    div.innerHTML = temp;
                    div.className = "fileButton";
                    console.log(temp);

                    //append div with a beautiful line
                    var line = document.createElement("hr");
                    list.appendChild(div);
                    list.appendChild(line);

                    no_of_divs = getCount("list", "div");
                }
                fileCursor.continue()
            }
            if (fileCursor.readyState != "pending") {
                if (no_of_divs == 0) {
                    document.getElementById('list').innerHTML = "<br> &emsp;&emsp;&emsp; No PDF files found!";
                }
            }
        }
    }
}

function getCount(parent, countFor) {
    var element = document.getElementById(parent);
    var noOfChildren = element.getElementsByTagName("div").length;
    return noOfChildren
}