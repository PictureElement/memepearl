var canvas = document.getElementById('c');

// Check for canvas support
if (canvas.getContext) {
  // Access the rendering context
  var context = canvas.getContext('2d');

  // Default values
  var topLine = document.getElementById("topLine").value;
  var bottomLine = document.getElementById("bottomLine").value;
  var fontSize = document.getElementById("fontSize").value;
  var currentImage = new Image();
  currentImage.src = "images/placeholder.jpg";
  var link = document.getElementById("save");
  var url = "images/placeholder.jpg";
  // href attribute
  link.href = url;
  // download attribute
  link.download = "mymeme.png";

  function redrawMeme (image, topText, bottomText) {
    // Erase any previously drawn content
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    if (image != null) {
      // Use the intrinsic size of image in CSS pixels
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
    }

    // Text styling
    context.font = fontSize + "px Arial";
    context.textAlign = 'center';
    context.strokeStyle = 'black';
    context.lineWidth = 4;
    context.fillStyle = 'white';
    
    // Draw top line
    if (topText != null) {
      context.strokeText(topText, canvas.width / 2, fontSize);
      context.fillText(topText, canvas.width / 2, fontSize);
    }

    // Draw bottom line
    if (bottomText != null) {
      context.strokeText(bottomText, canvas.width / 2, canvas.height - fontSize / 2);
      context.fillText(bottomText, canvas.width / 2, canvas.height - fontSize / 2);
    }

    // Create a Blob object representing the image contained in the canvas.
    // Using toBlob() is great, because instead of manipulating a base64 
    // encoded string that you get from toDataURL(), you can now you 
    // work with the encoded binary data directly.
    canvas.toBlob(function(blob) {
      // Create a DOMString containing a URL representing the object given in the parameter
      url = URL.createObjectURL(blob);
      // Update href attribute
      link.href = url;
    });
    // Release the object URL which was previously created with URL.createObjectURL()
    URL.revokeObjectURL(url);
  }

  function textChangeHandler (e) {
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

  function fileSelectHandler () {
    // Image file
    var file = this.files[0];

    // Create a new instance of FileReader
    var reader = new FileReader();

    reader.onload = function () {
      // Set the src property for the current image
      currentImage.src = reader.result;
      // Redraw canvas
      redrawMeme(currentImage, topLine, bottomLine);
    }

    if (file) {
      // Read the contents of the Blob or File and produce a data URL 
      // representing the file's data as a base64 encoded string.
      reader.readAsDataURL(file); 
    }
  }

  function init () {
    // The callback will be called when the image has finished loading
    currentImage.onload = function() {
      redrawMeme(currentImage, topLine, bottomLine);
    }

    // Execute textChangeHandler() when a user writes something in the <input> field
    document.getElementById("topLine").addEventListener("input", textChangeHandler);

    // Execute textChangeHandler() when a user writes something in the <input> field
    document.getElementById("bottomLine").addEventListener("input", textChangeHandler);

    // Execute callback when a user writes something in the <input> field
    document.getElementById("fontSize").addEventListener("input", function (e) {
      fontSize = e.target.value;
      // Redraw canvas
      redrawMeme(currentImage, topLine, bottomLine);
    });

    // Execute fileSelectHandler() when the user uploads an image
    document.getElementById("image-file").addEventListener('change', fileSelectHandler, false);
  }

  // Initialize
  init();
}