let myFont1, myFont2, myFont3;
let projectText, datasetText, aboutUsText;
let projectHintText, datasetHintText;

let fadeIn = 0;
let floatOffset = 20;

let scrollX = 0;
let targetScrollX = 0;
let contentWidth = 0;

let mushroomImg;

// Colors
const CYAN = [0, 255, 255];

const LINKS = {
  project: "https://github.com/lcg-infodesign/2025-group-project-gruppo_8",
  dataset: "https://github.com/data-is-plural/nuclear-explosions"
};

let arrowHitProject = null;
let arrowHitDataset = null;

// Touchpad variables
let slider;
let handle;
let draggingSlider = false;
const sliderWidth = 300;
const sliderHeight = 12;
const handleWidth = 20;
const handleHeight = 20;

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  mushroomImg = loadImage("images/mushroom.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  projectText =
    "The dataset provides structured details for each nuclear test, including the responsible country, location, date, test type, explosive yield, and declared purpose. Test types have been grouped into atmospheric/surface and underground categories, making it easier to visualize trends and patterns across more than fifty years of nuclear testing. This information supports historical research, academic studies, and public education, offering a clear picture of the global history of nuclear tests. To ensure the data is reliable and easy to use, it has been carefully cleaned and organized. Missing or inconsistent information has been filled in or standardized, and test types have been grouped clearly into the two main categories. These improvements make it easier for users to explore and understand the evolution, distribution, and impact of nuclear tests around the world.";

  datasetText =
    "The SIPRI–FOA dataset documents all known nuclear explosions from 1945 up to 1998, the year when India and Pakistan conducted their last declared nuclear tests. After the adoption of the Comprehensive Nuclear-Test-Ban Treaty (CTBT), nuclear-armed states continued to develop and maintain arsenals, but relied on simulations and non-explosive testing methods that cannot be tracked or verified in the same way. Therefore, 1998 marks the last year for which complete and verifiable data on nuclear tests are available. The dataset is based on the “Nuclear Explosions 1945–1998” collection and compiles information from multiple authoritative sources, including the Stockholm International Peace Research Institute (SIPRI), the Oklahoma Geological Survey, and the Natural Resources Defense Council. Originally scattered across military archives, seismic records, and official reports, the data have been cross-checked and organized into an open, accessible format.";

  aboutUsText =
    "We are a group of seven students from Politecnico di Milano. Through this project, we explore how data visualization and interaction design can help understand complex historical datasets, focusing on nuclear tests conducted worldwide from 1945 to 1998. Our goal is to provide users with a comprehensive and interactive view of nuclear testing history, making it easier to analyze trends, patterns, and historical context.";

  projectHintText = "View the project repository";
  datasetHintText = "Explore the dataset source";

  // --- CREATE TOUCHPAD AT BOTTOM ---
  slider = createDiv();
  slider.position((width - sliderWidth) / 2, height - 50);
  slider.size(sliderWidth, sliderHeight);
  slider.style("background", "#ddd");
  slider.style("border-radius", sliderHeight / 2 + "px");
  slider.style("position", "fixed");
  slider.style("z-index", "10");
  slider.style("cursor", "pointer");

  handle = createDiv();
  handle.size(handleWidth, handleHeight);
  handle.style("background", "#333");
  handle.style("border-radius", "50%");
  handle.position(0, -4);
  handle.style("position", "absolute");
  slider.child(handle);

  handle.mousePressed(() => draggingSlider = true);
  handle.touchStarted(() => draggingSlider = true);
}

function draw() {
  background(20);

  // Mushroom background
  if (mushroomImg) {
    push();
    tint(0, 255, 255, 150);
    imageMode(CENTER);
    let imgH = 0.9 * height;
    let imgW = 1.2 * height * (mushroomImg.width / mushroomImg.height);
    image(mushroomImg, width / 2 - scrollX * 0.1, height / 2, imgW, imgH);
    pop();
  }

  fadeIn = min(fadeIn + 3, 255);
  floatOffset = max(floatOffset - 0.6, 0);

  cursor(ARROW);
  arrowHitProject = null;
  arrowHitDataset = null;

  scrollX = lerp(scrollX, targetScrollX, 0.12);

  // Top progress line
  let progress = map(scrollX, 0, max(0, contentWidth - width), 0, width);
  stroke(...CYAN);
  strokeWeight(2);
  line(0, 0, progress, 0);

  // ----- FIXED TITLE -----
  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textAlign(CENTER, TOP);
  text("ABOUT", width / 2, 30); // stays fixed at top

  // Scrollable content horizontally
  push();
  translate(-scrollX, 0); // only scrolls boxes, NOT the title
  drawAboutContentHorizontal();
  pop();

  drawFooter();

  // Handle drag
  if (draggingSlider) {
    let mousePos = constrain(mouseX - (width - sliderWidth) / 2 - handleWidth / 2, 0, sliderWidth - handleWidth);
    handle.position(mousePos, -4);
    targetScrollX = map(mousePos, 0, sliderWidth - handleWidth, 0, max(0, contentWidth - width));
  }
}


// ------------------- HORIZONTAL CONTENT -------------------
function drawAboutContentHorizontal() {
  const titleSize = 16;
  const bodySize = 13;
  const hintSize = 11;
  const titleH = 24;
  const titleBodyGap = 10;
  const spacing = 80;

  const boxWidth = width * 0.6;
  const boxHeight = height * 0.5; // lower the boxes
  const startY = 180 + floatOffset; // lower the starting position

  // Draw the main "ABOUT" title at top center
  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textAlign(CENTER, TOP);
  text("ABOUT", width / 2 + scrollX, 30); // stays at top

  const texts = [
    { title: "ABOUT THE PROJECT", body: projectText, hint: projectHintText, link: LINKS.project },
    { title: "ABOUT THE DATASET", body: datasetText, hint: datasetHintText, link: LINKS.dataset },
    { title: "ABOUT US", body: aboutUsText, hint: null, link: null }
  ];

  let x = 100;
  contentWidth = 0;

  for (let t of texts) {
    noStroke();
    fill(20, 180);
    rect(x - 20, startY - 20, boxWidth + 40, boxHeight + 60); // boxes lower

    textFont(myFont1);
    fill(255, fadeIn);
    textSize(titleSize);
    textAlign(LEFT, TOP);
    text(t.title, x, startY);

    textFont(myFont2);
    textSize(bodySize);
    textLeading(bodySize * 1.45);
    let wrapped = wrapLines(t.body, boxWidth);
    for (let i = 0; i < wrapped.lines.length; i++) {
      text(wrapped.lines[i], x, startY + titleH + titleBodyGap + i * bodySize * 1.45);
    }

    if (t.hint && t.link) {
      drawHintWithArrow(
        t.hint,
        x,
        startY + titleH + titleBodyGap + wrapped.h + 10,
        hintSize,
        hintSize * 1.45,
        t.link,
        hit => (t.title === "ABOUT THE PROJECT" ? arrowHitProject = hit : arrowHitDataset = hit)
      );
    }

    x += boxWidth + spacing;
    contentWidth = x;
  }
}

// ------------------- WRAP LINES -------------------
function wrapLines(txt, maxW) {
  const words = txt.split(/\s+/);
  let lines = [];
  let line = "";
  for (let w of words) {
    const test = line ? line + " " + w : w;
    if (textWidth(test) <= maxW) line = test;
    else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return { lines, h: lines.length * textLeading() };
}

// ------------------- DRAW HINT -------------------
function drawHintWithArrow(label, x, y, hintSize, hintLeading, url, setHit) {
  textFont(myFont1);
  textSize(hintSize);
  textLeading(hintLeading);
  textAlign(LEFT, TOP);

  const textW = textWidth(label);
  const arrowX = x + textW + 10;
  const arrowY = y + hintSize * 0.55;

  const hit = { x: arrowX - 6, y: y - 2, w: 26, h: hintLeading + 4, url };

  const hovering =
    mouseX + scrollX >= hit.x &&
    mouseX + scrollX <= hit.x + hit.w &&
    mouseY >= hit.y &&
    mouseY <= hit.y + hit.h;

  if (hovering) {
    fill(...CYAN, fadeIn);
    stroke(...CYAN);
    cursor(HAND);
    setHit(hit);
  } else {
    fill(255, fadeIn);
    stroke(255);
  }

  noStroke();
  text(label, x, y);
  strokeWeight(1.4);
  line(arrowX, arrowY, arrowX + 14, arrowY);
  noStroke();
  triangle(arrowX + 14, arrowY, arrowX + 9, arrowY - 4, arrowX + 9, arrowY + 4);
}

// ------------------- FOOTER -------------------
function drawFooter() {
  fill(20);
  noStroke();
  rect(0, height - 40, width, 40);

  fill(110);
  textFont(myFont3);
  textSize(10);
  textAlign(CENTER, CENTER);
  text(
    "Politecnico di Milano · Information Design · Group 8 · A.A. 2025–2026",
    width / 2,
    height - 20
  );
}

// ------------------- EVENTS -------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  slider.position((width - sliderWidth) / 2, height - 50);
}

function mouseReleased() {
  draggingSlider = false;
  if (arrowHitProject) window.open(arrowHitProject.url, "_blank");
  if (arrowHitDataset) window.open(arrowHitDataset.url, "_blank");
}

function touchEnded() {
  draggingSlider = false;
}

function mouseWheel(event) {
  targetScrollX += event.delta;
  targetScrollX = constrain(targetScrollX, 0, max(0, contentWidth - width));
  return false;
}
