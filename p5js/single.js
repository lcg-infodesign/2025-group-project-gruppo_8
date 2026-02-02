let bombID;
let table;
let bombData = null;
let typeImages = {};
let typeImg = null;
let myFont1, myFont2, myFont3;
let animR = 0;
let hiroshimaTextBounds = null;
let hDiagProgress = 0;
let hHorizProgress = 0;
//to google map
let coordX, coordY, coordW, coordH;

let mapImg;
let scaledW, scaledH, offsetX, offsetY;
const LON_MIN = -180;
const LON_MAX = 180;
const LAT_MIN = -90;
const LAT_MAX = 90;

let yieldList = [
  50000, 20000, 5000, 2000, 500, 200, 50, 20,
];
let radii = [];
let centerX, centerY;
let animPlaying = false;
let mapZoomed = false;
let animBlueR = 0;

let ctaBtnX, ctaBtnY, ctaBtnW, ctaBtnH;
let ctaBtnVisible = false;

let isHandCursor = false;
let tsarNameBounds = null;
let hoverNearBombPoint = false;

const purposeTextMap = {
  WR: "Activities associated with a weapons development programme, also used when a test's purpose is unspecified.",
  COMBAT:
    "Use of atomic bombs in wartime, specifically Hiroshima and Nagasaki in August 1945.",
  WE: "Tests evaluating the effects of a nuclear detonation on various targets.",
  ME: "Test conducted during a military exercise involving a real nuclear detonation.",
  SE: "Tests assessing nuclear weapon safety in the event of an accident.",
  FMS: "Tests conducted to study phenomena produced by a nuclear explosion.",
  SAM: "Tests examining accidental modes and emergency scenarios involving nuclear weapons.",
  "PNE:PLO":
    "Peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  TRANSP: "Tests related to the transportation and storage of nuclear weapons.",
  "PNE:V":
    "Peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  "*UNKNOWN": "Missing information in the original dataset.",
  PNE: "Peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  "WR/SE":
    "Activities associated with a weapons development programme, and tests assessing nuclear weapon safety in the event of an accident.",
  "WR/WE":
    "Activities associated with a weapons development programme, and tests evaluating the effects of a nuclear detonation on various targets.",
  "WR/PNE":
    "Activities associated with a weapons development programme, and peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  "WE/SAM":
    "Tests evaluating the effects of a nuclear detonation on various targets and tests examining accidental modes and emergency scenarios involving nuclear weapons.",
  "WR/P/SA":
    "A test examining accidental modes and emergency scenarios involving nuclear weapons, an explosion associated with a weapons development programme, one peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  "WR/SAM":
    "Activities associated with a weapons development programme, and tests examining accidental modes and emergency scenarios involving nuclear weapons.",
  "WR/F/SA":
    "A test examining accidental modes and emergency scenarios involving nuclear weapons, two explosions associated with a weapons development programme, an explosion conducted to study phenomena produced by a nuclear explosion.",
  "WR/FMS":
    "Activities associated with a weapons development programme, and tests conducted to study phenomena produced by a nuclear explosion.",
  "WR/P/S":
    "Three weapons-related explosions, activities associated with a weapons development programme, one peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies and a test examining accidental modes and emergency scenarios involving nuclear weapons. ",
  "WR/F/S":
    "Three weapons-related explosions, activities associated with a weapons development programme, one test conducted to study phenomena produced by a nuclear explosion and one test examining accidental modes and emergency scenarios involving nuclear weapons.",
  "WR/WE/S":
    "Three weapons-related explosions, activities associated with a weapons development programme, one test evaluating the effects of a nuclear detonation on various targets, a test examining accidental modes and emergency scenarios involving nuclear weapons.",
};

const typeTextMap = {
  AIRDROP:
    " Nuclear device released from an aircraft and detonated in midair or on impact.",
  ATMOSPH:
    "Nuclear detonation occurring in the atmosphere above ground or sea level.",
  SPACE: "Nuclear detonation occurring in the space",
  BALLOON:
    "Nuclear device suspended from a balloon and detonated in the atmosphere.",
  BARGE:
    "Nuclear device placed on a floating platform and detonated, usually at sea.",
  SHIP: "Nuclear device tested inside the outer structure of a ship anchored in a lagoon.",
  ROCKET:
    "Nuclear device delivered and detonated using a rocket launch system.",
  SHAFT:
    "Nuclear device lowered into a deep vertical borehole and detonated underground.",
  "SHAFT/GR":
    "Nuclear device detonated in a ground-based well at an underground test site.",
  "SHAFT/LG":
    "Nuclear device detonated in a drilled vertical hole beneath an atoll lagoon.",
  SURFACE:
    "Nuclear device placed directly on the ground and detonated near the surface.",
  TOWER: "Nuclear device mounted atop a tower and detonated above ground.",
  TUNNEL: "Nuclear device detonated in a horizontal underground tunnel.",
  GALLERY:
    "Nuclear device detonated in a horizontal mined gallery within rock.",
  UW: "Nuclear device detonated underwater below the sea surface.",
  UG: "Nuclear detonation conducted below the Earth's surface.",
  WATERSUR: "Nuclear device detonated on the surface of the sea.",
  CRATER: "Nuclear device detonated within a prepared ground crater.",
  MINE: "Nuclear device detonated inside an existing mine.",
};

const purposeTitle = {
  WR: "Weapons-related",
  COMBAT: "Wartime use",
  WE: "Weapon effects test",
  ME: "Military exercise test",
  SE: "Safety test",
  FMS: "Phenomena study",
  SAM: "Accident scenario test",
  "PNE:PLO": "Peaceful nuclear explosions",
  TRANSP: "Transport & storage",
  "PNE:V": "Peaceful nuclear explosions",
  "*UNKNOWN": "Unknown purpose",
  PNE: "Peaceful nuclear explosions",
  "WR/SE": "Weapons & safety test",
  "WR/WE": "Weapons & effect test",
  "WR/PNE": "Weapons & peaceful test",
  "WE/SAM": "Effects & accident test",
  "WR/P/SA": "Weapons & accident & peaceful test",
  "WR/SAM": "Weapons & accident test",
  "WR/F/SA": "Weapons & accident & phenomena test",
  "WR/FMS": "Tests weapons-related: ",
  "WR/FMS": "Weapons & phenomena study",
  "WR/P/S": "Weapons & peaceful & accident tests",
  "WR/F/S": "Weapons & phenomena & accident tests",
  "WR/WE/S": "Weapons & effect & accident tests",
}

const typeTitle = {
  AIRDROP:
    "Airdrop",
  ATMOSPH:
    "Atmospheric",
  SPACE: "Exoatmospheric",
  BALLOON:
    "Balloon-Suspended",
  BARGE:
    "Barge-Mounted",
  SHIP: "Ship-Based",
  ROCKET:
    "Rocket-Delivered",
  SHAFT:
    "Vertical Shaft Underground",
  "SHAFT/GR":
    "Ground-Based Shaft",
  "SHAFT/LG":
    "Lagoon Shaft",
  SURFACE:
    "Surface",
  TOWER: "Tower-Mounted",
  TUNNEL: "Tunnel-Based Underground",
  GALLERY:
    "Gallery Underground",
  UW: "Underwater",
  UG: "Underground",
  WATERSUR: "Water-Surface",
  CRATER: "Crater",
  MINE: "Mine-Based",
}

function preload() {
  const urlParams = new URLSearchParams(window.location.search);
  bombID = urlParams.get("id") || "1";
  console.log("bombID =", bombID);

  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  table = loadTable("dataset/dataset-singleb.csv", "csv", "header");
  mapImg = loadImage("images/mappa.png");
  bombBgImg = loadImage("images/single bomb rumore.png");

  typeImages["AIRDROP"] = loadImage("images/airdrop.png");
  typeImages["ATMOSPH"] = loadImage("images/atmosph.png");
  typeImages["SPACE"] = loadImage("images/atmosph.png");
  typeImages["BALLOON"] = loadImage("images/balloon.png");
  typeImages["BARGE"] = loadImage("images/barge.png");
  typeImages["SHIP"] = loadImage("images/barge.png");
  typeImages["ROCKET"] = loadImage("images/rocket.png");
  typeImages["SHAFT"] = loadImage("images/shaft.png");
  typeImages["SHAFT/GR"] = loadImage("images/shaft.png");
  typeImages["SHAFT/LG"] = loadImage("images/shaft.png");
  typeImages["SURFACE"] = loadImage("images/surface.png");
  typeImages["TOWER"] = loadImage("images/tower.png");
  typeImages["TUNNEL"] = loadImage("images/tunnel AND gallery.png");
  typeImages["GALLERY"] = loadImage("images/tunnel AND gallery.png");
  typeImages["UW"] = loadImage("images/uw.png");
  typeImages["UG"] = loadImage("images/ug.png");
  typeImages["WATERSUR"] = loadImage("images/watersurface.png");
  typeImages["CRATER"] = loadImage("images/crater.png");
  typeImages["MINE"] = loadImage("images/mine.png");
}

function getBombData(row) {
  return {
    year: row.getString("year"),
    name: row.getString("name"),
    country: row.getString("country"),
    region: row.getString("region"),
    date_long: row.getString("date_long"),
    yield_u: parseFloat(row.getString("yield_u")) || 0,
    purpose: row.getString("purpose"),
    type: row.getString("type"),
    latitude: parseFloat(row.getString("latitude")),
    longitude: parseFloat(row.getString("longitude")),
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  radii = yieldList.map((y) => mapYieldToRadius(y));
  centerX = width / 2;
  centerY = height;

  noFill();
  strokeCap(SQUARE);
  textFont(myFont2);

  for (let i = 0; i < table.getRowCount(); i++) {
    if (table.getString(i, "id_no").trim() === bombID) {
      bombData = getBombData(table.getRow(i));
      break;
    }
  }

  if (!bombData && table.getRowCount() > 0) {
    bombData = getBombData(table.getRow(0));
  }

  if (bombData) {
    typeImg = typeImages[bombData.type];
  }

  ctaBtnVisible = (bombID === "61053" || bombID === "45002" || bombID === "45003");

  calculateMapDimensions();
}

function draw() {
  isHandCursor = false;

  background(20);

  if (mapZoomed) {
    drawZoomedMap();
    cursor(isHandCursor ? HAND : ARROW);
    return;
  }

  drawBombRing();

  if (!bombData) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text("No bomb data available", width / 2, height / 2);
    cursor(isHandCursor ? HAND : ARROW);
    return;
  }

  for (let i = 0; i < radii.length; i++) {
    let r = radii[i];

    noFill();
    stroke(150);
    strokeWeight(1);
    ellipse(centerX, centerY, r * 2);

    noStroke();
    fill(200);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(yieldList[i], centerX, centerY - r - 10);
  }
  //hiroshima
  let rInner = mapYieldToRadius(15);
  animBlueR = lerp(animBlueR, rInner, 0.05);

  stroke(0, 255, 255);
  strokeWeight(1);
  noFill();
  ellipse(centerX, centerY, animBlueR * 2);

  drawHiroshimaAnnotation();
  drawBombAnnotation();
  drawInfo();

  if (ctaBtnVisible) {
    drawCtaSection();
  }

  cursor(isHandCursor ? HAND : ARROW);
}

function mapYieldToRadius(y) {
  let minR = 20;
  let maxR = height * 0.8;

  let ySafe = max(y, 1);

  let minY = 1;
  let maxY = 50000;

  return map(log(ySafe), log(minY), log(maxY), minR, maxR);
}

function getYieldColor(y) {
  if (y >= 0 && y <= 19) return "#fcddbfff";
  else if (y === 20) return "#FFB873";
  else if (y >= 21 && y <= 150) return "#ff7a22ff";
  else if (y >= 151 && y <= 4999) return "#f35601ff";
  else if (y >= 5000) return "#c21d00ff";
}

function calculateMapDimensions() {
  if (!mapImg) return;
  if (!mapZoomed) {
    scaledW = width * 0.2;
    scaledH = mapImg.height * (scaledW / mapImg.width);

    offsetX = width - scaledW - 0.03 * width;
    offsetY = 0.25 * height + scaledW + 0.05 * height;
  } else {
    scaledW = width * 0.7;
    scaledH = mapImg.height * (scaledW / mapImg.width);

    offsetX = (width - scaledW) / 2;
    offsetY = (height - scaledH) / 2;
  }
}

//mappa
function lonToMapX(lon) {
  return map(lon, LON_MIN, LON_MAX, offsetX, offsetX + scaledW);
}

function latToMapY(lat) {
  return map(lat, LAT_MIN, LAT_MAX, offsetY + scaledH, offsetY);
}

function drawInfo() {
  let boxW = 0.2 * width,
    boxH = boxW,
    boxX = width - boxW - 0.03 * width,
    boxY = 0.25 * height;
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(boxX, boxY, boxW, boxH);

  if (typeImg) {
    let imgW = boxW,
      imgH = boxH;
    image(
      typeImg,
      boxX + (boxW - imgW) / 2,
      boxY + (boxH - imgH) / 2,
      imgW,
      imgH
    );
  }

  let isHover =
    mouseX >= boxX &&
    mouseX <= boxX + boxW &&
    mouseY >= boxY &&
    mouseY <= boxY + boxH;

  if (isHover) {
    fill(0, 150);
    noStroke();
    rect(boxX, boxY, boxW, boxH);

    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    textFont(myFont2);
    text(getTypeText(bombData.type), width - boxW - 0.02 * width, boxY + boxH / 2, width * 0.18);
  }

  if (!mapImg || !bombData) return;

  image(mapImg, offsetX, offsetY, scaledW, scaledH);
  noTint();

  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(offsetX, offsetY, scaledW, scaledH);

  let isHoverMap =
    mouseX >= offsetX &&
    mouseX <= offsetX + scaledW &&
    mouseY >= offsetY &&
    mouseY <= offsetY + scaledH;

  if (isHoverMap) {
    isHandCursor = true;

    fill(0, 150);
    rect(offsetX, offsetY, scaledW, scaledH);

    noFill();
    stroke(0, 255, 255);
    strokeWeight(2);

    let iconX = offsetX + scaledW / 2;
    let iconY = offsetY + scaledH / 2;
    let iconSize = 100;

    if (!mapZoomed) {
      let baseSize = 6;
      let scaleFactor = isHoverMap ? 3 : 1;
      let s = baseSize * scaleFactor;

      line(iconX - s, iconY - s, iconX + 0, iconY - s);
      line(iconX - s, iconY - s, iconX - s, iconY + 0);
      line(iconX + s, iconY + s, iconX + 0, iconY + s);
      line(iconX + s, iconY + s, iconX + s, iconY + 0);

    } else {
      line(iconX - iconSize / 2, iconY - iconSize / 2, iconX + iconSize / 2, iconY + iconSize / 2);
      line(iconX - iconSize / 2, iconY + iconSize / 2, iconX + iconSize / 2, iconY - iconSize / 2);
    }

  }

  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(width * 0.03, offsetY, width * 0.2, scaledH);

  noStroke();
  textAlign(RIGHT, TOP);
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(14);
  textAlign(LEFT, TOP);
  text("Year: " + bombData.year, offsetX, boxY - 60)
  text("Type: " + getTypeTitle(bombData.type), offsetX, boxY - 30);
  text("Purpose: " + getPurposeTitle(bombData.purpose), width * 0.03, offsetY - 30);
  text("Country: " + bombData.country, offsetX, offsetY - 30);
  textSize(24);
  textAlign(LEFT, TOP);
  let yieldColor = color(getYieldColor(bombData.yield_u));
  fill(yieldColor);
  textAlign(CENTER, BOTTOM);
  text(bombData.yield_u, width / 2, height - 30);
  textAlign(CENTER, TOP);
  textSize(14);
  fill(0, 255, 255);

  const yLabel = "Yield (kt)";
  const yX = width / 2;
  const yY = height - 90;

  textFont(myFont3);
  text(yLabel, yX, yY);

  const labelW = textWidth(yLabel);
  const iconR = 6;
  const iconCX = yX + labelW / 2 + 14;
  const iconCY = yY + 9;

  drawInfoIcon(iconCX, iconCY, iconR);

  const hoverYield =
    mouseX >= (yX - labelW / 2) && mouseX <= (iconCX + iconR) &&
    mouseY >= yY && mouseY <= (yY + 18);

  if (hoverYield) {
    isHandCursor = true;

    push();
    const padding = 8;
    const lineHeight = 16;

    fill(0, 0, 0, 200);

    const boxW = 200;
    const boxH = padding * 4 + lineHeight * 3.5;

    const boxX = yX - boxW / 2;
    const boxY = yY - boxH - 10;

    rect(boxX, boxY, boxW, boxH, 5);

    textFont(myFont2);
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
  textAlign(LEFT, TOP);
  fill(255), text(getPurposeText(bombData.purpose), width * 0.04, offsetY + 10, width * 0.18);

  let px = lonToMapX(bombData.longitude);
  let py = latToMapY(bombData.latitude);

  let c = color(getYieldColor(bombData.yield_u));
  fill(c);
  noStroke();
  circle(px, py, 10);
}

function drawBombRing() {
  let targetR = mapYieldToRadius(bombData.yield_u);
  animR = lerp(animR, targetR, 0.05);

  let rOuter = animR;
  let c = color(getYieldColor(bombData.yield_u));
  let thickness = max(3, rOuter * 0.1);

  for (let r = rOuter; r > rOuter - thickness; r -= 0.5) {
    let alpha = map(r, rOuter - thickness, rOuter, 0, 160);
    stroke(red(c), green(c), blue(c), alpha);
    strokeWeight(2);
    noFill();
    ellipse(centerX, centerY, r * 2);
  }
}

function getPurposeText(purpose) {
  if (!purpose) return "";
  return purposeTextMap[purpose.toUpperCase()] || "Unknown Purpose";
}

function getTypeText(type) {
  if (!type) return "";
  return typeTextMap[type.toUpperCase()] || "Unknown Purpose";
}

function getPurposeTitle(purpose) {
  if (!purpose) return "";
  return purposeTitle[purpose.toUpperCase()] || "Unknown";
}

function getTypeTitle(type) {
  if (!type) return "";
  return typeTitle[type.toUpperCase()] || "Unknown";
}

function drawInfoIcon(cx, cy, r = 6) {
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

function drawZoomedMap() {
  if (!mapImg || !bombData) return;

  image(mapImg, offsetX, offsetY, scaledW, scaledH);

  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 10);
  rect(offsetX, offsetY, scaledW, scaledH);

  stroke(0, 255, 255);
  strokeWeight(2);

  // close x
  let iconX = offsetX + scaledW - 16;
  let iconY = offsetY + 16;
  let iconSize = 12;

  line(
    iconX - iconSize / 2,
    iconY - iconSize / 2,
    iconX + iconSize / 2,
    iconY + iconSize / 2
  );
  line(
    iconX - iconSize / 2,
    iconY + iconSize / 2,
    iconX + iconSize / 2,
    iconY - iconSize / 2
  );

  let isCloseHover =
    mouseX >= iconX - iconSize &&
    mouseX <= iconX + iconSize &&
    mouseY >= iconY - iconSize &&
    mouseY <= iconY + iconSize;

  if (isCloseHover) {
    isHandCursor = true;
  }

  //GRID
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255);
  textFont(myFont2);

  // longitude
  for (let i = 0; i <= 6; i++) {
    let lon = LON_MIN + (i * (LON_MAX - LON_MIN)) / 6;
    let x = lonToMapX(lon);
    line(x, offsetY, x, offsetY + scaledH);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    fill(0, 255, 255);
    text(lon.toFixed(0) + "°", x, offsetY + scaledH + 10);
    stroke(0, 255, 255, 80);
  }

  // latitude
  for (let i = 0; i <= 6; i++) {
    let lat = LAT_MIN + (i * (LAT_MAX - LAT_MIN)) / 6;
    let y = latToMapY(lat);

    stroke(0, 255, 255, 80);
    line(offsetX, y, offsetX + scaledW, y);

    noStroke();
    fill(0, 255, 255);
    textSize(12);

    if (i === 6) textAlign(CENTER, TOP);
    else if (i === 0) textAlign(CENTER, BOTTOM);
    else textAlign(CENTER, CENTER);

    text(lat.toFixed(0) + "°", offsetX - 20, y);
  }

  let px = lonToMapX(bombData.longitude);
  let py = latToMapY(bombData.latitude);

  let baseColor = color(getYieldColor(bombData.yield_u));
  let r = 8 + 3 * sin(frameCount * 0.04);

  noStroke();
  fill(baseColor);
  circle(px, py, r * 2);

  let hoverNearBomb = dist(mouseX, mouseY, px, py) < 20;

  hoverNearBombPoint = hoverNearBomb;

  if (hoverNearBomb) {
    isHandCursor = true;
  }

  if (hoverNearBomb) {
    const padding = 8;
    const lineHeight = 16;

    fill(0, 0, 0, 200);

    const line1 = "Click to view on Google Maps";
    const line2 = "Launched by: " + bombData.country;

    let boxW = 180;
    let boxH = padding * 2 + lineHeight * 2;

    let boxX = px + 15;
    let boxY = py - boxH / 2;

    if (boxX + boxW > offsetX + scaledW) {
      boxX = px - boxW - 15;
    }

    rect(boxX, boxY, boxW, boxH, 5);

    textSize(12);
    textFont(myFont2);
    textAlign(LEFT, TOP);
    fill(0, 255, 255);

    text(line1, boxX + padding, boxY + padding);
    text(line2, boxX + padding, boxY + padding + lineHeight);
  }

  noStroke();
  textAlign(CENTER, BOTTOM);
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(20);

  let currentY = offsetY - 10;

  push();
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text("The location is often approximate.", offsetX, currentY);
  pop();

  let coordText = "(" + nf(bombData.latitude, 0, 2) + ", " + nf(bombData.longitude, 0, 2) + ")";
  let centerX = width / 2;
  let coordW = textWidth(coordText);
  let coordH = 20;

  let isCoordHover =
    mouseX >= centerX - coordW / 2 &&
    mouseX <= centerX + coordW / 2 &&
    mouseY >= currentY - coordH &&
    mouseY <= currentY;

  push();
  translate(centerX, currentY);
  textAlign(CENTER, BOTTOM);
  if (isCoordHover) {
    isHandCursor = true;
    fill(255);
    scale(1.05);
  } else {
    fill(0, 255, 255);
  }
  text(coordText, 0, 0);
  pop();

  push();
  textFont(myFont2);
  textSize(14);
  textAlign(RIGHT, BOTTOM);

  let hintX = offsetX + scaledW;
  let hintText = "<< Click to view on Google Maps";
  let hintW = textWidth(hintText);

  const pulse = (sin(frameCount * 0.08) + 1) / 2;
  const alphaGlow = 80 + pulse * 175;

  fill(0, 255, 255, alphaGlow * 0.25);
  text(hintText, hintX + 1, currentY + 1);

  fill(0, 255, 255, alphaGlow);
  text(hintText, hintX, currentY);

  pop();
}

function updateBackBtnVisibility() {
  if (mapZoomed) {
    document.body.classList.add("map-open");
  } else {
    document.body.classList.remove("map-open");
  }
}

window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});
function drawHiroshimaAnnotation() {
  let horizLength = 100;

  let finalAnchorX = centerX + 150;
  let finalAnchorY = centerY - 200;

  let angle = atan2(finalAnchorY - centerY, finalAnchorX - centerX);

  let startX = centerX + cos(angle) * animBlueR;
  let startY = centerY + sin(angle) * animBlueR;

  stroke(0, 255, 255);
  strokeWeight(1);
  noFill();

  hDiagProgress = lerp(hDiagProgress, 1, 0.02);
  if (hDiagProgress > 0.6) {
    hHorizProgress = lerp(hHorizProgress, 1, 0.05);
  }

  let anchorX = lerp(startX, finalAnchorX, hDiagProgress);
  let anchorY = lerp(startY, finalAnchorY, hDiagProgress);

  line(startX, startY, anchorX, anchorY);

  let currentHorizLength = horizLength * hHorizProgress;
  line(anchorX, anchorY, anchorX + currentHorizLength, anchorY);

  let textX = anchorX + currentHorizLength + 10;

  const line1 = "Little Boy";
  const line2 = "Hiroshima, 1945";
  const line3 = "Yield(kt): 15";

  textFont(myFont2);
  textSize(14);

  const lineH = 16; 
  const textW = max(textWidth(line1), textWidth(line2), textWidth(line3));
  const textH = lineH * 3;

  const textY = anchorY - textH / 2;

  const padding = 10;

  const active = (hHorizProgress > 0.95);

  const bounds = {
    x: textX - padding,
    y: textY - padding,
    w: textW + padding * 2,
    h: textH + padding * 2,
  };

  const isHiroshimaHover =
    active &&
    mouseX >= bounds.x &&
    mouseX <= bounds.x + bounds.w &&
    mouseY >= bounds.y &&
    mouseY <= bounds.y + bounds.h;

  noStroke();
  if (isHiroshimaHover) {
    isHandCursor = true;
    fill(255);
  } else {
    fill(0, 255, 255);
  }

  textAlign(LEFT, TOP);
  text(line1 + "\n" + line2 + "\n" + line3, textX, textY);

  if (active) {
    hiroshimaTextBounds = bounds;
  } else {
    hiroshimaTextBounds = null;
  }
}


function drawBombAnnotation() {
  if (!bombData) return;

  let horizLength = 120;

  let finalAnchorX = width * 0.31;
  let finalAnchorY = height * 0.2;

  let angle = atan2(finalAnchorY - centerY, finalAnchorX - centerX);

  let startX = centerX + cos(angle) * animR;
  let startY = centerY + sin(angle) * animR;

  let c = color(getYieldColor(bombData.yield_u));
  stroke(c);
  strokeWeight(1);
  noFill();

  if (this.diagProgress === undefined) this.diagProgress = 0;
  if (this.horizProgress === undefined) this.horizProgress = 0;

  this.diagProgress = lerp(this.diagProgress, 1, 0.02);
  if (this.diagProgress > 0.6) {
    this.horizProgress = lerp(this.horizProgress, 1, 0.05);
  }

  let anchorX = lerp(startX, finalAnchorX, this.diagProgress);
  let anchorY = lerp(startY, finalAnchorY, this.diagProgress);

  line(startX, startY, anchorX, anchorY);

  let currentHorizLength = horizLength * this.horizProgress;
  line(anchorX - currentHorizLength, anchorY, anchorX, anchorY);

  let textX = anchorX - currentHorizLength - 10;

  noStroke();

  const isTsar = (bombData.year === "1961" && bombData.name === "RDS-200");

  textFont(myFont1);
  textSize(20);
  textAlign(RIGHT, CENTER);

  const nameW = textWidth(bombData.name);
  const nameH = 24;
  const bx = textX - nameW;
  const by = anchorY - nameH / 2;

  if (isTsar) {
    tsarNameBounds = { x: bx, y: by, w: nameW, h: nameH };

    const isHoverName =
      mouseX >= bx && mouseX <= bx + nameW &&
      mouseY >= by && mouseY <= by + nameH;

    if (isHoverName) {
      isHandCursor = true;
      fill(200);
    } else {
      fill(red(c), green(c), blue(c));
    }
  } else {
    tsarNameBounds = null;
    fill(red(c), green(c), blue(c));
  }

  text(bombData.name, textX, anchorY);

}

let ctaAlpha = 0;

function drawCtaSection() {
  if (mapZoomed) return;

  ctaAlpha = lerp(ctaAlpha, 255, 0.06);

  ctaBtnW = 240;
  ctaBtnH = 30;
  ctaBtnX = offsetX;

  let menuBtnCenterY = 25 + 60 / 2;
  ctaBtnY = menuBtnCenterY - ctaBtnH / 2;

  let isHover =
    mouseX >= ctaBtnX &&
    mouseX <= ctaBtnX + ctaBtnW &&
    mouseY >= ctaBtnY &&
    mouseY <= ctaBtnY + ctaBtnH;

  if (isHover) {
    isHandCursor = true;
  }

  push();
  drawingContext.globalAlpha = ctaAlpha / 255;
  drawCtaButton(ctaBtnX, ctaBtnY, ctaBtnW, ctaBtnH, "VIEW HISTORIC INSIGHTS", isHover);
  pop();
}

function mousePressed() {
  if (ctaBtnVisible && ctaAlpha > 50) {
    if (
      mouseX >= ctaBtnX &&
      mouseX <= ctaBtnX + ctaBtnW &&
      mouseY >= ctaBtnY &&
      mouseY <= ctaBtnY + ctaBtnH
    ) {
      let topic;
      if (bombID === "61053") {
        topic = "tsarbomba";
      } else {
        topic = "hiroshima";
      }
      window.location.href = "insight.html?topic=" + topic;
      return;
    }
  }

  if (hiroshimaTextBounds) {
    const b = hiroshimaTextBounds;

    if (
      mouseX >= b.x &&
      mouseX <= b.x + b.w &&
      mouseY >= b.y &&
      mouseY <= b.y + b.h
    ) {
      window.location.href = "insight.html?topic=hiroshima";
      return;
    }
  }

  if (tsarNameBounds) {
    const b = tsarNameBounds;
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      window.location.href = "insight.html?topic=tsarbomba";
      return;
    }
  }

  animR = 0;
  animBlueR = 0;
  hDiagProgress = 0;
  hHorizProgress = 0;
  this.diagProgress = 0;
  this.horizProgress = 0;
  ctaAlpha = 0;

  animPlaying = true;

  if (bombData && mapZoomed) {
    let currentY = offsetY - 10;
    let coordText = "(" + nf(bombData.latitude, 0, 2) + ", " + nf(bombData.longitude, 0, 2) + ")";
    let coordW = textWidth(coordText);
    let coordH = 20;
    let centerX = width / 2;

    let isCoordClicked =
      mouseX >= centerX - coordW / 2 &&
      mouseX <= centerX + coordW / 2 &&
      mouseY >= currentY - coordH &&
      mouseY <= currentY;

    textFont(myFont2);
    textSize(14);
    let hintText = "<< Click to view on Google Maps";
    let hintW = textWidth(hintText);
    let hintX = offsetX + scaledW;

    let isHintClicked =
      mouseX >= hintX - hintW &&
      mouseX <= hintX &&
      mouseY >= currentY - 14 &&
      mouseY <= currentY;

    let px = lonToMapX(bombData.longitude);
    let py = latToMapY(bombData.latitude);
    let isPointClicked = dist(mouseX, mouseY, px, py) < 20;

    if (isCoordClicked || isHintClicked || isPointClicked) {
      let lat = bombData.latitude;
      let lon = bombData.longitude;
      let googleMapsURL = `https://www.google.com/maps?q=${lat},${lon}&t=k`;
      window.open(googleMapsURL, "_blank");
      return;
    }
  }

  // map zoom
  let clickedOnMap =
    mouseX >= offsetX &&
    mouseX <= offsetX + scaledW &&
    mouseY >= offsetY &&
    mouseY <= offsetY + scaledH;

  if (mapZoomed) {
    let iconX = offsetX + scaledW - 16;
    let iconY = offsetY + 16;
    let iconSize = 12;

    if (
      mouseX >= iconX - iconSize &&
      mouseX <= iconX + iconSize &&
      mouseY >= iconY - iconSize &&
      mouseY <= iconY + iconSize
    ) {
      mapZoomed = false;
      calculateMapDimensions();
      updateBackBtnVisibility();
      return;

    }
  }

  if (!mapZoomed && clickedOnMap) {
    mapZoomed = true;
    calculateMapDimensions();
    updateBackBtnVisibility();
  } else if (mapZoomed && !clickedOnMap) {
    mapZoomed = false;
    calculateMapDimensions();
    updateBackBtnVisibility();
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    if (mapZoomed) {
      mapZoomed = false;
      calculateMapDimensions();
      updateBackBtnVisibility();
    }
  }
}

function drawCtaButton(btnX, btnY, btnW, btnH, label, isHover) {
  const r = 8;
  const padX = 12;

  fill(20, 20, 20, 200);
  stroke(0, 255, 255, isHover ? 220 : 120);
  strokeWeight(isHover ? 1.5 : 1);
  rect(btnX, btnY, btnW, btnH, r);

  noStroke();
  fill(0, 255, 255, isHover ? 255 : 180);
  textAlign(LEFT, CENTER);
  textFont(myFont3);
  textSize(13);
  text(label, btnX + padX, btnY + btnH / 2 - 1);

  let triSize = 5;
  let triX = btnX + btnW - 12;
  let triY = btnY + btnH / 2;

  if (isHover) {
    triX += sin(frameCount * 0.2) * 2;
  }

  fill(0, 255, 255, isHover ? 255 : 180);
  noStroke();
  push();
  translate(triX, triY);
  triangle(-triSize, -triSize, -triSize, triSize, triSize, 0);
  pop();
}