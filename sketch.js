let profileImg;
let link;
let canvasHeight;

function preload() {
  profileImg = loadImage("profile.jpg");
}

function setup() {
  canvasHeight = windowHeight;
  createCanvas(windowWidth, canvasHeight);
  noFill();

  link = createA("Coding_Midterm_Final/index.html", "ENTER THE MID-TERM PROJECT");
  link.style("font-family", "Tamil MN"); 
  link.style("font-size", "15px");
  link.style("letter-spacing", "3px");
  link.style("color", "#002AA7");
  link.style("text-decoration", "none");
  link.style("text-align", "center");
}

function draw() {
  background(0);
  drawWaveLines();
  drawCard();
  drawHeader();
  drawImage();
  drawInfo();
  drawProject();
  drawLinkInCard();
}

function drawWaveLines() {
  stroke("#002AA7");
  strokeWeight(1);

  let lineSpacing = 40;
  let amplitude = 50;
  let yStep = 5;

  for (let xStart = 0; xStart < width; xStart += lineSpacing) {
    beginShape();
    for (let y = 0; y <= height; y += yStep) {
      let nx = xStart * 0.01;
      let ny = y * 0.01;
      let offsetX = map(noise(nx, ny, frameCount * 0.01), 0, 1, -amplitude, amplitude);
      vertex(xStart + offsetX, y);
    }
    endShape();
  }
}


function drawCard() {
  noStroke();
  fill("#FFAC85");
  rectMode(CENTER);
  rect(width/2, canvasHeight/2, 520, 1000);
}

function drawHeader() {
  textAlign(CENTER);
  textFont("Tamil MN");
  fill("#000000");
  textSize(42);
  drawingContext.letterSpacing = "3px";
  text("XINYUE XI", width/2, canvasHeight/2 - 400);

  textSize(16);
  fill("#002AA7");
  text("CYNTHIA  |  25014054", width/2, canvasHeight/2 - 360);
}

function drawImage() {
  imageMode(CENTER);
  push();
  translate(width/2, canvasHeight/2 - 230);
  let size = 150;
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(0, 0, size/2, 0, TWO_PI);
  drawingContext.clip();
  image(profileImg, 0, 0, size, size);
  drawingContext.restore();
  pop();
}

function drawInfo() {
  textAlign(CENTER);
  textFont("Helvetica");
  fill("#222222");
  textSize(16);
  drawingContext.letterSpacing = "0px";

  let infoY = canvasHeight/2 + 200;
  let infoText = 
    "I'm a student at UAL studying Creative Computing.\n\n" +
    "With a high school background in science\n" +
    "and a bachelor's degree in Product Design,\n" +
    "I am passionate about physics and computational\n" +
    "arts, exploring how interactive systems, sensing\n" +
    "technologies, and data representation shape the\n" +
    "relationship between people and their environment,\n" +
    "and investigating the evolving dynamics between\n" +
    "humans, bodies, and machines within\n" + "technological frameworks.\n"

  text(infoText, width/2, infoY, 480, 600);
}

function drawProject() {
  textAlign(CENTER);
  textFont("Helvetica");
  fill("#333333");
  textSize(16);

  let projectY = canvasHeight/2 + 400;
  let projectText = 
    "Final Project:\n" +
    "Still in conception and exploration···\n";

  text(projectText, width/2, projectY, 480, 400);

  let requiredHeight = projectY + 250;
  if (requiredHeight > canvasHeight) {
    canvasHeight = requiredHeight;
    resizeCanvas(windowWidth, canvasHeight);
  }
}

function drawLinkInCard() {
  let linkY = canvasHeight/2 + 350;
  link.position(width/2 - link.size().width/2, linkY);
}

function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}

















