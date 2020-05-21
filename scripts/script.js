document.addEventListener('DOMContentLoaded', function () {
    // initialize select with material UI
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems);

    // array to store the user's three select input values
    let selValues = [];
    // three select inputs 
    let selectors = document.querySelectorAll('#size-selector, #complexity-selector, #style-selector');
    // input range
    let range = document.querySelector('#zoom');
    // image data from the API call
    let imageData;
    
    for (let i = 0; i < selectors.length; i++) {

        // on first load, get initial default selected values, and load the default image from the API data.
        if (selValues.length < 3) {
            selValues[i] = instances[i].getSelectedValues()[0];
            if (selValues.length === 3) {
                imageData = getImageData('https://hotsprings.io/demo/pixel-code-viewer/assignment/api/' + selValues[0] + '-' + selValues[1] + '-' + selValues[2] + '.json');
                createImage(imageData);
            } 
        }
        
        /*
            On select field change:
            a. store new value.
            b. remove existing pixels.
            c. reset the zoom input range.
            d. get the image data.
            e. start creating the new image.
        */
        selectors[i].addEventListener('change', function () {
            selValues[i] = this.value;
            removePixels();
            resetZoom();
            imageData = getImageData('https://hotsprings.io/demo/pixel-code-viewer/assignment/api/' + selValues[0] + '-' + selValues[1] + '-' + selValues[2] + '.json');
            createImage(imageData);
        })
    }

    /* Binding appropriate listener to change events on input range field */
    range.addEventListener('input', rangeListener);

    range.addEventListener('mousedown', function () {
       
        range.addEventListener('mousemove', rangeListener)
    });

    range.addEventListener("mouseup", function () {
        range.removeEventListener("mousemove", rangeListener);
    });

});

// global variables to help with the resize functionality
var rangePrev = 0;
var baseWidth, baseHeight;

function resetZoom() {
    document.querySelector('#zoom').value = 1;
    document.getElementById('zoom-value').innerHTML = '1';
}
function removePixels() {
    document.getElementById("pixel-container").innerHTML = '';
}

function getImageData(URL) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", URL, false);
    xmlHttp.send(null);
    console.log(JSON.parse(xmlHttp.responseText));
    return JSON.parse(xmlHttp.responseText);
}

function getPixelsColor(imgData) {
    let colorsArr = [];
    for (let i = 0; i < imgData.data.length; i++) {
        colorsArr[imgData.data.length - i - 1] = imgData.colorTable[imgData.data[i]];
    }
    return colorsArr;
}

function createImage(imgData) {
    let colorsArr = getPixelsColor(imgData);
    let width = imgData.width;
    let height = imgData.data.length / width;
    baseWidth = width;
    baseHeight = height;
    console.log(baseWidth)
    definePlaceholder(width, height);
    fillPixels(colorsArr, imgData.data.length);
}

function definePlaceholder(w, h) {
    document.getElementById("pixel-container").style.width = w + "px";
    document.getElementById("pixel-container").style.height = h + "px";
}

function fillPixels(colors, size) {
    var parent = document.getElementById("pixel-container");
    for (let i = 0; i < size; i++) {
        newPixel = document.createElement("div");
        newPixel.className = "newPixel";
        newPixel.style.width = "1px";
        newPixel.style.height = "1px";
        newPixel.style.backgroundColor = 'rgb('+colors[i]+')';
        parent.appendChild(newPixel);
    }
}

function rangeListener() {
    if (rangePrev != this.value && rangePrev != undefined) {
        document.getElementById("pixel-container").style.width = baseWidth * this.value + "px";
        document.getElementById("pixel-container").style.height = baseHeight * this.value + "px";
        let pixels = document.getElementsByClassName("newPixel");
        for (let i = 0; i < pixels.length; i++) {
            pixels[i].style.width = this.value + "px";
            pixels[i].style.height = this.value + "px";
        }
        document.getElementById("zoom-value").innerHTML = this.value
    } else {
        rangePrev = this.value;
    }
}
