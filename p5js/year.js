let table;
let years = [];
let currentYearIndex = 0;
let testsByYear = {};
let countries = [];
let dots = [];
let menuOpen = false;

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
  img1 = loadImage("images/bleauuu.png");

  table = loadTable("dataset/dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  processData(); // Prima elabora i dati per generare l'array years

  const urlParams = new URLSearchParams(window.location.search);
  const yearParam = urlParams.get("year");
  console.log(yearParam);

  if (yearParam) {
    const parsedYear = parseInt(yearParam);
    const index = years.indexOf(parsedYear);
    if (index !== -1) {
      currentYearIndex = index;
    }
  }
}

function draw() {
  background(20);
  drawGrid();
  textFont(myFont1);
  fill(110, 133, 219);
  textSize(20);
  textAlign(CENTER, TOP);
  text("BOMBS IN EACH YEAR", width / 2, 20);

  if (years.length === 0) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Caricamento dati...", width / 2, height / 2);
    return;
  }

  let currentYear = years[currentYearIndex];
  let yearData = testsByYear[currentYear];

  drawYearNavigation(currentYear);
  drawTestDots(yearData);
  drawBottomInfo(yearData);

  drawMenuIcon();
}

function processData() {
  let allTests = [];

  for (let i = 0; i < table.getRowCount(); i++) {
    let id_no = table.getString(i, "id_no");
    let year = parseInt(table.getString(i, "year"));
    let country = table.getString(i, "country");
    let yield_u = parseFloat(table.getString(i, "yield_u"));

    if (!isNaN(year) && year > 0 && country && country.trim() !== "") {
      allTests.push({
        id: id_no,
        year: year,
        country: country.trim(),
        yield: isNaN(yield_u) || yield_u < 0 ? 0 : yield_u,
      });
    }
  }

  allTests.forEach((test) => {
    if (!testsByYear[test.year]) {
      testsByYear[test.year] = {};
      years.push(test.year);
    }
    if (!testsByYear[test.year][test.country]) {
      testsByYear[test.year][test.country] = [];
      if (!countries.includes(test.country)) countries.push(test.country);
    }
    testsByYear[test.year][test.country].push({
      id: test.id,
      yield: test.yield,
    });
  });

  years.sort((a, b) => a - b);
  countries.sort();
}

function getYieldColor(y) {
  if (isNaN(y) || y === null || y === undefined) y = 0;

  if (y >= 0 && y <= 19) return color("#fcddbfff");
  else if (y === 20) return color("#FFB873");
  else if (y >= 21 && y <= 150) return color("#ff7a22ff");
  else if (y >= 151 && y <= 4999) return color("#f35601ff");
  else if (y >= 5000) return color("#c21d00ff");
}

function getColorLevel(y) {
  if (y >= 0 && y <= 19) return 0;
  else if (y === 20) return 1;
  else if (y >= 21 && y <= 150) return 2;
  else if (y >= 151 && y <= 4999) return 3;
  else if (y >= 5000) return 4;
  else return 5;
}

function drawYearNavigation(currentYear) {
  textAlign(RIGHT, TOP);
  textSize(32);
  fill(200);
  textFont(myFont2);
  text(currentYear, width - 80, 120);
  textFont(myFont3);
  fill(0, 255, 255);
  textSize(14);
  text("YEAR", width - 80, 70);

  // Freccia sinistra <
  fill(
    mouseX > width / 2 - 150 &&
      mouseX < width / 2 - 90 &&
      mouseY > 110 &&
      mouseY < 150
      ? 255
      : 150
  );
  triangle(width / 2 - 130, 130, width / 2 - 100, 115, width / 2 - 100, 145);

  // Freccia destra >
  fill(
    mouseX > width / 2 + 90 &&
      mouseX < width / 2 + 150 &&
      mouseY > 110 &&
      mouseY < 150
      ? 255
      : 150
  );
  triangle(width / 2 + 130, 130, width / 2 + 100, 115, width / 2 + 100, 145);
}

function drawTestDots(yearData) {
  dots = [];
  let cellSize = 15;
  let gap = 8;
  let cols = 5;
  let lineY = height - 150; // linea di base
  let fixedSpacing = 150; // spaziatura fissa tra i nomi dei paesi

  countries.forEach((country, idx) => {
    let tests = yearData[country] || [];
    let x = width / 2 + (idx - (countries.length - 1) / 2) * fixedSpacing;

    // Ordinare per livello di colore, dal più basso al più alto
    tests.sort((a, b) => getColorLevel(a.yield) - getColorLevel(b.yield));

    let numCols = Math.max(1, Math.min(cols, tests.length));
    let colWidth = (numCols - 1) * (cellSize + gap);

    tests.forEach((yieldVal, i) => {
      let col = i % cols;
      let row = Math.floor(i / cols);

      // Allineare il centro della colonna con il centro del testo
      let cx = x - colWidth / 2 + col * (cellSize + gap);
      let cy = lineY - row * (cellSize + gap);

      fill(getYieldColor(yieldVal.yield));
      noStroke();
      circle(cx, cy, cellSize);

      // Salva l’area cliccabile
      dots.push({
        cx: cx,
        cy: cy,
        r: cellSize / 2,
        id: yieldVal.id,
      });
    });

    // Disegna il nome del paese
    noStroke();
    textAlign(CENTER);
    textSize(13);
    fill(200);
    text(country, x, lineY + 30);
  });
}

function drawBottomInfo(yearData) {
  let total = Object.values(yearData).reduce(
    (sum, tests) => sum + tests.length,
    0
  );

  fill(0, 255, 255);
  textAlign(CENTER, TOP);
  textSize(14);
  text("TATAL BOMBS IN EACH YEAR", width / 2, 70);
  textSize(60);
  text(total, width / 2, 90);

  textAlign(LEFT, TOP);
  fill(0, 255, 255);
  textSize(14);
  text("YIELD", 80, 70);

  let legend = [
    { range: "0-19 kt", y: 10 },
    { range: "20 kt", y: 20 },
    { range: "21-150 kt", y: 100 },
    { range: "151-4999 kt", y: 1000 },
    { range: "5000+ kt", y: 5000 },
  ];

  textFont(myFont2);
  textSize(12);
  let circleSize = 10;
  let lineSpacing = 20;

  legend.forEach((item, i) => {
    fill(getYieldColor(item.y));
    let cx = 80 + circleSize / 2;
    let cy = 80 + 25 + i * lineSpacing;
    circle(cx, cy, circleSize);

    fill(200, 200, 200);
    textAlign(LEFT, CENTER);
    text(item.range, cx + circleSize + 5, cy);
  });
}

function mouseWheel(event) {
  if (event.delta > 0) {
    // Scorrendo verso il basso → incremento dell’anno
    if (currentYearIndex < years.length - 1) currentYearIndex++;
  } else if (event.delta < 0) {
    // Scorrendo verso l’alto → decremento dell’anno
    if (currentYearIndex > 0) currentYearIndex--;
  }
  // impedire lo scorrimento predefinito della pagina
  return false;
}

function drawGrid() {
  let spacing = 20;
  stroke(110, 133, 219, 100);
  strokeWeight(0.5);
  for (let x = 0; x <= width; x += spacing) line(x, 0, x, height);
  for (let y = 0; y <= height; y += spacing) line(0, y, width, y);
  tint(255, 180);
  //if (img1) image(img1, 13 * spacing, 3 * spacing, 45 * spacing, 35 * spacing);
}

function mousePressed() {
  // freccia sinistra <
  if (
    mouseX > width / 2 - 150 &&
    mouseX < width / 2 - 90 &&
    mouseY > 110 &&
    mouseY < 150
  ) {
    if (currentYearIndex > 0) {
      currentYearIndex--;
    }
    return;
  }

  // freccia destra >
  if (
    mouseX > width / 2 + 90 &&
    mouseX < width / 2 + 150 &&
    mouseY > 110 &&
    mouseY < 150
  ) {
    if (currentYearIndex < years.length - 1) {
      currentYearIndex++;
    }
    return;
  }

  for (let d of dots) {
    if (dist(mouseX, mouseY, d.cx, d.cy) < d.r) {
      window.location.href = `single.html?id=${d.id}`;
      return;
    }
  }

  // -----------------------------
  // Common to all pages: menu
  // -----------------------------
  let d = dist(mouseX, mouseY, 50, 50);
  if (d < 15) {
    menuOpen = !menuOpen;
    return;
  }

  // -----------------------------
  // menuopen
  // -----------------------------
  if (menuOpen) {
    // HOMEPAGE
    if (mouseX > 20 && mouseX < 300 && mouseY > 75 && mouseY < 95) {
      window.location.href = "index.html";
      menuOpen = false;
      return;
    }

    // GENERAL VISUALIZATION
    if (mouseX > 20 && mouseX < 300 && mouseY > 105 && mouseY < 125) {
      window.location.href = "index.html#page2";
      menuOpen = false;
      return;
    }

    // BOMBS IN ONE YEAR
    if (mouseX > 20 && mouseX < 300 && mouseY > 135 && mouseY < 155) {
      window.location.href = "year.html?id=1";
      menuOpen = false;
      return;
    }
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
