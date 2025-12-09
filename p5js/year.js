let table;
let years = [];
let currentYearIndex = 0;
let testsByYear = {};
let countries = [];
let dots = [];

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
  background(20)

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

  // 🔹 Aggiungo anche gli anni "vuoti" tra il primo e l'ultimo
  years.sort((a, b) => a - b);

  if (years.length > 0) {
    const minYear = years[0];
    const maxYear = years[years.length - 1];

    for (let y = minYear; y <= maxYear; y++) {
      if (!testsByYear[y]) {
        // Nessun test in quell'anno → creo un anno vuoto
        testsByYear[y] = {};
        years.push(y);
      }
    }

    years.sort((a, b) => a - b);
  }

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
  textAlign(CENTER, TOP);
  textSize(32);
  fill(200);
  textFont(myFont2);
  text(currentYear, width/2,110);
  textFont(myFont3);
  fill(0, 255, 255);
  textSize(14);
  text("YEAR", width/2, 90);

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
  textAlign(RIGHT, TOP);
  textSize(14);
  text("TOTAL BOMBS IN THAT YEAR", width-80, 70);
  textSize(60);
  text(total, width-80 , 90);

 
  // Coordinate di riferimento in basso a destra
let offsetX = width - 150; // distanza dal bordo destro
let offsetY = height - 150; // distanza dal bordo inferiore

  textAlign(LEFT, TOP);
  fill(0, 255, 255);
  textSize(14);
  text("YIELD (kt)", offsetX, offsetY - 40);

  
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

}
window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});
