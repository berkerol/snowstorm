let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let flake = {
  color: '#FFFFFF',
  lines: 4,
  lineCap: 'round',
  highestDepth: 0.05,
  highestLength: 8,
  highestLineWidth: 2.5,
  highestSpeedX: 1,
  highestSpeedY: 4,
  lowestDepth: -0.05,
  lowestLength: 4,
  lowestLineWidth: 1.5,
  lowestSpeedX: -1,
  lowestSpeedY: 2,
  probability: 0.2,
  sideProbability: 0.1
};

let flakes = [];

draw();
window.addEventListener('resize', resizeHandler);

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = flake.color;
  ctx.lineCap = flake.lineCap;
  for (let f of flakes) {
    drawFlake(f);
  }
  createFlakes();
  removeFlakes();
  window.requestAnimationFrame(draw);
}

function drawFlake (f) {
  ctx.lineWidth = f.lineWidth;
  ctx.save();
  ctx.translate(f.x, f.y);
  for (let i = 0; i < flake.lines * 2; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(f.length, 0);
    ctx.stroke();
    ctx.closePath();
    ctx.rotate(Math.PI / flake.lines);
  }
  ctx.restore();
}

function createFlakes () {
  if (Math.random() < flake.probability) {
    let length = flake.lowestLength + Math.random() * (flake.highestLength - flake.lowestLength);
    let speedX = flake.lowestSpeedX + Math.random() * (flake.highestSpeedX - flake.lowestSpeedX);
    let x;
    let y;
    if (Math.random() < flake.sideProbability) {
      if (Math.random() < 0.5) {
        x = -length;
        if (speedX < 0) {
          speedX = -speedX;
        }
      } else {
        x = canvas.width + length;
        if (speedX > 0) {
          speedX = -speedX;
        }
      }
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = -length;
    }
    flakes.push({
      x,
      y,
      depth: flake.lowestDepth + Math.random() * (flake.highestDepth - flake.lowestDepth),
      length,
      lineWidth: flake.lowestLineWidth + Math.random() * (flake.highestLineWidth - flake.lowestLineWidth),
      speedX,
      speedY: flake.lowestSpeedY + Math.random() * (flake.highestSpeedY - flake.lowestSpeedY)
    });
  }
}

function removeFlakes () {
  for (let i = 0; i < flakes.length; i++) {
    let f = flakes[i];
    if (f.length < 0 || f.x + f.length < 0 || f.x - f.length > canvas.width || f.y - f.length > canvas.height) {
      flakes.splice(i, 1);
    } else {
      f.x += f.speedX;
      f.y += f.speedY;
      f.length += f.depth;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
