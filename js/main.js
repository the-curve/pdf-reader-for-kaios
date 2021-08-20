var appExit = 0;
var adSDCard = 0;
var adError = 0;
var adReady = 0;
// $(".adHeader").hide();

    //startAD
    // var placementId_2 = "unique_ad_8";
            // VMAX.cacheAd(placementId_2);
            // console.log("Cache Ad Called...", placementId_2);
            // VMAX.onAdReady = function (placementId, adUxType) {
                // adReady=1;
                // console.log("Ad ready...", placementId);
                // console.log("Ad Ux Type..." + adUxType);
            // }

            // VMAX.onAdError = function (placementId, errorString) {
                // adError = 1;
                // console.log("oops something went wrong" + JSON.stringify(errorString));
                // console.log("Ad Error..." + placementId);
            // }
            // VMAX.onAdClose = function (placementId) {
                // if(appExit == 1)
                    // {
                        // window.close();
                        // $(".adHeader").hide();
                        // document.getElementById("full").style.display = '';
                    // }
                // else if(adSDCard == 1)
                    // {
                        // $(".adHeader").hide();
                        // document.getElementById("full").style.display = '';
                    // }
                // console.log("Ad Closed...: ", placementId);
            // }
    //closeAD
window.addEventListener("load", function() {
    console.log("Hello World!");

    document.getElementById("soft-key-right").innerHTML = 'Help';
    document.getElementById("soft-key-center").innerHTML = '';
    document.getElementById("soft-key-left").innerHTML = 'Menu';

    var sdcards = navigator.getDeviceStorages("sdcard");

    console.log("There are " + sdcards.length + " SDCards available.");

    if (sdcards.length == 2) {
        externalCard();
    }
    internalCard();
    
            
});
var screenMode;
if (window.matchMedia("(orientation: portrait)").matches) {
    screenMode = "portrait";
} else {
    screenMode = "landscape";
}

'use strict';
var help_back_scroll = 0;
var scroll = 0;
var no_of_divs_i = 0;
var no_of_divs_e = 0;
var count_i = 1;
var count_e = 1;
var nav_i = 1;
var nav_e = 1;

function internalCard() {
    var sd = navigator.getDeviceStorage('sdcard');

    var cursor = sd.enumerate();

    cursor.onsuccess = function() {

        if (cursor.result.name !== null) {
            var file = cursor.result;

            //display the file name in console
            if (file.type == 'application/pdf') {
                console.log("File found: " + file.name);
                console.log("File found: " + file.type);

                var div = document.createElement("div");
                div.setAttribute("name", file.name);
                div.setAttribute("id", count_i);
                count_i++;
                var l = file.name.lastIndexOf("/");
                var temp = file.name.slice(l + 1);
                div.innerHTML = temp;
                div.className = "myButton";
                //             div.style.display = "none";

                // test case, append the div to the body
                document.getElementById('list_i').appendChild(div);
                var line = document.createElement("hr");
                document.getElementById('list_i').appendChild(line);
            }
            this.continue();
        }
        no_of_divs_i = $('#list_i > div').length;
        console.log(no_of_divs_i);
        var delayMillis = 1000;
        setTimeout(function() {
            if (cursor.readyState != "pending") {
                if (no_of_divs_i == 0) {
                    document.getElementById('list_i').innerHTML = "<br>\ &nbsp&nbsp&nbspNo Files found";
                }
            }
        }, delayMillis);

    }
    cursor.onerror = function() {
        console.warn("No file found: " + this.error);
    }
}

function externalCard() {
    var sdcard = navigator.getDeviceStorages('sdcard');
    var sd = sdcard[1];
    var cursor = sd.enumerate();

    var cursor = sd.enumerate();

    cursor.onsuccess = function() {
        if (cursor.result.name !== null) {
            var file = cursor.result;

            //display the file name in console
            if (file.type == 'application/pdf') {
                console.log("File found: " + file.name);
                console.log("File found: " + file.type);

                var div = document.createElement("div");
                div.setAttribute("name", file.name);
                div.setAttribute("id", count_e);
                count_e++;
                var l = file.name.lastIndexOf("/");
                var temp = file.name.slice(l + 1);
                div.innerHTML = temp;
                div.className = "myButton";
                //             div.style.display = "none";

                // test case, append the div to the body
                document.getElementById('list_e').appendChild(div);
                var line = document.createElement("hr");
                document.getElementById('list_e').appendChild(line);
            }

            this.continue();
        }
        no_of_divs_e = $('#list_e > div').length;
        console.log(no_of_divs_e);
        //     $("#1").addClass("active");

    }
    cursor.onerror = function() {
        console.warn("No file found: " + this.error);
    }
}
document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.key) {
        case "Enter":
            enterKeyPressed();
            break;
        case "ArrowDown":
            downArrowPressed(evt);
            break;
        case "ArrowUp":
            upArrowPressed(evt);
            break;
        case "ArrowRight":
            rightArrowPressed();
            break;
        case "ArrowLeft":
            leftArrowPressed();
            break;
        case "SoftLeft":
            SoftLeftPressed();
            break;
        case "SoftRight":
            SoftRightPressed();
            break;
        case "Backspace":
            BackspacePressed(evt);
            break;
    }
}

function downArrowPressed(event) {
    console.log(count_i);
    event.preventDefault();
    var tabs;
    if (screenMode == "portrait") {
        tabs = 4;
    } else {
        tabs = 3;
    }

    if ($('#help_info').is(':visible')) {
        event.preventDefault();
    } else {
        //   if(nav_i<count-2)
        if ($("#internal").hasClass("active1")) {
            event.preventDefault();
            $("#list_i > #1").addClass("active");
            $("#internal").removeClass("active1");
            $("#internal").addClass("active2");
        } else if (nav_i < count_i - 1 && $("#internal").hasClass("active2")) {
            if ($("#list_i > #" + nav_i).hasClass("active")) {
                $("#list_i > #" + nav_i).removeClass("active");
                $("#list_i > #" + (nav_i + 1)).addClass("active");
                nav_i++;
                if (nav_i > tabs) {
                    scroll = window.pageYOffset + 51;
                    window.scrollTo(0, scroll);
                }
            }
        } else if ($("#external").hasClass("active1")) {
            $("#list_e > #1").addClass("active");
            $("#external").removeClass("active1");
            $("#external").addClass("active2");
        } else if (nav_e < count_e - 1 && $("#external").hasClass("active2")) {
            if ($("#list_e > #" + nav_e).hasClass("active")) {
                $("#list_e > #" + nav_e).removeClass("active");
                $("#list_e > #" + (nav_e + 1)).addClass("active");
                nav_e++;
                if (nav_e > tabs) {
                    scroll = window.pageYOffset + 51;
                    window.scrollTo(0, scroll);
                }
            }
        }
        if ($("#lists .active").length > 0) {
            document.getElementById("soft-key-center").innerHTML = '&#x25A2';
        } else {
            document.getElementById("soft-key-center").innerHTML = '';
        }
    }
}

function upArrowPressed(event) {
    console.log(count_i);
    if ($('#help_info').is(':visible')) {
        event.preventDefault();
    } else {
        event.preventDefault();
        var tabs;
        if (screenMode == "portrait") {
            tabs = 4;
        } else {
            tabs = 3;
        }
        //   if(nav>=count)
        if (nav_i == 1 && $("#internal").hasClass("active2")) {
            $("#list_i > #1").removeClass("active");
            if ($("#internal").hasClass("active2")) {
                $("#internal").addClass("active1");
                $("#internal").removeClass("active2");
            }
            if ($("#external").hasClass("active2")) {
                $("#external").addClass("active1");
                $("#external").removeClass("active2");
            }
        }
        if (nav_i > 1 && $("#internal").hasClass("active2")) {
            if ($("#list_i > #" + nav_i).hasClass("active")) {
                $("#list_i > #" + nav_i).removeClass("active");
                $("#list_i > #" + (nav_i - 1)).addClass("active");
                nav_i--;
                if (nav_i <= no_of_divs_i - tabs) {
                    scroll = window.pageYOffset - 51;
                    window.scrollTo(0, scroll);
                }
            }
        }

        if (nav_e == 1 && $("#external").hasClass("active2")) {
            $("#list_e > #1").removeClass("active");
            if ($("#external").hasClass("active2")) {
                $("#external").addClass("active1");
                $("#external").removeClass("active2");
            }
            if ($("#external").hasClass("active2")) {
                $("#external").addClass("active1");
                $("#external").removeClass("active2");
            }
        }
        if (nav_e > 1 && $("#external").hasClass("active2")) {
            if ($("#list_e > #" + nav_e).hasClass("active")) {
                $("#list_e > #" + nav_e).removeClass("active");
                $("#list_e > #" + (nav_e - 1)).addClass("active");
                nav_e--;
                if (nav_e <= no_of_divs_e - tabs) {
                    scroll = window.pageYOffset - 51;
                    window.scrollTo(0, scroll);
                }
            }
        }
        if ($("#lists .active").length > 0) {
            document.getElementById("soft-key-center").innerHTML = '&#x25A2';
        } else {
            document.getElementById("soft-key-center").innerHTML = '';
        }
    }
}

function enterKeyPressed() {
    var path = "";

    if ($('#help_info').is(':visible')) {
        event.preventDefault();
    } else {
        if ($("#internal").hasClass("active2")) {
            path = $("#list_i .active").attr('name');
            console.log(path);
        }
        if ($("#external").hasClass("active2")) {
            path = $("#list_e .active").attr('name');
            console.log(path);
        }
        if (path) {
            var url = "index.html?path=" + path;
            document.location.href = url;
        }
    }
}

function rightArrowPressed() {
    if ($('#help_info').is(':visible')) {
        event.preventDefault();
    } else {
        if ($("#internal").hasClass("active1")) {
            $("#internal").removeClass("active1");
            $("#external").addClass("active1");
            $("#list_i").hide();
            // if(adReady == 1 && adError == 0)
            // {
            // document.getElementById("full").style.display = 'none';
              // $(".adHeader").show();
              // VMAX.showAd('unique_ad_8');
            // adSDCard = 1;
            // }
            $("#list_e").show();
            if (no_of_divs_e == 0) {
                document.getElementById('list_e').innerHTML = "<br>\ &nbsp&nbsp&nbspNo Files found";
            }
        }
    }
}

function leftArrowPressed() {
    if ($('#help_info').is(':visible')) {
        event.preventDefault();
    } else {
        if ($("#external").hasClass("active1")) {
            $("#external").removeClass("active1");
            $("#internal").addClass("active1");
            $("#list_e").hide();
            $("#list_i").show();
        }
    }
}

function SoftRightPressed() {
    if ($('#full').is(':visible')) {
        help_back_scroll = window.pageYOffset;
        console.log("help_back_scroll", help_back_scroll);
        document.getElementById("soft-key-right").innerHTML = 'Back';
        $("#help_info").show();
        $("#full").hide();
    } else {
        $("#help_info").hide();
        $("#full").show();
        document.getElementById("soft-key-right").innerHTML = 'Help';
        window.scrollTo(0, help_back_scroll);
    }
}

function SoftLeftPressed() {
    window.location.href = "menu.html";
}

function BackspacePressed(event) {
    event.preventDefault();
    if ($('#help_info').is(':visible')) {
        $("#help_info").hide();
        $("#full").show();
        document.getElementById("soft-key-right").innerHTML = 'Help';
    } else {
        // localStorage.setItem("NoOfPDF",0);
        // if(adReady == 1 && adError == 0)
            // {
                // document.getElementById("full").style.display = 'none';
                // $(".adHeader").show();
                // VMAX.showAd('unique_ad_8');
                // appExit = 1;
            // }
        // else
            // {
                // window.close();
            // }
        window.close();
    }
}