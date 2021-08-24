/*
 * Below some code is only to get a perfect file path
 */
var totalPages;
var ur = document.location.href,
    params = ur.split('?')[1].split('&'),
    data = {},
    tmp;

for (var i = 0, l = params.length; i < l; i++) {
    tmp = params[i].split('=');
    data[tmp[0]] = tmp[1];
}
var path = data.path;
var file_path = path.replace(/%20/g, " ");
/*
 * Above some code was only to get a perfect file path
 */

var sdcard = navigator.getDeviceStorage('sdcard');
var request = sdcard.getEditable(file_path);

request.onsuccess = function() {
    var file = this.result;
    const display = document.getElementById("displayInfo");
    //slicing to get only file name
    var l = file.name.lastIndexOf("/");
    var name = file.name.slice(l + 1);

    var div = document.createElement("div");

    div.innerHTML = "<div>Name </div> <p>" + name + "</p>" +
        "<div>Path </div> <p>" + file.name + "</p>" +
        "<div>Size </div> <p>" + getSize(file.size) + "</p>" +
        "<div>Last Modified Date </div> <p>" + getDate(file.lastModifiedDate) + "</p>";

    div.className = "infoBtn";
    display.appendChild(div);
}

function getSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getDate(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var month = date.getUTCMonth() + 1; //months from 1-12
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();

    return (day + " " + monthNames[month] + " " + year);
}

document.onkeydown = function(evt) {
    switch (evt.key) {
        case "Backspace":
            evt.preventDefault();
            history.back();
            break;
    }
}