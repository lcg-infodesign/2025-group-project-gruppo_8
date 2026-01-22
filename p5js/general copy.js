// ===============================
// Variabili globali
// ===============================
let page = 1;
let data = [];
let menuOpen = false;
let enteredPage2ByScroll = false; 


// Page2 top-right text carousel (4 steps)
let infoStep = 0; // 0..3
const infoTexts = [
  "The first nuclear explosions mark a historical turning point. After the end of World War II,\n the atomic bomb becomes a tool of power and deterrence.\n Testing is limited, but a new form of global threat begins.",
  "Competition between superpowers leads to a rapid increase in nuclear tests.\nExplosions become more frequent and more powerful, often atmospheric.\nNuclear testing is used as a political and military demonstration.",
  "After the first international restrictions, many tests move underground.\nThe number of explosions decreases, but technological development continues.\nDeterrence remains central throughout the Cold War.",
  "With the end of the Cold War, nuclear explosions decrease significantly.\nIn 1996, the Comprehensive Nuclear-Test-Ban Treaty (CTBT) is adopted, aiming to ban all nuclear test explosions.\n1998 marks the last officially certified nuclear tests.",
];

// Hover state (page2: years/columns)
let hoveredYear = null;
let isHoveringInteractive = false;

// Automatic circle expansion control
let autoExpandStarted = false;
let expandStartFrame = 0;
// -------- Variabili della pagina 1--------
let particles1 = [];
let numParticles1 = 50;
let radii = [
  { a: 300, b: 60, angleOffset: 0 },
  { a: 300, b: 60, angleOffset: 120 },
  { a: 300, b: 60, angleOffset: 240 },
];

let spreadSpeed = 0;
let centerCircleSize = 10;
let scrollOffset = 0; // Global scroll offset
let maxScroll;

let myFont1, myFont2;
let img1, img2, img3, img4;

// -------- Variabili della pagina 2 --------
let table;
let bombsPerYear = {};
let UGBombsPerYear = {};
let particles2 = [];
let startYear = 1945;
let endYear = 1998;
// Use the same lateral spacing across pages (matches Insight style)
let margin = 80;
let yAxis;

// UI alignment (must match p5js/menu.js button position/size)
const MENU_BTN_X = 25;
const MENU_BTN_Y = 25;
const MENU_BTN_SIZE = 60;
const UI_GAP = 20;

// Shared layout spacing
const SIDE_MARGIN = 80;
const MAX_TEXT_W = 420;

let scrollProgress;
let lastStepTime = 0;
let STEP_DELAY = 50;
let scrollDirection = 0;
let scrollStep = 0.5;

let UGTypes = [
  "UG",
  "SHAFT",
  "TUNNEL",
  "GALLERY",
  "MINE",
  "SHAFT/GR",
  "SHAFT/LG",
];

// NUOVA FUNZIONE — vai alla overview
// ===============================
function goToOverview() {
  enteredPage2ByScroll = false;
  // Vai alla pagina 2 (grafico)
  page = 2;

  // Porta subito la timeline alla fine: grafico "attivo"
  scrollProgress = endYear;

  // Attiva tutte le particelle (bombe) in page 2
  if (particles2 && particles2.length > 0) {
    for (let p of particles2) {
      p.active = true;
    }
  }

  // Nascondi il bottone "CLICK TO CONTINUE", se esiste
  const skipBtn = document.getElementById("skipIntroBtn");
  if (skipBtn && skipBtn.parentElement) {
    skipBtn.parentElement.style.display = "none";
  }
}
 
//    // goToOverview DA USARE PER APPARIRE LE BOMBE GRADUALI SE CLICCHI SKIP //
//function goToOverview() {
  //enteredPage2ByScroll = true;
  //page = 2;
  //scrollProgress = startYear - 1;
  //scrollDirection = 1;
  //const skipBtn = document.getElementById("skipIntroBtn");
  //if (skipBtn && skipBtn.parentElement) {
  //  skipBtn.parentElement.style.display = "none";
  //}
//}

function preload() {
  // pagina1
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  // pagina2
  table = loadTable("dataset/dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    data.push({
      id: i, // Definisci l'ID in base al numero della riga
      year: row.getNum("year"),
      type: row.getString("type"),
      yield: row.getNum("yield_u"),
    });
  }

  // -------- Inizializza le particelle della pagina 1 --------
  for (let r = 0; r < radii.length; r++) {
    for (let i = 0; i < numParticles1; i++) {
      let angle = random(TWO_PI);
      particles1.push(
        new Particle1(
          angle,
          radii[r].a,
          radii[r].b,
          radians(radii[r].angleOffset),
          random(1, 8)
        )
      );
    }
  }
  maxScroll = height * 4;

  // -------- Inizializza le particelle della pagina 2 --------
  yAxis = height / 2 + 70;
  scrollProgress = startYear - 1;

  for (let y = startYear; y <= endYear; y++) {
    bombsPerYear[y] = 0;
    UGBombsPerYear[y] = 0;
  }

  for (let i = 0; i < table.getRowCount(); i++) {
    let year = table.getNum(i, "year");
    let type = table.getString(i, "type");
    if (year >= startYear && year <= endYear) {
      bombsPerYear[year]++;
      if (UGTypes.includes(type)) UGBombsPerYear[year]++;
    }
  }

  creaParticlesDaTabella();
  checkHashNavigation();
}
// ===============================
// Se URL contiene #page2 → apri ovverview SUBITO
// ===============================
function checkHashNavigation() {
  if (window.location.hash === "#page2") {
    page = 2;
enteredPage2ByScroll = false;
    // Avvia subito le particelle attive
    scrollProgress = endYear; // imposta tutte le particelle come “attive”
    for (let p of particles2) {
      p.active = true;
    }
  }
}

// ===============================
// Ciclo principale
// ===============================
function draw() {
  if (page === 1) drawPage1();
  else if (page === 2) drawPage2();
}

// ===============================
// pagina1draw
// ===============================
function drawPage1() {
  background(20);
  // drawGrid();
  //imageMode(CENTER);
  //tint(255, 180);
  //image(img1, width / 2, height / 2, 1200, 900);

  //textFont(myFont2);
  //fill(150);
  //textSize(16);
  //textAlign(CENTER, BOTTOM);
  //text("SCROLL DOWN FOR MORE", width / 2, height - 40);

  // Title: vertically aligned with menu, horizontally centered
  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textAlign(CENTER, TOP);

  // same vertical rhythm as menu icon
  // const titleY = MENU_BTN_Y + MENU_BTN_SIZE / 2;

  text("NUCLEAR EXPLOSIONS ARCHIVE", width / 2, 30);

  textFont(myFont2);
  fill(200, 200, 200);

  // Intro texts — same spacing logic as Insight (consistent margins + max width)
  const str1 =
    "The atom breaks: each particle is a real test. History unfolds before your eyes.";
  const str2 =
    "Between 1945 and 1998, nuclear testing reshaped geopolitics, science, and the environment. Over two thousand explosions left a lasting mark on the planet.";
  const str3 =
    "This website is a digital archive that presents nuclear testing as an interactive timeline. \nIt traces the evolution of nuclear explosions over the second half of the twentieth century.";
  const str4 = "Data from the SIPRI-FOA Report";

  // Bring the two columns closer to the center
  const GUTTER = 200; // space between left/right columns (smaller = closer to center)
  const leftX = width / 2 - GUTTER / 2 - MAX_TEXT_W;
  const rightX = width / 2 + GUTTER / 2;

  // Make blocks closer vertically
  const introStartY = height + 120; // where the first text appears
  const introStepY = height * 0.6; // distance between blocks (smaller = closer)

  textAlign(LEFT, TOP);
  drawIntroBlock(
    str1,
    leftX,
    introStartY + introStepY * 0 - scrollOffset,
    MAX_TEXT_W
  );
  drawIntroBlock(
    str2,
    rightX,
    introStartY + introStepY * 1 - scrollOffset,
    MAX_TEXT_W
  );
  drawIntroBlock(
    str3,
    leftX,
    introStartY + introStepY * 2 - scrollOffset,
    MAX_TEXT_W
  );
  drawIntroBlock(
    str4,
    rightX,
    introStartY + introStepY * 3 - scrollOffset,
    MAX_TEXT_W
  );

  // Scroll hint arrow (bottom center) — hidden once the user scrolls a bit
  drawScrollHintArrow();

  // particelle centrale
  push();
  let scaledSize = centerCircleSize;
  //Scala lentamente solo se la sfera non è stata ancora ingrandita
  if (centerCircleSize <= 10) {
    let scaleFactor = 2 + 2 * sin(frameCount * 0.01);
    scaledSize *= scaleFactor;
  }

  // --- Automatic circle expansion after full scroll ---
  if (autoExpandStarted) {
    centerCircleSize = lerp(centerCircleSize, max(width, height) * 2, 0.03);

    // When fully expanded, go to next page
    if (centerCircleSize > max(width, height)) {
      goNextPage();
    }
  }
  fill(20);
  stroke(0, 255, 255);
  strokeWeight(1.5);
  translate(width / 2, height / 2);
  ellipse(0, 0, scaledSize, scaledSize);

  for (let p of particles1) {
    p.update(spreadSpeed);
    p.show();
  }
  pop();

  spreadSpeed = lerp(spreadSpeed, 0, 0.1);
}

function drawIntroBlock(str, x, y, w) {
  // y is the top of the text block; fade should depend on its position in the viewport.
  // 0% alpha at top (0) and bottom (height), 100% alpha at center (height/2).
  const centerY = height / 2;
  const d = abs(y - centerY); // distanza dal centro
  const a = map(d, 0, centerY, 255, 0, true); // 255 al centro, 0 agli estremi

  textFont(myFont2);
  textSize(21);
  noStroke();
  fill(255, a);

  text(str, x, y, w);
}

function drawScrollHintArrow() {
  // Only show at the very start
  const visible = scrollOffset < 80;
  if (!visible) return;

  const alpha = map(scrollOffset, 0, 80, 255, 0, true);
  const bob = sin(frameCount * 0.08) * 4;

  const cx = width / 2;
  const cy = height - 44 + bob;

  const halfW = 10; // half width of the chevron (smaller = less wide)
  const h = 8; // height of the chevron (smaller = less tall)

  push();
  stroke(0, 255, 255, alpha);
  strokeWeight(2);
  noFill();

  // chevron only (no vertical stem)
  line(cx - halfW, cy - h, cx, cy);
  line(cx + halfW, cy - h, cx, cy);

  pop();
}

// ===============================
// pagina2draw
// ===============================
function drawPage2() {
  background(20);

  // Hover detection for years/columns + cursor
  updateHoverPage2();

  // -----------------------------
  // LEGENDA POTENZA
  // -----------------------------

  // Coordinate legenda: a sinistra (pulita e coerente)
  let offsetX = margin - 8; // usa lo stesso margin del grafico
  let offsetY = height - margin - 80; // base, poi la sistemiamo con lineSpacing

  //textFont(myFont1);  OLD TYTLE
  //noStroke();
  //fill(200);
  //textSize(20);
  //textAlign(CENTER, TOP);
  //text("TOTAL AMOUNT OF BOMBS", width / 2, 35);

  textFont(myFont2);  
  noStroke();
  fill(0,255,255);
  textSize(16);
  textAlign(CENTER, TOP);
  text("Bombs Launched", width / 2, 170);

  noStroke();
  fill(0, 255, 255);
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, TOP);
  text("YIELD (kt)", offsetX, offsetY - 40);
  textAlign(RIGHT, TOP);

  textSize(14);
  textAlign(CENTER, TOP);
  //text("TOTAL AMOUNT OF BOMBS", width / 2, 80);
  let activeParticles = particles2.filter((p) => p.active).length;
  textFont(myFont3);
  textSize(60);
  fill(0,255,255);
  text(activeParticles, width / 2, 90);

  // Top-right text carousel (line + text + arrows)
  drawTopRightInfoCarousel();

  /*fill(200, 200, 200);
  textSize(14);
  textFont(myFont2);
  textAlign(RIGHT, TOP);
  text(
    "Lorum Ipsum Dolor Sit\nAmet Consectetur Adipiscing Elit\nSed Do Eiusmod Tempor?",
    width - 80,
    105
  );*/

  let legend = [
    { range: "0-19", y: 10 },
    { range: "20", y: 20 },
    { range: "21-150", y: 100 },
    { range: "151-4999", y: 1000 },
    { range: "5000+", y: 5000 },
  ];

  textFont(myFont2);
  textSize(12);
  let circleSize = 10;
  let lineSpacing = 20;

  // Etichette ATM / SOTT allineate alla legenda
  noStroke();
  fill(0, 255, 255);
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, TOP);

  // "ATM" in alto a sinistra, stesso x della legenda
  text("Atmospheric", offsetX, margin + 280);

  // "SOTT" poco sopra la legenda
  textAlign(LEFT, BOTTOM);
  text("Underground", offsetX, offsetY - 85);

  legend.forEach((item, i) => {
    fill(getYieldColor(item.y));
    let cx = offsetX + circleSize / 2;
    let cy = offsetY + i * lineSpacing;
    circle(cx, cy, circleSize);

    fill(200, 200, 200);
    textAlign(LEFT, CENTER);
    text(item.range, cx + circleSize + 5, cy);
  });

  let yearsToMark = [1950, 1963, 1990];
  yearsToMark.forEach((y) => {
    let x = map(y, startYear, endYear, margin, width - margin);

    if (scrollProgress >= y) {
      // Visualizza solo al raggiungimento di quell’anno
      stroke(0, 255, 255);
      strokeWeight(1);
      noFill();

      /*if (y === 1950) {
        line(x, yAxis + 30, x, yAxis + 90);
        rect(x - 75, yAxis + 90, 150, 100);
      } else if (y === 1963) {
        line(x, yAxis - 60, x, yAxis - 135);
        line(x, yAxis - 135, x + 75, yAxis - 135);
        rect(x + 75, yAxis - 185, 150, 100);
      } else if (y === 1990) {
        line(x, yAxis - 30, x, yAxis - 120);
        rect(x - 75, yAxis - 220, 150, 100);
      }*/
    }
  });

  if (scrollDirection !== 0 && millis() - lastStepTime > STEP_DELAY) {
    scrollProgress += scrollDirection * scrollStep;
    scrollProgress = constrain(scrollProgress, startYear - 1, endYear);
    lastStepTime = millis();
  }
  textFont(myFont2);
  disegnaAsseEAnni();

  for (let p of particles2) {
   if (enteredPage2ByScroll) {
  // attivazione colonna per colonna
  p.active = p.year <= floor(scrollProgress);
} else {
  // comportamento attuale (tutte insieme)
  p.active = true;
}

    p.update();
    p.draw();
  }

  // CTA bottom-right (glow/pulse)
  drawColumnCTA();
}

function drawColumnCTA() {
  const msg = "Click a column to see more";

  const x = width - margin;
  const y = height - margin;

  // pulsazione automatica
  const pulse = (sin(frameCount * 0.08) + 1) / 2; // 0..1
  const a = 80 + pulse * 175; // alpha

  textFont(myFont2);
  textSize(14);
  textAlign(RIGHT, BOTTOM);

  // luminanza: 2 passate morbide + 1 netta
  noStroke();
  fill(0, 255, 255, a * 0.25);
  text(msg, x + 1, y + 1);
  text(msg, x - 1, y - 1);

  fill(0, 255, 255, a);
  text(msg, x, y);
}

function updateHoverPage2() {
  hoveredYear = null;
  isHoveringInteractive = false;

  // --- PRIORITY: top-right carousel arrows hover => HAND (must run BEFORE exclusions) ---
  const lineX = width / 2 + 260;
  const boxX = lineX + 18;
  const titleY = 70;
  const boxY = titleY;

  const boxW = 340;
  const boxH = 120;


  const arrowsY = boxY + boxH + 18;
  const hitW = 34,
    hitH = 34;

  const rightCx = boxX + boxW - 4;
  const leftCx = boxX + 4;

  const overRight =
    infoStep < 3 &&
    mouseX >= rightCx - hitW / 2 &&
    mouseX <= rightCx + hitW / 2 &&
    mouseY >= arrowsY - hitH / 2 &&
    mouseY <= arrowsY + hitH / 2;

  const overLeft =
    infoStep > 0 &&
    mouseX >= leftCx - hitW / 2 &&
    mouseX <= leftCx + hitW / 2 &&
    mouseY >= arrowsY - hitH / 2 &&
    mouseY <= arrowsY + hitH / 2;

  if (overRight || overLeft) {
    cursor(HAND);
    return;
  }

  // spazio orizzontale tra anni (colonne)
  const yearStep = (width - 2 * margin) / (endYear - startYear);
  const hitX = yearStep * 0.45; // quanto "larga" è l'area hover della colonna

  // aree sensibili (anni e colonna)
  const labelTop = yAxis - 40;
  const labelBottom = yAxis + 40;
  // area del grafico (colonne) — NON include bottom UI (legenda/CTA)
  const columnTop = 80; // sopra l'asse (puoi ritoccare)
  const columnBottom = yAxis + 200;

  // EXCLUDE bottom-left legend area
  const legendLeft = margin - 10;
  const legendRight = margin + 220; // allarga se la legenda è più larga
  const legendTop = height - margin - 150; // alza/abbassa in base alla tua legenda
  const legendBottom = height;

  // EXCLUDE bottom-right CTA area
  const ctaLeft = width - margin - 320;
  const ctaRight = width;
  const ctaTop = height - margin - 60;
  const ctaBottom = height;

  // EXCLUDE top-center total bombs UI (title + number)
  const topLeft = width / 2 - 220; // larghezza box (tweak se serve)
  const topRight = width / 2 + 900;
  const topTop = 0;
  const topBottom = 350; // altezza box (tweak se serve)

  // se sei sopra legenda o CTA, niente hover e niente hand cursor
  const overLegend =
    mouseX >= legendLeft &&
    mouseX <= legendRight &&
    mouseY >= legendTop &&
    mouseY <= legendBottom;

  const overCTA =
    mouseX >= ctaLeft &&
    mouseX <= ctaRight &&
    mouseY >= ctaTop &&
    mouseY <= ctaBottom;

  const overTopUI =
    mouseX >= topLeft &&
    mouseX <= topRight &&
    mouseY >= topTop &&
    mouseY <= topBottom;

  if (overLegend || overCTA || overTopUI) {
    cursor(ARROW);
    return;
  }

  for (let year = startYear; year <= endYear; year++) {
    const x = map(year, startYear, endYear, margin, width - margin) + 3;

    const overX = abs(mouseX - x) <= hitX;
    const overLabelY = mouseY >= labelTop && mouseY <= labelBottom;
    const overColumnY = mouseY >= columnTop && mouseY <= columnBottom;

    if (overX && (overLabelY || overColumnY)) {
      hoveredYear = year;
      isHoveringInteractive = true;
      break;
    }
  }

  // Cursor
  if (isHoveringInteractive) cursor(HAND);
  else cursor(ARROW);
}

function drawTopRightInfoCarousel() {
  // Layout (tweak safe)
  const lineX = width / 2 + 260; // “a destra” del blocco centrale
  const topY = 0;

  const boxX = lineX + 18;
  const titleY = 75;   // stessa y del "TOTAL AMOUNT OF BOMBS"
  const boxY = titleY; // allineamento top testo

  const boxW = width - width / 2 - 260 - margin;    // box più lunga
  const boxH = 200;    // box più alta (più righe)

  // Vertical cyan line from top
  push();
  stroke(0, 255, 255, 160);
  strokeWeight(2);
  line(lineX, topY, lineX, boxY + boxH);
  pop();

  // Text block
  push();
  noStroke();
  textFont(myFont2);
  textSize(21);
  fill(200, 200, 200);
  textAlign(LEFT, TOP);
  text(infoTexts[infoStep], boxX, boxY, boxW, boxH);
  pop();

  // Arrows under the text block
  const arrowsY = boxY + boxH + 4;
  const chevronW = 10;
  const chevronH = 8;

  // right arrow under-right
  if (infoStep < 3) {
    drawGlowingChevronRight(boxX + boxW - 4, arrowsY, chevronW, chevronH);
  }
  // left arrow under-left
  if (infoStep > 0) {
    drawGlowingChevronLeft(boxX + 4, arrowsY, chevronW, chevronH);
  }
}

function drawGlowingChevronRight(cx, cy, halfW, h) {
  const pulse = (sin(frameCount * 0.08) + 1) / 2; // 0..1
  const a = 90 + pulse * 165;

  // luminanza (2 passate) + netta
  push();
  strokeWeight(2);
  noFill();

  stroke(0, 255, 255, a * 0.25);
  line(cx - halfW, cy - h, cx, cy);
  line(cx - halfW, cy + h, cx, cy);

  stroke(0, 255, 255, a);
  line(cx - halfW, cy - h, cx, cy);
  line(cx - halfW, cy + h, cx, cy);
  pop();
}

function drawGlowingChevronLeft(cx, cy, halfW, h) {
  const pulse = (sin(frameCount * 0.08) + 1) / 2;
  const a = 90 + pulse * 165;

  push();
  strokeWeight(2);
  noFill();

  stroke(0, 255, 255, a * 0.25);
  line(cx + halfW, cy - h, cx, cy);
  line(cx + halfW, cy + h, cx, cy);

  stroke(0, 255, 255, a);
  line(cx + halfW, cy - h, cx, cy);
  line(cx + halfW, cy + h, cx, cy);
  pop();
}

function mouseWheel(event) { 
  if (page === 1) {
    spreadSpeed += event.delta * 0.05;

    if (scrollOffset < maxScroll) {
      scrollOffset += event.delta * 0.5;
      scrollOffset = constrain(scrollOffset, 0, maxScroll);
    } else {
      // Start automatic animation once max scroll reached
      if (!autoExpandStarted) {
        autoExpandStarted = true;
        expandStartFrame = frameCount;
      }
    }
  } else if (page === 2) {
    if (event.delta > 0) scrollDirection = 1;
    else if (event.delta < 0) scrollDirection = -1;
  }
  return false;
}

function mousePressed() {
  // ------------ page 2 ------------
  if (page === 2) {
    // --- click on top-right carousel arrows ---
    const lineX = width / 2 + 260;
    const boxX = lineX + 18;
    const titleY = 70;
    const boxY = titleY;

    const boxW = width - width / 2 - 260 - margin;
    const boxH = 200;

    const arrowsY = boxY + boxH + 18;


    const hitW = 34,
      hitH = 34;

    // freccia destra sotto-dx del box
    const rightCx = boxX + boxW - 4;
    // freccia sinistra sotto-sx del box
    const leftCx = boxX + 4;

    const overRight =
      infoStep < 3 &&
      mouseX >= rightCx - hitW / 2 &&
      mouseX <= rightCx + hitW / 2 &&
      mouseY >= arrowsY - hitH / 2 &&
      mouseY <= arrowsY + hitH / 2;

    const overLeft =
      infoStep > 0 &&
      mouseX >= leftCx - hitW / 2 &&
      mouseX <= leftCx + hitW / 2 &&
      mouseY >= arrowsY - hitH / 2 &&
      mouseY <= arrowsY + hitH / 2;

    if (overRight) {
      infoStep++;
      return;
    }
    if (overLeft) {
      infoStep--;
      return;
    }

    for (let p of particles2) {
      let d = dist(mouseX, mouseY, p.x, p.y);
      if (d < p.r) {
        let targetYear = p.year;
        window.location.href = `year.html?year=${targetYear}`;
        break;
      }
    }
    for (let year = startYear; year <= endYear; year++) {
      let x = map(year, startYear, endYear, margin, width - margin) + 3;
      let y = yAxis;
      let tw = textWidth(year);
      let th = 12; // textSize

      let dx = mouseX - x;
      let dy = mouseY - y;
      let rx = dx * cos(-HALF_PI) - dy * sin(-HALF_PI);
      let ry = dx * sin(-HALF_PI) + dy * cos(-HALF_PI);

      if (rx >= -tw / 2 && rx <= tw / 2 && ry >= 0 && ry <= th) {
        window.location.href = `year.html?year=${year}`;
        break;
      }
    }
  }
}

function keyPressed() {
  // Only on page2 and when menu is not open
  if (page !== 2 || menuOpen) return;

  if (keyCode === RIGHT_ARROW && infoStep < 3) {
    infoStep++;
  } else if (keyCode === LEFT_ARROW && infoStep > 0) {
    infoStep--;
  }
}

function mouseReleased() {
  if (page === 2) scrollDirection = 0;
}

// ===============================
// particles in page1
// ===============================
class Particle1 {
  constructor(angle, a, b, rot, size) {
    this.angle = angle;
    this.a = a;
    this.b = b;
    this.rot = rot;
    this.size = size;
    this.currentA = a;
    this.currentB = b;
    this.rotationSpeed = random(0.002, 0.02);
    this.expandSpeed = random(0.1, 0.5);
  }
  update(speed) {
    this.angle += this.rotationSpeed;
    if (speed > 0) {
      this.currentA += this.expandSpeed * speed;
      this.currentB += this.expandSpeed * speed;
    } else {
      this.currentA = max(this.a, this.currentA + this.expandSpeed * speed);
      this.currentB = max(this.b, this.currentB + this.expandSpeed * speed);
    }
  }
  show() {
    let x = this.currentA * cos(this.angle);
    let y = this.currentB * sin(this.angle);
    let xr = x * cos(this.rot) - y * sin(this.rot);
    let yr = x * sin(this.rot) + y * cos(this.rot);
    noStroke();
    fill(0, 255, 255);
    ellipse(xr, yr, this.size, this.size);
  }
}

// ===============================
// particles in page2
// ===============================
class Particle2 {
  constructor(year, isUG, yieldVal, targetX, targetY) {
    this.year = year;
    this.isUG = isUG;
    this.yieldVal = yieldVal;
    this.tx = targetX;
    this.ty = targetY;
    this.x = random(width);
    this.y = -random(50, 200);
    this.col = color(getYieldColor(this.yieldVal));
    this.r = 4;
    this.speed = random(0.03, 0.08);
    this.active = false;
  }
  update() {
    if (!this.active) return;
    this.x = lerp(this.x, this.tx, this.speed);
    this.y = lerp(this.y, this.ty, this.speed);
  }
  draw() {
    if (!this.active) return;

    const isHover = hoveredYear === this.year;
    const rr = isHover ? this.r * 1.25 : this.r;

    noStroke();
    fill(this.col);
    circle(this.x, this.y, rr);
  }
}

// ===============================
// Funzioni di supporto per la pagina2
// ===============================
function getYieldColor(y) {
  if (y >= 0 && y <= 19) return "#fcddbfff";
  else if (y === 20) return "#FFB873";
  else if (y >= 21 && y <= 150) return "#ff7a22ff";
  else if (y >= 151 && y <= 4999) return "#f35601ff";
  else if (y >= 5000) return "#c21d00ff";
}

function getColorLevel(y) {
  if (y >= 0 && y <= 19) return 0;
  else if (y === 20) return 1;
  else if (y >= 21 && y <= 150) return 2;
  else if (y >= 151 && y <= 4999) return 3;
  else if (y >= 5000) return 4;
  else return 5;
}

function creaParticlesDaTabella() {
  let cellSize = 5,
    gap = 1,
    cols = 2,
    colWidth = cols * cellSize + (cols - 1) * gap;
  for (let year = startYear; year <= endYear; year++) {
    let x = map(year, startYear, endYear, margin, width - margin);
    let nonUGBombs = [];
    for (let i = 0; i < data.length; i++) {
      let rowYear = data[i].year;
      let type = data[i].type;
      if (rowYear === year && !UGTypes.includes(type)) {
        nonUGBombs.push({ yieldVal: data[i].yield });
      }
    }
    nonUGBombs.sort(
      (a, b) => getColorLevel(a.yieldVal) - getColorLevel(b.yieldVal)
    );
    for (let i = 0; i < nonUGBombs.length; i++) {
      let row = floor(i / cols),
        col = i % cols;
      let cx = x - colWidth / 2 + col * (cellSize + gap);
      let cy = yAxis - (row + 6) * (cellSize + gap);
      particles2.push(
        new Particle2(year, false, nonUGBombs[i].yieldVal, cx, cy)
      );
    }

    let ugBombs = [];
    for (let i = 0; i < data.length; i++) {
      let rowYear = data[i].year;
      let type = data[i].type;
      if (rowYear === year && UGTypes.includes(type)) {
        ugBombs.push({ yieldVal: data[i].yield });
      }
    }
    ugBombs.sort(
      (a, b) => getColorLevel(a.yieldVal) - getColorLevel(b.yieldVal)
    );
    for (let i = 0; i < ugBombs.length; i++) {
      let row = floor(i / cols),
        col = i % cols;
      let cx = x - colWidth / 2 + col * (cellSize + gap);
      let cy = yAxis + (row + 6) * (cellSize + gap);
      particles2.push(new Particle2(year, true, ugBombs[i].yieldVal, cx, cy));
    }
  }
}

function disegnaAsseEAnni() {
  textAlign(CENTER, TOP);
  noStroke();

  for (let year = startYear; year <= endYear; year++) {
    let x = map(year, startYear, endYear, margin, width - margin) + 3;
    let y = yAxis;

    const isHover = hoveredYear === year;

    push();
    translate(x + 3, y);
    rotate(HALF_PI);

    if (isHover) {
      fill(0,255,255);
      textSize(14);
      scale(1.06); // ingrandimento leggero
    } else {
      fill(220);
      textSize(12);
    }

    text(year, 0, 0);
    pop();
  }
}

function goNextPage() {
  // Vai alla pagina 2 (grafico)
  page = 2;

  // Stessa logica di goToOverview:
  // porta subito la timeline alla fine
 
  enteredPage2ByScroll = true; // <-- AGGIUNTO

  scrollProgress = startYear - 1; // <-- CAMBIATO (prima era endYear)



  // Nascondi il bottone se per caso è ancora visibile
  const skipBtn = document.getElementById("skipIntroBtn");
  if (skipBtn && skipBtn.parentElement) {
    skipBtn.parentElement.style.display = "none";
  }
}

// ===============================
// LISTENER MENU → CAMBIO PAGINA
// ===============================
window.addEventListener("changePage", (e) => {
  // <<< AGGIORNATO
  if (e.detail.page === 2) {
    goToOverview();
  } else {
    page = e.detail.page;
  }
});
 
