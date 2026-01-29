let myFont1, myFont2, myFont3;
let projectText, datasetText, aboutUsText;
let projectHintText, datasetHintText;

let fadeIn = 0;
let floatOffset = 20;

let iconProject, iconData, iconUs;

// Layout icone
const ICON_SIZE = 78; // ⬅️ slightly larger
const ICON_GAP = 90;
const VISUAL_SHIFT_RIGHT = 22;
const STROKE_THIN = "0.7";

// Colors
const PURPLE = [110, 133, 219];
const CYAN = [0, 255, 255];

const LINKS = {
  project: "https://github.com/lcg-infodesign/2025-group-project-gruppo_8",
  dataset: "https://github.com/data-is-plural/nuclear-explosions"
};

let arrowHitProject = null;
let arrowHitDataset = null;

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.style("z-index", "1");

  if (window.lucide) lucide.createIcons();

  projectText =
    "This project visualizes the global history of nuclear testing through an interactive and minimal system. " +
    "By mapping tests across years, countries, and yields, it reveals patterns that raw data alone cannot show. " +
    "The aim is to make a complex historical timeline accessible, readable, and reflective.";

  datasetText =
    "This project uses the file “sipri-report-explosions.csv”, derived from the official SIPRI report " +
    "“Nuclear Explosions, 1945–1998”. For field definitions and documentation, please refer to the original reports.";

  aboutUsText =
    "We are a group of seven students from Politecnico di Milano. " +
    "Through this project, we explore how data visualization and interaction design " +
    "can transform complex historical datasets into meaningful narratives.";

  projectHintText = "View the project repository";
  datasetHintText = "Explore the dataset source";

  iconProject = select("#icon-project");
  iconData = select("#icon-data");
  iconUs = select("#icon-us");

  [iconProject, iconData, iconUs].forEach(icon => {
    icon.style("position", "absolute");
    icon.style("z-index", "10");
    icon.style("color", "#00FFFF");
    icon.style("opacity", "1");
    icon.style("width", ICON_SIZE + "px");
    icon.style("height", ICON_SIZE + "px");
    icon.style("stroke-width", STROKE_THIN);
  });
}

function draw() {
  background(0);

  fadeIn = min(fadeIn + 3, 255);
  floatOffset = max(floatOffset - 0.6, 0);

  cursor(ARROW);
  arrowHitProject = null;
  arrowHitDataset = null;

  drawAboutContent();
  drawFooter();
}

function drawAboutContent() {
  const titleSize = 16;
  const bodySize = 13;
  const hintSize = 11;

  const titleH = 24;
  const titleBodyGap = 10;
  const spacingBetween = 64;

  const bodyLeading = Math.round(bodySize * 1.45);
  const hintLeading = Math.round(hintSize * 1.45);

  const boxWidth = width * 0.38;
  const groupWidth = boxWidth + ICON_GAP + ICON_SIZE;
  const x = (width - groupWidth) / 2 + VISUAL_SHIFT_RIGHT;

  // PAGE TITLE

  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textAlign(CENTER, TOP);
  text("ABOUT", width / 2, 30);

  textFont(myFont1);
  textSize(bodySize);
  textLeading(bodyLeading);

  const p1 = wrapLines(projectText, boxWidth);
  const p2 = wrapLines(datasetText, boxWidth);
  const p3 = wrapLines(aboutUsText, boxWidth);

  const hintLineH = hintLeading;

  const totalH =
    titleH + titleBodyGap + p1.h + 10 + hintLineH +
    spacingBetween +
    titleH + titleBodyGap + p2.h + 10 + hintLineH +
    spacingBetween +
    titleH + titleBodyGap + p3.h;

  // ⬅️ moved up slightly (was +80)
  let startY = (height - totalH) / 2 + 56 + floatOffset;

  // ===== PROJECT =====
  fill(255, fadeIn);
  textSize(titleSize);
  textLeading(titleSize * 1.2);
  textAlign(LEFT, TOP);
  text("ABOUT THE PROJECT", x, startY);

  const bodyY1 = startY + titleH + titleBodyGap;
  drawWrappedText(p1.lines, x, bodyY1, bodyLeading, 255, fadeIn, bodySize);

  const hintY1 = bodyY1 + p1.h + 10;
  drawHintWithArrow(
    projectHintText,
    x,
    hintY1,
    hintSize,
    hintLeading,
    LINKS.project,
    hit => (arrowHitProject = hit)
  );

  positionIcon(
    iconProject,
    x + boxWidth + ICON_GAP,
    startY,
    titleH + titleBodyGap + p1.h + 10 + hintLineH
  );

  // ===== DATASET =====
  const y2 = hintY1 + hintLineH + spacingBetween;

  fill(255, fadeIn);
  textSize(titleSize);
  text("ABOUT THE DATASET", x, y2);

  const bodyY2 = y2 + titleH + titleBodyGap;
  drawWrappedText(p2.lines, x, bodyY2, bodyLeading, 255, fadeIn, bodySize);

  const hintY2 = bodyY2 + p2.h + 10;
  drawHintWithArrow(
    datasetHintText,
    x,
    hintY2,
    hintSize,
    hintLeading,
    LINKS.dataset,
    hit => (arrowHitDataset = hit)
  );

  positionIcon(
    iconData,
    x + boxWidth + ICON_GAP,
    y2,
    titleH + titleBodyGap + p2.h + 10 + hintLineH
  );

  // ===== ABOUT US =====
  const y3 = hintY2 + hintLineH + spacingBetween;

  fill(255, fadeIn);
  textSize(titleSize);
  text("ABOUT US", x, y3);

  const bodyY3 = y3 + titleH + titleBodyGap;
  drawWrappedText(p3.lines, x, bodyY3, bodyLeading, 255, fadeIn, bodySize);

  positionIcon(
    iconUs,
    x + boxWidth + ICON_GAP,
    y3,
    titleH + titleBodyGap + p3.h
  );
}

// helpers unchanged
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

function drawWrappedText(lines, x, y, leading, r, a, fontSize) {
  textFont(myFont1);
  textSize(fontSize);
  textLeading(leading);
  textAlign(LEFT, TOP);
  fill(r, a);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, y + i * leading);
  }
}

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
    mouseX >= hit.x && mouseX <= hit.x + hit.w &&
    mouseY >= hit.y && mouseY <= hit.y + hit.h;

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
  triangle(
    arrowX + 14, arrowY,
    arrowX + 9, arrowY - 4,
    arrowX + 9, arrowY + 4
  );
}

function mouseReleased() {
  if (arrowHitProject) window.open(arrowHitProject.url, "_blank");
  if (arrowHitDataset) window.open(arrowHitDataset.url, "_blank");
}

function positionIcon(icon, x, y, h) {
  if (!icon) return;
  icon.position(x, y + h / 2 - ICON_SIZE / 2);
}

function drawFooter() {
  fill(110);
  textFont(myFont3);
  textSize(10);
  // textAlign(CENTER, BOTTOM);
  text(
    "Politecnico di Milano · Information Design · Group 8 · A.A. 2025–2026",
    width / 2,
    height - 14
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
