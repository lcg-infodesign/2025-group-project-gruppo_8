let bombID;
let table;
let bombData = null;
let typeImages = {};
let typeImg = null;
let myFont1, myFont2, myFont3;
let animR = 0;

// Map variables
let mapImg;
let scaledW, scaledH, offsetX, offsetY;
const LON_MIN = -180;
const LON_MAX = 180;
const LAT_MIN = -90;
const LAT_MAX = 90;

let yieldList = [
  50000, 20000, 5000, 2000,  500, 200,  50, 20, 
];
let radii = [];
let centerX, centerY;
let animPlaying = false;
let mapZoomed = false;
let animBlueR = 0;

const purposeTextMap = {
  WR: "Weapons-related: activities associated with a weapons development programme, also used when a test’s purpose is unspecified.",
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
  "*UNKNOWN": "missing information in the original dataset",
  PNE: "Peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  "WR/SE":
    "Tests weapons-related:,activities associated with a weapons development programme, and tests assessing nuclear weapon safety in the event of an accident.",
  "WR/WE":
    "Tests weapons-related:,activities associated with a weapons development programme, and tests evaluating the effects of a nuclear detonation on various targets.",
  "WR/PNE":
    "Explosions weapons-related:,activities associated with a weapons development programme, and peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  "WE/SAM":
    "Tests evaluating the effects of a nuclear detonation on various targets and tests examining accidental modes and emergency scenarios involving nuclear weapons.",
  "WR/P/SA":
    "A test examining accidental modes and emergency scenarios involving nuclear weapons, an explosion associated with a weapons development programme, one peaceful nuclear explosions for industrial applications or testing peaceful nuclear technologies.",
  "WR/SAM":
    "Tests weapons-related:,activities associated with a weapons development programme, and tests examining accidental modes and emergency scenarios involving nuclear weapons.",
  "WR/F/SA":
    "A test examining accidental modes and emergency scenarios involving nuclear weapons, two explosions associated with a weapons development programme, an explosion conducted to study phenomena produced by a nuclear explosion.",
  "WR/FMS":
    "Tests weapons-related:,activities associated with a weapons development programme, and tests conducted to study phenomena produced by a nuclear explosion.",
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
  UG: "Nuclear detonation conducted below the Earth’s surface.",
  WATERSUR: "Nuclear device detonated on the surface of the sea.",
  CRATER: "Nuclear device detonated within a prepared ground crater.",
  MINE: "Nuclear device detonated inside an existing mine.",
};

function preload() {
  const urlParams = new URLSearchParams(window.location.search);
  bombID = urlParams.get("id") || "1"; //Ottieni l'ID della bomba dall'URL, se non presente usa "1"
  console.log("bombID =", bombID);

  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  table = loadTable("dataset/dataset-singleb.csv", "csv", "header");
  mapImg = loadImage("images/mappa.png");

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

  // Cerca i dati della bomba corrispondente all'ID
  for (let i = 0; i < table.getRowCount(); i++) {
    if (table.getString(i, "id_no").trim() === bombID) {
      bombData = getBombData(table.getRow(i));
      break;
    }
  }
  // Se non viene trovato alcun ID corrispondente → torna direttamente alla prima pagina
  if (!bombData && table.getRowCount() > 0) {
    bombData = getBombData(table.getRow(0)); // Torna alla prima pagina
  }

  if (bombData) {
    typeImg = typeImages[bombData.type];
  }

  calculateMapDimensions();
}

function draw() {
  background(20);

  if (mapZoomed) {
    drawZoomedMap();
    return;
  }

  // textFont(myFont1);
  // noStroke();
  // fill(200);
  // textSize(20);
  // textAlign(CENTER, TOP);
  // text(bombData.name, width / 2, 30);

  drawBombRing();
  if (!bombData) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text("No bomb data available", width / 2, height / 2);
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
}

function mapYieldToRadius(y) {
  let minR = 20;
  let maxR = height*0.8;

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
    scaledW = width*0.2;
    scaledH = mapImg.height * (scaledW / mapImg.width);

    offsetX = width - scaledW - 0.03*width;
    offsetY = 0.2*height+scaledW+0.05*height;
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
  let boxW = 0.2*width,
    boxH = boxW,
    boxX = width - boxW - 0.03*width,
    boxY = 0.2*height;
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
    text(getTypeText(bombData.type), boxX + 10, boxY + boxH / 2, 280);
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
    cursor(HAND);
    fill(0, 150);
    rect(offsetX, offsetY, scaledW, scaledH);

    noFill();
    stroke(0, 255, 255);
    strokeWeight(2);

 let iconX = offsetX + scaledW / 2; 
    let iconY = offsetY + scaledH / 2; 
    let iconSize = 100;      

    if (!mapZoomed) {
      line(iconX - 6, iconY - 6, iconX + 0, iconY - 6);
      line(iconX - 6, iconY - 6, iconX - 6, iconY + 0);
      line(iconX + 6, iconY + 6, iconX + 0, iconY + 6);
      line(iconX + 6, iconY + 6, iconX + 6, iconY + 0);
    } else {
      line(iconX - iconSize / 2, iconY - iconSize / 2, iconX + iconSize / 2, iconY + iconSize / 2);
      line(iconX - iconSize / 2, iconY + iconSize / 2, iconX + iconSize / 2, iconY - iconSize / 2);
    }

  } else {
    cursor(ARROW);
  }

  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(width*0.03, offsetY, width*0.2, scaledH);

  noStroke();
  textAlign(RIGHT, TOP);
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(14);


  textAlign(LEFT, TOP);
  text("Type: " + bombData.type, offsetX, boxY-30);
  text("Purpose: " + bombData.purpose, width*0.03, offsetY - 30);
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
  text("Yield(kt) ", width / 2, height - 90);
 
  textFont(myFont2);
  textAlign(LEFT, TOP);
  fill(200), text(getPurposeText(bombData.purpose), width*0.04, offsetY + 10, width*0.18);

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



function drawZoomedMap() {
  if (!mapImg || !bombData) return;

  image(mapImg, offsetX, offsetY, scaledW, scaledH);

  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 10);
  rect(offsetX, offsetY, scaledW, scaledH);

  stroke(0, 255, 255);
  strokeWeight(2);

  let iconX = offsetX + scaledW - 16;
  let iconY = offsetY + 16;
  let iconSize = 12;

  line(iconX - iconSize / 2, iconY - iconSize / 2, iconX + iconSize / 2, iconY + iconSize / 2);
  line(iconX - iconSize / 2, iconY + iconSize / 2, iconX + iconSize / 2, iconY - iconSize / 2);

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
    line(offsetX, y, offsetX + scaledW, y);
    noStroke();
    textSize(12);
    textAlign(CENTER, RIGHT);
    fill(0, 255, 255);
    text(lat.toFixed(0) + "°", offsetX - 20, y);
    stroke(0, 255, 255, 80);
  }

  let px = lonToMapX(bombData.longitude);
  let py = latToMapY(bombData.latitude);

  let baseColor = color(getYieldColor(bombData.yield_u));

  let r = 8 + 3 * sin(frameCount * 0.04);

  noStroke();
  fill(baseColor);
  circle(px, py, r * 2);

  let hoverNearBomb = dist(mouseX, mouseY, px, py) < 20;

  if (hoverNearBomb) {
    const padding = 8;
    const lineHeight = 16;

    fill(0, 0, 0, 200);

    let boxW = 180;
    let boxH = padding * 2 + lineHeight * 3;

    let boxX = px + 15;
    let boxY = py - boxH / 2;

    if (boxX + boxW > offsetX + scaledW) {
      boxX = px - boxW - 15;
    }

    rect(boxX, boxY, boxW, boxH, 5);

    textSize(12);
    textAlign(LEFT, TOP);
    fill(0, 255, 255);
    text("Country:", boxX + padding, boxY + padding);
    text("Latitude:", boxX + padding, boxY + padding + lineHeight * 1);
    text("Longitude:", boxX + padding, boxY + padding + lineHeight * 2);

    textAlign(RIGHT, TOP);
    const valueX = boxX + boxW - padding;

    fill(0, 255, 255);
    text(bombData.country, valueX, boxY + padding);
    text(nf(bombData.latitude, 0, 2), valueX, boxY + padding + lineHeight * 1);
    text(nf(bombData.longitude, 0, 2), valueX, boxY + padding + lineHeight * 2);
  }

noStroke();
textAlign(CENTER, BOTTOM);
fill(0, 255, 255);
textFont(myFont3);
textSize(20);

let coordText = "(" + nf(bombData.latitude, 0, 2) + ", " + nf(bombData.longitude, 0, 2) + ")";
let coordX = width / 2;
let coordY = 70;

text(coordText, coordX, coordY);

textSize(20);
let textW = textWidth(coordText);
let textH = 20; 

if (
  mouseX >= coordX - textW / 2 &&
  mouseX <= coordX + textW / 2 &&
  mouseY >= coordY - textH &&
  mouseY <= coordY
) {
  stroke(0, 255, 255);
  strokeWeight(2);
  line(coordX - textW / 2, coordY + 2, coordX + textW / 2, coordY + 2); 
  noStroke();
}

}

window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});

function drawHiroshimaAnnotation() {
  let angle = radians(-25); 
  let startX = centerX + cos(angle) * animBlueR;
  let startY = centerY + sin(angle) * animBlueR;

  let diagX = startX + 40;
  let diagY = startY - 40;

  let horizX = diagX + 100;
  let horizY = diagY;

  stroke(0, 255, 255);
  strokeWeight(1);
  noFill();

  line(startX, startY, diagX, diagY);
  line(diagX, diagY, horizX, horizY);

  noStroke();
  fill(0, 255, 255);
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, CENTER);

  text(
    "Little Boy\nHiroshima, 1945",
    horizX + 8,
    horizY
  );
}

function keyPressed() {
  if (keyCode === ESCAPE) { 
    if (mapZoomed) {
      mapZoomed = false;
      calculateMapDimensions();
    }
  }
}

function mousePressed() {
  animR = 0;
  animPlaying = true;

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
      return; 
    }
  }

  if (!mapZoomed && clickedOnMap) {
    mapZoomed = true;
    calculateMapDimensions();
  } else if (mapZoomed && !clickedOnMap) {
    mapZoomed = false;
    calculateMapDimensions();
  }
}

function drawBombAnnotation() {
  if (!bombData) return;

  // 动态圆环半径
  let targetR = animR; 
  let angle = radians(-65); // 圆环出发角度
  let startX = centerX - cos(angle) * targetR;
  let startY = centerY + sin(angle) * targetR;

  // 固定文字位置
  let textX = width * 0.05;
  let textY = height * 0.05;

  let c = color(getYieldColor(bombData.yield_u));
  stroke(c);
  strokeWeight(1);
  noFill();

  // 动态斜线中点：lerp 可以控制动画
  let diagTargetX = textX + 50; // 最终水平线起点，距离文字一点
  let diagTargetY = textY;

  // 让中点慢慢接近最终位置
  if (!this.diagX) this.diagX = startX; // 初始化
  if (!this.diagY) this.diagY = startY;

  this.diagX = lerp(this.diagX, diagTargetX, 0.05);
  this.diagY = lerp(this.diagY, diagTargetY, 0.05);

  line(startX, startY, this.diagX, this.diagY);
  line(this.diagX, this.diagY, textX, textY);

  noStroke();
  fill(c);
  textFont(myFont2);
  textSize(14);
  textAlign(LEFT, CENTER);

  text(bombData.name, textX, textY);
}
