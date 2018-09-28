/* global performance */
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const getTime = typeof performance === 'function' ? performance.now : Date.now;
const FRAME_DURATION = 1000 / 58;
let then = getTime();
let acc = 0;

let flake = {
  color: '#FFFFFF',
  lines: 6,
  lineCap: 'round',
  highestDepth: 0.05,
  highestLength: 6,
  highestLineWidth: 2.5,
  highestRotation: 2,
  highestSpeedX: 1,
  highestSpeedY: 4,
  lowestDepth: -0.05,
  lowestLength: 4,
  lowestLineWidth: 1.5,
  lowestRotation: 1,
  lowestSpeedX: -1,
  lowestSpeedY: 2,
  probability: 0.2,
  sideProbability: 0.1
};

let flakes = [];

draw();
window.addEventListener('resize', resizeHandler);

function draw () {
  let now = getTime();
  let ms = now - then;
  let frames = 0;
  then = now;
  if (ms < 1000) {
    acc += ms;
    while (acc >= FRAME_DURATION) {
      frames++;
      acc -= FRAME_DURATION;
    }
  } else {
    ms = 0;
  }
  ctx.lineCap = flake.lineCap;
  ctx.strokeStyle = flake.color;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let f of flakes) {
    drawFlake(f);
  }
  createFlakes();
  removeFlakes(frames);
  window.requestAnimationFrame(draw);
}

function drawFlake (f) {
  ctx.lineWidth = f.lineWidth;
  for (let i = 0; i < flake.lines / 2; i++) {
    let angle = f.angle * Math.PI / 180 + i * 2 * Math.PI / flake.lines;
    let x = f.length * Math.cos(angle);
    let y = f.length * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(f.x - x, f.y - y);
    ctx.lineTo(f.x + x, f.y + y);
    ctx.stroke();
    ctx.closePath();
  }
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
      angle: 0,
      depth: flake.lowestDepth + Math.random() * (flake.highestDepth - flake.lowestDepth),
      length,
      lineWidth: flake.lowestLineWidth + Math.random() * (flake.highestLineWidth - flake.lowestLineWidth),
      rotation: flake.lowestRotation + Math.random() * (flake.highestRotation - flake.lowestRotation),
      speedX,
      speedY: flake.lowestSpeedY + Math.random() * (flake.highestSpeedY - flake.lowestSpeedY)
    });
  }
}

function removeFlakes (frames) {
  for (let i = flakes.length - 1; i >= 0; i--) {
    let f = flakes[i];
    if (f.length < 0 || f.x + f.length < 0 || f.x - f.length > canvas.width || f.y - f.length > canvas.height) {
      flakes.splice(i, 1);
    } else {
      f.x += f.speedX * frames;
      f.y += f.speedY * frames;
      f.length += f.depth * frames;
      f.angle += f.rotation * frames;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
