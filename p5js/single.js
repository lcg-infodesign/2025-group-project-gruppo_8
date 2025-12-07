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

let yieldList = [50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10];
let radii = []; // 存每个圈的半径
let centerX, centerY;

function preload() {
  const urlParams = new URLSearchParams(window.location.search);
  bombID = urlParams.get("id") || "1"; //Ottieni l'ID della bomba dall'URL, se non presente usa "1"
  console.log("bombID =", bombID);

  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  table = loadTable("dataset/dataset.csv", "csv", "header");
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
  typeImages["WATER SU"] = loadImage("images/watersurface.png");
  typeImages["CRATER"] = loadImage("images/crater.png");
  typeImages["MINE"] = loadImage("images/mine.png");
  typeImages["SPACE"] = loadImage("images/space.png");
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

  radii = yieldList.map(y => mapYieldToRadius(y));
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

  if (!bombData) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text("No bomb data available", width / 2, height / 2);
    return;
  }
  // name
  fill(0, 255, 255);
  textFont(myFont3);
  textAlign(CENTER, TOP);
  textSize(30);
  text(bombData.name, width / 2, 20);
let d = dist(mouseX, mouseY, centerX, centerY);

for (let i = 0; i < radii.length; i++) {
  let r = radii[i];
  let innerR = i < radii.length - 1 ? radii[i + 1] : 0;

  if (d <= r && d > innerR) {
    fill(0, 255, 255, 30); // hover
  } else {
    noFill();
  }

  stroke(150);
  strokeWeight(1);
  ellipse(centerX, centerY, r * 2);

  noStroke();
  fill(200);
  textAlign(CENTER, CENTER);
  textSize(12);
  text(yieldList[i], centerX, centerY - r);
}

  let rOuter = mapYieldToRadius(bombData.yield_u); //bomb
  let rInner = mapYieldToRadius(15); //hiroshima

  // hirishima
  stroke(0, 255, 255);
  strokeWeight(1);
  noFill();
  ellipse(centerX, centerY, rInner * 2);

  // bomb
  // ---- 动画：半径由小到大 ----
let targetR = mapYieldToRadius(bombData.yield_u);
animR = lerp(animR, targetR, 0.05);  // 越小越慢，0.05 = 缓慢变大
  rOuter = animR;
  let c = color(getYieldColor(bombData.yield_u));
  let thickness = max(3, rOuter * 0.1);

  for (let r = rOuter; r > rOuter - thickness; r -= 0.5) {
    let alpha = map(r, rOuter - thickness, rOuter, 0, 200);
    stroke(red(c), green(c), blue(c), alpha);
    strokeWeight(2);
    noFill();
    ellipse(centerX, centerY, r * 2);
  }

  drawMap();
drawingContext.filter = 'blur(5px)';
  let boxW = 300,
    boxH = 300,
    boxX = width - boxW - 50,
    boxY = 150;
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(boxX, boxY, boxW, boxH);
drawingContext.filter = 'none';
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

}

function mapYieldToRadius(y) {
  let minR = 5;
  let maxR = min(width, height) * 0.8;

  if (y <= 20) {
    // 0-20
    return map(y, 0, 20, minR, minR + 50);
  } else if (y <= 10000) {
    // 20-10000
    return map(y, 20, 10000, minR + 50, maxR - 100);
  } else {
    // 10000-50000
    return map(y, 10000, 50000, maxR - 100, maxR);
  }
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

  // 固定宽度为600，高度根据图片比例计算
  scaledW = 300;
  scaledH = mapImg.height * (scaledW / mapImg.width);

  // 右下角偏移一点
  offsetX = width - scaledW - 50;
  offsetY = height - scaledH - 50;
}

//mappa
function lonToMapX(lon) {
  return map(lon, LON_MIN, LON_MAX, offsetX, offsetX + scaledW);
}

function latToMapY(lat) {
  return map(lat, LAT_MIN, LAT_MAX, offsetY + scaledH, offsetY);
}

function drawMap() {
  if (!mapImg || !bombData) return;

  // 显示地图
  // tint(255, 220);
  image(mapImg, offsetX, offsetY, scaledW, scaledH);
  noTint();

  // 地图边框
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(offsetX, offsetY, scaledW, scaledH);

  fill(0, 255, 255);
  textAlign(LEFT, TOP);
  textSize(12);
  noStroke();
  text("Lat: " + bombData.latitude, offsetX, offsetY-20);
  text("Lon: " + bombData.longitude, offsetX+100, offsetY-20);
  text("Yield: " + bombData.yield_u, offsetX, 110);
  text("Purpose: " + bombData.purpose, offsetX, 90);
  text("Type: " + bombData.type, offsetX, 130);
  // 炸弹点
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
