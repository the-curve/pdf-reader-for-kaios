const searchBox = document.getElementById("searchBox");

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    switch (keyName) {
        case "Enter":
            if (searchBox.matches(":focus")) {
                if (searchBox.value != "") {
                    searchIt(searchBox.value);
                }
            }
            break;
        case "SoftRight":
            if (searchBox.matches(":focus")) {
                searchBox.value = "";
                searchIt("");
                document.getElementById("softkey-right").innerHTML = '';
            }
            break;
    }
})

function searchIt(input) {
    document.getElementById("softkey-right").innerHTML = 'Clear';
    var filter = input.toUpperCase();
    var list = document.getElementById("list");
    var div = list.getElementsByTagName("div");
    var hr = list.getElementsByTagName("hr");

    console.log("--------Found Items----------")
    for (var i = 0; i < div.length; i++) {
        var textVal = div[i].textContent;

        div[i].style.display = "none";
        hr[i].style.display = "none";

        if (textVal.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
            hr[i].style.display = "";
            console.log(div[i].innerHTML)
        }
    }
}