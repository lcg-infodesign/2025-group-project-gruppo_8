// Variabili globali
// Country filter
let selectedCountry = "ALL COUNTRIES";
const countries = [
  "ALL COUNTRIES",
  "INDIA",
  "PAKISTAN",
  "CHINA",
  "FRANCE",
  "UK",
  "USA",
  "USSR"
];

// Menu UI
let menuOpen = false;
let animatedOnce = false;
const BTN_W = 125;
const BTN_H = 30;
const GAP = 10;
const RADIUS = 6;
const PADDING_AREA = 14;
let menuButtons = [];
let menuItems = [];
let listButtons = [];
let page = 1;
let data = [];
let enteredPage2ByScroll = false;
let introTimelinePlaying = false;
let infoStep = 0;
const infoTexts = [
  "The first nuclear explosions mark a historical turning point. \nAfter the end of World War II, \nthe atomic bomb becomes a tool of power and deterrence. Testing is limited, \nbut a new form of global threat begins.",
  "Competition between superpowers \nleads to a rapid increase in nuclear tests.\nExplosions become more frequent \nand more powerful, often atmospheric.\nNuclear testing is used as a political \nand military demonstration.",
  "After the first international restrictions,\n many tests move underground.\nThe number of explosions decreases, \nbut technological development continues.\nDeterrence remains central \nthroughout the Cold War.",
  "With the end of the Cold War, \nnuclear explosions decrease significantly.\nIn 1996, the Comprehensive \nNuclear Test Ban Treaty is adopted, \naiming to ban all nuclear test explosions.\n1998 marks the last officially\n certified nuclear tests.",
];
let hoveredYear = null;
let isHoveringInteractive = false;
let autoExpandStarted = false;
let expandStartFrame = 0;
let particles1 = [];
let numParticles1 = 50;
let radii = [
  { a: 300, b: 60, angleOffset: 0 },
  { a: 300, b: 60, angleOffset: 120 },
  { a: 300, b: 60, angleOffset: 240 },
];

let spreadSpeed = 0;
let centerCircleSize = 10;
let scrollOffset = 0;
let maxScroll;

let introIndex = -1;
let introTargets = [];
let snapping = false;
let snapTarget = 0;

let showScrollLabelPage1 = true;
const INTRO_START_OFFSET = 120;
const INTRO_STEP_FACTOR = 0.6;
const SNAP_LERP = 0.16;


let myFont1, myFont2;
let img1, img2, img3, img4;

// Variabili della pagina 2 
let table;
let bombsPerYear = {};
let UGBombsPerYear = {};
let particles2 = [];
let startYear = 1945;
let endYear = 1998;
let margin = 80;
let yAxis;
// UI alignment 
const MENU_BTN_X = 25;
const MENU_BTN_Y = 25;
const MENU_BTN_SIZE = 60;
const UI_GAP = 20;
const SIDE_MARGIN = 80;
const MAX_TEXT_W = 420;

let scrollProgress;
let lastStepTime = 0;
let STEP_DELAY = 50;
let scrollDirection = 0;
let scrollStep = 0.55;

let page2BackScrollAcc = 0;
const PAGE2_BACK_SCROLL_THRESHOLD = 2000;
let backTransActive = false;
let backTransT = 0;
const BACK_TRANS_DURATION = 0.6;
let page2Snapshot = null;

let jumpedToPage2 = false;
const PAGE1_END_SPREAD = 650;


let UGTypes = [
  "UG",
  "SHAFT",
  "TUNNEL",
  "GALLERY",
  "MINE",
  "SHAFT/GR",
  "SHAFT/LG",
];

function goToOverview() {

  jumpedToPage2 = true;
  enteredPage2ByScroll = false;
  // Vai alla pagina 2 (grafico)
  page = 2;

  scrollProgress = endYear;

  // Attiva tutte le particelle (bombe) in page 2
  if (particles2 && particles2.length > 0) {
    for (let p of particles2) {
      p.active = true;
    }
  }

  updateSkipVisibility();

}

function updateSkipVisibility() {
  if (page === 1) document.body.classList.add("show-skip");
  else document.body.classList.remove("show-skip");
}

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
  table = loadTable("dataset/dataset-singleb.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    data.push({
      id: i,
      year: row.getNum("year"),
      type: row.getString("type"),
      yield: row.getNum("yield_u"),
      country: row.getString("country")
    });
  }

  //Inizializza le particelle della pagina 1
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
  computeIntroTargets();

  //Inizializza le particelle della pagina 2 
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
  updateSkipVisibility();

  function initMenu() {
    let mainX = width / 2 - BTN_W / 2 + 20;
    let mainY = 170;
    let columnGap = 10;

    listButtons = [];
    for (let i = 0; i < countries.length; i++) {
      let col = i < 4 ? 0 : 1;
      let row = i % 4;

      let offsetX = (col === 0) ? -(BTN_W + columnGap) / 2 : (BTN_W + columnGap) / 2;
      let targetX = mainX + offsetX;
      let targetY = mainY + BTN_H + GAP + row * (BTN_H + GAP);

      listButtons.push(new MenuButton(targetX, mainY, countries[i], targetY));
    }
  }
  initMenu();
  checkExternalCountryFilter();
}

function computeIntroTargets() {
  const introStartY = height + INTRO_START_OFFSET;
  const introStepY = height * INTRO_STEP_FACTOR;

  introTargets = [0, 1, 2, 3].map((i) =>
    max(0, introStartY + introStepY * i - height / 2)
  );
  maxScroll = max(introTargets[3] + 40, introTargets[3]);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeIntroTargets();
}

function syncIntroIndex() {
  let idx = -1;
  for (let i = 0; i < introTargets.length; i++) {
    if (scrollOffset >= introTargets[i] - 10) idx = i;
  }
  introIndex = idx;
}

function snapTo(val) {
  snapTarget = constrain(val, 0, maxScroll);
  snapping = true;
}

function introPrev() {
  syncIntroIndex();

  if (introIndex > 0) {
    introIndex--;
    snapTo(introTargets[introIndex]);
  } else {
    introTop();
  }

  if (introIndex <= 0) showScrollLabelPage1 = true;
}

function introTop() {
  introIndex = 0;
  showScrollLabelPage1 = true;

  autoExpandStarted = false;
  centerCircleSize = 10;
  snapTo(0);
}

function checkHashNavigation() {
  if (window.location.hash === "#page2") {
    jumpedToPage2 = true;
    page = 2;

    enteredPage2ByScroll = true;

    scrollProgress = endYear;
    scrollDirection = 0;

    updateSkipVisibility();


  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

function startBackTransition() {
  if (backTransActive) return;
  backTransActive = true;
  backTransT = 0;
  scrollDirection = 0; 
  page2Snapshot = get();   
}


function draw() {
  if (page === 1) drawPage1();
  else if (page === 2) drawPage2();
}

// pagina1draw
function drawPage1() {
  background(20);
  if (snapping) {
    scrollOffset = lerp(scrollOffset, snapTarget, SNAP_LERP);
    if (abs(scrollOffset - snapTarget) < 0.6) {
      scrollOffset = snapTarget;
      snapping = false;
    }
  }

  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textLeading(31);
  const titleX = width / 2;
  const titleY = MENU_BTN_Y + MENU_BTN_SIZE / 2;

  textAlign(CENTER, CENTER);
  text("NUCLEAR EXPLOSIONS ARCHIVE", titleX, titleY);

  textFont(myFont2);
  fill(200, 200, 200);

  const str1 =
    "Between 1945 and 1998, \n nuclear testing reshaped geopolitics,\nscience, and the environment.";

  const str3 =
    "Over two thousand explosions\nleft a lasting mark on the planet.\nEach particle is a real test.";
  const str2 =
  "Apart from the Hiroshima and Nagasaki\n bombs, all other explosions were tests\nand have not been used as weapons.";
  const str4 = "Data from the SIPRI-FOA Report";

  const GUTTER = 200;
  const leftX = width / 2 - GUTTER / 2 - MAX_TEXT_W;
  const rightX = width / 2 + GUTTER / 2;

  const introStartY = height + 120;
  const introStepY = height * 0.6; 

  textAlign(LEFT, TOP);
  drawIntroBlock(
    str1,
    leftX,
    introStartY + introStepY * 0 - scrollOffset,
    MAX_TEXT_W
  );

  drawIntroBlock(
    str2,
    leftX,
    introStartY + introStepY * 1 - scrollOffset,
    MAX_TEXT_W);

  drawIntroBlock(
    str3,
    leftX,
    introStartY + introStepY * 2 - scrollOffset,
    MAX_TEXT_W
  );
  drawIntroBlockData(
    str4,
    rightX,
    introStartY + introStepY * 3 - scrollOffset,
    MAX_TEXT_W
  );

  drawScrollHintArrow();

  if (isOverDownHint(mouseX, mouseY) || isOverUpHint(mouseX, mouseY)) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  // particelle centrale
  push();
  let scaledSize = centerCircleSize;
  if (centerCircleSize <= 10) {
    let scaleFactor = 2 + 2 * sin(frameCount * 0.01);
    scaledSize *= scaleFactor;
  }

  // Automatic circle expansion after full scroll
  if (autoExpandStarted) {

    if (scrollOffset < maxScroll - 2) {
      autoExpandStarted = false;
      centerCircleSize = 10;
    } else {
      centerCircleSize = lerp(centerCircleSize, max(width, height) * 2, 0.03);
      if (centerCircleSize > max(width, height)) {
        goNextPage();
      }
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
  const centerY = height / 2;
  const d = abs(y - centerY); 
  const a = map(d, 0, centerY, 255, 0, true); 

  textFont(myFont2);
  textSize(21);
  noStroke();
  fill(255, a);
  textLeading(31)
  text(str, x, y, w);
}

function drawIntroBlockData(str, x, y, w) {

  const centerY = height / 2;
  const d = abs(y - centerY); 
  const a = map(d, 0, centerY, 255, 0, true); 

  textFont(myFont2);
  textSize(14);
  noStroke();
  fill(255, a);
  textLeading(31)
  text(str, x, y, w);
}

function drawScrollHintArrow() {
  const cx = width / 2;
  const bob = sin(frameCount * 0.08) * 4;
  const cy = height - 44 + bob;
  const labelY = cy - 24; 

  const halfW = 10; 
  const h = 8;  

  const firstTarget = (introTargets && introTargets.length) ? introTargets[0] : 120;
  const showLabel = scrollOffset < firstTarget - 10;
  if (scrollOffset >= maxScroll - 2) return;

  const labelAlpha = showLabel
    ? map(scrollOffset, 0, max(1, firstTarget - 10), 255, 0, true)
    : 0;

  const fadeStart = maxScroll - 140;
  const arrowAlpha = scrollOffset > fadeStart
    ? map(scrollOffset, fadeStart, maxScroll, 255, 0, true)
    : 255;

  push();

  if (showLabel) {
    noStroke();
    fill(200, labelAlpha);
    textFont(myFont2);
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text("SCROLL DOWN FOR MORE", cx, labelY);
  }

  stroke(200, arrowAlpha);
  strokeWeight(2);
  noFill();
  line(cx - halfW, cy - h, cx, cy);
  line(cx + halfW, cy - h, cx, cy);

  pop();
}

function isOverDownHint(mx, my) {

  const cx = width / 2;
  const baseCy = height - 4;
  const hitW = 220;
  const hitH = 80;

  return (
    mx >= cx - hitW / 2 &&
    mx <= cx + hitW / 2 &&
    my >= baseCy - hitH &&
    my <= baseCy + 20
  );
}

function snapTo(val) {
  snapTarget = constrain(val, 0, maxScroll);
  snapping = true;
}

function introNext() {
  syncIntroIndex();
  if (introIndex < 3) {
    introIndex++;
    snapTo(introTargets[introIndex]);
  } else {
    snapping = false;
    scrollOffset = maxScroll;
    snapTarget = maxScroll;

    if (!autoExpandStarted) autoExpandStarted = true;
  }
}


function introPrev() {
  if (introIndex > 0) {
    introIndex--;
    snapTo(introTargets[introIndex]);
  } else {
    introIndex = -1;
    autoExpandStarted = false;
    centerCircleSize = 10;
    snapTo(0);
  }
}

function drawUpHintArrow() {
  if (scrollOffset <= 0) return;

  const cx = width / 2;
  const cy = 44;  

  push();
  stroke(200);
  strokeWeight(2);
  noFill();

  line(cx, cy + 12, cx, cy - 12);
  line(cx, cy - 12, cx - 8, cy - 4);
  line(cx, cy - 12, cx + 8, cy - 4);

  noStroke();
  fill(200);
  textFont(myFont2);
  textSize(12);
  textAlign(CENTER, TOP);
  text("BACK", cx, cy + 16);
  pop();
}

function isOverUpHint(mx, my) {
  const cx = width / 2;
  const cy = 44;
  const w = 140;
  const h = 70;
  return mx >= cx - w / 2 && mx <= cx + w / 2 && my >= cy - 20 && my <= cy + h;
}

function drawPage2() {

  if (backTransActive && page2Snapshot) {
    backTransT += (deltaTime / 1000) / BACK_TRANS_DURATION;
    const t = constrain(backTransT, 0, 1);
    const e = t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;

    background(20);

    push();
    tint(255, 255 * (1 - e));
    translate(0, +e * 28); 
    image(page2Snapshot, 0, 0);
    pop();

    if (t >= 1) {
      backTransActive = false;
      page2Snapshot = null;
      goBackToIntroBottom();
    }
    return;
  }
  background(20);
  drawCountryMenu();
  updateHoverPage2();

  // LEGENDA 
  let offsetX = margin - 8; 
  let offsetY = height - margin - 80; 

  textFont(myFont2);
  noStroke();
  fill(0, 255, 255);
  textSize(20);
  textAlign(CENTER, TOP);
  text("Bombs Launched", width / 2, 137);

  noStroke();
  fill(200);
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, TOP);

  const yLabel = "YIELD (kt)";
  text(yLabel, offsetX, offsetY - 40);
  drawInfoIcon(offsetX + textWidth(yLabel) + 14, (offsetY - 40) + 9);

  textSize(14);
  textAlign(CENTER, TOP);
  let activeParticles;
  if (selectedCountry === "ALL COUNTRIES") {
    activeParticles = particles2.filter((p) => p.active).length;
  } else {
    let target = getDatasetCountryName(selectedCountry);
    activeParticles = particles2.filter((p) =>
      p.active && normalizeCountry(p.country) === normalizeCountry(target)
    ).length;
  }
  textFont(myFont3);
  textSize(60);
  fill(0, 255, 255);
  text(activeParticles, width / 2, 57);
  drawTopRightInfoCarousel();

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
  noStroke();
  fill(0, 255, 255);
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, TOP);
  push();
  stroke(200, 160);
  strokeWeight(1.5);
  const xBase = margin - 20 - 5;
  line(
    xBase,
    yAxis - 25,
    width - margin + 10,
    yAxis - 25
  );
  line(
    xBase,
    yAxis - 25,
    xBase,
    yAxis - 25 - 144
  );

  let dashLength = 4;  
  let dashGap = 6;     
  let offset = 5;   

  for (let y = yAxis - 25 - 144 - offset; y >= yAxis - 25 - 144 - offset - 40; y -= dashLength + dashGap) {
    line(xBase, y, xBase, y - dashLength);
  }

  line(
    xBase,
    yAxis + 25,
    width - margin + 10,
    yAxis + 25
  );

  line(
    xBase,
    yAxis + 25,
    xBase,
    yAxis + 25 + 144
  );

  for (let y = yAxis + 25 + 144 + offset; y <= yAxis + 25 + 144 + offset + 40; y += dashLength + dashGap) {
    line(xBase, y, xBase, y + dashLength);
  }

  pop();

  const atmLabel = "Atmospheric";
  fill(200)
  push();
  translate(offsetX - 45, yAxis - 25); 
  rotate(-HALF_PI);
  textAlign(LEFT, TOP);
  text(atmLabel, 0, 0);

  drawInfoIcon(
    textWidth(atmLabel) + 14,
    9
  );
  pop();

  const undLabel = "Underground";
  const undW = textWidth(undLabel);

  push();
  translate(offsetX - 45, yAxis + 25);  
  rotate(-HALF_PI);
  textAlign(RIGHT, TOP);  
  text(undLabel, 0, 0);

  drawInfoIcon(
    -undW - 14,
    9
  );
  pop();
  push();
  stroke(200, 160);
  strokeWeight(1.5);

  const xRight = width - margin + 10;
  for (let y = yAxis - 25; y >= yAxis - 25 - 40; y -= dashLength + dashGap) {
    line(xRight, y, xRight, y - dashLength);
  }
  for (let y = yAxis + 25; y <= yAxis + 25 + 40; y += dashLength + dashGap) {
    line(xRight, y, xRight, y + dashLength);
  }

  pop();

  // hover sopra Atmospheric
  const isHoverATM = hoverOnAtmospheric(offsetX, margin);

  if (isHoverATM) {
    push();
    const padding = 8;
    const lineHeight = 16;

    fill(0, 0, 0, 200);

    let boxW = 180;
    let boxH = padding * 2 + lineHeight * 3.5;

    let boxX = offsetX;
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

  // hover sopra underground
  const isHoverUND = hoverOnUnderground(offsetX, offsetY);

  if (isHoverUND) {
    push();
    const padding = 8;
    const lineHeight = 16;

    fill(0, 0, 0, 200);

    let boxW = 180;
    let boxH = padding * 2 + lineHeight * 3.5;

    let boxX = offsetX;
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


  const isHoverYIELD = hoverOnYield(offsetX, offsetY);

  if (isHoverYIELD) {
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
    text("in kilotons;", boxX + padding, boxY + 2 * padding + lineHeight * 2);
    text("1 kt = 1,000 tons of TNT.", boxX + padding, boxY + 2 * padding + lineHeight * 3);

    pop();
  }



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
      stroke(0, 255, 255);
      strokeWeight(1);
      noFill();

    }
  });

  if (scrollDirection !== 0 && millis() - lastStepTime > STEP_DELAY) {
    scrollProgress += scrollDirection * scrollStep;
    scrollProgress = constrain(scrollProgress, startYear - 1, endYear);
    lastStepTime = millis();
  }

  if (introTimelinePlaying && scrollProgress >= endYear) {
    scrollDirection = 0;
    introTimelinePlaying = false;
  }

  textFont(myFont2);
  disegnaAsseEAnni();

  for (let p of particles2) {
    if (enteredPage2ByScroll) {
      p.active = p.year <= floor(scrollProgress);
    } else {
      p.active = true;
    }

    p.update();
    p.draw();
  }

  drawColumnCTA();

  if (backTransActive) {
    drawingContext.restore();
  }


}

function hoverOnAtmospheric(offsetX, offsetY) {
  const label = "Atmospheric";

  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, TOP);

  const xStart = offsetX - 45;      
  const yStart = yAxis - 25;      

  const textW = textWidth(label);
  const iconGap = 14;           
  const iconSize = 16;     
  const w = textW + iconGap + iconSize;

  const h = 22; 

  const mouseXRel = mouseX - xStart;
  const mouseYRel = mouseY - yStart;

  return (mouseXRel >= 0 && mouseXRel <= h &&
    mouseYRel >= -w && mouseYRel <= 0);
}

function hoverOnUnderground(offsetX, offsetY) {
  const label = "Underground";

  textFont(myFont2);
  textSize(14);

  const xStart = offsetX - 35;
  const yStart = yAxis + 25;

  const textW = textWidth(label);
  const iconGap = 14;
  const iconSize = 16;
  const w = textW + iconGap + iconSize;
  const h = 22;    

  const mouseXRel = mouseX - xStart;
  const mouseYRel = mouseY - yStart;

  return (mouseXRel >= -h && mouseXRel <= 0 &&
    mouseYRel >= 0 && mouseYRel <= w);
}



function hoverOnYield(offsetX, offsetY) {
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



function drawColumnCTA() {
  const msg = "Click a column to see more";

  const x = width - margin;
  const y = height - margin;

  const pulse = (sin(frameCount * 0.08) + 1) / 2; 
  const a = 80 + pulse * 175; 

  textFont(myFont2);
  textSize(14);
  textAlign(RIGHT, BOTTOM);

  noStroke();
  fill(0, 255, 255, a * 0.25);
  text(msg, x + 1, y + 1);
  text(msg, x - 1, y - 1);

  fill(0, 255, 255, a);
  text(msg, x, y);
}

function isHoveringCountryMenu() {
  const mainX = width / 2 - BTN_W / 2 + 20;
  const mainY = 170;

  const overMain =
    mouseX >= mainX && mouseX <= mainX + BTN_W &&
    mouseY >= mainY && mouseY <= mainY + BTN_H;

  if (overMain) return true;

  if (menuOpen) {
    for (let btn of listButtons) {
      if (btn.isHovered()) return true;
    }
  }

  return false;
}


function updateHoverPage2() {
  hoveredYear = null;
  isHoveringInteractive = false;

  if (isHoveringCountryMenu()) {
    cursor(HAND);
    return;
  }

  const lineX = width - 400 - margin;
  const boxX = lineX + 18;
  const titleY = 75;
  const boxY = titleY;

  const boxW = 400;
  const boxH = 210;

  const arrowsY = boxY + boxH + 28;
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

  const legendOffsetX = margin - 8;
  const legendOffsetY = height - margin - 80;

  const overATM = hoverOnAtmospheric(legendOffsetX, margin);
  const overUND = hoverOnUnderground(legendOffsetX, legendOffsetY);
  const overYLD = hoverOnYield(legendOffsetX, legendOffsetY);

  if (overATM || overUND || overYLD) {
    cursor(HAND);
    return;
  }

  const yearStep = (width - 2 * margin) / (endYear - startYear);
  const hitX = yearStep * 0.45; 

  const labelTop = yAxis - 40;
  const labelBottom = yAxis + 40;
  const columnTop = 80; 
  const columnBottom = yAxis + 200;

  const legendLeft = margin - 10;
  const legendRight = margin + 220; 
  const legendTop = height - margin - 150; 
  const legendBottom = height;

  const ctaLeft = width - margin - 320;
  const ctaRight = width;
  const ctaTop = height - margin - 60;
  const ctaBottom = height;

  const topLeft = width / 2 - 220; 
  const topRight = width / 2 + 900;
  const topTop = 0;
  const topBottom = 350; 

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

  if (isHoveringInteractive) cursor(HAND);
  else cursor(ARROW);
}

function drawTopRightInfoCarousel() {

  const lineX = width - 400 - margin; 
  const topY = 0;

  const boxX = lineX + 18;
  const titleY = 75;   
  const boxY = titleY; 
  const boxW = 400;
  const boxH = 210;

  push();
  stroke(0, 255, 255, 160);
  strokeWeight(2);
  line(lineX, topY, lineX, boxY + boxH + 38);
  pop();

  
  push();
  noStroke();
  textFont(myFont2);
  textSize(20);
  textLeading(31);
  fill(200, 200, 200);
  textAlign(LEFT, TOP);
  text(infoTexts[infoStep], boxX, boxY, boxW, boxH);
  pop();

  // Arrows under the text block
  const arrowsY = boxY + boxH + 28;
  const chevronW = 10;
  const chevronH = 8;

  if (infoStep < 3) {
    drawGlowingChevronRight(boxX + boxW - 4, arrowsY, chevronW, chevronH);
  }
  
  if (infoStep > 0) {
    drawGlowingChevronLeft(boxX + 4, arrowsY, chevronW, chevronH);
  }
}

function drawGlowingChevronRight(cx, cy, halfW, h) {
  const pulse = (sin(frameCount * 0.08) + 1) / 2;
  const a = 90 + pulse * 165;

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

function handleIntroScroll(delta) {
  spreadSpeed += delta * 0.05;

  scrollOffset += delta * 0.5;
  scrollOffset = constrain(scrollOffset, 0, maxScroll);

  if (delta < 0) {
    autoExpandStarted = false;
    centerCircleSize = 10;
  }

  if (scrollOffset >= maxScroll && delta > 0 && !autoExpandStarted) {
    autoExpandStarted = true;
    expandStartFrame = frameCount;
  }
}


function mouseWheel(event) {
  if (backTransActive) return false;

  if (page === 1) {

    spreadSpeed += event.delta * 0.05;

    scrollOffset += event.delta * 0.5;
    scrollOffset = constrain(scrollOffset, 0, maxScroll);

    if (event.delta < 0) {
      autoExpandStarted = false;
      centerCircleSize = 10;
    }

    if (scrollOffset >= maxScroll && event.delta > 0 && !autoExpandStarted) {
      autoExpandStarted = true;
      expandStartFrame = frameCount;
    }

    {
      handleIntroScroll(event.delta);
      return false;
    }
  } else if (page === 2) {

    if (event.delta > 0) {
      page2BackScrollAcc = 0;
      scrollDirection = 1;
      return false;
    }

    // scroll up  indietro nella timeline
    if (event.delta < 0) {
      scrollDirection = 0;

      page2BackScrollAcc += abs(event.delta);

      if (page2BackScrollAcc >= PAGE2_BACK_SCROLL_THRESHOLD) {
        page2BackScrollAcc = 0;
        goBackToIntroBottom();
      }

      startBackTransition();

      return false;
    }

    return false;

  }

  return false;
}

function mousePressed() {

  // page 1
  if (page === 1) {
    if (isOverDownHint(mouseX, mouseY)) {
      introNext();  
      return;
    }
    if (isOverUpHint(mouseX, mouseY)) {
      introPrev();  
      return;
    }
  }


  // page 2 
  if (page === 2) {
    const lineX = width - 400 - margin;
    const boxX = lineX + 18;
    const titleY = 75;
    const boxY = titleY;

    const boxW = 400;
    const boxH = 210;

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
      let th = 12;

      let dx = mouseX - x;
      let dy = mouseY - y;
      let rx = dx * cos(-HALF_PI) - dy * sin(-HALF_PI);
      let ry = dx * sin(-HALF_PI) + dy * cos(-HALF_PI);

      if (rx >= -tw / 2 && rx <= tw / 2 && ry >= 0 && ry <= th) {
        window.location.href = `year.html?year=${year}`;
        break;
      }
    }

    if (page === 2) {
      let mainX = width / 2 - BTN_W / 2 + 20;
      let mainY = 170;

      if (mouseX >= mainX && mouseX <= mainX + BTN_W &&
        mouseY >= mainY && mouseY <= mainY + BTN_H) {
        menuOpen = !menuOpen;
        return;
      }

      if (menuOpen) {
        for (let btn of listButtons) {
          if (btn.isHovered()) {
            selectedCountry = btn.label;
            menuOpen = false;
            return;
          }
        }
      }
    }
  }
}

function applyIntroDelta(delta) {

  handleIntroScroll(delta);
}

function kickSpreadToward(targetScroll) {
  const delta = (targetScroll - scrollOffset) / 0.5;
  spreadSpeed += delta * 0.05;
  if (delta < 0) {
    autoExpandStarted = false;
    centerCircleSize = 10;
  }
}

function keyPressed() {

  if (page === 1) {

    if (keyCode === DOWN_ARROW) {
      syncIntroIndex();
      const target = (introIndex < 3) ? introTargets[introIndex + 1] : maxScroll;
      kickSpreadToward(target);
      introNext();
      return false;
    }

    if (keyCode === UP_ARROW) {
      syncIntroIndex();
      const target = (introIndex > 0) ? introTargets[introIndex - 1] : 0;
      kickSpreadToward(target);
      introPrev();
      return false;
    }

    if (keyCode === HOME) {
      introTop();
      return false;
    }
  }

  if (page !== 2 || menuOpen) return;

  if (keyCode === RIGHT_ARROW && infoStep < 3) {
    infoStep++;
  } else if (keyCode === LEFT_ARROW && infoStep > 0) {
    infoStep--;
  }
}

// particles in page1
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

// particles in page2
class Particle2 {
  constructor(year, isUG, yieldVal, targetX, targetY, country) {
    this.year = year;
    this.isUG = isUG;
    this.yieldVal = yieldVal;
    this.country = country;
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
    let target = getDatasetCountryName(selectedCountry);
    let visible =
      selectedCountry === "ALL COUNTRIES" ||
      normalizeCountry(this.country) === normalizeCountry(target);
    const isHover = hoveredYear === this.year;
    const rr = isHover ? this.r * 1.25 : this.r;

    noStroke();
    if (visible) {
      fill(this.col);
    } else {
      fill(255, 255, 255, 25); 
    }
    circle(this.x, this.y, rr);
  }
}

// Funzioni di supporto per la pagina2
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
        nonUGBombs.push({ yieldVal: data[i].yield, country: data[i].country });

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
        new Particle2(year, false, nonUGBombs[i].yieldVal, cx, cy, nonUGBombs[i].country)
      );
    }

    let ugBombs = [];
    for (let i = 0; i < data.length; i++) {
      let rowYear = data[i].year;
      let type = data[i].type;
      if (rowYear === year && UGTypes.includes(type)) {
        ugBombs.push({ yieldVal: data[i].yield, country: data[i].country });
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
      particles2.push(
        new Particle2(year, true, ugBombs[i].yieldVal, cx, cy, ugBombs[i].country)
      );
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
      fill(0, 255, 255);
      textSize(14);
      scale(1.06); 
    } else {
      fill(220);
      textSize(12);
    }

    text(year, 0, 0);
    pop();
  }
}

function forcePage1AtBottom() {
  scrollOffset = maxScroll;
  scrollOffset = constrain(scrollOffset, 0, maxScroll);
  snapping = false;
  snapTarget = scrollOffset;
  autoExpandStarted = false;
  centerCircleSize = 10;

  introIndex = 3;
  showScrollLabelPage1 = false;

  for (let p of particles1) {
    p.currentA = p.a + p.expandSpeed * PAGE1_END_SPREAD;
    p.currentB = p.b + p.expandSpeed * PAGE1_END_SPREAD;
  }

  spreadSpeed = 0; 
}

function goBackToIntroBottom() {
  page = 1;
  history.replaceState(null, "", window.location.pathname);
  scrollDirection = 0;
  autoExpandStarted = false;
  centerCircleSize = 10;

  function goBackToIntroBottom() {
    page = 1;
    history.replaceState(null, "", window.location.pathname);

    scrollDirection = 0;
    autoExpandStarted = false;
    centerCircleSize = 10;

    if (jumpedToPage2) {
      forcePage1AtBottom();
    } else {
      scrollOffset = maxScroll - 30;
      scrollOffset = constrain(scrollOffset, 0, maxScroll);
      snapping = false;
    }

    const backBtn = document.getElementById("backToTopBtn");
    if (backBtn) backBtn.style.display = "none";

    updateSkipVisibility();
  }

  const backBtn = document.getElementById("backToTopBtn");
  if (backBtn) backBtn.style.display = "none";

  updateSkipVisibility();

}

function goNextPage() {
  page = 2;

  enteredPage2ByScroll = true;
  scrollProgress = startYear - 1;

  scrollDirection = 1;
  introTimelinePlaying = true; 

  lastStepTime = millis();

  updateSkipVisibility();

}


function drawCountryMenu() {
  let mainX = width / 2 - BTN_W / 2 + 20;
  let mainY = 170;

  const overMain =
    mouseX >= mainX && mouseX <= mainX + BTN_W &&
    mouseY >= mainY && mouseY <= mainY + BTN_H;

  if (!menuOpen && overMain) {
    menuOpen = true;
  }

  drawMainButton(mainX, mainY);

  if (menuOpen) {
    for (let i = 0; i < listButtons.length; i++) {
      let btn = listButtons[i];
      btn.update();
      btn.display();
    }

    if (!isMouseInMenuArea(mainX, mainY)) {
      menuOpen = false;
    }
  } else {
    for (let btn of listButtons) {
      btn.visibleY = mainY;
      btn.x = mainX;
    }
  }
}


function isMouseInMenuArea(mainX, mainY) {
  let columnGap = 10;
  let totalW = BTN_W * 2 + columnGap;

  let left = mainX + (BTN_W / 2) - (totalW / 2) - PADDING_AREA;
  let right = left + totalW + PADDING_AREA * 2;
  let top = mainY - PADDING_AREA;
  let bottom = mainY + BTN_H + PADDING_AREA + 4 * (BTN_H + GAP);

  return (
    mouseX >= left && mouseX <= right &&
    mouseY >= top && mouseY <= bottom
  );
}

// LISTENER MENU x CAMBIO PAGINA
window.addEventListener("changePage", (e) => {
  if (e.detail.page === 2) {
    goToOverview();
  } else {
    page = e.detail.page;
  }
});

function getVisibleCountries() {
  return countries.filter(c => c !== selectedCountry || c === "ALL COUNTRIES");
}

function normalizeCountry(c) {
  return c.trim().toUpperCase();
}

function drawMainButton(x, y) {
  fill(0, 255, 255); 
  noStroke();
  textFont(myFont2);
  textSize(20);
  textAlign(RIGHT, CENTER); 
  text("by", x - 15, y + BTN_H / 2 - 4);
  let isHover = mouseX >= x && mouseX <= x + BTN_W && mouseY >= y && mouseY <= y + BTN_H;

  stroke(0, 255, 255);
  strokeWeight(2);
  if (isHover || menuOpen) fill(0, 255, 255);
  else noFill();
  rect(x, y, BTN_W, BTN_H, RADIUS);

  noStroke();
  fill(isHover || menuOpen ? 20 : color(0, 255, 255));
  textAlign(CENTER, CENTER);
  textFont(myFont2);
  textSize(14);
  text(selectedCountry, x + BTN_W / 2, y + BTN_H / 2 - 1);
}

class MenuButton {
  constructor(targetX, y, label, targetY) {
    this.initialX = width / 2 - BTN_W / 2 + 30; 
    this.targetX = targetX;
    this.x = this.initialX; 
    this.visibleY = y;
    this.targetY = targetY;
    this.w = BTN_W;
    this.h = BTN_H;
    this.label = label;
  }

  update() {
    let easing = 0.2;
    this.x += (this.targetX - this.x) * easing;
    this.visibleY += (this.targetY - this.visibleY) * easing;
  }

  display() {
    let hovered = this.isHovered();
    stroke(0, 255, 255);
    strokeWeight(2);
    if (hovered) fill(0, 255, 255);
    else fill(20, 220);

    rect(this.x, this.visibleY, this.w, this.h, RADIUS); 

    noStroke();
    fill(hovered ? 20 : color(0, 255, 255));
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.visibleY + this.h / 2 - 1);
  }

  isHovered() {
    return (
      mouseX >= this.x && mouseX <= this.x + this.w &&
      mouseY >= this.visibleY && mouseY <= this.visibleY + this.h
    );
  }
}

function getDatasetCountryName(label) {
  if (label === "PAKISTAN") return "PAKIST";
  return label;
}
function checkExternalCountryFilter() {
  let params = new URLSearchParams(window.location.search);
  const countryParam = params.get("country");
  const fromParam = params.get("from");

  const backBtn = document.getElementById("backFromYearBtn");
  if (backBtn) {
    const shouldShow = !!countryParam && fromParam === "year";
    backBtn.style.display = shouldShow ? "block" : "none";

    if (shouldShow) {
      backBtn.onclick = () => {
        const y = sessionStorage.getItem("lastYear");
        window.location.href = y ? `year.html?year=${y}` : "year.html";
      };
    }
  }

  if (countryParam) {
    selectedCountry = countryParam.toUpperCase();
    page = 2;
    enteredPage2ByScroll = true;
    scrollProgress = endYear; 

    const skipBtn = document.getElementById("skipIntroBtn");
    if (skipBtn && skipBtn.parentElement) {
      skipBtn.parentElement.style.display = "none";
    }
  }

}
