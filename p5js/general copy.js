// ===============================
// Variabili globali
// ===============================
let page = 1;
let data = [];
let menuOpen = false;
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
let margin = 100;
let yAxis;

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


function preload() {
  // pagina1
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
  img1 = loadImage("images/bleauuu.png");


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
  imageMode(CENTER);
  tint(255, 180);
  image(img1, width / 2, height / 2, 1200, 900);

  //textFont(myFont2);
  //fill(150);
  //textSize(16);
  //textAlign(CENTER, BOTTOM);
  //text("SCROLL DOWN FOR MORE", width / 2, height - 40);

  textFont(myFont1);
  noStroke();
  fill(110, 133, 219);
  textSize(20);
  textAlign(CENTER, TOP);
  text("NUCLEAR EXPLOSIONS ARCHIVE", width / 2, 20 - scrollOffset);

  textFont(myFont2);
  textSize(16);
  fill(200, 200, 200);

  textAlign(LEFT, BOTTOM);
  let str1 =
    "Between 1945 and 1998, over two thousand nuclear explosions \nleft a lasting mark on the planet.";
  let str2 =
    "This archive turns those events into a dynamic map \nof the atomic era.";
  let str3 =
    "The atom breaks: each particle is a real test. \nHistory unfolds before your eyes.";
  let str4 = "Datas from the SIPRI-FOA Report";

  text(str1, 50, height + 100 - scrollOffset, 500);
  text(str2, width - 550, height * 2 - scrollOffset, 500);
  text(str3, 50, height * 3 - scrollOffset, 500);
  text(str4, width - 550, height * 4 - scrollOffset, 500);

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

// ===============================
// pagina2draw
// ===============================
function drawPage2() {
  background(20);

  // -----------------------------
  // LEGENDA POTENZA
  // -----------------------------
  
  // Coordinate di riferimento in basso a destra
let offsetX = width - 150; // distanza dal bordo destro
let offsetY = height - 150; // distanza dal bordo inferiore
  
  noStroke();
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(14);
  textAlign(LEFT, TOP);
  text("YIELD (kt)", offsetX, offsetY - 40);
  textAlign(RIGHT, TOP);
  text("SOME INFORMATION??", width - 80, 70);

  textAlign(CENTER, TOP);
  text("TOTAL AMOUNT OF BOMBS", width / 2, 70);
  let activeParticles = particles2.filter((p) => p.active).length;
  textSize(60);
  fill(0, 255, 255);
  text(activeParticles, width / 2, 90);

  fill(200, 200, 200);
  textSize(14);
  textFont(myFont2);
  textAlign(RIGHT, TOP);
  text(
    "Lorum Ipsum Dolor Sit\nAmet Consectetur Adipiscing Elit\nSed Do Eiusmod Tempor?",
    width - 80,
    105
  );

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

      if (y === 1950) {
        line(x, yAxis + 30, x, yAxis + 90);
        rect(x - 75, yAxis + 90, 150, 100);
      } else if (y === 1963) {
        line(x, yAxis - 60, x, yAxis - 135);
        line(x, yAxis - 135, x + 75, yAxis - 135);
        rect(x + 75, yAxis - 185, 150, 100);
      } else if (y === 1990) {
        line(x, yAxis - 30, x, yAxis - 120);
        rect(x - 75, yAxis - 220, 150, 100);
      }
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
    p.active = p.year - random(0, 0.9) <= scrollProgress;
    p.update();
    p.draw();
  }

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
  // -----------------------------
  // Common to all pages: menu
  // -----------------------------
  let d = dist(mouseX, mouseY, 50, 50);
  if (d < 15) {
    menuOpen = !menuOpen;
    return;
  }

  if (menuOpen) {
    // HOMEPAGE
    if (mouseX > 20 && mouseX < 300 && mouseY > 75 && mouseY < 95) {
      window.location.href = "index.html";
      menuOpen = false;
      return;
    }

    // GENERAL VISUALIZATION
    if (mouseX > 20 && mouseX < 300 && mouseY > 105 && mouseY < 125) {
      goNextPage();
      menuOpen = false;
      return;
    }

    // BOMBS IN ONE YEAR
    if (mouseX > 20 && mouseX < 300 && mouseY > 135 && mouseY < 155) {
      window.location.href = "year.html?id=1";
      menuOpen = false;
      return;
    }

    // SINGLE BOMB
    if (mouseX > 20 && mouseX < 300 && mouseY > 135 && mouseY < 185) {
      window.location.href = "single.html";
      menuOpen = false;
      return;
    }

    // INSIGHT
    if (mouseX > 20 && mouseX < 300 && mouseY > 135 && mouseY < 215) {
      window.location.href = "insight.html";
      menuOpen = false;
      return;
    }

    // ABOUT
    if (mouseX > 20 && mouseX < 300 && mouseY > 135 && mouseY < 245) {
      window.location.href = "about.html";
      menuOpen = false;
      return;
    }
  }

  // ------------ page 2 ------------
  if (page === 2) {
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
// grid
// ===============================
function drawGrid() {
  let spacing = 20;
  stroke(110, 133, 219, 100);
  strokeWeight(0.5);
  for (let x = 0; x <= width; x += spacing) line(x, 0, x, height);
  for (let y = 0; y <= height; y += spacing) line(0, y, width, y);
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
    noStroke();
    fill(this.col);
    circle(this.x, this.y, this.r);
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
  textSize(12);
  fill(0, 255, 255);
  noStroke();

  for (let year = startYear; year <= endYear; year++) {
    let x = map(year, startYear, endYear, margin, width - margin) + 3;
    let y = yAxis;

    push();
    translate(x + 3, y);
    rotate(HALF_PI);
    text(year, 0, 0);
    pop();
  }
}

function goNextPage() {
  // Vai alla pagina 2 (grafico)
  page = 2;

  // Stessa logica di goToOverview:
  // porta subito la timeline alla fine
  scrollProgress = endYear;

  if (particles2 && particles2.length > 0) {
    for (let p of particles2) {
      p.active = true;
    }
  }

  // Nascondi il bottone se per caso è ancora visibile
  const skipBtn = document.getElementById("skipIntroBtn");
  if (skipBtn && skipBtn.parentElement) {
    skipBtn.parentElement.style.display = "none";
  }
}


// ===============================
// menu
// ===============================
function drawMenuIcon() {
  fill(0, 255, 255);
  noStroke();
  ellipse(50, 50, 20, 20);

  // menuopen
  if (menuOpen) {
    fill(200);
    rect(0, 0, 300, windowHeight);
    textFont(myFont2);
    textSize(12);
    fill(110, 133, 219);
    textAlign(LEFT, TOP);
    fill(110, 133, 219);
    noStroke();
    ellipse(50, 50, 20, 20);
    text("HOMEPAGE", 50, 80);
    text("GENERAL VISUALIZATION", 50, 110);
    text("BOMBS IN ONE YEAR", 50, 140);
    text("SINGLE BOMB", 50, 170);
    text("INSIGHT", 50, 200);
    text("ABOUT", 50, 230);
  }
}

// ===============================
// LISTENER MENU → CAMBIO PAGINA
// ===============================
window.addEventListener("changePage", (e) => {   // <<< AGGIORNATO
  if (e.detail.page === 2) {
    goToOverview();
  } else {
    page = e.detail.page;
  }
});