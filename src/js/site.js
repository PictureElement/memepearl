var canvas = document.getElementById('c');

//--------------------------------- FUNCTIONS ----------------------------------

function clearCanvas() {
  // Erase any previously drawn content
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// image can be an 'ImageBitmap' or 'HTMLImageElement'
function redrawMeme(image, topText, bottomText) {

  // Draw image
  if (image != null) {

    var MAX_WIDTH = 500;
    var MAX_HEIGHT = 500;

    var width = image.width;
    var height = image.height;

    //console.log(width);
    //console.log(height);

    // Resize image
    if (width > height) {
      if (width > MAX_WIDTH) {
        height = height * MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    }
    else {
      if (height > MAX_HEIGHT) {
        width = width * MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    //console.log(width);
    //console.log(height);

    canvas.width = width;
    canvas.height = height;

    // Set image brightness and contrast
    ctx.filter = 'brightness(' + (brightness + 100) + '%)' + 'contrast(' + (contrast + 100) + '%)';

    // Draw image onto the canvas.
    // Source can be CSSImageValue, an HTMLImageElement, an SVGImageElement,
    // an HTMLVideoElement, an HTMLCanvasElement, an ImageBitmap, or an
    // OffscreenCanvas.
    ctx.drawImage(image, 0, 0, width, height);

    // Disable brightness (not required for text)
    ctx.filter = "none";
  }

  // Text styling
  ctx.font = fontSize + "px Arial";
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.fillStyle = 'white';

  // Draw top line
  if (topText != null) {
    ctx.strokeText(topText, canvas.width / 2, fontSize);
    ctx.fillText(topText, canvas.width / 2, fontSize);
  }

  // Draw bottom line
  if (bottomText != null) {
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - fontSize / 2);
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - fontSize / 2);
  }

  // Create a Blob object representing the image contained in the canvas.
  // Using toBlob() is great, because instead of manipulating a base64
  // encoded string that you get from toDataURL(), you can now you
  // work with the encoded binary data directly.
  canvas.toBlob(function(blob) {
    // Create a DOMString containing a URL representing the object given in the parameter
    url = window.URL.createObjectURL(blob);
    // Update href attribute
    link.href = url;
  });
  // Release the object URL which was previously created with URL.createObjectURL()
  URL.revokeObjectURL(url);
}

function textChangeHandler(e) {
  var id = e.target.id;
  var text = e.target.value;
  if (id == "topLine-input") {
    topLine = text;
  }
  else {
    bottomLine = text;
  }
  clearCanvas();
  // Redraw canvas
  redrawMeme(alteredImageBitmap, topLine, bottomLine);
}

function fileSelectHandler() {
  // Image file
  var file = this.files[0];

  // Create a new instance of FileReader
  var reader = new FileReader();

  reader.onload = function() {
    // Once you set the src attribute image loading will start
    unalteredImage.src = reader.result;

    // The callback will be called when the image has finished loading
    unalteredImage.onload = function() {
      // Reset Bitmap on file selection
      createImageBitmap(unalteredImage).then(function(imgBitmap) {
        alteredImageBitmap = imgBitmap;
      });
      clearCanvas();
      // Redraw canvas
      redrawMeme(unalteredImage, topLine, bottomLine);
    };
  };

  if (file) {
    // Read the contents of the Blob or File and produce a data URL
    // representing the file's data as a base64 encoded string.
    reader.readAsDataURL(file);
  }
}

function grayScale() {
  // ImageData object
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Save image state before applying the filter
  createImageBitmap(imageData).then(function(imgBitmap) {
    alteredImageBitmap = imgBitmap;
  });

  // One-dimensional array containing the data in the RGBA order
  var data = imageData.data;
  // data represents the Uint8ClampedArray containing the data
  // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
  for (var i = 0; i < data.length; i += 4) {

    // Averaging method: gray = (r + g + b) / 3
    // var gray = (data[i] + data[i + 1] + data[i + 2]) / 3;

    // Luma method (Photoshop/Gimp): gray = r * 0.3 + g * 0.59 + b * 0.11
    // var gray = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11);

    // Luma method (ITU-R BT.709): gray = r * 0.2126 + g * 0.7152 + b * 0.0722
    var gray = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722);

    // Luma method (ITU-R BT.2100): gray = r * 0.2627 + g * 0.6780 + b * 0.0593
    // var gray = (data[i] * 0.2627 + data[i + 1] * 0.6780 + data[i + 2] * 0.0593);

    // Red channel
    data[i] = gray;
    // Green channel
    data[i + 1] = gray;
    // Blue channel
    data[i + 2] = gray;
  }

  // Create an ImageBitmap containing bitmap data from the given image source.
  // The image source can be <img>, SVG <image>, <video>, <canvas>,
  // HTMLImageElement, SVGImageElement, HTMLVideoElement, HTMLCanvasElement,
  // Blob, ImageData, ImageBitmap, or OffscreenCanvas object.
  createImageBitmap(imageData).then(function(imgBitmap) {
    clearCanvas();
    // Redraw canvas
    redrawMeme(imgBitmap, topLine, bottomLine);
  });
}

function sepiaFilter() {
  // ImageData object
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Save image state before applying the filter
  createImageBitmap(imageData).then(function(imgBitmap) {
    alteredImageBitmap = imgBitmap;
  });

  // One-dimensional array containing the data in the RGBA order
  var data = imageData.data;
  // data represents the Uint8ClampedArray containing the data
  // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];
    // Red channel
    data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
    // Green channel
    data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
    // Blue channel
    data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
  }

  // Create an ImageBitmap containing bitmap data from the given image source.
  // The image source can be <img>, SVG <image>, <video>, <canvas>,
  // HTMLImageElement, SVGImageElement, HTMLVideoElement, HTMLCanvasElement,
  // Blob, ImageData, ImageBitmap, or OffscreenCanvas object.
  createImageBitmap(imageData).then(function(imgBitmap) {
    clearCanvas();
    // Redraw canvas
    redrawMeme(imgBitmap, topLine, bottomLine);
  });
}

function colorInvert() {
  // ImageData object
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Save image state before applying the filter
  createImageBitmap(imageData).then(function(imgBitmap) {
    alteredImageBitmap = imgBitmap;
  });

  // One-dimensional array containing the data in the RGBA order
  var data = imageData.data;
  // data represents the Uint8ClampedArray containing the data
  // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
  for (var i = 0; i < data.length; i += 4) {
    // Red channel
    data[i] = 255 - data[i];
    // Green channel
    data[i + 1] = 255 - data[i + 1];
    // Blue channel
    data[i + 2] = 255 - data[i + 2];
  }

  // Create an ImageBitmap containing bitmap data from the given image source.
  // The image source can be <img>, SVG <image>, <video>, <canvas>,
  // HTMLImageElement, SVGImageElement, HTMLVideoElement, HTMLCanvasElement,
  // Blob, ImageData, ImageBitmap, or OffscreenCanvas object.
  createImageBitmap(imageData).then(function(imgBitmap) {
    clearCanvas();
    // Redraw canvas
    redrawMeme(imgBitmap, topLine, bottomLine);
  });
}

function setFontSize() {
  // Dynamic range slider to display the current value
  fontSizeLabel.innerHTML = this.value;

  // Update font size
  fontSize = Number(this.value);

  clearCanvas();
  // Redraw canvas
  redrawMeme(alteredImageBitmap, topLine, bottomLine);
}

function setBrightness() {
  // Dynamic range slider to display the current value
  brightnessLabel.innerHTML = this.value;

  // Update brightness value
  brightness = Number(this.value);

  clearCanvas();
  // Redraw canvas
  redrawMeme(alteredImageBitmap, topLine, bottomLine);
}

function setContrast() {
  // Dynamic range slider to display the current value
  contrastLabel.innerHTML = this.value;

  // Update contrast value
  contrast = Number(this.value);

  clearCanvas();
  // Redraw canvas
  redrawMeme(alteredImageBitmap, topLine, bottomLine);
}

function reset() {
  if (window.confirm("Reset changes?")) {
    // Reset brightness
    brightnessLabel.innerHTML = "0";
    brightnessSlider.value = "0";
    brightness = 0;

    // Reset contrast
    contrastLabel.innerHTML = "0";
    contrastSlider.value = "0";
    contrast = 0;

    // Reset font size
    fontSizeLabel.innerHTML = "50";
    fontSizeSlider.value = "50";
    fontSize = 50;

    clearCanvas();
    redrawMeme(unalteredImage, topLine, bottomLine);
  }
}

function init() {
  // The callback will be called when the image has finished loading
  unalteredImage.onload = function() {

    // Bitmap of the initial unaltered image
    createImageBitmap(unalteredImage).then(function(imgBitmap) {
      alteredImageBitmap = imgBitmap;
    });

    clearCanvas();
    redrawMeme(unalteredImage, topLine, bottomLine);
  };

  // Execute textChangeHandler() when the value of the specified <input> element is changed.
  document.getElementById("topLine-input").addEventListener("input", textChangeHandler);

  // Execute textChangeHandler() when the value of the specified <input> element is changed.
  document.getElementById("bottomLine-input").addEventListener("input", textChangeHandler);

  // Execute setFontSize() when the value of the specified <input> element is changed.
  document.getElementById("fontSize-input").addEventListener("input", setFontSize);

  // Execute setBrightness() when the value of the specified <input> element is changed.
  document.getElementById("brightness-input").addEventListener("input", setBrightness);

  // Execute setContrast() when the value of the specified <input> element is changed.
  document.getElementById("contrast-input").addEventListener("input", setContrast);

  // Execute fileSelectHandler() when a change to the specified <input> value is committed by the user.
  document.getElementById("file-input").addEventListener("change", fileSelectHandler, false);

  // Execute grayScale() when a pointing device button is pressed and released on the specified element.
  document.getElementById("grayscale-btn").addEventListener("click", grayScale);

  // Execute sepiaFilter() when a pointing device button is pressed and released on the specified element.
  document.getElementById("sepia-btn").addEventListener("click", sepiaFilter);

  // Execute colorInvert() when a pointing device button is pressed and released on the specified element.
  document.getElementById("invert-btn").addEventListener("click", colorInvert);

  // Execute reset() when a pointing device button is pressed and released on the specified element.
  document.getElementById("reset-btn").addEventListener("click", reset);
}

//------------------------------------ MAIN ------------------------------------

// Check for canvas support
if (canvas.getContext) {
  var ctx = canvas.getContext('2d'); // Access the rendering context

  // Defaults
  var topLine = "";
  var bottomLine = "";
  var unalteredImage = new Image();
  unalteredImage.src = "images/placeholder.jpg"; // Once you set the src attribute image loading will start
  var alteredImageBitmap;
  var link = document.getElementById("save");
  var url = "images/placeholder.jpg";
  link.href = url; // href attribute
  link.download = "mymeme.png"; // download attribute

  document.getElementById("grayscale-btn").value = "0";
  document.getElementById("sepia-btn").value = "0";
  document.getElementById("invert-btn").value = "0";

  var fontSizeLabel = document.getElementById("fontSize-label");
  var fontSizeSlider = document.getElementById("fontSize-input");
  fontSizeLabel.innerHTML = "50";
  fontSizeSlider.value = "50";
  var fontSize = 50;

  var brightnessLabel = document.getElementById("brightness-label");
  var brightnessSlider = document.getElementById("brightness-input");
  brightnessLabel.innerHTML = "0";
  brightnessSlider.value = "0";
  var brightness = 0;

  var contrastLabel = document.getElementById("contrast-label");
  var contrastSlider = document.getElementById("contrast-input");
  contrastLabel.innerHTML = "0";
  contrastSlider.value = "0";
  var contrast = 0;

  // Initialize
  init();
}
