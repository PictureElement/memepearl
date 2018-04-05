var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var topLine = "Top text";
var bottomLine = "Bottom text";
var fontSize = 50;
var brightness = 0;
var contrast = 0;
var grayscale = 0;
var sepia = 0;
var invert = 0;
var MAX_WIDTH = 600;
var MAX_HEIGHT = 600;
var url = "images/placeholder.jpg";
var image = new Image();

// Initialize canvas with placeholder image
init(url);

// Initialize canvas
function init(url) {
  image.src = url;
  image.onload = function() {
    redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
  };
}

// Initialize canvas with selected image
$("#file-input").on("change", function() {
  var file = this.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    // Update url
    url = reader.result;
    init(url);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

function textChangeHandler(e) {
  var id = e.target.id;
  var text = e.target.value;

  if (id === "topLine-input") {
    topLine = text;
  }
  else {
    bottomLine = text;
  }

  redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
}

$("#topLine-input").on("input", textChangeHandler);

$("#bottomLine-input").on("input", textChangeHandler);

$("#fontSize-input").on("input", function() {
  $("#fontSize-label").html(this.value);
  fontSize = Number(this.value);
  redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
});

$("#brightness-input").on("input", function() {
  $("#brightness-label").html(this.value);
  brightness = Number(this.value);
  redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
});

$("#contrast-input").on("input", function() {
  $("#contrast-label").html(this.value);
  contrast = Number(this.value);
  redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
});

// Grayscale button toggle state
$("#grayscale-btn").on("click", function() {
  if ( $(this).hasClass("active") ) {
    $(this).removeClass("active");
    grayscale = 0;
    redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
  }
  else {
    if (sepia === 100) {
      $("#sepia-btn").removeClass("active");
      sepia = 0;
    }
    if (invert === 100) {
      $("#invert-btn").removeClass("active");
      invert = 0;
    }
    $(this).addClass("active");
    grayscale = 100;
    redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
  }
});

// Sepia button toggle state
$("#sepia-btn").on("click", function() {
  if ( $(this).hasClass("active") ) {
    $(this).removeClass("active");
    sepia = 0;
    redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
  }
  else {
    if (grayscale === 100) {
      $("#grayscale-btn").removeClass("active");
      grayscale = 0;
    }
    if (invert === 100) {
      $("#invert-btn").removeClass("active");
      invert = 0;
    }
    $(this).addClass("active");
    sepia = 100;
    redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
  }
});

// Invert button toggle state
$("#invert-btn").on("click", function() {
  if ( $(this).hasClass("active") ) {
    $(this).removeClass("active");
    invert = 0;
    redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
  }
  else {
    if (grayscale === 100) {
      $("#grayscale-btn").removeClass("active");
      grayscale = 0;
    }
    if (sepia === 100) {
      $("#sepia-btn").removeClass("active");
      sepia = 0;
    }
    $(this).addClass("active");
    invert = 100;
    redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert);
  }
});

$("#reset-btn").on("click", function() {
  if (window.confirm("Reset changes?")) {
    
    topLine = "Top text";
    bottomLine = "Bottom text";
    fontSize = 50;
    brightness = 0;
    contrast = 0;
    grayscale = 0;
    sepia = 0;
    invert = 0;

    $("#topLine-input").val("Top text");
    $("#bottomLine-input").val("Bottom text");
    $("#fontSize-label").html(fontSize);
    $("#fontSize-input").val(fontSize);
    $("#brightness-label").html(brightness);
    $("#brightness-input").val(brightness);
    $("#contrast-label").html(contrast);
    $("#contrast-input").val(contrast);
    $("#grayscale-btn").removeClass("active");
    $("#sepia-btn").removeClass("active");
    $("#invert-btn").removeClass("active");

    // Initialize canvas with placeholder image
    init(url);
  }
});

$("#save-btn").on("click", function() {
  // Download content
  var canvas = document.getElementById("c");
  this.href = canvas.toDataURL(); // href attribute
  this.download = "mymeme.png"; // download attribute
});

// Redraw meme ('image' can be an 'ImageBitmap' or 'HTMLImageElement')
function redraw(image, topLine, bottomLine, fontSize, brightness, contrast, grayscale, sepia, invert) {
  var width = image.width;
  var height = image.height;

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

  // Erase previously drawn content
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = width;
  canvas.height = height;
  // Filter settings
  ctx.filter = 'brightness(' + (brightness + 100) + '%)' + 'contrast(' + (contrast + 100) + '%)' + 'grayscale(' + grayscale + '%)' + 'sepia(' + sepia + '%)' + 'invert(' + invert + '%)';
  // Draw image
  ctx.drawImage(image, 0, 0, width, height);
  // Disable filters (not required for text)
  ctx.filter = "none";

  // Text settings
  ctx.font = fontSize + "px Arial";
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.fillStyle = 'white';

  // Draw top & bottom text
  ctx.strokeText(topLine, canvas.width / 2, fontSize);
  ctx.fillText(topLine, canvas.width / 2, fontSize);
  ctx.strokeText(bottomLine, canvas.width / 2, canvas.height - fontSize / 2);
  ctx.fillText(bottomLine, canvas.width / 2, canvas.height - fontSize / 2);
}
