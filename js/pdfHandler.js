var lock = window.navigator.requestWakeLock('screen');
var screenMode;
var adjustment;

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
const softkeys = document.getElementById("softkeys");
const canfix = document.getElementById("canfix");
const loader = document.getElementById("loader-container");

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
                softkeys.style.display = "none";
                loader.style.display = "none";
                canfix.style.display = "";

                totalPages = pdfDoc.numPages;
                console.log("Total pages: " + totalPages);

                renderPageForFirstTime(pageNum);
            }).catch(function(error) {
                console.log(error.name);
                loader.style.display = "none";

                // If file has password on it
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
    ctx = canvas.getContext('2d');
var renderTask;
var initialScale;

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */

function renderPageForFirstTime(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        if (renderTask) {
            renderTask.cancel();
        }
        var unscaledViewport = page.getViewport({ scale: 1 });
        // A big formula...
        scale = Math.min((window.screen.height / unscaledViewport.height) + adjustment, (window.screen.width / unscaledViewport.width) + adjustment); // It means to fit pdf on screen
        initialScale = scale;
        console.log("Changed scale: " + scale);
        var viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            ctx.font = "bold 16px Noto Sans";
            ctx.fillText(pageNum + '/' + totalPages, 10, 20);

        }).catch(function(error) {
            if (error.name == "RenderingCancelledException") {
                console.log("Previous rendering task cancelled!")
            } else {
                console.log(error);
            }
        });
    })
}

function renderPage(num) {
    pageRendering = true;

    pdfDoc.getPage(num).then(function(page) {
        if (renderTask) {
            renderTask.cancel();
        }
        var viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            ctx.font = "bold 16px Noto Sans";
            ctx.fillText(pageNum + '/' + totalPages, 10, 20);
        }).catch(function(error) {
            if (error.name == "RenderingCancelledException") {
                console.log("Previous rendering task cancelled!")
            } else {
                console.log(error);
            }
        });
    });
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
 * Changes a page to a given number
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
    if (keyName == "2") {
        onPrevPage();
    }
}, false);

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName == "8") {
        onNextPage();
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

        if (window.matchMedia("(orientation: landscape)").matches) {
            screen.orientation.lock('portrait');
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
            canvas.classList.toggle("dark"); //Slow :(
            count++;
        } else {
            canvas.classList.remove("dark");
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