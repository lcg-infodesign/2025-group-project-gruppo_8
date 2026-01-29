let table;
let years = [];
let currentYearIndex = 0;
let testsByYear = {};
let countries = [];
let dots = [];
let mushroomImg;
let noTestYears = [1947, 1950, 1959, 1997];
let noTestTexts = {
  1947: `No lanci nel 1947
In 1947, no nuclear test launches are recorded because, in the immediate aftermath of Hiroshima and Nagasaki, nuclear powers entered a period of caution and reassessment. The United States, at the time the only country with nuclear weapons, faced no immediate military necessity and was shifting the role of nuclear arms toward deterrence rather than active testing. Additionally, nuclear tests were technically complex, costly, and politically sensitive in a rapidly emerging Cold War context.`,
  
  1950: `No lanci nel 1950
In 1950, the strategic competition between the United States and the Soviet Union entered a qualitatively new phase. The year falls between the first Soviet nuclear test in 1949 and the next one in 1951, but it is precisely this apparent absence of spectacular events that determines its historical significance. In fact, 1950 represents the moment when the presence of the USSR as an atomic power became fully perceived by the United States and its allies, ushering in an arms race characterized by growing technological and doctrinal competition.
The awareness that both superpowers possessed nuclear capabilities introduced the real risk of mutually assured destruction, laying the foundations for the concept of modern nuclear deterrence: international stability was no longer guaranteed by the superiority of a single power, but by the balance of a symmetrical threat. The absence of significant tests during the 1950s did not therefore reflect a period of stagnation, but rather the caution imposed by the fear of uncontrollable escalation.
At the same time, this period was marked by intense research and development activity. In 1950, systematic studies began on more advanced weapons systems, including the hydrogen bomb, which was destined to exceed the power of previous weapons by orders of magnitude. In this sense, 1950 was a key year in the transformation of deterrence into a structural element of the international order of the Cold War.`,

1959: `No lanci nel 1959
The reason there were no tests in 1959 was that the Soviet Union, Great Britain, and the United States agreed to a moratorium on nuclear weapon tests in 1958. This moratorium lasted from November 1958 to August 1961. The Soviet Union resumed on 1 September, 1961, with the US following suit a couple of weeks later.
France, being on the verge of being a nuclear-capable nation in 1958, did not take part in that moratorium. They didn't test in 1959 because they did not quite have the ability to do so. They did have that ability in 1960.
The 1958–1961 moratorium represented a rare moment of international cooperation during the Cold War, aiming to slow down the nuclear arms race and reduce atmospheric fallout. While the main powers paused testing, technological development and planning continued in secret. For countries like France, this period allowed them to finalize key technologies before conducting their first successful tests in 1960. The moratorium also highlighted the growing importance of diplomacy and negotiation in nuclear policy, setting a precedent for future treaties such as the Partial Test Ban Treaty of 1963.`,

  1997: `No lanci nel 1997
In 1997 there were no nuclear launches because the international context was relatively stable and governed by the logic of deterrence. The Cold War had ended several years earlier, the Soviet Union no longer existed, and the direct ideological and military confrontation between superpowers had eased. The United States and Russia still possessed large nuclear arsenals, but they were constrained by arms control treaties such as the START agreements, which reduced the number of operational warheads and increased cooperation and transparency. Moreover, the awareness that any nuclear attack would lead to mutually assured destruction made such a launch irrational from a political and strategic perspective. In the absence of acute crises or serious incidents that could be interpreted as an imminent attack, and with more reliable communication and early-warning systems than in the past, the conditions that might have led to the use of nuclear weapons simply did not exist in 1997.`

};

let highlightColor;
let countryTotalCounts = {};
let margin = 80;

let selectedCountry = null;


function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
  mushroomImg = loadImage("images/mushroom.png");
  table = loadTable("dataset/dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  highlightColor = color(0, 255, 255);
  processData();

  const urlParams = new URLSearchParams(window.location.search);

  const yearParam = urlParams.get("year");
  if (yearParam) {
    const parsedYear = parseInt(yearParam);
    const index = years.indexOf(parsedYear);
    if (index !== -1) currentYearIndex = index;
  }

  const countryParam = urlParams.get("country");
  if (countryParam && countries.includes(countryParam)) {
    selectedCountry = countryParam;
  }
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
  text("NUCLEAR TEST EACH YEAR", width / 2, 30);

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
    (currentYearIndex > 0 && mouseX > width/2 - 150 && mouseX < width/2 - 90 && mouseY > 120 && mouseY < 170) ||
    (currentYearIndex < years.length - 1 && mouseX > width/2 + 90 && mouseX < width/2 + 150 && mouseY > 120 && mouseY < 170);
  let overDot = dots.some(d => dist(mouseX, mouseY, d.cx, d.cy) < d.r);

  let overCountry = false;
  const fixedSpacing = 150; 
  const lineY = height / 2 + 50;

  const visibleCountries = selectedCountry
  ? countries.filter(c => c === selectedCountry)
  : countries;

visibleCountries.forEach((country, idx) => {

let x = width / 2 + (idx - (visibleCountries.length - 1) / 2) * fixedSpacing;

    if (mouseX > x - 40 && mouseX < x + 120 && mouseY > lineY - 20 && mouseY < lineY + 20) {
      overCountry = true;
    }
  });

  cursor(overArrow || overDot || overCountry ? HAND : ARROW);

  drawColumnCTA(); // Disegna il messaggio "Click a column to see more"

  // btn insight page
  let checkYear = Number(currentYear);
  if (checkYear === 1958 || checkYear === 1963 || checkYear === 1996) {
    let btnW = 240;
    let btnH = 40;
    // centro orizzontalmente
    let btnX = width / 2 - btnW / 2; 
    // Y posizione in basso
    let btnY = height - margin - 65;

    push();
    let isHoverBack = mouseX > btnX && mouseX < btnX + btnW &&
                      mouseY > btnY && mouseY < btnY + btnH;


    if (isHoverBack) {
      fill(20, 20, 20, 200);
      stroke(255, 122, 34, 200);
      cursor(HAND);
    } else {
      fill(20, 20, 20, 200);
      stroke(255, 122, 34, 120);
    }

    strokeWeight(1);
    rect(btnX, btnY, btnW, btnH);

    noStroke();
    fill(isHoverBack ? 255 : 255, 122, 34);
    textAlign(CENTER, CENTER);
    textFont(myFont3);
    textSize(14);
    text("VIEW HISTORIC INSIGHTS", btnX + btnW / 2, btnY + btnH / 2 - 2);

    // --- triangle ---
    let triSize = 5; // 
    let triX = btnX + btnW - 12; 
    let triY = btnY + btnH / 2;
    if (isHoverBack) {
      // hover animation
      triX += sin(frameCount * 0.2) * 2;
    }
    push();
    translate(triX, triY);
    noStroke();
    fill(isHoverBack ? 255 : 255, 122, 34);
    // Draw the triangle
    triangle(-triSize, -triSize, -triSize, triSize, triSize, 0);
    pop();
    pop();
  }
    // tooltip bomba
      drawBombTooltip(); 

      drawColumnCTA();
}

function drawTimeline() {
    let ty = height - 50;   
    let spacing = 80;       
    let centerX = width / 2; 
    
    // disegna gli anni 
    const historicYears = [1958, 1963, 1996];
    const orangeColor = [255, 122, 34]; //  orangeRGB
    const cyanColor = [255, 255, 255];    // 
    
    push();
    for (let i = 0; i < years.length; i++) {
      let x = centerX + (i - currentYearIndex) * spacing;

      if (x > -spacing && x < width + spacing) {
        let d = abs(centerX - x);
        
        let opacity = map(d, 0, width / 2, 255, 70);
        opacity = constrain(opacity, 70, 255); 

        let isHistoric = historicYears.includes(Number(years[i]));
        let rgb = isHistoric ? orangeColor : cyanColor;

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
    // Estrae il titolo "No lanci nel..."
    if (line.startsWith("No lanci nel")) {
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
      region: test.region,
      latitude: test.latitude,
      longitude: test.longitude
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
  textSize(48);
  fill(0, 255, 255);
  textFont(myFont3);
  text(currentYear, width / 2, 90);
  
  textFont(myFont2);
  fill(0, 255, 255);
  textSize(14);
  text("YEAR", width / 2, 70);


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
  fill(200);
  textAlign(LEFT, TOP);
  textSize(14);
  noStroke();
  let margin = 80;
  text("ATMOSPHERIC", margin - 8, margin + 280);
  textAlign(LEFT, BOTTOM);
  text("UNDERGROUND", margin - 8, height - margin - 165);

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
      mouseY > lineY - 15 && 
      mouseY < lineY + 15
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
        let cy = isAtmosph ? lineY - 25 - row * (cellSize + gap) : lineY + 25 + row * (cellSize + gap);
        let d = dist(mouseX, mouseY, cx, cy);
        let isHovered = d < cellSize / 2;
        let size = isHovered ? cellSize * 1.5 : cellSize;
        fill(getYieldColor(test.yield));
        noStroke();
        circle(cx, cy, size);
        dots.push({ cx: cx, cy: cy, r: cellSize / 2, id: test.id });
      });
    }
    drawGroup(atmTests, true);
    drawGroup(sottTests, false);

    //  country name and total
    push();
    translate(x, lineY); 
    if (isNameHovered) {
      scale(1.08);  
    }

    // country name
    textAlign(CENTER, CENTER);
    textFont(myFont2);
    textSize(14);
    if (isNameHovered) {
      fill(255);
    } else {
      fill(0, 255, 255);
      noStroke();
    }
    text(country, 0, 0);

    // total number above name when hovered
    if (isNameHovered) {
      let historicalTotal = countryTotalCounts[country] || 0;
      let totalText = historicalTotal;
      let padding = 8; 
      let numX = (nameW / 2) + padding; 

      noStroke();
      fill(255);
      textFont(myFont3);
      textSize(14);
      textAlign(LEFT, CENTER);

      let yOffset = -2;
      text(totalText, numX, yOffset);

      // arrow
      let tw = textWidth(totalText);
      let arrowX = numX + tw + 8;
      let s = 4;
      let arrowY = yOffset + 3;
      fill(255);
      triangle(
          arrowX, arrowY - s,
          arrowX, arrowY + s,
          arrowX + s + 2, arrowY
        );
      }
    pop();
  });
}

function drawBottomInfo(yearData) {
  let total = Object.values(yearData).reduce((sum, tests) => sum + tests.length, 0);

  fill(150, 150, 150);
  textAlign(RIGHT, TOP);
  textSize(14);
  textFont(myFont2);
  text("TOTAL BOMBS", width - 80, 70);
  textSize(48);
  textFont(myFont3);
  text(total, width - 80, 90);
}

function drawLegend() {

  let offsetX = margin - 8; // usa lo stesso margin del grafico
  let offsetY = height - margin - 80;

  textFont(myFont2);
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
  if (event.delta < 0) {
    if (currentYearIndex < years.length - 1) {
      currentYearIndex++;
    }
  } 
  else if (event.delta > 0) {
    if (currentYearIndex > 0) {
      currentYearIndex--;
    }
  }
  
  return false;
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
        return; 
      }
    }
  }

  // index button
  let activeYear = Number(years[currentYearIndex]);
  
  if (activeYear === 1958 || activeYear === 1963 || activeYear === 1996) {
    let btnW = 240;
    let btnH = 40;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - margin - 45;

    if (mouseX > btnX && mouseX < btnX + btnW &&
        mouseY > btnY && mouseY < btnY + btnH) {
      window.location.href = 'insight.html';
      return;
   }
  }
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
 // year_bombe.html
  const fixedSpacing = 150; // 
  const lineY = height / 2 + 50;

  countries.forEach((country, idx) => {
    let x = width / 2 + (idx - (countries.length - 1) / 2) * fixedSpacing;
    let areaSinistra = 40;  // 
    let areaDestra = 110;   // 
    let areaAltezza = 20;   // 

    if (
      mouseX > x - areaSinistra &&
      mouseX < x + areaDestra &&
      mouseY > lineY - areaAltezza &&
      mouseY < lineY + areaAltezza
    ) {
 window.location.href =
  `index.html?year=${years[currentYearIndex]}&resetCountry=true#page2`;


return;
    }

  });




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

function drawColumnCTA() {
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

    // Trova i dati della bomba corrispondente
    for (let country in yearData) {
      bombData = yearData[country].find(t => t.id === hoveredDot.id);
      if (bombData) {
        bombData.country = country; 
        break;
      }
    }

    if (bombData) {
      const padding = 8;
      const lineHeight = 16;
      const boxW = 180;
      const boxH = padding * 2 + lineHeight * 5;

      let boxX = mouseX + 15;
      let boxY = mouseY - boxH / 2;

      if (boxX + boxW > width) {
        boxX = mouseX - boxW - 15;
      }

      push();
      fill(0, 0, 0, 200);
      rect(boxX, boxY, boxW, boxH, 5);

      textSize(12);
      textAlign(LEFT, TOP);
      textFont(myFont2);
      fill(0, 255, 255);
      text("Country:", boxX + padding, boxY + padding);
      text("Region:", boxX + padding, boxY + padding + lineHeight * 1);
      text("Latitude:", boxX + padding, boxY + padding + lineHeight * 2);
      text("Longitude:", boxX + padding, boxY + padding + lineHeight * 3);
      text("Yield(kt):", boxX + padding, boxY + padding + lineHeight * 4);
      textAlign(RIGHT, TOP);
      const valueX = boxX + boxW - padding;

      fill(0, 255, 255);
      text(bombData.country, valueX, boxY + padding);
      text(bombData.region, valueX, boxY + padding + lineHeight * 1);
      text(nf(bombData.latitude, 0, 4), valueX, boxY + padding + lineHeight * 2);
      text(nf(bombData.longitude, 0, 4), valueX, boxY + padding + lineHeight * 3);
      text(bombData.yield, valueX, boxY + padding + lineHeight * 4);
      pop();
    }
  }
}

window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});
