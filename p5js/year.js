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
In 1947, no nuclear test launches are recorded because, in the immediate aftermath of Hiroshima and Nagasaki, nuclear powers entered a period of caution and reassessment. The United States, at the time the only country with nuclear weapons, faced no immediate military necessity and was shifting the role of nuclear arms toward deterrence rather than active testing. Additionally, nuclear tests were technically complex, costly, and politically sensitive in a rapidly emerging Cold War context.`,

  1950: `No tests were conducted in 1950
In 1950, the strategic competition between the United States and the Soviet Union entered a qualitatively new phase. The year falls between the first Soviet nuclear test in 1949 and the next one in 1951, but it is precisely this apparent absence of spectacular events that determines its historical significance. In fact, 1950 represents the moment when the presence of the USSR as an atomic power became fully perceived by the United States and its allies, ushering in an arms race characterized by growing technological and doctrinal competition.
The awareness that both superpowers possessed nuclear capabilities introduced the real risk of mutually assured destruction, laying the foundations for the concept of modern nuclear deterrence: international stability was no longer guaranteed by the superiority of a single power, but by the balance of a symmetrical threat. The absence of significant tests during the 1950s did not therefore reflect a period of stagnation, but rather the caution imposed by the fear of uncontrollable escalation.
At the same time, this period was marked by intense research and development activity. In 1950, systematic studies began on more advanced weapons systems, including the hydrogen bomb, which was destined to exceed the power of previous weapons by orders of magnitude. In this sense, 1950 was a key year in the transformation of deterrence into a structural element of the international order of the Cold War.`,

  1959: `No tests were conducted in 1959
The reason there were no tests in 1959 was that the Soviet Union, Great Britain, and the United States agreed to a moratorium on nuclear weapon tests in 1958. This moratorium lasted from November 1958 to August 1961. The Soviet Union resumed on 1 September, 1961, with the US following suit a couple of weeks later.
France, being on the verge of being a nuclear-capable nation in 1958, did not take part in that moratorium. They didn't test in 1959 because they did not quite have the ability to do so. They did have that ability in 1960.
The 1958–1961 moratorium represented a rare moment of international cooperation during the Cold War, aiming to slow down the nuclear arms race and reduce atmospheric fallout. While the main powers paused testing, technological development and planning continued in secret. For countries like France, this period allowed them to finalize key technologies before conducting their first successful tests in 1960. The moratorium also highlighted the growing importance of diplomacy and negotiation in nuclear policy, setting a precedent for future treaties such as the Partial Test Ban Treaty of 1963.`,

  1997: `No tests were conducted in 1997
In 1997 there were no nuclear launches because the international context was relatively stable and governed by the logic of deterrence. The Cold War had ended several years earlier, the Soviet Union no longer existed, and the direct ideological and military confrontation between superpowers had eased. The United States and Russia still possessed large nuclear arsenals, but they were constrained by arms control treaties such as the START agreements, which reduced the number of operational warheads and increased cooperation and transparency. Moreover, the awareness that any nuclear attack would lead to mutually assured destruction made such a launch irrational from a political and strategic perspective. In the absence of acute crises or serious incidents that could be interpreted as an imminent attack, and with more reliable communication and early-warning systems than in the past, the conditions that might have led to the use of nuclear weapons simply did not exist in 1997.`

};

let highlightColor;
let countryTotalCounts = {};
let margin = 80;
let selectedCountry = null;

// --- TSAR CTA (global hitbox) ---
let tsarCtaBox = null; // {x,y,w,h}

let yAxis; // 纵轴中心位置，需要在 setup() 中初始化，例如： yAxis = height / 2 + 70;
const dashLength = 4;  // 虚线段长度
const dashGap = 6;     // 虚线间隔
const offset = 5;      // 虚线偏移
let atmLabel = "Atmospheric";
let undLabel = "Underground";
let offsetX;  // 标签X起点，通常 = margin - 8
let xBase;    // 竖轴起点，通常 = margin - 20 - 5


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
  // Se “VIEW HISTORIC INSIGHTS” ha già una palette/alpha specifica,
  // copia qui ESATTAMENTE quegli stessi valori.
  const r = 8;
  const padX = 14;

  // stroke/hover come il bottone esistente
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

  // freccetta laterale (stessa logica che vuoi)
  const ax = btnX + btnW - padX;
  const ay = btnY + btnH / 2;

  // Se vuoi proprio la stessa freccia del bottone “historic”,
  // copia il suo disegno. Qui ti do una freccia “che sta bene”.
  stroke(0, 255, 255, isHover ? 255 : 180);
  strokeWeight(isHover ? 2 : 1.5);
  line(ax - 10, ay, ax, ay);
  line(ax - 4, ay - 4, ax, ay);
  line(ax - 4, ay + 4, ax, ay);

}



function draw() {
  background(20);

  // Fungo atomico come sfondo
  if (mushroomImg) {
    push();
    tint(40);
    imageMode(CENTER);
    // Adatta l'immagine in altezza mantenendo le proporzioni
    let imgH = 0.9 * height;
    let imgW = 1.2 * height * (mushroomImg.width / mushroomImg.height);
    image(mushroomImg, width / 2, height / 2, imgW, imgH);
    pop();
  }

  // Controllo se i dati sono caricati
  if (years.length === 0) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Caricamento dati...", width / 2, height / 2);
    return;
  }

  // === Dati correnti dell'anno ===
  const currentYear = years[currentYearIndex];  // Dichiarazione una sola volta
  const yearData = testsByYear[currentYear];

  // === Contenuto sempre visibile ===
  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textAlign(CENTER, TOP);
  //text("NUCLEAR TEST EACH YEAR", width / 2, 30);

  // Visualizza l'anno e le frecce di navigazione
  drawYearNavigation(currentYear);
  // Visualizza il totale delle bombe
  drawBottomInfo(yearData);

  drawTimeline();

  // === Gestione anni senza test nucleari ===
  if (noTestYears.includes(currentYear)) {
    drawNoTestBox(currentYear);   // Mostra il riquadro con testo centrale
    return;                       // Non disegnare bombe, etichette ATM/UN, nomi Paesi, legenda Yield o messaggio Click
  }

  // === Anni con test nucleari: disegna bombe e legenda ===
  drawTestDots(yearData);          // Disegna bombe, etichette ATM/UN e nomi dei paesi
  drawLegend();                    // Disegna legenda Yield e messaggio "Click a bomb to see more"

  // === Logica cursore per frecce e bombe ===
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
    hoverOnAtmospheric(legendX, 80) || // qui margin locale in drawTestDots è 80
    hoverOnUnderground(legendX, height - 80) || // coerente col tuo hoverOnUnderground
    hoverOnYieldYear(legendX, legendY);


  /*cursor(overArrow || overDot || overCountry || overTimelineYear || overLegendInfo ? HAND : ARROW);
 
   drawColumnCTA(); // Disegna il messaggio "Click a column to see more"*/

  const overTsarCTA = drawColumnCTA(); // <-- spostata qui per ottenere hover

  cursor(
    overArrow || overDot || overCountry || overTimelineYear || overLegendInfo || overTsarCTA
      ? HAND
      : ARROW
  );


  // btn insight page
// ... 在 draw() 函数内部 ...
let checkYear = Number(currentYear);
if (checkYear === 1958 || checkYear === 1959 || checkYear === 1963 || checkYear === 1996) {

    // --- 统一参数 ---
    let btnH = 30; // 统一高度为 30
    let btnW = 240;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - margin - 70; // 统一 Y 轴起始高度
    const r = 8;
    const padX = 12;

    push();
    let isHoverBack = mouseX > btnX && mouseX < btnX + btnW &&
                      mouseY > btnY && mouseY < btnY + btnH;

    // 绘制容器
    fill(20, 20, 20, 200);
    stroke(0, 255, 255, isHoverBack ? 220 : 120);
    strokeWeight(isHoverBack ? 1.5 : 1);
    rect(btnX, btnY, btnW, btnH, r);

    // 绘制文字
    noStroke();
    fill(0, 255, 255, isHoverBack ? 255 : 180);
    textAlign(LEFT, CENTER); // 改为 LEFT 配合 padding，与另一个按钮一致
    textFont(myFont3);
    textSize(13); // 统一字号
    text("VIEW HISTORIC INSIGHTS", btnX + padX, btnY + btnH / 2 - 1);

    // 绘制三角形
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
  // tooltip bomba
  drawBombTooltip();

  //drawColumnCTA();
  drawAxes();
  drawAtmosUndLabels();

}

function drawTimeline() {
  let ty = height - 50;
  let spacing = 80;
  let centerX = width / 2;

  // disegna gli anni 
  const historicYears = [1947, 1950, 1958, 1959, 1963, 1996, 1997];
  const insightColor = [0, 255, 255]; //  orangeRGB
  const cyanColor = [255, 255, 255];    // 

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
        // --- altri year color ---
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


// === text box per anni senza test ===
function drawNoTestBox(year) {
  let boxW = width * 0.6; // Aumentato per ospitare due colonne
  let boxX = width / 2 - boxW / 2;
  let padding = 30;
  let gap = 50; // Spazio tra le due colonne
  let colW = (boxW - 2 * padding - gap) / 2;

  // Calcolo altezza riga
  textFont(myFont2);
  textSize(14);
  let lineHeight = textAscent() + textDescent() + 4;
  textAlign(LEFT, TOP);
  textWrap(WORD);

  // Split dei paragrafi e gestione righe
  let paragraphs = noTestTexts[year].split('\n');
  let allLines = [];
  let titleLine = "";

  for (let p = 0; p < paragraphs.length; p++) {
    let line = paragraphs[p];
    // Estrae il titolo "No tests were conducted..."
    if (line.startsWith("No tests were conducted")) {
      titleLine = line;
      continue;
    }

    let words = line.split(/\s+/);
    let currentLine = "";
    for (let i = 0; i < words.length; i++) {
      let testLine = currentLine + (currentLine ? " " : "") + words[i];
      // Calcolo a capo basato sulla larghezza della singola colonna
      if (textWidth(testLine) > colW) {
        allLines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) allLines.push(currentLine);
    allLines.push(""); // Spazio tra paragrafi
  }

  // Divisione delle righe in due colonne
  let midPoint = Math.ceil(allLines.length / 2);
  let leftColumn = allLines.slice(0, midPoint);
  let rightColumn = allLines.slice(midPoint);

  // Calcolo altezza dinamica del box
  let boxH = Math.max(leftColumn.length, rightColumn.length) * lineHeight + padding * 2 + 40;
  let boxY = height / 2 - boxH / 2 + 40;

  // Disegno del box di sfondo
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 10);
  rect(boxX, boxY, boxW, boxH);

  // Disegno del titolo centrato
  noStroke();
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(22);
  textAlign(CENTER, TOP);
  text(titleLine, width / 2, boxY + padding);

  // Disegno delle due colonne di testo
  textFont(myFont2);
  textSize(14);
  fill(200);
  textAlign(LEFT, TOP);

  let textStartY = boxY + padding + 50;

  // Colonna Sinistra
  for (let i = 0; i < leftColumn.length; i++) {
    text(leftColumn[i], boxX + padding, textStartY + i * lineHeight);
  }

  // Colonna Destra
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

    // --- cambiare PAKIST ---
    if (country) {
      country = country.trim();
      if (country.toUpperCase() === "PAKIST") {
        country = "PAKISTAN";
      }
    }
    // -----------------------

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
        // --- bombData ---
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
  const disabledAlpha = 0; // feccia trasparente per frecce disabilitate

  const halfW = 12;
  const h = 10;

  push();
  strokeWeight(4);
  noFill();

  // ====================
  // FRECCIA SINISTRA
  // ====================
  let isFirstYear = (currentYearIndex === 0);
  let hoverLeft = !isFirstYear &&
    mouseX > width / 2 - 150 && mouseX < width / 2 - 90 &&
    mouseY > 120 && mouseY < 170;

  stroke(0, 255, 255, isFirstYear ? disabledAlpha : (hoverLeft ? 255 : activeAlpha));

  const cxL = width / 2 - 120;
  const cyL = 130;
  line(cxL + halfW, cyL - h, cxL, cyL);
  line(cxL + halfW, cyL + h, cxL, cyL);

  // ====================
  // FRECCIA DESTRA 
  // ====================
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
  let fixedSpacing = 150;

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

    // --- Dynamic hover area check ---
    textFont(myFont2);
    textSize(14);
    let nameW = textWidth(country);

let isNameHovered = (
  mouseX > x - 50 && 
  mouseX < x + 100 &&
  mouseY > yAxis - 15 && 
  mouseY < yAxis + 15
);



    // --- (drawGroup) ---
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
    
    // 调整 Y 方向
    let cy;
    if (isAtmosph) {
      cy = yAxis - 40 - row * (cellSize + gap); // 上方留 40px 空间
    } else {
      cy = yAxis + 40 + row * (cellSize + gap); // 下方留 40px 空间
    }

    let d = dist(mouseX, mouseY, cx, cy);
    let isHovered = d < cellSize / 2;

    let size = cellSize;
    push();
    fill(getYieldColor(test.yield));

    // === HIGHLIGHT RDS-200 (1961) ===
const currentYear = years[currentYearIndex];
const isRDS200 =
  currentYear === 1961 &&
  test.bombName &&
  test.bombName.toUpperCase() === "RDS-200";

if (isRDS200) {
  push();
  noFill();// rettangolo ciano attorno alla bomba
  stroke(0, 255, 255);
  strokeWeight(2);
  rectMode(CENTER);
  circle(cx, cy, cellSize + 9);
  stroke(0, 255, 255);// linea verso sinistra
  strokeWeight(2);
  line(cx - (cellSize -4) / 2, cy-10, cx - 300, cy -10 );
  noStroke();// testo sopra la linea
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

    //  country name and total
  push();
  translate(x, yAxis); 
  textAlign(CENTER, CENTER);
  textFont(myFont2);
  textSize(14);
  fill(isNameHovered ? color(0,255,255) : color(200));
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

  let offsetX = margin - 8; // usa lo stesso margin del grafico
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

    // accanto alla legenda: leggermente sopra/sinistra va bene
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


// === mouse wheel per cambiare anno ===
let lastScrollTime = 0;
let scrollVelocity = 0;

// 在函数外部定义一个变量，用来存储滚动的累积量
let scrollAccumulator = 0; 
// 设定灵敏度阈值：数字越小越灵敏（滚一点就动），数字越大越迟钝
const SCROLL_THRESHOLD = 80; 

function mouseWheel(event) {


  // 区域限制逻辑保持不变
  if (mouseY < height - 100) return;

  const oldIndex = currentYearIndex;

  // 获取当前滚动的距离（取横向或纵向中较大的那个）
  const currentDelta = abs(event.deltaX) > abs(event.deltaY) ? event.deltaX : event.deltaY;

  // 1. 将本次滚动的距离加入累加器
  scrollAccumulator += currentDelta;

  // 2. 只要累加器超过了阈值，就进行年份切换（使用 while 循环支持一次滚多页）
  while (abs(scrollAccumulator) >= SCROLL_THRESHOLD) {
    if (scrollAccumulator > 0) {
      // 向下滚 / 向右滚 -> 年份增加
      if (currentYearIndex < years.length - 1) currentYearIndex++; 
        // 消费掉阈值
        scrollAccumulator -= SCROLL_THRESHOLD;
      } else {
      // 向上滚 / 向左滚 -> 年份减少
      if (currentYearIndex > 0) currentYearIndex--;
      // 消费掉阈值
      scrollAccumulator += SCROLL_THRESHOLD;
    }
    
    // 边界保护：如果已经滚到头了，清空累加器，防止积攒过多无效滚动
    if (currentYearIndex === 0 || currentYearIndex === years.length - 1) {
       scrollAccumulator = 0;
       break; 
    }
  }

   if (currentYearIndex !== oldIndex) {
    saveLastYear(years[currentYearIndex]);
    setYearInURL(years[currentYearIndex]);
  }

  // 阻止默认网页滚动
  event.preventDefault();
  return false;
}

// blocca lo scroll per un certo tempo
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

  // --- TSAR CTA click ---
  // --- TSAR CTA click ---
  if (tsarCtaBox) {
    const overTsar =
    mouseX >= tsarCtaBox.x && mouseX <= tsarCtaBox.x + tsarCtaBox.w &&
    mouseY >= tsarCtaBox.y && mouseY <= tsarCtaBox.y + tsarCtaBox.h;

  /*if (overTsar) {
    // 1. 寻找 1961 年在数据中的位置
    const targetYear = 1961;
    const targetIndex = years.indexOf(targetYear);

    if (targetIndex !== -1) {
      // 2. 如果找到了，更新当前索引
      currentYearIndex = targetIndex;
      saveLastYear(years[currentYearIndex]);

    } 
    return; // 结束处理，防止触发下方的其他点击逻辑
  }*/

    if (overTsar) {
  const currentYear = Number(years[currentYearIndex]);

  // se sei già nel 1961 → vai all'insight Tsar Bomba
  if (currentYear === 1961) {
    saveLastYear(years[currentYearIndex]);
    setYearInURL(years[currentYearIndex]);
    window.location.href = "insight.html?topic=tsarbomba";
    return;
  }

  // altrimenti → jump interno al 1961
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


  // index button 1958， 1963， 1996 
  let activeYear = Number(years[currentYearIndex]);
  saveLastYear(years[currentYearIndex]);

  if (activeYear === 1958 || activeYear === 1959 || activeYear === 1963 || activeYear === 1996) {
    let btnW = 240;
    let btnH = 40;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - margin - 65; // 确保 Y 坐标与 draw() 中绘制的位置一致

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
  // year_bombe.html
  const fixedSpacing = 150; // 
  const lineY = height / 2 + 50;

  //  Seleziona solo i paesi visibili se un paese è selezionato
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

      saveLastYear(years[currentYearIndex]); // salva l'anno corrente prima di lasciare la pagina
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

/*function drawColumnCTA() {
  const msg = "Click a bomb or a country to see more";

  const x = width - margin;
  const y = height - margin;

  // pulsazione automatica
  const pulse = (sin(frameCount * 0.08) + 1) / 2; // 0..1
  const a = 80 + pulse * 175; // alpha

  textFont(myFont2);
  textSize(14);
  textAlign(RIGHT, BOTTOM);

  // "glow" finto: 2 passate morbide + 1 netta
  noStroke();
  fill(0, 255, 255, a * 0.25);
  text(msg, x + 1, y + 1);
  text(msg, x - 1, y - 1);

  fill(0, 255, 255, a);
  text(msg, x, y);
}*/

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

      // --- left (Labels) ---
      textAlign(LEFT, TOP);
      fill(0, 255, 255);
      text("Click the bomb for more information", boxX + padding, boxY + padding)
      text("Bomb Name:", boxX + padding, boxY + padding+ lineHeight);
      text("Yield (kt):", boxX + padding, boxY + padding + lineHeight+ lineHeight);

      // --- right (Values) ---
      textAlign(RIGHT, TOP);
      fill(0, 255, 255);
      const valueX = boxX + boxW - padding;

      text(bombData.bombName, valueX, boxY + padding+ lineHeight);
      text(bombData.yield, valueX, boxY + padding + lineHeight+ lineHeight);

      pop();
    }
  }
}

function drawInfoIcon(cx, cy, r = 7) {
  push();

  // badge
  stroke(0, 255, 255, 220);
  strokeWeight(1.6);
  fill(18, 210);
  circle(cx, cy, r * 2);

  // "i" leggibile: contorno scuro + fill cyan
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


// atmospheric text hover detection
// 修改 Atmospheric 的检测 (现在是垂直排列在左侧)
function hoverOnAtmospheric(offsetX, dummy) {
  let x = offsetX - 65; // 旋转后的 X 范围
  let y = yAxis - 180;  // 向上延伸的长度
  let w = 40;
  let h = 150;
  return (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y);
}

// 修改 Underground 的检测
function hoverOnUnderground(offsetX, dummy) {
  let x = offsetX - 65;
  let y = yAxis + 30;   // 向下延伸
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
  setYearInURL(years[currentYearIndex]); // opzionale
  indow.location.href = `index.html?country=${countryName}&from=year#page2`;

}

function drawAxes() {
  push();
  stroke(200, 160);
  strokeWeight(1.5);

  // 横轴上方
  line(xBase, yAxis - 25, width - margin + 10, yAxis - 25);
  // 上方竖轴（实线）
  line(xBase, yAxis - 25, xBase, yAxis - 25 - 144);
  // 上方竖轴虚线
  for (let y = yAxis - 25 - 144 - offset; y >= yAxis - 25 - 144 - offset - 40; y -= dashLength + dashGap) {
    line(xBase, y, xBase, y - dashLength);
  }

  // 横轴下方
  line(xBase, yAxis + 25, width - margin + 10, yAxis + 25);
  // 下方竖轴（实线）
  line(xBase, yAxis + 25, xBase, yAxis + 25 + 144);
  // 下方竖轴虚线
  for (let y = yAxis + 25 + 144 + offset; y <= yAxis + 25 + 144 + offset + 40; y += dashLength + dashGap) {
    line(xBase, y, xBase, y + dashLength);
  }

  // 右边横轴虚线
  const xRight = width - margin + 10;
  for (let y = yAxis - 25; y >= yAxis - 25 - 40; y -= dashLength + dashGap) {
    line(xRight, y, xRight, y - dashLength);
  }
  for (let y = yAxis + 25; y <= yAxis + 25 + 40; y += dashLength + dashGap) {
    line(xRight, y, xRight, y + dashLength);
  }

  pop();
}

// -------------------------------
// 绘制 Atmospheric 和 Underground 标签及图标
// -------------------------------
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

// -------------------------------
// 信息图标函数
// -------------------------------
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

// -------------------------------
// Hover检测函数（可选）
// -------------------------------
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
  // preserva eventuale hash (#...) e altri parametri
  history.replaceState(null, "", url.toString());
}

