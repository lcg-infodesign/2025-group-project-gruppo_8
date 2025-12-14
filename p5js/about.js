
let myFont1, myFont2, myFont3;
let projectText, datasetText, aboutUsText;

let fadeIn = 0;
let floatOffset = 20;

let iconProject, iconData, iconUs;

// Parametri layout icone
const ICON_SIZE = 72;
const ICON_GAP = 90;
const VISUAL_SHIFT_RIGHT = 22;
const STROKE_THIN = "1.4";

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.style("z-index", "1");

  // Inizializza icone Lucide (CDN globale)
  if (window.lucide) lucide.createIcons();

  // --- Testi (EN) ---
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

  // Riferimenti DOM alle icone
  iconProject = select("#icon-project");
  iconData = select("#icon-data");
  iconUs = select("#icon-us");

  // Stile icone
  [iconProject, iconData, iconUs].forEach(icon => {
    icon.style("position", "absolute");
    icon.style("z-index", "10");
    icon.style("color", "#6e85db");
    icon.style("opacity", "0.6");
    icon.style("width", ICON_SIZE + "px");
    icon.style("height", ICON_SIZE + "px");
    icon.style("stroke-width", STROKE_THIN);
  });
}

function draw() {
  background(0);

  // Animazione fade + leggero movimento verticale
  fadeIn = min(fadeIn + 3, 255);
  floatOffset = max(floatOffset - 0.6, 0);

  // Il menu è gestito da menuVersion2.js
  drawAboutContent();
  drawFooter();
}

function drawAboutContent() {
  // Titolo pagina
  textFont(myFont1);
  fill(110, 133, 219);
  textSize(20);
  textAlign(CENTER, TOP);
  text("ABOUT", width / 2, 20);

  // Impostazioni tipografiche
  const titleSize = 16;
  const bodySize = 13;
  const titleH = 24;
  const titleBodyGap = 10;
  const spacingBetween = 90;

  const boxWidth = width * 0.45;

  // Calcolo del gruppo (testo + icona) centrato visivamente
  const groupWidth = boxWidth + ICON_GAP + ICON_SIZE;
  const groupLeft = (width - groupWidth) / 2 + VISUAL_SHIFT_RIGHT;
  const x = groupLeft;

  textFont(myFont1);
  textAlign(LEFT, TOP);
  textSize(bodySize);

  // Altezze dei blocchi di testo
  let p1H = textHeight(projectText, boxWidth, bodySize);
  let p2H = textHeight(datasetText, boxWidth, bodySize);
  let p3H = textHeight(aboutUsText, boxWidth, bodySize);

  // Altezza totale contenuto
  let totalH =
    titleH + titleBodyGap + p1H +
    spacingBetween +
    titleH + titleBodyGap + p2H +
    spacingBetween +
    titleH + titleBodyGap + p3H;

  let startY = (height - totalH) / 2 + 40 + floatOffset;

  fill(255, fadeIn);

  // ABOUT THE PROJECT
  textSize(titleSize);
  text("ABOUT THE PROJECT", x, startY);

  textSize(bodySize);
  text(projectText, x, startY + titleH + titleBodyGap, boxWidth);

  positionIcon(iconProject, x + boxWidth + ICON_GAP, startY, titleH + titleBodyGap + p1H);

  // ABOUT THE DATASET
  let y2 = startY + titleH + titleBodyGap + p1H + spacingBetween;

  textSize(titleSize);
  text("ABOUT THE DATASET", x, y2);

  textSize(bodySize);
  text(datasetText, x, y2 + titleH + titleBodyGap, boxWidth);

  positionIcon(iconData, x + boxWidth + ICON_GAP, y2, titleH + titleBodyGap + p2H);

  // ABOUT US
  let y3 = y2 + titleH + titleBodyGap + p2H + spacingBetween;

  textSize(titleSize);
  text("ABOUT US", x, y3);

  textSize(bodySize);
  text(aboutUsText, x, y3 + titleH + titleBodyGap, boxWidth);

  positionIcon(iconUs, x + boxWidth + ICON_GAP, y3, titleH + titleBodyGap + p3H);
}

function positionIcon(icon, x, y, blockHeight) {
  if (!icon) return;
  icon.position(x, y + blockHeight / 2 - ICON_SIZE / 2);
}

function drawFooter() {
  // Footer discreto
  fill(110);
  textFont(myFont3);
  textSize(10);
  textAlign(CENTER, BOTTOM);

  text(
    "Politecnico di Milano · Information Design · Group 8 · A.A. 2025–2026",
    width / 2,
    height - 14
  );
}

function textHeight(txt, boxWidth, fontSize) {
  let bbox = myFont1.textBounds(txt, 0, 0, fontSize);
  let lines = ceil(bbox.w / boxWidth);
  return lines * (fontSize * 1.35);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
