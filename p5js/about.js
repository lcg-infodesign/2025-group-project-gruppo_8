let myFont1, myFont2, myFont3;
let sections = [];
let currentSection = 0;
let textOpacity = 255;
let targetOpacity = 255;

let mushroomImg;
const CYAN = [0, 255, 255];
const LINKS = {
  project: "https://github.com/lcg-infodesign/2025-group-project-gruppo_8",
  dataset: "https://github.com/data-is-plural/nuclear-explosions"
};

let navButtons = [];
let arrowHit = null;

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
  mushroomImg = loadImage("images/mushroom.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sections = [
    {
      title: "ABOUT THE PROJECT",
      body: "The dataset provides structured details for each nuclear test, including the responsible country, location, date, test type, explosive yield, and declared purpose. Test types have been grouped into atmospheric/surface and underground categories.",
      hint: "View the project repository",
      link: LINKS.project
    },
    {
      title: "ABOUT THE DATASET",
      body: "The SIPRI–FOA dataset documents all known nuclear explosions from 1945 up to 1998, the year when India and Pakistan conducted their last declared nuclear tests. After the adoption of the CTBT, states relied on simulations.",
      hint: "Explore the dataset source",
      link: LINKS.dataset
    },
    {
      title: "ABOUT US",
      body: "We are a group of seven students from Politecnico di Milano. Through this project, we explore how data visualization and interaction design can help understand complex historical datasets.",
      hint: null,
      link: null
    }
  ];

 // --- Inside setup() ---
const navContainer = createDiv();
navContainer.style("position", "fixed");
navContainer.style("top", "16%"); // Lowered from 10%
navContainer.style("width", "100%");
navContainer.style("display", "flex");
navContainer.style("justify-content", "center");
navContainer.style("gap", "60px");
navContainer.style("z-index", "2000");

sections.forEach((s, i) => {
  let label = (i === 2) ? "ABOUT US" : s.title.split(" ").pop();
  let btn = createButton(label);
  btn.parent(navContainer);
  
  btn.style("background", "none");
  btn.style("border", "none");
  btn.style("color", "cyan"); 
  
  // Apply myFont1 (Lexend Zetta)
  btn.style("font-family", "'Lexend Zetta', sans-serif"); 
  btn.style("font-size", "16px"); // Adjusted size for the new font
  btn.style("letter-spacing", "5px");
  btn.style("cursor", "pointer");
  btn.style("transition", "0.3s");

  btn.mousePressed(() => {
    if (currentSection !== i) {
      targetOpacity = 0;
      setTimeout(() => {
        currentSection = i;
        targetOpacity = 255;
      }, 300);
    }
  });
  navButtons.push(btn);
});
}

function draw() {
  background(10);

  if (mushroomImg) {
    push();
    tint(0, 255, 255, 50);
    imageMode(CENTER);
    image(mushroomImg, width / 2, height / 2, height * 0.9 * (mushroomImg.width / mushroomImg.height), height * 0.9);
    pop();
  }
   // Draw the main "ABOUT" title at top center
   textFont(myFont1);
   noStroke();
   fill(200);
   textSize(20);
   textAlign(CENTER, TOP);
   text("ABOUT", width / 2 + scrollX, 30); // stays at top
  
   
  textOpacity = lerp(textOpacity, targetOpacity, 0.15);
  updateNavStyles();
  drawFixedBox();
  drawFooter();
}

function updateNavStyles() {
  navButtons.forEach((btn, i) => {
    btn.style("color", "cyan"); // Keep them all cyan
    if (i === currentSection) {
      btn.style("text-shadow", "0 0 15px cyan");
      btn.style("opacity", "1.0");
    } else {
      btn.style("text-shadow", "none");
      btn.style("opacity", "0.6"); // Lower opacity for inactive, but still cyan
    }
  });
}

function drawFixedBox() {
  const boxWidth = min(width * 0.6, 700);
  const startY = height * 0.35;
  const item = sections[currentSection];

  push();
  // Cyan Box with Thick Outline
  fill(0, 255, 255, 30); // Transparent cyan fill
  stroke(CYAN);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 20, boxWidth + 80, 400, 2);

  // Content
  noStroke();
  textAlign(LEFT, TOP);
  let contentX = width / 2 - boxWidth / 2;

  fill(255, textOpacity);
  textFont(myFont1);
  textSize(18);
  text(item.title, contentX, startY);

  fill(220, textOpacity);
  textFont(myFont2);
  textSize(15);
  textLeading(26);
  let wrapped = wrapLines(item.body, boxWidth);
  for (let j = 0; j < wrapped.lines.length; j++) {
    text(wrapped.lines[j], contentX, startY + 60 + (j * 26));
  }
  
  // Logic for the link arrow...
  if (item.link) {
     drawHintWithArrow(item.hint, contentX, startY + 80 + wrapped.h, 11, item.link);
  }
  pop();
}

function wrapLines(txt, maxW) {
  let words = txt.split(" ");
  let lines = [];
  let currentLine = "";
  for (let w of words) {
    let test = currentLine + w + " ";
    if (textWidth(test) < maxW) currentLine = test;
    else { lines.push(currentLine); currentLine = w + " "; }
  }
  lines.push(currentLine);
  return { lines, h: lines.length * 26 };
}

function drawHintWithArrow(label, x, y, size, url) {
  textFont(myFont1);
  textSize(size);
  let tw = textWidth(label);
  let isHover = (mouseX > x && mouseX < x + tw + 40 && mouseY > y && mouseY < y + 25);
  
  arrowHit = isHover ? url : arrowHit;
  fill(isHover ? CYAN : [255, textOpacity * 0.6]);
  noStroke();
  text(label, x, y);
  
  stroke(isHover ? CYAN : [255, textOpacity * 0.6]);
  line(x + tw + 10, y + size/2, x + tw + 30, y + size/2);
}

function drawFooter() {
  fill(100);
  noStroke();
  textFont(myFont3);
  textSize(10);
  textAlign(CENTER);
  text("POLITECNICO DI MILANO · GROUP 8", width / 2, height - 40);
}

function mouseReleased() {
  if (arrowHit) window.open(arrowHit, "_blank");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}