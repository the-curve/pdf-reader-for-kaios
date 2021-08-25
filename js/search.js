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

        default:
            break;
    }
})

function searchIt(word) {
    var input,
        filter,
        list,
        div,
        td,
        i,
        txtValue;
    //input = document.getElementById("myInput");
    filter = word.toUpperCase();
    list = document.getElementById("list");
    div = list.getElementsByTagName("div");

    for (i = 0; i < div.length; i++) {
        //td = div[i].getElementsByTagName("td")[0];
        if (div) {
            txtValue = div.innerHTML;
            console.log(txtValue, div.textContent);
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              div[i].style.display = "";
            } else {
              div[i].style.display = "none";
            }
        }
    }
}
