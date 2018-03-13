var canvas2 = document.getElementById('c2');

// Check for canvas support
if (canvas2.getContext) {
  // Access the rendering context
  var ctx2 = canvas2.getContext('2d');

  // Default values
  var topLine = document.getElementById("topLine").value;
  var bottomLine = document.getElementById("bottomLine").value;
  var fontSize = document.getElementById("fontSize").value;
  var currentImage = new Image();
  // Once you set the src attribute image loading will start
  currentImage.src = "images/placeholder.jpg";
  var link = document.getElementById("save");
  var url = "images/placeholder.jpg";
  // href attribute
  link.href = url;
  // download attribute
  link.download = "mymeme.png";

  function redrawMeme(image, topText, bottomText) {
    // Erase any previously drawn content
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    // Draw image
    if (image != null) {

      var MAX_WIDTH = 500;
      var MAX_HEIGHT = 500;

      // Use the intrinsic size of image in CSS pixels
      var width = image.naturalWidth;
      var height = image.naturalHeight;

      console.log(width);
      console.log(height);

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

      console.log(width);
      console.log(height);

      canvas2.width = width;
      canvas2.height = height;
      ctx2.drawImage(image, 0, 0, width, height);
    }

    // Text styling
    ctx2.font = fontSize + "px Arial";
    ctx2.textAlign = 'center';
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 5;
    ctx2.fillStyle = 'white';
    
    // Draw top line
    if (topText != null) {
      ctx2.strokeText(topText, canvas2.width / 2, fontSize);
      ctx2.fillText(topText, canvas2.width / 2, fontSize);
    }

    // Draw bottom line
    if (bottomText != null) {
      ctx2.strokeText(bottomText, canvas2.width / 2, canvas2.height - fontSize / 2);
      ctx2.fillText(bottomText, canvas2.width / 2, canvas2.height - fontSize / 2);
    }

    // Create a Blob object representing the image contained in the canvas.
    // Using toBlob() is great, because instead of manipulating a base64 
    // encoded string that you get from toDataURL(), you can now you 
    // work with the encoded binary data directly.
    canvas2.toBlob(function(blob) {
      // Create a DOMString containing a URL representing the object given in the parameter
      url = URL.createObjectURL(blob);
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
    // Redraw canvas
    redrawMeme(currentImage, topLine, bottomLine);
  }

  function fileSelectHandler() {
    // Image file
    var file = this.files[0];

    // Create a new instance of FileReader
    var reader = new FileReader();

    reader.onload = function() {
      // Once you set the src attribute image loading will start
      currentImage.src = reader.result;
      // The callback will be called when the image has finished loading
      currentImage.onload = function() {
        // Redraw canvas
        redrawMeme(currentImage, topLine, bottomLine);
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
    var imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    // One-dimensional array containing the data in the RGBA order
    var data = imageData.data;
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
    for (let i = 0; i < data.length; i += 4) {
      // Averaging method: gray = (r + g + b) / 3
      let gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      // Red channel
      data[i] = gray;
      // Green channel
      data[i + 1] = gray;
      // Blue channel
      data[i + 2] = gray;
    }
    // Paint pixel data into the context
    ctx2.putImageData(imageData, 0, 0);
  }

  function sepiaFilter() {
    // ImageData object
    var imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    // One-dimensional array containing the data in the RGBA order
    var data = imageData.data;
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      // Red channel
      data[i] = (r * 0.393)+(g * 0.769)+(b * 0.189);
      // Green channel
      data[i + 1] = (r * 0.349)+(g * 0.686)+(b * 0.168);
      // Blue channel
      data[i + 2] = (r * 0.272)+(g * 0.534)+(b * 0.131);
    }
    // Paint pixel data into the context
    ctx2.putImageData(imageData, 0, 0);
  }

  function colorInvert() {
    // ImageData object
    var imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    // One-dimensional array containing the data in the RGBA order
    var data = imageData.data;
    // data represents the Uint8ClampedArray containing the data
    // in the RGBA order [r0, g0, b0, a0, r1, g1, b1, a1, ..., rn, gn, bn, an]
    for (let i = 0; i < data.length; i += 4) {
      // Red channel
      data[i] = 255 - data[i];
      // Green channel
      data[i+1] = 255 - data[i+1];
      // Blue channel
      data[i+2] = 255 - data[i+2];
    }
    // Paint pixel data into the context
    ctx2.putImageData(imageData, 0, 0);
  }

  function init() {
    // The callback will be called when the image has finished loading
    currentImage.onload = function() {
      redrawMeme(currentImage, topLine, bottomLine);
    }

    // Execute textChangeHandler() when a user writes something in the <input> field
    document.getElementById("topLine").addEventListener("input", textChangeHandler);

    // Execute textChangeHandler() when a user writes something in the <input> field
    document.getElementById("bottomLine").addEventListener("input", textChangeHandler);

    // Execute callback when a user writes something in the <input> field
    document.getElementById("fontSize").addEventListener("input", function(e) {
      fontSize = e.target.value;
      // Redraw canvas
      redrawMeme(currentImage, topLine, bottomLine);
    });

    // Execute fileSelectHandler() when the user uploads an image
    document.getElementById("image-file").addEventListener("change", fileSelectHandler, false);

    // Execute grayScale() when the user clicks the Grayscaling button
    document.getElementById("grayscale-btn").addEventListener("click", grayScale);

    // Execute sepiaFilter() when the user clicks the Sepia button
    document.getElementById("sepia-btn").addEventListener("click", sepiaFilter);

    // Execute colorInvert() when the user clicks the Invert button
    document.getElementById("invert-btn").addEventListener("click", colorInvert);
  }

  // Initialize
  init();
}