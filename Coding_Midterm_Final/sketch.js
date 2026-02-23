// Cell Gallery – Pixel Microscopy Lab

// =======================================================
// M1: Amoebas
// M2: Cocci
// M3: Filament Cells
// M4: Large eukaryotic cell
// =======================================================

const W = 1440;  // Canvas width
const H = 900;   // Canvas height
const PIX = 4;   // Pixel size

// Center positions of dishes (compact 2×2 layout) ----

const C1 = { x: 480, y: 300 };   // Amoebas
const C2 = { x: 960, y: 300 };   // Cocci
const C3 = { x: 480, y: 680 };   // Filament cells
const C4 = { x: 960, y: 680 };   // A large eukaryotic cell

function setup() {
  createCanvas(W, H);
  noStroke();
  frameRate(60);          // 60 FPS

  initDish1();  // Initialize Microscope Perspective 1
  initDish2();  // Initialize Microscope Perspective 2
  initDish3();  // Initialize Microscope Perspective 3
  initDish4();  // Initialize Microscope Perspective 4
}

// Click to toggle fullscreen

function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs);
}

function draw() {
  background(15);
  drawDish1();      // Draw M1
  drawDish2();      // Draw M2
  drawDish3();      // Draw M3
  drawDish4();      // Draw M4
}

// ------------------------------------------------------------
// Utility helpers 
// ❗️❗️❗️ **Using ChatGPT 5.0 to snap to pixel grid**❗️❗️❗️
// ------------------------------------------------------------

function pix(v) { return floor(v / PIX) * PIX; } 


// ============================================================
// M1 — Amoebas
// ============================================================

let walkers = [];

function initDish1() {
  walkers = [];
  for (let i = 0; i < 25; i++) {
    walkers.push({
      x: pix(C1.x + random(-60, 60)),  // random starting pos
      y: pix(C1.y + random(-60, 60)),
      path: [],                       // path history
      col: color(230, 255, 120, 180)  // color
    });
  }
}

function drawDish1() {
  let R = 150 - PIX * 2;  // dish radius
  drawPixelDish(C1.x, C1.y, 150);  // draw pixel dish

  for (let w of walkers) {
    let dir = floor(random(4));  // random direction
    if (dir === 0) w.x += PIX;
    if (dir === 1) w.x -= PIX;
    if (dir === 2) w.y += PIX;
    if (dir === 3) w.y -= PIX;

    // Keep inside dish
    
    if (dist(w.x, w.y, C1.x, C1.y) > R) {
      w.x = pix(C1.x);
      w.y = pix(C1.y);
    }

    // store trail
    
    w.path.unshift({ x: w.x, y: w.y });
    if (w.path.length > 200) w.path.pop();

    // draw trail
    
    for (let i = 0; i < w.path.length; i++) {
      let p = w.path[i];
      let a = map(i, 0, w.path.length, 255, 30); //fading
      fill(180, 255, 120, a);
      rect(p.x, p.y, PIX, PIX);
    }
  }
}

// ============================================================
// M2 — Cocci
// ============================================================

let fungi2 = [];
const SAFE2 = 24; // Inner safe area

function initDish2() {
  fungi2 = [];
  let R = 150 - PIX * 2 - SAFE2;  // max radius

  for (let i = 0; i < 20; i++) {
    let ang = random(TWO_PI);   // random angle
    let r = random(0, R);       // random radius
    let x = pix(C2.x + cos(ang) * r);
    let y = pix(C2.y + sin(ang) * r);

    fungi2.push({
      x, y,
      baseSize: floor(random(6, 14)) * PIX,  // base size
      layers: [
        color(255, 80, 120), // pink
        color(140, 40, 255), // purple
        color(60, 200, 255)  // blue
      ],
      
// ------------------------------------------------------------
// Offset 
// ❗️❗️❗️ **Using ChatGPT 5.0 to make breathing phase offset**❗️❗️❗️
// ------------------------------------------------------------
      
      offset: random(1000)
    });
  }
}

function drawDish2() {
  let R = 150 - PIX * 2 - SAFE2;
  drawPixelDish(C2.x, C2.y, 150); // dish

  for (let f of fungi2) {
    let step = f.baseSize / f.layers.length; // layer step

// ------------------------------------------------------------
// Offset 
// ❗️❗️❗️ **Using ChatGPT 5.0 to make breathing phase offset**❗️❗️❗️
// ------------------------------------------------------------
    
    for (let i = 0; i < f.layers.length; i++) {
      let scaleOffset = sin(frameCount * 0.02 + f.offset + i) * 2; // breathing
      let d = f.baseSize - i * step + scaleOffset;

      if (d / 2 > R) d = R * 2;

      fill(f.layers[i]);
      drawPixelCircle(f.x, f.y, d, R);  // draw pixel circle
    }
  }
}

// ============================================================
// M3 — Filament Cells
// ============================================================

let dish3Cells = [];

function initDish3() {
  dish3Cells = [];
  let d = { cx: C3.x, cy: C3.y, R: 150 - PIX * 2 }; // center + radius

  for (let i = 0; i < 40; i++) {
    let ang = random(TWO_PI);
    let r = random(d.R * 0.15, d.R * 0.85);

    let fx = pix(d.cx + cos(ang) * r);
    let fy = pix(d.cy + sin(ang) * r);

    dish3Cells.push(makeOrangeRedCells(fx, fy, d));
  }
}

// Generate filament branches

function makeOrangeRedCells(x, y, d) {
  let branches = [];
  let branchCount = int(random(4, 7)); // branch count

  for (let b = 0; b < branchCount; b++) {
    let pts = [];
    let steps = int(random(25, 60)); // steps
    let angle = random(TWO_PI);

    let px = x, py = y;
    for (let s = 0; s < steps; s++) {
      px += cos(angle) * PIX;
      py += sin(angle) * PIX;
      angle += random(-0.35, 0.35); // wiggle

      if (dist(px, py, d.cx, d.cy) > d.R) break;
      pts.push({ x: px, y: py });
    }
    branches.push(pts);
  }

  let colorOptions = [
    [255, 160, 140],
    [255, 140, 120],
    [255, 200, 180],
    [255, 100, 80]
  ];
  let cidx = int(random(colorOptions.length));
  let baseCol = color(...colorOptions[cidx], random(160, 220)); // warm color

  return { branches, baseCol };
}

function drawDish3() {
  let R = 150 - PIX * 2;
  drawPixelDish(C3.x, C3.y, 150);

  for (let f of dish3Cells) {
    for (let b of f.branches) {
      for (let i = 0; i < b.length; i++) {
        let fade = map(i, 0, b.length, 255, 120); // fading

        let r = red(f.baseCol);
        let g = green(f.baseCol);
        let bl = blue(f.baseCol);

        if (i > b.length * 0.6) {
          r = min(r + 20, 255);
          g = min(g - 20, 200);
          bl -= 10;
        }

        let dx = sin(frameCount * 0.05 + i * 0.3) * PIX; // wobble
        let dy = cos(frameCount * 0.05 + i * 0.3) * PIX;

        fill(r, g, bl, fade);
        rect(pix(b[i].x + dx), pix(b[i].y + dy), PIX, PIX);

        // random micro branches
        
        if (random() < 0.04) {
          let nx = b[i].x + PIX * random([-1, 0, 1]);
          let ny = b[i].y + PIX * random([-1, 0, 1]);

          if (dist(nx, ny, C3.x, C3.y) <= R) {
            fill(
              min(r + 25, 255),
              min(g + 25, 255),
              min(bl + 25, 255),
              fade + 30
            );
            rect(nx, ny, PIX, PIX);
          }
        }
      }
    }
  }
}

// ============================================================
// M4 — A large eukaryotic cell
// ============================================================

let dish4Diffuse = [];  // diffuse layers
let dish4Bubbles = [];  // bubbles

function initDish4() {
  let cx = C4.x;
  let cy = C4.y;
  let R = (150 - PIX * 2) * 0.95; // main radius

  dish4Diffuse = [];
  dish4Bubbles = [];

  // ---- layered gradient cell ----
  
  let layers = 7;
  for (let i = 0; i < layers; i++) {
    let radius = R * (1 - i * 0.12);
    let t = i / layers;

    let col1 = color("#C5BFED"); // purple-blue
    let col2 = color("#79F5D6"); // mint green
    let baseCol = lerpColor(col1, col2, t);

    let slightPink = color(255, 175, 205); // soft pink tint
    baseCol = lerpColor(baseCol, slightPink, 0.15);

    let pts = [];
    for (let x = -radius; x <= radius; x += PIX) {
      for (let y = -radius; y <= radius; y += PIX) {
        let d = sqrt(x * x + y * y);
        if (d <= radius) {
          let n = noise(x * 0.01, y * 0.01, i * 10);
          if (d > radius * (0.78 + n * 0.12)) continue;

          pts.push({
            x: cx + x,
            y: cy + y,
            offset: random(1000) // noise offset
          });
        }
      }
    }

    dish4Diffuse.push({
      pts,
      baseCol,
      baseRadius: radius,       // base radius
      breathingSpeed: random(0.006, 0.015), // local breathing speed
      breathingAmp: random(4, 10)           // breathing amplitude
    });
  }

  // ---- internal bubbles ----
  
  let bubbleCount = 14;
  for (let i = 0; i < bubbleCount; i++) {
    let ang = random(TWO_PI);
    let r = random(0, R * 0.65);

    let bx = cx + cos(ang) * r;
    let by = cy + sin(ang) * r;

    let rad = random(12, 24);

    dish4Bubbles.push({
      x: bx,
      y: by,
      r: rad,                  // radius
      irregularity: random(0.4, 0.9), // edge irregularity
      driftX: random(1000),   // drift noise X
      driftY: random(2000),   // drift noise Y
      moveSpeed: random(0.002, 0.005), // move speed
      col: color(              // bubble color
        random(180, 210),
        random(140, 170),
        random(200, 230),
        200
      )
    });
  }
}

function drawDish4() {
  let cx = C4.x;
  let cy = C4.y;

  drawPixelDish(cx, cy, 150); // dish outline

  push();
  noStroke();

  let globalBreath = sin(frameCount * 0.03) * 10;   // global breathing
  let globalColorShift = sin(frameCount * 0.025) * 18; // global color pulse

  // ---- draw main cell layers ----
  
  for (let layer of dish4Diffuse) {
    let localBreath = sin(frameCount * layer.breathingSpeed) * layer.breathingAmp;
    let currentR = layer.baseRadius + localBreath + globalBreath; // live radius

    for (let p of layer.pts) {
      let dx = sin(frameCount * 0.01 + p.offset) * 1.2; // slight drift
      let dy = cos(frameCount * 0.012 + p.offset) * 1.2;

      let px = pix(p.x + dx);
      let py = pix(p.y + dy);

      if (dist(px, py, cx, cy) <= currentR) {
        let c = layer.baseCol;
        let finalCol = color(
          red(c) + globalColorShift,
          green(c) + globalColorShift,
          blue(c) + globalColorShift
        );
        fill(finalCol);
        rect(px, py, PIX, PIX);
      }
    }
  }

  // ---- draw bubbles ----
  
  for (let b of dish4Bubbles) {
    let mx = sin(frameCount * b.moveSpeed + b.driftX) * 6; // drift X
    let my = cos(frameCount * b.moveSpeed + b.driftY) * 6; // drift Y

    let cx2 = b.x + mx;
    let cy2 = b.y + my;

    let breath = sin(frameCount * 0.05 + b.driftX) * 2; // breathing

    fill(b.col);

    for (let x = -b.r; x <= b.r; x += PIX) {
      for (let y = -b.r; y <= b.r; y += PIX) {
        let d = sqrt(x * x + y * y);
        let cutoff = b.r * (
          b.irregularity +
          sin(x * 0.15 + y * 0.2) * 0.1 +
          breath * 0.01
        );

        if (d < cutoff) {
          rect(pix(cx2 + x), pix(cy2 + y), PIX, PIX);
        }
      }
    }
  }

  pop();
}

// ============================================================
// Pixel Drawing Helpers
// ============================================================

function drawPixelDish(cx, cy, R) {
  stroke(180, 180, 255, 80);   // soft blue edge
  strokeWeight(2);
  noFill();
  drawPixelCircle(cx, cy, R * 2); // outer circle
}

// ------------------------------------------------------------ 
// ❗️❗️❗️ **Using ChatGPT 5.0 to draw pixel circle**❗️❗️❗️
// ------------------------------------------------------------

function drawPixelCircle(cx, cy, D, maxR) {
  let R = D / 2;
  for (let x = -R; x <= R; x += PIX) {
    for (let y = -R; y <= R; y += PIX) {
      if (x * x + y * y <= R * R) {
        if (maxR === undefined || dist(cx + x, cy + y, cx, cy) <= maxR)
          rect(pix(cx + x), pix(cy + y), PIX, PIX); // draw pixel square
      }
    }
  }
}
