let bombID;
let table;
let bombData = null;

// Map variables
let mapImg;
let IMG_W = 1024;
let IMG_H = 512;
let LON_MIN = -180,
  LON_MAX = 180;
let LAT_MIN = -90,
  LAT_MAX = 90;
let offsetX, offsetY, scaledW, scaledH;

function preload() {
  const urlParams = new URLSearchParams(window.location.search);
  bombID = urlParams.get("id") || "1"; //Ottieni l'ID della bomba dall'URL, se non presente usa "1"
  console.log("bombID =", bombID);

  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  table = loadTable("dataset/dataset.csv", "csv", "header");

  mapImg = loadImage("images/worldmap.png");
  typeImg = loadImage("images/airdrop.png");
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

  calculateMapDimensions();
}

function draw() {
  background(20);

  if (!bombData) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text("No bomb data available", width / 2, height / 2);
    return;
  }

  textFont(myFont1);
  fill(110, 133, 219);
  textSize(20);
  noStroke();
  textAlign(CENTER, TOP);
  text("SINGLE BOMB", width / 2, 20);

  // --- Titolo ---
  fill(0, 255, 255);
  textFont(myFont3);
  textAlign(LEFT, TOP);
  textSize(20);
  text("Name: " + bombData.name, 50, 80);

  // --- Cerchi centrali ---
  let centerX = (width - 562) / 2;
  let centerY = height / 2;

  let radiusOuter, outerMin, outerMax;

  if (bombData.yield_u < 15) {
    outerMin = 10;
    outerMax = 50;
    radiusOuter = map(bombData.yield_u, 0, 15, outerMin, outerMax);
  } else if (bombData.yield_u <= 10000) {
    outerMin = 50;
    outerMax = 900;
    radiusOuter = map(bombData.yield_u, 15, 10000, outerMin, outerMax);
  } else {
    outerMin = 900;
    outerMax = 1000;
    radiusOuter = map(bombData.yield_u, 10000, 50000, outerMin, outerMax);
  }

  let radiusInner = 50;
  stroke(255);
  strokeWeight(1);
  noFill();
  ellipse(centerX, centerY, radiusInner * 2);

  let c = color(getYieldColor(bombData.yield_u));
  let thickness = max(3, radiusOuter * 0.1);
  for (let r = radiusOuter; r > radiusOuter - thickness; r -= 0.5) {
    let alpha = map(r, radiusOuter - thickness, radiusOuter, 0, 200);
    stroke(red(c), green(c), blue(c), alpha);
    strokeWeight(2);
    noFill();
    ellipse(centerX, centerY, r * 2);
  }

  fill(50);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  fill(0, 255, 255);
  text("Type: " + bombData.type, 50, height - 110);
  text("Purpose: " + bombData.purpose, 50, height - 80);
  text("Yield: " + bombData.yield_u, 50, height - 140);

  drawMap();

  let boxW = 512,
    boxH = 375,
    boxX = width - boxW - 50,
    boxY = 80;
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(boxX, boxY, boxW, boxH);

  if (typeImg) {
    let imgW = boxW * 0.8,
      imgH = boxH * 0.8;
    image(
      typeImg,
      boxX + (boxW - imgW) / 2,
      boxY + (boxH - imgH) / 2,
      imgW,
      imgH
    );
  }
}

function mousePressed() {}
  

function getYieldColor(y) {
  if (y >= 0 && y <= 19) return "#fcddbfff";
  else if (y === 20) return "#FFB873";
  else if (y >= 21 && y <= 150) return "#ff7a22ff";
  else if (y >= 151 && y <= 4999) return "#f35601ff";
  else if (y >= 5000) return "#c21d00ff";
}

// --- Funzioni mappa ---
function calculateMapDimensions() {
  if (!mapImg) return;

  scaledW = IMG_W * 0.5;
  scaledH = IMG_H * 0.5;

  offsetX = width - scaledW - 50;
  offsetY = height - scaledH - 50;
}

function lonToMapX(lon) {
  return map(lon, LON_MIN, LON_MAX, offsetX, offsetX + scaledW);
}

function latToMapY(lat) {
  return map(lat, LAT_MIN, LAT_MAX, offsetY + scaledH, offsetY);
}

function drawMap() {
  if (!mapImg || !bombData) return;

  // Mappa
  tint(255, 100);
  image(mapImg, offsetX, offsetY, scaledW, scaledH);
  noTint();

  // Bordo mappa
  stroke(0, 255, 255, 150);

  strokeWeight(1);
  noFill();
  rect(offsetX, offsetY, scaledW, scaledH);

  // Punto bomba
  let px = lonToMapX(bombData.longitude);
  let py = latToMapY(bombData.latitude);

  let c = color(getYieldColor(bombData.yield_u));
  fill(c);
  noStroke();
  circle(px, py, 10);
}

window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});
