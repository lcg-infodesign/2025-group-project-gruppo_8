let table;
let years = [];
let currentYearIndex = 0;
let testsByYear = {};
let countries = [];
let dots = [];
let mushroomImg;

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
  img1 = loadImage("images/bleauuu.png");
  mushroomImg = loadImage("images/bleauuu.png");
  table = loadTable("dataset/dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  processData();
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

  // Fungo atomico come sfondo
  if (mushroomImg) {
    push();
    tint(255, 100, 0);
    imageMode(CENTER);
    // Adatta in altezza
    let imgH = height;
    let imgW = height * (mushroomImg.width / mushroomImg.height);
    image(mushroomImg, width / 2, height / 2, imgW, imgH);
    pop();
  }

  textFont(myFont3);
  fill(0, 255, 255);
  textAlign(CENTER, TOP);
  textSize(33);
  text("NUCLEAR TEST EACH YEAR", width / 2, 40);

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
  drawLegend();
}

function processData() {
  let allTests = [];
  for (let i = 0; i < table.getRowCount(); i++) {
    let id_no = table.getString(i, "id_no");
    let year = parseInt(table.getString(i, "year"));
    let country = table.getString(i, "country");
    let yield_u = parseFloat(table.getString(i, "yield_u"));
    let type = table.getString(i, "type");
    if (!isNaN(year) && year > 0 && country && country.trim() !== "") {
      allTests.push({
        id: id_no,
        year: year,
        country: country.trim(),
        yield: isNaN(yield_u) || yield_u < 0 ? 0 : yield_u,
        type: type || "ATMOSPH",
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
      type: test.type,
    });
  });
  years.sort((a, b) => a - b);
  if (years.length > 0) {
    const minYear = years[0];
    const maxYear = years[years.length - 1];
    for (let y = minYear; y <= maxYear; y++) {
      if (!testsByYear[y]) {
        testsByYear[y] = {};
        years.push(y);
      }
    }
    years.sort((a, b) => a - b);
  }
  countries.sort();
  const countryOrder = ["INDIA", "PAKIST", "USA", "USSR", "FRANCE", "UK", "CHINA"];
  countries.sort((a, b) => {
    const indexA = countryOrder.indexOf(a);
    const indexB = countryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
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
  textSize(48);
  fill(200);
  textFont(myFont2);
  text(currentYear, width / 2, 120);
  textFont(myFont3);
  fill(0, 255, 255);
  textSize(14);
  text("YEAR", width / 2, 100);

  // Freccia sinistra < (invertita rispetto a prima)
  let hoverLeft = mouseX > width / 2 - 150 && mouseX < width / 2 - 90 && mouseY > 120 && mouseY < 170;
  stroke(hoverLeft ? 255 : 150);
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(width / 2 - 125, 145);
  vertex(width / 2 - 100, 130);
  vertex(width / 2 - 100, 160);
  endShape(CLOSE);

  // Freccia destra > (invertita rispetto a prima)
  let hoverRight = mouseX > width / 2 + 90 && mouseX < width / 2 + 150 && mouseY > 120 && mouseY < 170;
  stroke(hoverRight ? 255 : 150);
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(width / 2 + 125, 145);
  vertex(width / 2 + 100, 130);
  vertex(width / 2 + 100, 160);
  endShape(CLOSE);
}

function drawTestDots(yearData) {
  dots = [];
  let cellSize = 15;
  let gap = 8;
  let cols = 5;
  let lineY = height / 2 + 50;
  let fixedSpacing = 150;

  // Testo "ATM / SOTT" a sinistra
  textFont(myFont3);
  fill(0, 255, 255);
  textAlign(RIGHT, CENTER);
  textSize(14);
  noStroke();
  text("ATM", 230, lineY - 40);
  text("SOTT", 230, lineY + 40);

  let hoveredDot = null;

  countries.forEach((country, idx) => {
    let tests = yearData[country] || [];
    let x = width / 2 + (idx - (countries.length - 1) / 2) * fixedSpacing;

    tests.sort((a, b) => {
      let levelDiff = getColorLevel(a.yield) - getColorLevel(b.yield);
      if (levelDiff !== 0) return levelDiff;
      if (a.type === "ATMOSPH" && b.type !== "ATMOSPH") return -1;
      if (a.type !== "ATMOSPH" && b.type === "ATMOSPH") return 1;
      return 0;
    });

    let numCols = Math.max(1, Math.min(cols, tests.length));
    let colWidth = (numCols - 1) * (cellSize + gap);

    tests.forEach((test, i) => {
      let col = i % cols;
      let row = Math.floor(i / cols);
      let cx = x - colWidth / 2 + col * (cellSize + gap);
      let cy;
      if (test.type === "ATMOSPH") {
        cy = lineY - (cellSize + gap) - row * (cellSize + gap);
      } else {
        cy = lineY + (cellSize + gap) + row * (cellSize + gap);
      }

      // Check hover
      let d = dist(mouseX, mouseY, cx, cy);
      let isHovered = d < cellSize / 2;
      let size = isHovered ? cellSize * 1.5 : cellSize;

      fill(getYieldColor(test.yield));
      noStroke();
      circle(cx, cy, size);

      dots.push({
        cx: cx,
        cy: cy,
        r: cellSize / 2,
        id: test.id,
      });

      if (isHovered) {
        hoveredDot = { cx, cy };
      }
    });

    // Nome paese al centro sulla linea
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    fill(200);
    text(country, x, lineY);
  });

  // Cambia cursore se hover su dot
  if (hoveredDot) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  // Call to action
  textFont(myFont3);
  fill(0, 255, 255);
  textAlign(CENTER);
  textSize(14);
  text("CLICK ON ANY DOT TO VIEW DETAILS", width / 2, height - 50);
}

function drawBottomInfo(yearData) {
  let total = Object.values(yearData).reduce((sum, tests) => sum + tests.length, 0);

  fill(0, 255, 255);
  textAlign(RIGHT, TOP);
  textSize(14);
  textFont(myFont3);
  text("TOTAL BOMBS", width - 80, 70);
  textSize(48);
  textFont(myFont2);
  text(total, width - 80, 90);
}

function drawLegend() {
  let offsetX = 80;
  let offsetY = height - 200;

  textFont(myFont3);
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
  let circleSize = 15;
  let lineSpacing = 30;

  legend.forEach((item, i) => {
    fill(getYieldColor(item.y));
    let cx = offsetX + circleSize / 2;
    let cy = offsetY + i * lineSpacing + circleSize / 2;
    circle(cx, cy, circleSize);
    fill(200, 200, 200);
    textAlign(LEFT, CENTER);
    text(item.range, cx + circleSize + 10, cy);
  });
}

function mouseWheel(event) {
  return false;
}

function mousePressed() {
  if (mouseX > width / 2 - 150 && mouseX < width / 2 - 90 && mouseY > 120 && mouseY < 170) {
    if (currentYearIndex > 0) {
      currentYearIndex--;
    }
    return;
  }
  if (mouseX > width / 2 + 90 && mouseX < width / 2 + 150 && mouseY > 120 && mouseY < 170) {
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

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (currentYearIndex > 0) {
      currentYearIndex--;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (currentYearIndex < years.length - 1) {
      currentYearIndex++;
    }
  }
}

window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});