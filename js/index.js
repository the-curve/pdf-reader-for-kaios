window.addEventListener("load", function () {
    document.getElementById("softkey-left").innerHTML = '';
    document.getElementById("softkey-center").innerHTML = 'SEARCH';
    document.getElementById("softkey-right").innerHTML = '';
});

var screenMode;
if (window.matchMedia("(orientation: portrait)").matches) {
    screenMode = "portrait";
} else {
    screenMode = "landscape";
}

var count = 1;
var filesArray = [];
searchFiles("name");

function searchFiles(sortby) {
    var sdcards = navigator.getDeviceStorages("sdcard");
    var storageAmount = sdcards.length;
    console.log("Storages: " + storageAmount);

    for (let i = 0; i < storageAmount; i++) {
        var fileCursor = sdcards[i].enumerate();

        fileCursor.onsuccess = function () {
            if (fileCursor.result && fileCursor.result.name !== null) {
                let files = fileCursor.result;

                if (files.type == "application/pdf") {
                    filesArray.push(files); // push files into array
                }fileCursor.continue()
            }
            if (fileCursor.readyState != "pending") {
                if (filesArray.length == 0) {
                    document.getElementById('list').innerHTML = "<br> &emsp;&emsp;&emsp; No PDF files found!";
                } else {
                    sortIt(sortby)
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

/**
 * <3 Kisses to stackOverflow!
 */
function sortIt(sortby) {
    for (var i = 0; i < filesArray.length; i++) {

        // Sorting by date...
        if (sortby == "date") {
            filesArray.sort(function (a, b) {
                return new Date(b.lastModified) - new Date(a.lastModified);
            });
        } else if (sortby == "name") {
            // Sorting by name...
            filesArray.sort(function(a, b){
                // toLowerCase is important
                var aname = a.name.slice(a.name.lastIndexOf("/")).toLowerCase();
                var bname = b.name.slice(b.name.lastIndexOf("/")).toLowerCase();
                
                if(aname < bname) { return -1; }
                if(aname > bname) { return 1; }
                return 0;
            })
        } else if (sortby = "size") {
            // Sorting by size...
            filesArray.sort(function(a,b){
                a = a.size;
                b = b.size;
                
                return a-b;
            });
        }

        console.log(filesArray[i].name)

        // make div element then append with lists with attributes
        var div = document.createElement("div");
        div.setAttribute("path", filesArray[i].name);
        div.setAttribute("id", count);
        count++;

        // slice it to get only file name
        var l = filesArray[i].name.lastIndexOf("/");
        var temp = filesArray[i].name.slice(l + 1);
        div.innerHTML = temp;
        div.className = "fileButton";

        // append div with a beautiful line
        var line = document.createElement("hr");
        list.appendChild(div);
        list.appendChild(line);
    }
}