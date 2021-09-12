/*
 * Below some code is only to get method of sorting
 */
try {
    var ur = document.location.href,
        params = ur.split('?')[1].split('&'),
        data = {},
        tmp;

    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    var method = data.method;
} catch (error) {} //D.N.
/*
 * Above some code was only to get method of sorting
 */

var screenMode;
if (window.matchMedia("(orientation: portrait)").matches) {
    screenMode = "portrait";
} else {
    screenMode = "landscape";
}

var count = 1;
var filesArray = [];

console.log("Method: " + method);
searchFiles(method);

function searchFiles(sortby) {
    var sdcards = navigator.getDeviceStorages("sdcard");
    var storageAmount = sdcards.length;

    for (let i = 0; i < storageAmount; i++) {
        var fileCursor = sdcards[i].enumerate();

        fileCursor.onsuccess = function() {
            if (fileCursor.result && fileCursor.result.name !== null) {
                let files = fileCursor.result;

                if (files.type == "application/pdf") {
                    filesArray.push(files); // push files into array
                }
                fileCursor.continue()
            }
            if (fileCursor.readyState != "pending") {
                if (filesArray.length == 0) {
                    list.innerHTML = "<p style='text-align: center'>No PDF files found!</p>";
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

function sortIt(sortby) {
    for (var i = 0; i < filesArray.length; i++) {
        // Sorting by date...
        if (sortby == "date") {
            filesArray.sort(function(a, b) {
                return new Date(b.lastModified) - new Date(a.lastModified);
            });
        } else if (sortby == "name" || typeof method == "undefined") {
            // Sorting by name...
            filesArray.sort(function(a, b) {
                // toLowerCase is important
                var aname = a.name.slice(a.name.lastIndexOf("/")).toLowerCase();
                var bname = b.name.slice(b.name.lastIndexOf("/")).toLowerCase();

                if (aname < bname) {
                    return -1;
                }
                if (aname > bname) {
                    return 1;
                }
                return 0;
            })
        } else if (sortby = "size") {
            // Sorting by size...
            filesArray.sort(function(a, b) {
                a = a.size;
                b = b.size;

                return a - b;
            });
        }

        // make div element then append with lists with attributes
        var div = document.createElement("div");
        div.setAttribute("path", filesArray[i].name);
        div.setAttribute("id", count);
        count++;

        // slice it to get only file name
        var l = filesArray[i].name.lastIndexOf("/");
        var temp = filesArray[i].name.slice(l + 1);
        var loc = filesArray[i].name.split(temp)[0]
        div.innerHTML = "<p id='name'>" + temp + "</p>" + "<p id='path'>" + loc + "</p>";
        div.className = "list__item";

        // append div with a beautiful line
        var line = document.createElement("hr");
        list.appendChild(div);
        list.appendChild(line);
    }
}