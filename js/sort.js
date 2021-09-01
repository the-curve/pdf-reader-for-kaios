var method = "";
var url = "index.html?method=" + method;
document.onkeydown = function (evt) {
    switch (evt.key) {
        case "1":
            method = "name"
            go();
            break;
        case "2":
            method = "size"
            go();
            break;
        case "3":
            method = "date"
            go();
            break;
        case "Backspace":
            evt.preventDefault();
            history.back();
            break;
    }
}

function go(){
    var url = "index.html?method=" + method;
    document.location.href = url;
}
