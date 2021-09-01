const searchBox = document.getElementById("searchBox");
var searching = false;
var index = [];

document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    if (keyName == "Enter") {
        if (searchBox.value != "") {
            searchIt(searchBox.value);
        }
    } else if (keyName == "SoftRight") {
        if(searchBox.matches(":focus")){
            searchIt("");
            searchBox.value = "";
            searching = false;
            document.getElementById("softkey-right").innerHTML = '';
        }
    }
})

function searchIt(input) {
    var filter = input.toUpperCase();
    var list = document.getElementById("list");
    var div = list.getElementsByTagName("div");
    var hr = list.getElementsByTagName("hr");
    index = [];

    document.getElementById("softkey-right").innerHTML = 'Clear';
    searching = true;

    for (var i = 0; i < div.length; i++) {
        var textVal = div[i].textContent;

        div[i].style.display = "none";
        hr[i].style.display = "none";

        if (textVal.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
            hr[i].style.display = "";
            index.push(div[i]);
        }
    }
    console.log(index)
}