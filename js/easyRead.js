/**
 * Note: PDFs are meant to display content as it was
 * Easy read works well if pdf is simple and not have too much styling(like: color, underline, boldness, etc...)
 * If PDF have any images it will not display (only texts)
 * This maybe usefull for small screens(In testing...)
 */

var lock = window.navigator.requestWakeLock('screen');
var screenMode;
var adjustment;
var screenOffOrientation = null;

if (window.matchMedia("(orientation: portrait)").matches) {
    screenMode = "portrait";
    adjustment = 0;
} else {
    screenMode = "landscape";
    adjustment = 0;
}

const passwordContainer = document.getElementById("password-container");
const passwordBox = document.getElementById("pdf-password");
const passwordMessage = document.getElementById("password-message");
const softkeys = document.getElementById("softkeys")
const easyRead = document.getElementById("easy-read")

passwordContainer.style.display = "none";
softkeys.style.display = "none";

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
console.log("File Path: " + file_path);
/*
 * Above some code was only to get a perfect file path
 */

getPDF("", file_path);

function getPDF(password, filePath) {
    var sdcard = navigator.getDeviceStorage("sdcard");
    var request = sdcard.getEditable(filePath);

    request.onsuccess = function() {
        var fileReader = new FileReader();

        fileReader.onload = function() {
            var typedarray = new Uint8Array(this.result);
            var blob = new Blob([typedarray], { "type": "application/pdf" });
            var uri = URL.createObjectURL(blob);

            pdfjsLib.getDocument({ url: uri, password: password }).promise.then(function(pdfDoc_) {
                pdfDoc = pdfDoc_;

                passwordContainer.style.display = "none";
                passwordBox.blur();
                document.getElementById("set2").style.display = "none";
                document.getElementById("loader").style.display = "none";
                softkeys.style.display = 'none';

                totalPages = pdfDoc.numPages;
                console.log("Total pages: " + totalPages);

                renderPage(pageNum);
            }).catch(function(error) {
                console.log(error.name);
                document.getElementById("set2").style.display = "none";
                document.getElementById("loader").style.display = "none";

                // If file has password
                if (error.name == 'PasswordException') {
                    passwordContainer.style.display = "";
                    passwordBox.value = "";
                    passwordBox.focus();

                    softkeys.style.display = '';
                    document.getElementById("softkey-center").innerHTML = 'OK';

                    passwordMessage.innerText = error.code == 2 ? error.message + "!" : '';
                } else {
                    alert(error.message);
                }
            })
        }
        fileReader.readAsArrayBuffer(this.result);
    }
}

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d");
var renderTask;
var initialScale;

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */

function renderPage(num) {
    if (easyRead.hasChildNodes) {
        removeAllChildNodes(easyRead);
    }
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        var unscaledViewport = page.getViewport({ scale: 1 });
        // A big formula...
        scale = Math.min((window.screen.height / unscaledViewport.height) + adjustment, (window.screen.width / unscaledViewport.width) + adjustment); // It means to fit text content on screen
        initialScale = scale;
        var viewport = page.getViewport({ scale: scale });

        // Get text from pdf 
        page.getTextContent().then(function(text) {
            console.log("Getting text of page: " + num);
            canvas.style.display = "none"; // Hide canvas if displaying text

            text.items.forEach(function(textItem) {
                var tx = pdfjsLib.Util.transform(
                    pdfjsLib.Util.transform(viewport.transform, textItem.transform), [1, 0, 0, -1, 0, 0]
                );
                var style = text.styles[textItem.fontName];

                // adjust for font ascent/descent
                var fontSize = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));

                if (style.ascent) {
                    tx[5] -= fontSize * style.ascent;
                } else if (style.descent) {
                    tx[5] -= fontSize * (1 + style.descent);
                } else {
                    tx[5] -= fontSize / 2;
                }

                // adjust for rendered width
                if (textItem.width > 0) {
                    ctx.font = tx[0] + 'px ' + style.fontFamily;

                    var width = ctx.measureText(textItem.str).width;

                    if (width > 0) {
                        //tx[0] *= (textItem.width * viewport.scale) / width;
                        tx[0] = (textItem.width * viewport.scale) / width;
                    }
                }

                var item = document.createElement("span");
                var br = document.createElement("br");
                item.textContent = textItem.str;
                item.style.fontFamily = style.fontFamily;
                item.style.fontSize = fontSize + 10 + 'px';
                item.style.transform = 'scaleX(' + tx[0] + ')';
                item.style.left = tx[4] + 'px';
                item.style.top = tx[5] + 'px';
                item.style.fontWeight = "300";

                easyRead.appendChild(item);
                easyRead.appendChild(br);
            })
        }).catch(function(error) {
            if (error.name == "RenderingCancelledException") {
                console.log("Previous rendering task cancelled!")
            } else {
                console.log(error);
            }
        });
    })
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    renderPage(pageNum);
}

/**
 * Displays next page.
 */
function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    renderPage(pageNum);
}
/**
 * 
 * This changes a page to a custom number
 */
function changePage(num) {
    if (num <= pdfDoc.numPages) {
        pageNum = num;
        renderPage(pageNum);
    } else {
        alert("Invalid Page!")
    }
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (screenMode == "portrait") {
        if (keyName == "2") {
            onPrevPage();
        }
    }
    if (screenMode == "landscape") {
        if (keyName == "e") {
            onPrevPage();
        }
    }

}, false);

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (screenMode == "portrait") {
        if (keyName == "8") {
            onNextPage();
        }
    }
    if (screenMode == "landscape") {
        if (keyName == "x") {
            onNextPage();
        }
    }

}, false);

var count = 0; // this memorises the no of times * pressed
document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    if (keyName == "1") {
        if (scale > initialScale) {
            scale = scale - 0.09;
            console.log("scale: " + scale);
            renderPage(pageNum);
        }
    }
    if (keyName == "3") {
        if (scale < 2.0) {
            scale = scale + 0.09;
            console.log("scale: " + scale);
            renderPage(pageNum);
        }
    }
    if (keyName == "Backspace") {
        event.preventDefault();

        if (screenMode == "portrait") {
            if (window.matchMedia("(orientation: landscape)").matches) {
                screen.orientation.lock('portrait');
            }
        }
        if (screenMode == "landscape") {
            if (window.matchMedia("(orientation: portrait)").matches) {
                screen.orientation.lock('landscape');
            }
        }

        history.back();
    }
    if (keyName == "5") {
        if (passwordContainer.style.display == "none") {
            if (window.matchMedia("(orientation: portrait)").matches) {
                screen.orientation.lock('landscape');
            }

            if (window.matchMedia("(orientation: landscape)").matches) {
                screen.orientation.lock('portrait');
            }
        }

    }
    if (keyName == "#") {
        if (passwordContainer.style.display == "none") {
            var page = parseInt(prompt("Enter page number"));

            // If page is not null/empty/NaN
            if (page) {
                changePage(page);
            }
        }
    }
    if (keyName == "*") {
        console.log(count)
        if (count == 0) {
            document.body.style.filter = "invert(100%) sepia(20%)"
            console.log("invert")
            count++;
        } else {
            document.body.style.filter = "invert(0) sepia(0)"
            console.log("reinvert")
            count--;
        }
    }
    if (keyName == "Enter") {
        if (passwordContainer.style.display == "") {
            var pswd = passwordBox.value;
            getPDF(pswd, file_path);
        }
    }

}, false);