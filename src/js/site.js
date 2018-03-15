var canvas = document.getElementById('c');

// Check for canvas support
if (canvas.getContext) {
  // Access the rendering context
  var ctx = canvas.getContext('2d');

  // Default values
  var topLine = "";
  var bottomLine = "";
  var fontSize = 50;
  var brightnessAdjustmentValue = 0;
  var image = new Image();
  // Once you set the src attribute image loading will start
  image.src = "images/placeholder.jpg";
  var link = document.getElementById("save");
  var url = "images/placeholder.jpg";
  // href attribute
  link.href = url;
  // download attribute
  link.download = "mymeme.png";

  function clearCanvas() {
    // Erase any previously drawn content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

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

      // Set image brightness
      ctx.filter = `brightness(${brightnessAdjustmentValue + 100}%)`;
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
    if (id == "topLine") {
      topLine = text;
    }
    else {
      bottomLine = text;
    }
    clearCanvas();
    // Redraw canvas
    redrawMeme(image, topLine, bottomLine);
  }

  function fileSelectHandler() {
    // Image file
    var file = this.files[0];

    // Create a new instance of FileReader
    var reader = new FileReader();

    reader.onload = function() {
      // Once you set the src attribute image loading will start
      image.src = reader.result;
      // The callback will be called when the image has finished loading
      image.onload = function() {
        clearCanvas();
        // Redraw canvas
        redrawMeme(image, topLine, bottomLine);
      }
    }

    if (file) {
      // Read the contents of the Blob or File and produce a data URL
      // representing the file's data as a base64 encoded string.
      reader.readAsDataURL(file);
    }
  }

  function grayScale() {
    // ImageData object
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // One-dimensional array containing the data in the RGBA order
    var data = imageData.data;
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
    for (let i = 0; i < data.length; i += 4) {

      // Averaging method: gray = (r + g + b) / 3
      // let gray = (data[i] + data[i + 1] + data[i + 2]) / 3;

      // Luma method (Photoshop/Gimp): gray = r * 0.3 + g * 0.59 + b * 0.11
      // let gray = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11);

      // Luma method (ITU-R BT.709): gray = r * 0.2126 + g * 0.7152 + b * 0.0722
      let gray = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722);

      // Luma method (ITU-R BT.2100): gray = r * 0.2627 + g * 0.6780 + b * 0.0593
      // let gray = (data[i] * 0.2627 + data[i + 1] * 0.6780 + data[i + 2] * 0.0593);

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
    // One-dimensional array containing the data in the RGBA order
    var data = imageData.data;
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
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
    // One-dimensional array containing the data in the RGBA order
    var data = imageData.data;
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
    for (let i = 0; i < data.length; i += 4) {
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

  var fontSizeSliderValue = document.getElementById("font-value");

  function setFontSize(e) {
    // Dynamic range slider to display the current value
    fontSizeSliderValue.innerHTML = this.value;

    fontSize = e.target.value;
    clearCanvas();
    // Redraw canvas
    redrawMeme(image, topLine, bottomLine);
  }

  var brightnessSliderValue = document.getElementById("brightness-value");

  function setBrightness(e) {
    // Dynamic range slider to display the current value
    brightnessSliderValue.innerHTML = this.value;

    // Update brightness value
    brightnessAdjustmentValue = Number(this.value);

    clearCanvas();
    // Redraw canvas
    redrawMeme(image, topLine, bottomLine);
  }

  function reset() {
    if (window.confirm("Reset changes?")) {
      clearCanvas();
      redrawMeme(image, topLine, bottomLine);
    }
  }

  function init() {
    // The callback will be called when the image has finished loading
    image.onload = function() {
      clearCanvas();
      redrawMeme(image, topLine, bottomLine);
    }

    // Execute textChangeHandler() when the user writes something in the <input> field
    document.getElementById("topLine").addEventListener("input", textChangeHandler);

    // Execute textChangeHandler() when the user writes something in the <input> field
    document.getElementById("bottomLine").addEventListener("input", textChangeHandler);

    // Execute callback when the user writes something in the <input> field
    document.getElementById("fontSize").addEventListener("input", setFontSize);

    // Execute callback when the user writes something in the <input> field
    document.getElementById("brightness").addEventListener("input", setBrightness);

    // Execute fileSelectHandler() when the user uploads an image
    document.getElementById("image-file").addEventListener("change", fileSelectHandler, false);

    // Execute grayScale() when the user clicks the Grayscaling button
    document.getElementById("grayscale-btn").addEventListener("click", grayScale);

    // Execute sepiaFilter() when the user clicks the Sepia button
    document.getElementById("sepia-btn").addEventListener("click", sepiaFilter);

    // Execute colorInvert() when the user clicks the Invert button
    document.getElementById("invert-btn").addEventListener("click", colorInvert);

    // Execute reset() when the user clicks the Reset button
    document.getElementById("reset-btn").addEventListener("click", reset);
  }

  // Initialize
  init();
}
