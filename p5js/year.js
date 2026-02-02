let table;
let years = [];
let currentYearIndex = 0;
let testsByYear = {};
let countries = [];
let dots = [];
let mushroomImg;
let noTestYears = [1947, 1950, 1959, 1997];
let noTestTexts = {
  1947: `No tests were conducted in 1947
In 1947, no nuclear tests were conducted. After the atomic bombings of Hiroshima and Nagasaki, the United States, the only country with nuclear weapons at the time, undertook a strategic review of nuclear weapons policy. There was no immediate military need for further testing, and U.S. strategy increasingly emphasized deterrence over continued experimentation. Nuclear tests were also technically difficult, expensive, and politically sensitive as Cold War tensions were just beginning to emerge.`,

  1950: `No tests were conducted in 1950
In 1950 the strategic competition between the United States and the Soviet Union entered a new phase. Situated between the first Soviet nuclear test in 1949 and the next one in 1951, the year was not marked by spectacular events. It’s precisely this apparent lack of dramatic turning points that gives it its historical significance. In 1950, the Soviet Union’s status as an atomic power was fully absorbed by the United States and its allies, resulting in an arms race characterized by increasingly intense technological and doctrinal competition.
The awareness that both superpowers possessed nuclear capabilities introduced the real risk of mutually assured destruction, laying the foundations for the concept of modern nuclear deterrence: international stability was no longer guaranteed by the superiority of a single power, but by the balance of a symmetrical threat. The absence of significant tests during the 1950s did not therefore reflect a period of stagnation, but rather the caution imposed by the fear of uncontrollable escalation.
At the same time, this period was marked by intense research and development activity. In 1950, systematic studies began on more advanced weapons systems, including the hydrogen bomb, which was destined to exceed the power of previous weapons by orders of magnitude. Therefore, 1950 marked a pivotal moment in which deterrence evolved into a structural element of the Cold War international order.`,

  1959: `No tests were conducted in 1959
The reason there were no tests in 1959 was that the Soviet Union, Great Britain, and the United States agreed to a moratorium on nuclear weapon tests in 1958. This moratorium lasted from November 1958 to August 1961. The Soviet Union resumed on 1 September, 1961, with the US following suit a couple of weeks later.
France, being on the verge of being a nuclear-capable nation in 1958, did not take part in that moratorium. They didn't test in 1959 because they did not quite have the ability to do so. They did have that ability in 1960.
The 1958–1961 moratorium represented a rare moment of international cooperation during the Cold War, aiming to slow down the nuclear arms race and reduce atmospheric fallout. While the main powers paused testing, technological development and planning continued in secret. For countries like France, this period allowed them to finalize key technologies before conducting their first successful tests in 1960. The moratorium also highlighted the growing importance of diplomacy and negotiation in nuclear policy, setting a precedent for future treaties such as the Partial Test Ban Treaty of 1963.`,

  1997: `No tests were conducted in 1997
In 1997, no nuclear weapons tests were conducted because the international situation was relatively stable and shaped by post–Cold War arms control. The Cold War had ended, the Soviet Union no longer existed, and tensions between major powers had significantly decreased. During this period, the United States and Russia continued to possess nuclear arsenals, but their activities were increasingly regulated by arms control agreements, such as the START Agreements (Strategic Arms Reduction Treaties). Two treaties were negotiated: START I, which entered into force in 1994, and START II, which was signed but never fully implemented.
The START Agreements were created to reduce the number of nuclear warheads and delivery systems possessed by the United States and Russia. They set specific limits and required both countries to share data and allow inspections, making nuclear forces more transparent and easier to monitor. By focusing on reducing existing weapons rather than developing new ones. The START Agreements helped move nuclear policy away from weapon development and testing toward arms reduction and long-term strategic stability.
The principle of nuclear deterrence, based on the certainty that any nuclear attack would cause mutual destruction, made the use of such weapons highly unlikely. With no major crises and improved communication and early-warning systems, there were no conditions in 1997 that would have led to the use of nuclear weapons.`

};

let highlightColor;
let countryTotalCounts = {};
let margin = 80;
let selectedCountry = null;

let tsarCtaBox = null;

let yAxis;
const dashLength = 4;
const dashGap = 6;
const offset = 5;
let atmLabel = "Atmospheric";
let undLabel = "Underground";
let offsetX;
let xBase;

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
  mushroomImg = loadImage("images/mushroom.png");
  table = loadTable("dataset/dataset-singleb.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  highlightColor = color(0, 255, 255);
  processData();

  const urlParams = new URLSearchParams(window.location.search);

  const yearParam = urlParams.get("year");
  if (!yearParam) {
    const storedYear = sessionStorage.getItem("lastYear");
    if (storedYear) {
      const index = years.indexOf(Number(storedYear));
      if (index !== -1) currentYearIndex = index;
    }
  }

  if (yearParam) {
    const parsedYear = parseInt(yearParam);
    const index = years.indexOf(parsedYear);
    if (index !== -1) currentYearIndex = index;
  }

  saveLastYear(years[currentYearIndex]);
  setYearInURL(years[currentYearIndex]);

  const countryParam = urlParams.get("country");
  if (countryParam && countries.includes(countryParam)) {
    selectedCountry = countryParam;
  }
  yAxis = height / 2 + 70;
  offsetX = margin - 8;
  xBase = margin - 20 - 5;

}

function drawCtaButton(btnX, btnY, btnW, btnH, label, isHover) {
  const r = 8;
  const padX = 14;
  stroke(0, 255, 255, isHover ? 220 : 120);
  strokeWeight(isHover ? 1.5 : 1);

  fill(20, 20, 20, 200);
  rect(btnX, btnY, btnW, btnH, r);

  noStroke();
  fill(0, 255, 255, isHover ? 255 : 180);

  textFont(myFont3);
  textSize(13);
  textAlign(LEFT, CENTER);
  text(label, btnX + padX, btnY + btnH / 2 - 1);
  const ax = btnX + btnW - padX;
  const ay = btnY + btnH / 2;

  stroke(0, 255, 255, isHover ? 255 : 180);
  strokeWeight(isHover ? 2 : 1.5);
  line(ax - 10, ay, ax, ay);
  line(ax - 4, ay - 4, ax, ay);
  line(ax - 4, ay + 4, ax, ay);

}

function draw() {
  background(20);

  if (mushroomImg) {
    push();
    tint(40);
    imageMode(CENTER);
    let imgH = 0.9 * height;
    let imgW = 1.2 * height * (mushroomImg.width / mushroomImg.height);
    image(mushroomImg, width / 2, height / 2, imgW, imgH);
    pop();
  }

  if (years.length === 0) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Caricamento dati...", width / 2, height / 2);
    return;
  }

  const currentYear = years[currentYearIndex];
  const yearData = testsByYear[currentYear];

  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textAlign(CENTER, TOP);

  drawYearNavigation(currentYear);
  drawBottomInfo(yearData);

  drawTimeline();

  //anni senza test nucleari
  if (noTestYears.includes(currentYear)) {
    drawNoTestBox(currentYear);
    return;
  }

  drawTestDots(yearData);
  drawLegend();

  let overArrow =
    (currentYearIndex > 0 && mouseX > width / 2 - 150 && mouseX < width / 2 - 90 && mouseY > 120 && mouseY < 170) ||
    (currentYearIndex < years.length - 1 && mouseX > width / 2 + 90 && mouseX < width / 2 + 150 && mouseY > 120 && mouseY < 170);
  let overDot = dots.some(d => dist(mouseX, mouseY, d.cx, d.cy) < d.r);

  let overCountry = false;
  const fixedSpacing = 150;
  const lineY = height / 2 + 50;

  const visibleCountries = selectedCountry
    ? countries.filter(c => c === selectedCountry)
    : countries;

  visibleCountries.forEach((country, idx) => {

    let x = width / 2 + (idx - (visibleCountries.length - 1) / 2) * fixedSpacing;

    if (mouseX > x - 40 && mouseX < x + 120 && mouseY > yAxis - 20 && mouseY < yAxis + 20) {
      overCountry = true;
    }
  });

  // hover year
  let overTimelineYear = false;
  let ty = height - 50;
  let spacing = 80;
  let centerX = width / 2;

  if (mouseY > ty - 40 && mouseY < ty + 40) {
    for (let i = 0; i < years.length; i++) {
      let x = centerX + (i - currentYearIndex) * spacing;
      if (abs(mouseX - x) < 30) {
        overTimelineYear = true;
        break;
      }
    }
  }

  const legendX = margin - 8;
  const legendY = height - margin - 80;

  const overLegendInfo =
    hoverOnAtmospheric(legendX, 80) ||
    hoverOnUnderground(legendX, height - 80) ||
    hoverOnYieldYear(legendX, legendY);

  const overTsarCTA = drawColumnCTA();

  cursor(
    overArrow || overDot || overCountry || overTimelineYear || overLegendInfo || overTsarCTA
      ? HAND
      : ARROW
  );

  let checkYear = Number(currentYear);
  if (checkYear === 1958 || checkYear === 1959 || checkYear === 1963 || checkYear === 1996) {

    let btnH = 30;
    let btnW = 240;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - margin - 70;
    const r = 8;
    const padX = 12;

    push();
    let isHoverBack = mouseX > btnX && mouseX < btnX + btnW &&
      mouseY > btnY && mouseY < btnY + btnH;


    fill(20, 20, 20, 200);
    stroke(0, 255, 255, isHoverBack ? 220 : 120);
    strokeWeight(isHoverBack ? 1.5 : 1);
    rect(btnX, btnY, btnW, btnH, r);

    noStroke();
    fill(0, 255, 255, isHoverBack ? 255 : 180);
    textAlign(LEFT, CENTER);
    textFont(myFont3);
    textSize(13);
    text("VIEW HISTORIC INSIGHTS", btnX + padX, btnY + btnH / 2 - 1);

    let triSize = 5;
    let triX = btnX + btnW - 12;
    let triY = btnY + btnH / 2;
    if (isHoverBack) {
      triX += sin(frameCount * 0.2) * 2;
      cursor(HAND);
    }

    push();
    translate(triX, triY);
    triangle(-triSize, -triSize, -triSize, triSize, triSize, 0);
    pop();
    pop();
  }
  drawBombTooltip();

  drawAxes();
  drawAtmosUndLabels();

}

function drawTimeline() {
  let ty = height - 50;
  let spacing = 80;
  let centerX = width / 2;

  // disegna gli anni 
  const historicYears = [1947, 1950, 1958, 1959, 1963, 1996, 1997];
  const insightColor = [0, 255, 255];
  const cyanColor = [255, 255, 255];

  push();
  for (let i = 0; i < years.length; i++) {
    let x = centerX + (i - currentYearIndex) * spacing;

    if (x > -spacing && x < width + spacing) {
      let d = abs(centerX - x);

      let opacity = map(d, 0, width / 2, 255, 70);
      opacity = constrain(opacity, 70, 255);

      let isHistoric = historicYears.includes(Number(years[i]));
      let rgb = isHistoric ? insightColor : cyanColor;

      if (i === currentYearIndex) {
        stroke(rgb[0], rgb[1], rgb[2], 255);
        strokeWeight(2);
        line(x, ty - 15, x, ty + 5);

        noStroke();
        fill(rgb[0], rgb[1], rgb[2], 255);
        textFont(myFont3);
        textSize(14);
        textAlign(CENTER, BOTTOM);
        text(years[i], x, ty - 20);
      } else {
        stroke(rgb[0], rgb[1], rgb[2], opacity * 0.8);
        strokeWeight(1);
        line(x, ty - 8, x, ty);

        noStroke();
        fill(rgb[0], rgb[1], rgb[2], opacity * 0.7);
        textFont(myFont2);
        textSize(10);
        textAlign(CENTER, TOP);
        text(years[i], x, ty + 10);
      }
    }
  }
  pop();
}

function drawNoTestBox(year) {
  let boxW = width * 0.6;
  let boxX = width / 2 - boxW / 2;
  let padding = 30;
  let gap = 50;
  let colW = (boxW - 2 * padding - gap) / 2;

  textFont(myFont2);
  textSize(14);
  let lineHeight = textAscent() + textDescent() + 4;
  textAlign(LEFT, TOP);
  textWrap(WORD);

  let paragraphs = noTestTexts[year].split('\n');
  let allLines = [];
  let titleLine = "";

  for (let p = 0; p < paragraphs.length; p++) {
    let line = paragraphs[p];
    if (line.startsWith("No tests were conducted")) {
      titleLine = line;
      continue;
    }

    let words = line.split(/\s+/);
    let currentLine = "";
    for (let i = 0; i < words.length; i++) {
      let testLine = currentLine + (currentLine ? " " : "") + words[i];
      if (textWidth(testLine) > colW) {
        allLines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) allLines.push(currentLine);
    allLines.push("");
  }

  let midPoint = Math.ceil(allLines.length / 2);
  let leftColumn = allLines.slice(0, midPoint);
  let rightColumn = allLines.slice(midPoint);

  let boxH = Math.max(leftColumn.length, rightColumn.length) * lineHeight + padding * 2 + 40;
  let boxY = height / 2 - boxH / 2 + 40;

  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 10);
  rect(boxX, boxY, boxW, boxH);

  noStroke();
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(22);
  textAlign(CENTER, TOP);
  text(titleLine, width / 2, boxY + padding);

  textFont(myFont2);
  textSize(14);
  fill(200);
  textAlign(LEFT, TOP);

  let textStartY = boxY + padding + 50;
  for (let i = 0; i < leftColumn.length; i++) {
    text(leftColumn[i], boxX + padding, textStartY + i * lineHeight);
  }

  for (let i = 0; i < rightColumn.length; i++) {
    text(rightColumn[i], boxX + padding + colW + gap, textStartY + i * lineHeight);
  }
}

function processData() {
  let allTests = [];
  countryTotalCounts = {};

  for (let i = 0; i < table.getRowCount(); i++) {
    let id_no = table.getString(i, "id_no");
    let year = parseInt(table.getString(i, "year"));
    let country = table.getString(i, "country");
    let bName = table.getString(i, "name");

    // conversione PAKIST
    if (country) {
      country = country.trim();
      if (country.toUpperCase() === "PAKIST") {
        country = "PAKISTAN";
      }
    }

    let yield_u = parseFloat(table.getString(i, "yield_u"));
    let type = table.getString(i, "type");

    let region = table.getString(i, "region");
    let latitude = parseFloat(table.getString(i, "latitude"));
    let longitude = parseFloat(table.getString(i, "longitude"));

    if (!isNaN(year) && year > 0 && country) {
      country = country.trim();
      countryTotalCounts[country] = (countryTotalCounts[country] || 0) + 1;

      allTests.push({
        id: id_no,
        year: year,
        country: country,
        bombName: bName || "N/A",
        yield: isNaN(yield_u) || yield_u < 0 ? 0 : yield_u,
        type: type || "ATMOSPH",
        region: region || "N/A",
        latitude: isNaN(latitude) ? 0 : latitude,
        longitude: isNaN(longitude) ? 0 : longitude
      });
    }
  }

  allTests.forEach((test) => {
    if (!testsByYear[test.year]) {
      testsByYear[test.year] = {};
      if (!years.includes(test.year)) {
        years.push(test.year);
      }
    }

    if (!testsByYear[test.year][test.country]) {
      testsByYear[test.year][test.country] = [];
      if (!countries.includes(test.country)) {
        countries.push(test.country);
      }
    }

    testsByYear[test.year][test.country].push({
      id: test.id,
      yield: test.yield,
      type: test.type,
      bombName: test.bombName

    });
  });

  years.sort((a, b) => a - b);

  if (years.length > 0) {
    const minYear = years[0];
    const maxYear = years[years.length - 1];
    for (let y = minYear; y <= maxYear; y++) {
      if (!testsByYear[y]) {
        testsByYear[y] = {};
        if (!years.includes(y)) {
          years.push(y);
        }
      }
    }
    years.sort((a, b) => a - b);
  }

  const countryOrder = ["INDIA", "PAKISTAN", "CHINA", "FRANCE", "UK", "USA", "USSR"];
  countries.sort((a, b) => {
    const indexA = countryOrder.indexOf(a);
    const indexB = countryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  console.log("Data processed successfully.");
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
  textSize(60);
  fill(0, 255, 255);
  textFont(myFont3);
  text(currentYear, width / 2, 80);

  textFont(myFont2);
  fill(0, 255, 255);
  textSize(20);
  text("NUCLEAR TEST EACH YEAR", width / 2, 70);

  const alphaBase = 200;
  const pulse = sin(frameCount * 0.08) * 55;
  const activeAlpha = constrain(alphaBase + pulse, 80, 255);
  const disabledAlpha = 0;

  const halfW = 12;
  const h = 10;

  push();
  strokeWeight(4);
  noFill();

  let isFirstYear = (currentYearIndex === 0);
  let hoverLeft = !isFirstYear &&
    mouseX > width / 2 - 150 && mouseX < width / 2 - 90 &&
    mouseY > 120 && mouseY < 170;

  stroke(0, 255, 255, isFirstYear ? disabledAlpha : (hoverLeft ? 255 : activeAlpha));

  const cxL = width / 2 - 120;
  const cyL = 130;
  line(cxL + halfW, cyL - h, cxL, cyL);
  line(cxL + halfW, cyL + h, cxL, cyL);

  let isLastYear = (currentYearIndex === years.length - 1);
  let hoverRight = !isLastYear &&
    mouseX > width / 2 + 90 && mouseX < width / 2 + 150 &&
    mouseY > 120 && mouseY < 170;

  stroke(0, 255, 255, isLastYear ? disabledAlpha : (hoverRight ? 255 : activeAlpha));

  const cxR = width / 2 + 120;
  const cyR = 130;
  line(cxR - halfW, cyR - h, cxR, cyR);
  line(cxR - halfW, cyR + h, cxR, cyR);

  pop();
}

function drawTestDots(yearData) {
  dots = [];
  let cellSize = 13;
  let gap = 7;
  let cols = 5;
  let lineY = height / 2 + 50;
  let fixedSpacing = 130;

  textFont(myFont2);
  fill(0, 255, 255);
  textAlign(LEFT, TOP);
  textSize(14);
  noStroke();
  let margin = 80;
  const lx = margin - 8;

  countries.forEach((country, idx) => {
    let tests = yearData[country] || [];
    let x = width / 2 + (idx - (countries.length - 1) / 2) * fixedSpacing;

    textFont(myFont2);
    textSize(14);
    let nameW = textWidth(country);

    let isNameHovered = (
      mouseX > x - 50 &&
      mouseX < x + 100 &&
      mouseY > yAxis - 15 &&
      mouseY < yAxis + 15
    );

    // underground type
    const undergroundTypes = ["UG", "SHAFT", "TUNNEL", "GALLERY", "MINE", "SHAFT/GR", "SHAFT/LG"];
    let sottTests = tests.filter(t => undergroundTypes.includes(t.type));
    let atmTests = tests.filter(t => !undergroundTypes.includes(t.type));
    atmTests.sort((a, b) => getColorLevel(a.yield) - getColorLevel(b.yield));
    sottTests.sort((a, b) => getColorLevel(a.yield) - getColorLevel(b.yield));

    function drawGroup(testArray, isAtmosph) {
      let numCols = Math.max(1, Math.min(cols, testArray.length));
      let colWidth = (numCols - 1) * (cellSize + gap);
      testArray.forEach((test, i) => {
        let col = i % cols;
        let row = Math.floor(i / cols);
        let cx = x - colWidth / 2 + col * (cellSize + gap);

        let cy;
        if (isAtmosph) {
          cy = yAxis - 40 - row * (cellSize + gap); 
        } else {
          cy = yAxis + 40 + row * (cellSize + gap); 
        }

        let d = dist(mouseX, mouseY, cx, cy);
        let isHovered = d < cellSize / 2;

        let size = cellSize;
        push();
        fill(getYieldColor(test.yield));

        const currentYear = years[currentYearIndex];
        const isRDS200 =
          currentYear === 1961 &&
          test.bombName &&
          test.bombName.toUpperCase() === "RDS-200";

        if (isRDS200) {
          push();
          noFill();
          stroke(0, 255, 255);
          strokeWeight(2);
          rectMode(CENTER);
          circle(cx, cy, cellSize + 9);
          stroke(0, 255, 255);
          strokeWeight(2);
          line(cx - (cellSize - 4) / 2, cy - 10, cx - 300, cy - 10);
          noStroke();
          textFont(myFont3);
          textSize(13);
          fill(0, 255, 255);
          textAlign(LEFT, BOTTOM);
          text("Largest bomb ever launched", cx - 297, cy - 11);

          pop();
        }

        if (isHovered) {
          const pulse = (sin(frameCount * 0.1) + 1) / 2;
          size = cellSize * (1.2 + pulse * 0.5);
          stroke(0, 255, 255);
          strokeWeight(1.4);
        } else {
          noStroke();
        }

        circle(cx, cy, size);
        pop();

        dots.push({ cx: cx, cy: cy, r: size / 2, id: test.id });
      });
    }

    drawGroup(atmTests, true);
    drawGroup(sottTests, false);

    push();
    translate(x, yAxis);
    textAlign(CENTER, CENTER);
    textFont(myFont2);
    textSize(14);
    fill(isNameHovered ? color(0, 255, 255) : color(200));
    text(country, 0, 0);
    pop();

  });

  const offsetX = margin - 8;
  const isHoverATM = hoverOnAtmospheric(offsetX, margin);
  const isHoverUND = hoverOnUnderground(offsetX, height - margin);

  if (isHoverATM) {
    push();
    const padding = 8;
    const lineHeight = 16;
    fill(0, 0, 0, 200);
    let boxW = 180;
    let boxH = padding * 2 + lineHeight * 3.5;
    let boxX = margin - 8;
    let boxY = 138;
    rect(boxX, boxY, boxW, boxH, 5);
    textSize(12);
    textAlign(LEFT, TOP);
    fill(0, 255, 255);
    text("ATMOSPHERIC", boxX + padding, boxY + padding);
    text("Nuclear detonations", boxX + padding, boxY + 2 * padding + lineHeight);
    text("with atmospheric dispersion.", boxX + padding, boxY + 2 * padding + lineHeight * 2);
    pop();
  }

  if (isHoverUND) {
    push();
    const padding = 8;
    const lineHeight = 16;
    fill(0, 0, 0, 200);
    let boxW = 180;
    let boxH = padding * 2 + lineHeight * 3.5;
    let boxX = margin - 8;
    let boxY = 138;
    rect(boxX, boxY, boxW, boxH, 5);
    textSize(12);
    textAlign(LEFT, TOP);
    fill(0, 255, 255);
    text("UNDERGROUND", boxX + padding, boxY + padding);
    text("Nuclear detonations", boxX + padding, boxY + 2 * padding + lineHeight);
    text("under the ground level.", boxX + padding, boxY + 2 * padding + lineHeight * 2);
    pop();
  }
}

function drawBottomInfo(yearData) {
  let total = Object.values(yearData).reduce((sum, tests) => sum + tests.length, 0);

  fill(150, 150, 150);
  textAlign(RIGHT, TOP);
  textSize(20);
  textFont(myFont2);
  text("Bombs launched", width - 80, 160);
  textSize(60);
  textFont(myFont3);
  text(total, width - 80, 80);
}

function drawLegend() {

  let offsetX = margin - 8;
  let offsetY = height - margin - 80;

  textFont(myFont2);
  textAlign(LEFT, TOP);
  fill(200);
  textSize(14);
  const yLabel = "YIELD (kt)";
  text(yLabel, offsetX, offsetY - 40);
  drawInfoIcon(offsetX + textWidth(yLabel) + 14, (offsetY - 40) + 9, 7);


  let legend = [
    { range: "0-19", y: 10 },
    { range: "20", y: 20 },
    { range: "21-150", y: 100 },
    { range: "151-4999", y: 1000 },
    { range: "5000+", y: 5000 },
  ];

  const isHoverYLD = hoverOnYieldYear(offsetX, offsetY);

  if (isHoverYLD) {
    push();
    const padding = 8;
    const lineHeight = 16;
    fill(0, 0, 0, 200);

    let boxW = 180;
    let boxH = padding * 4 + lineHeight * 3.5;

    let boxX = offsetX;
    let boxY = 138;

    rect(boxX, boxY, boxW, boxH, 5);

    textSize(12);
    textAlign(LEFT, TOP);
    fill(0, 255, 255);

    text("YIELD (kt):", boxX + padding, boxY + padding);
    text("explosive energy measured", boxX + padding, boxY + 2 * padding + lineHeight);
    text("in kilotons; 1 kt = 1,000", boxX + padding, boxY + 2 * padding + lineHeight * 2);
    text("tons of TNT.", boxX + padding, boxY + 2 * padding + lineHeight * 3);

    pop();
  }

  textFont(myFont2);
  textSize(14);
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

let lastScrollTime = 0;
let scrollVelocity = 0;

let scrollAccumulator = 0;
const SCROLL_THRESHOLD = 80;

function mouseWheel(event) {

  if (mouseY < height - 100) return;

  const oldIndex = currentYearIndex;
  const currentDelta = abs(event.deltaX) > abs(event.deltaY) ? event.deltaX : event.deltaY;
  scrollAccumulator += currentDelta;

  while (abs(scrollAccumulator) >= SCROLL_THRESHOLD) {
    if (scrollAccumulator > 0) {
      if (currentYearIndex < years.length - 1) currentYearIndex++;
      scrollAccumulator -= SCROLL_THRESHOLD;
    } else {
      if (currentYearIndex > 0) currentYearIndex--;
      scrollAccumulator += SCROLL_THRESHOLD;
    }
// Reset accumulator at boundary to prevent scroll overflow
    if (currentYearIndex === 0 || currentYearIndex === years.length - 1) {
      scrollAccumulator = 0;
      break;
    }
  }

  if (currentYearIndex !== oldIndex) {
    saveLastYear(years[currentYearIndex]);
    setYearInURL(years[currentYearIndex]);
  }

  event.preventDefault();
  return false;
}

function lockScroll(time) {
  isScrollingLocked = true;
  setTimeout(() => {
    isScrollingLocked = false;
  }, time);
}

function mousePressed() {
  let ty = height - 50;
  let spacing = 80;
  let centerX = width / 2;

  if (mouseY > ty - 40 && mouseY < ty + 40) {
    for (let i = 0; i < years.length; i++) {
      let x = centerX + (i - currentYearIndex) * spacing;
      if (abs(mouseX - x) < spacing / 2) {
        currentYearIndex = i;
        saveLastYear(years[currentYearIndex]);
        setYearInURL(years[currentYearIndex]);

        return;
      }
    }
  }

  if (tsarCtaBox) {
    const overTsar =
      mouseX >= tsarCtaBox.x && mouseX <= tsarCtaBox.x + tsarCtaBox.w &&
      mouseY >= tsarCtaBox.y && mouseY <= tsarCtaBox.y + tsarCtaBox.h;

    if (overTsar) {
      const currentYear = Number(years[currentYearIndex]);
      // 1961 to insight Tsar Bomba
      if (currentYear === 1961) {
        saveLastYear(years[currentYearIndex]);
        setYearInURL(years[currentYearIndex]);
        window.location.href = "insight.html?topic=tsarbomba";
        return;
      }
      const targetYear = 1961;
      const targetIndex = years.indexOf(targetYear);
      if (targetIndex !== -1) {
        currentYearIndex = targetIndex;
        saveLastYear(years[currentYearIndex]);
        setYearInURL(years[currentYearIndex]);
      }
      return;
    }

  }
  let activeYear = Number(years[currentYearIndex]);
  saveLastYear(years[currentYearIndex]);

  if (activeYear === 1958 || activeYear === 1959 || activeYear === 1963 || activeYear === 1996) {
    let btnW = 240;
    let btnH = 40;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - margin - 65;

    if (mouseX > btnX && mouseX < btnX + btnW &&
      mouseY > btnY && mouseY < btnY + btnH) {

      if (activeYear === 1958 || activeYear === 1959) {
        window.location.href = 'insight.html?topic=moratoria58';
      } else if (activeYear === 1963) {
        window.location.href = 'insight.html?topic=trattato63';
      } else if (activeYear === 1996) {
        window.location.href = 'insight.html?topic=trattato96';
      }
      return;
    }
  }

  if (mouseX > width / 2 - 150 && mouseX < width / 2 - 90 && mouseY > 120 && mouseY < 170) {
    if (currentYearIndex > 0) {
      currentYearIndex--;
      saveLastYear(years[currentYearIndex]);
      setYearInURL(years[currentYearIndex]);

    }
    return;
  }
  if (mouseX > width / 2 + 90 && mouseX < width / 2 + 150 && mouseY > 120 && mouseY < 170) {
    if (currentYearIndex < years.length - 1) {
      currentYearIndex++;
      saveLastYear(years[currentYearIndex]);
      setYearInURL(years[currentYearIndex]);

    }
    return;
  }
  for (let d of dots) {
    if (dist(mouseX, mouseY, d.cx, d.cy) < d.r) {
      const year = years[currentYearIndex];
      saveLastYear(years[currentYearIndex]);
      setYearInURL(years[currentYearIndex]);

      window.location.href = `single.html?id=${d.id}&from=year&year=${year}`;

      return;
    }
  }

  const fixedSpacing = 150;
  const lineY = height / 2 + 50;

  countries.forEach((country, idx) => {
    let x = width / 2 + (idx - (countries.length - 1) / 2) * fixedSpacing;
    let areaSinistra = 40;
    let areaDestra = 110;
    let areaAltezza = 20;

    if (
      mouseX > x - areaSinistra &&
      mouseX < x + areaDestra &&
      mouseY > yAxis - areaAltezza &&
      mouseY < yAxis + areaAltezza
    ) {

      saveLastYear(years[currentYearIndex]);
      setYearInURL(years[currentYearIndex]);
      window.location.href = `index.html?country=${country}&from=year#page2`;

      return;
    }
  });

}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (currentYearIndex > 0) {
      currentYearIndex--;
      saveLastYear(years[currentYearIndex]);
      setYearInURL(years[currentYearIndex]);

    }
  } else if (keyCode === RIGHT_ARROW) {
    if (currentYearIndex < years.length - 1) {
      currentYearIndex++;
      saveLastYear(years[currentYearIndex]);
      setYearInURL(years[currentYearIndex]);

    }
  }
}

function drawColumnCTA() {
  const msg = "Click a bomb or a country to see more";

  const currentYear = Number(years[currentYearIndex]);
  const tsarLabel = (currentYear === 1961)
    ? "VIEW HISTORIC INSIGHT"
    : "Go to the Largest bomb";

  const rightX = width - margin;
  const bottomY = height - margin;
  const moveUp = 25;
  const btnH = 30;

  textFont(myFont3);
  textSize(13);

  let btnW = 250;

  const btnX = rightX - btnW;
  const btnY = bottomY - btnH - 15 - moveUp;

  const isHoverTsar = mouseX >= btnX && mouseX <= btnX + btnW &&
    mouseY >= btnY && mouseY <= btnY + btnH;

  tsarCtaBox = { x: btnX, y: btnY, w: btnW, h: btnH };

  push();
  const pulse = (sin(frameCount * 0.08) + 1) / 2;
  const a = 80 + pulse * 175;
  textFont(myFont2);
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  noStroke();
  fill(0, 255, 255, a);
  text(msg, rightX, bottomY);
  pop();

  push();
  fill(20, 20, 20, 200);
  stroke(0, 255, 255, isHoverTsar ? 220 : 120);
  strokeWeight(isHoverTsar ? 1.5 : 1);
  rect(btnX, btnY, btnW, btnH, 8);

  noStroke();
  fill(0, 255, 255, isHoverTsar ? 255 : 180);
  textFont(myFont3);
  textSize(13);
  textAlign(LEFT, CENTER);

  text(tsarLabel, btnX + 18, btnY + btnH / 2 - 2);

  let triSize = 5;
  let triX = btnX + btnW - 12;
  let triY = btnY + btnH / 2;
  if (isHoverTsar) triX += sin(frameCount * 0.2) * 2;

  push();
  translate(triX, triY);
  triangle(-triSize, -triSize, -triSize, triSize, triSize, 0);
  pop();

  pop();

  return isHoverTsar;

}

function drawBombTooltip() {
  let hoveredDot = null;
  for (let d of dots) {
    if (dist(mouseX, mouseY, d.cx, d.cy) < d.r) {
      hoveredDot = d;
      break;
    }
  }

  if (hoveredDot) {
    let currentYear = years[currentYearIndex];
    let yearData = testsByYear[currentYear];
    let bombData = null;

    for (let country in yearData) {
      bombData = yearData[country].find(t => t.id === hoveredDot.id);
      if (bombData) {
        bombData.country = country;
        break;
      }
    }

    if (bombData) {
      const padding = 10;
      const lineHeight = 20;
      const boxW = 223;
      const boxH = padding * 2 + lineHeight * 2 + 10;

      let boxX = mouseX + 15;
      let boxY = mouseY - boxH / 2;

      if (boxX + boxW > width) {
        boxX = mouseX - boxW - 15;
      }

      push();
      fill(0, 0, 0, 220);
      rect(boxX, boxY, boxW, boxH, 4);

      noStroke();
      textSize(12);
      textFont(myFont2);

      textAlign(LEFT, TOP);
      fill(0, 255, 255);
      text("Click the bomb for more information", boxX + padding, boxY + padding)
      text("Bomb Name:", boxX + padding, boxY + padding + lineHeight);
      text("Yield (kt):", boxX + padding, boxY + padding + lineHeight + lineHeight);

      textAlign(RIGHT, TOP);
      fill(0, 255, 255);
      const valueX = boxX + boxW - padding;

      text(bombData.bombName, valueX, boxY + padding + lineHeight);
      text(bombData.yield, valueX, boxY + padding + lineHeight + lineHeight);

      pop();
    }
  }
}

function drawInfoIcon(cx, cy, r = 7) {
  push();

  stroke(0, 255, 255, 220);
  strokeWeight(1.6);
  fill(18, 210);
  circle(cx, cy, r * 2);

  textAlign(CENTER, CENTER);
  textFont("system-ui");
  textSize(r * 1.8);

  stroke(0, 220);
  strokeWeight(3);
  fill(0, 255, 255);
  text("i", cx, cy + 0.6);

  pop();
}

function hoverOnYieldYear(offsetX, offsetY) {
  const y = offsetY - 40;
  const label = "YIELD (kt)";

  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, TOP);

  const w = textWidth(label) + 14 + 16;
  const h = 22;

  return (mouseX >= offsetX && mouseX <= offsetX + w &&
    mouseY >= y && mouseY <= y + h);
}

function hoverOnAtmospheric(offsetX, dummy) {
  let x = offsetX - 65;
  let y = yAxis - 180;
  let w = 40;
  let h = 150;
  return (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y);
}

function hoverOnUnderground(offsetX, dummy) {
  let x = offsetX - 65;
  let y = yAxis + 30;
  let w = 40;
  let h = 150;
  return (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h);
}

window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});

function onCountryClick(countryName) {
  saveLastYear(years[currentYearIndex]);
  setYearInURL(years[currentYearIndex]);
  indow.location.href = `index.html?country=${countryName}&from=year#page2`;

}

function drawAxes() {
  push();
  stroke(200, 160);
  strokeWeight(1.5);

  line(xBase, yAxis - 25, width - margin + 10, yAxis - 25);
  line(xBase, yAxis - 25, xBase, yAxis - 25 - 144);
  for (let y = yAxis - 25 - 144 - offset; y >= yAxis - 25 - 144 - offset - 40; y -= dashLength + dashGap) {
    line(xBase, y, xBase, y - dashLength);
  }

  line(xBase, yAxis + 25, width - margin + 10, yAxis + 25);
  line(xBase, yAxis + 25, xBase, yAxis + 25 + 144);
  for (let y = yAxis + 25 + 144 + offset; y <= yAxis + 25 + 144 + offset + 40; y += dashLength + dashGap) {
    line(xBase, y, xBase, y + dashLength);
  }

  const xRight = width - margin + 10;
  for (let y = yAxis - 25; y >= yAxis - 25 - 40; y -= dashLength + dashGap) {
    line(xRight, y, xRight, y - dashLength);
  }
  for (let y = yAxis + 25; y <= yAxis + 25 + 40; y += dashLength + dashGap) {
    line(xRight, y, xRight, y + dashLength);
  }

  pop();
}

function drawAtmosUndLabels() {
  // Atmospheric
  push();
  translate(offsetX - 45, yAxis - 25);
  rotate(-HALF_PI);
  textAlign(LEFT, TOP);
  fill(200);
  textFont(myFont2);
  textSize(14);
  text(atmLabel, 0, 0);
  drawInfoIcon(textWidth(atmLabel) + 14, 9);
  pop();
  // Underground
  const undW = textWidth(undLabel);
  push();
  translate(offsetX - 45, yAxis + 25);
  rotate(-HALF_PI);
  textAlign(RIGHT, TOP);
  fill(200);
  textFont(myFont2);
  textSize(14);
  text(undLabel, 0, 0);
  drawInfoIcon(-undW, 9);
  pop();
}

// info icon
function drawInfoIcon(cx, cy, r = 7) {
  push();
  stroke(0, 255, 255, 220);
  strokeWeight(1.6);
  fill(18, 210);
  circle(cx, cy, r * 2);

  textAlign(CENTER, CENTER);
  textFont("system-ui");
  textSize(r * 1.8);
  stroke(0, 220);
  strokeWeight(3);
  fill(0, 255, 255);
  text("i", cx, cy + 0.6);
  pop();
}

// Hover detect
function hoverOnAtmospheric(offsetX, offsetY) {
  const label = "Atmospheric";
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, TOP);
  const textW = textWidth(label);
  const iconGap = 14, iconSize = 16;
  const w = textW + iconGap + iconSize, h = 22;
  const mouseXRel = mouseX - (offsetX - 45);
  const mouseYRel = mouseY - (yAxis - 25);
  return (mouseXRel >= 0 && mouseXRel <= h && mouseYRel >= -w && mouseYRel <= 0);
}

function hoverOnUnderground(offsetX, offsetY) {
  const label = "Underground";
  textFont(myFont2);
  textSize(14);
  const textW = textWidth(label);
  const iconGap = 14, iconSize = 16;
  const w = textW + iconGap + iconSize, h = 22;
  const mouseXRel = mouseX - (offsetX - 35);
  const mouseYRel = mouseY - (yAxis + 25);
  return (mouseXRel >= -h && mouseXRel <= 0 && mouseYRel >= 0 && mouseYRel <= w);
}

function saveLastYear(year) {
  sessionStorage.setItem("lastYear", year);
}

function setYearInURL(year) {
  const url = new URL(window.location.href);
  url.searchParams.set("year", year);
  history.replaceState(null, "", url.toString());
}

