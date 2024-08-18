const canvas = document.querySelector("#canvas");
canvas.width = window.innerWidth - 60;
canvas.height = 400;
let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let restore_array = [];
let index = -1;
function change_color(ele) {
  draw_color = ele.style.backgroundColor;
}
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);
let lineMode = false;
let startX, startY;
function straight_line() {
  lineMode = true;
}

function start(e) {
  is_drawing = true;
  startX = e.clientX - canvas.offsetLeft;
  startY = e.clientY - canvas.offsetTop;
  context.beginPath();
  context.moveTo(startX, startY);
  e.preventDefault();
}

function draw(e) {
  if (!is_drawing) return;

  const currentX = e.clientX - canvas.offsetLeft;
  const currentY = e.clientY - canvas.offsetTop;

  if (lineMode) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = start_background_color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (restore_array.length > 0) {
      context.putImageData(restore_array[index], 0, 0);
    }

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(currentX, currentY);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.stroke();
  } else {
    context.lineTo(currentX, currentY);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  }
  e.preventDefault();
}

function stop(e) {
  if (is_drawing) {
    if (lineMode) {
      const currentX = e.clientX - canvas.offsetLeft;
      const currentY = e.clientY - canvas.offsetTop;
      context.lineTo(currentX, currentY);
      context.stroke();
      context.closePath();
      lineMode = false;
    } else {
      context.stroke();
      context.closePath();
    }
    is_drawing = false;
    if (e.type !== "mouseout") {
      restore_array.push(
        context.getImageData(0, 0, canvas.width, canvas.height)
      );
      index += 1;
    }
  }
  e.preventDefault();
}
function clear_canvas() {
  context.fillStyle = start_background_color;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  index = -1;
}
function undo_last() {
  if (index > 0) {
    index -= 1;
    context.putImageData(restore_array[index], 0, 0);
  } else if (index === 0) {
    clear_canvas();
  }
}

function redo_last() {
  if (index < restore_array.length) {
    index += 1;
    context.putImageData(restore_array[index], 0, 0);
  }
}

function download() {
  const link = document.createElement("a");
  link.download = "canvas_drawing.png";
  link.href = canvas.toDataURL();
  link.click();
}
function eraser_last() {
  draw_color = start_background_color;
  draw_width = "10";
}
