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

<<<<<<< Updated upstream
let yieldList = [
  50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10,
];
let radii = [];
=======
// ----- 地图状态变量和常量 -----
let isMapLarge = false; 
const SMALL_MAP_W = 300;
const MAP_PADDING = 50;
const ICON_SIZE = 20; // 缩小图标尺寸
const ICON_MARGIN = 5; 

let yieldList = [50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10];
let radii = []; 
>>>>>>> Stashed changes
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
  bombID = urlParams.get("id") || "1";
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

<<<<<<< Updated upstream
  radii = yieldList.map((y) => mapYieldToRadius(y));
=======
  radii = yieldList.map(y => mapYieldToRadius(y));
>>>>>>> Stashed changes
  centerX = width / 2;
  centerY = height;

  noFill();
  strokeCap(SQUARE);
  textFont(myFont2);
<<<<<<< Updated upstream

  // Cerca i dati della bomba corrispondente all'ID
=======
  
>>>>>>> Stashed changes
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

  calculateMapDimensions(isMapLarge);
}

function draw() {

  
  
  background(20);

  if (mapZoomed) {
    drawZoomedMap();
    return;
  }

  textFont(myFont1);
  noStroke();
  fill(200);
  textSize(20);
  textAlign(CENTER, TOP);
  text("SINGLE BOMB", width / 2, 30);

  drawBombRing();
  if (!bombData) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text("No bomb data available", width / 2, height / 2);
    return;
  }
<<<<<<< Updated upstream

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

=======
  
  calculateMapDimensions(isMapLarge);

  // 标题
  fill(0, 255, 255);
  textFont(myFont3);
  textAlign(CENTER, TOP);
  textSize(30);
  text(bombData.name, width / 2, 20);

  // 爆炸圈和类型信息只在小地图模式下显示
  if (!isMapLarge) {
    drawYieldCircles(); 
    drawTypeInfoBox();
  }
  
  drawMap();

  
}

// --- 鼠标点击事件：仅处理点击图标切换大小 ---
function mousePressed() {
    let iconX = offsetX + scaledW - ICON_SIZE - ICON_MARGIN;
    let iconY = offsetY + ICON_MARGIN;
    let clickedIcon = mouseX >= iconX && mouseX <= iconX + ICON_SIZE &&
                      mouseY >= iconY && mouseY <= iconY + ICON_SIZE;

    if (clickedIcon) {
        isMapLarge = !isMapLarge; 
        calculateMapDimensions(isMapLarge);
    }
}

// --- 地图尺寸计算函数 ---
function calculateMapDimensions(isLarge) {
  if (!mapImg) return;

  if (isLarge) {
    const MAX_W = width - 2 * MAP_PADDING;
    const MAX_H = height - 2 * MAP_PADDING;
    const aspect = mapImg.width / mapImg.height;

    let w_by_width = MAX_W;
    let h_by_width = w_by_width / aspect;

    let h_by_height = MAX_H;
    let w_by_height = h_by_height * aspect;
    
    if (h_by_width > MAX_H) {
        scaledW = w_by_height;
        scaledH = h_by_height;
    } else {
        scaledW = w_by_width;
        scaledH = h_by_width;
    }
    
    offsetX = (width - scaledW) / 2;
    offsetY = (height - scaledH) / 2;

  } else {
    scaledW = SMALL_MAP_W;
    scaledH = mapImg.height * (scaledW / mapImg.width);
    offsetX = width - scaledW - MAP_PADDING;
    offsetY = height - scaledH - MAP_PADDING;
  }
}

// --- 线性地图投影函数 ---
function lonToMapX(lon) {
    return map(lon, LON_MIN, LON_MAX, offsetX, offsetX + scaledW);
}

function latToMapY(lat) {
    return map(lat, LAT_MIN, LAT_MAX, offsetY + scaledH, offsetY);
}


// --- 绘制地图 (核心修改区域) ---
function drawMap() {
  if (!mapImg || !bombData) return;
  
  // 1. 绘制地图图片
  image(mapImg, offsetX, offsetY, scaledW, scaledH);
  noTint();

  // 2. 绘制炸弹点位置
  let bombPx = lonToMapX(bombData.longitude);
  let bombPy = latToMapY(bombData.latitude);

  let c = color(getYieldColor(bombData.yield_u));
  fill(c);
  noStroke();
  circle(bombPx, bombPy, isMapLarge ? 15 : 10); 

  if (!isMapLarge) {
      // ------------------ 小地图模式 ------------------
      
      // 绘制蓝色背景框和边框
      stroke(0, 255, 255, 150);
      strokeWeight(1);
      fill(0, 255, 255, 20);
      rect(offsetX, offsetY, scaledW, scaledH);

      // 数据信息 (小字)
      fill(0, 255, 255);
      textAlign(LEFT, TOP);
      textSize(12);
      text("Lat: " + bombData.latitude, offsetX, offsetY-20);
      text("Lon: " + bombData.longitude, offsetX+100, offsetY-20);
      text("Yield: " + bombData.yield_u, offsetX, 110);
      text("Purpose: " + bombData.purpose, offsetX, 90);
      text("Type: " + bombData.type, offsetX, 130);
  } else {
      // ------------------ 大地图模式 ------------------
      
      let isHoveringMap = mouseX >= offsetX && mouseX <= offsetX + scaledW && 
                          mouseY >= offsetY && mouseY <= offsetY + scaledH;

      // 悬停在爆炸点附近的检测
      let hoverNearBomb = dist(mouseX, mouseY, bombPx, bombPy) < 30; 

      // 计算缩放图标的区域 (用于排除十字线绘制)
      let iconX_right = offsetX + scaledW;
      let iconY_top = offsetY;
      let iconX = iconX_right - ICON_SIZE - ICON_MARGIN;
      let iconY = iconY_top + ICON_MARGIN;
      let isHoveringIcon = mouseX >= iconX && mouseX <= iconX + ICON_SIZE &&
                           mouseY >= iconY && mouseY <= iconY + ICON_SIZE;


      // A. 鼠标悬停逻辑：只绘制十字线
      // ** 关键修改：添加 !isHoveringIcon 条件 **
      if (isHoveringMap && !isHoveringIcon) { 
          // 绘制十字线 (Crosshairs)
          stroke(0, 255, 255, 150); // 青色半透明
          strokeWeight(1);
          line(offsetX, mouseY, mouseX - 5, mouseY); // 水平左侧
          line(mouseX + 5, mouseY, offsetX + scaledW, mouseY); // 水平右侧
          line(mouseX, offsetY, mouseX, mouseY - 5); // 垂直上侧
          line(mouseX, mouseY + 5, mouseX, offsetY + scaledH); // 垂直下侧
      }

      // B. 悬停在爆炸点附近：显示国家/地区和经纬度信息 (标签化、分行)
      if (hoverNearBomb) {
          const padding = 8; // 信息框内边距
          const lineHeight = 16; // 每行行高
          
          // 绘制信息背景框
          fill(0, 0, 0, 200); 
          
          let boxW = 180; 
          let boxH = padding * 2 + lineHeight * 4; 
          
          let boxX = bombPx + 15; 
          let boxY = bombPy - boxH / 2;
          
          // 确保信息框不超出右边界
          if (boxX + boxW > offsetX + scaledW) {
              boxX = bombPx - boxW - 15; 
          }
          
          rect(boxX, boxY, boxW, boxH, 5); 
          
          // 绘制文本
          textSize(12);
          
          // --- 标签（Label: 左对齐） ---
          textAlign(LEFT, TOP);
          
          // 1. 国家标签
          fill(0, 255, 255); 
          text("Country:", boxX + padding, boxY + padding);
          
          // 2. 地区标签
          text("Region:", boxX + padding, boxY + padding + lineHeight * 1);
          
          // 3. 纬度标签
          text("Latitude:", boxX + padding, boxY + padding + lineHeight * 2);
          
          // 4. 经度标签
          text("Longitude:", boxX + padding, boxY + padding + lineHeight * 3);
          
          // --- 数值（Value: 右对齐） ---
          textAlign(RIGHT, TOP);
          const valueX = boxX + boxW - padding; // 文本最右侧 X 坐标
          
          // 1. 国家数值
          fill(255); 
          text(bombData.country, valueX, boxY + padding);
          
          // 2. 地区数值
          text(bombData.region, valueX, boxY + padding + lineHeight * 1);

          // 3. 纬度数值
          text(nf(bombData.latitude, 0, 4), valueX, boxY + padding + lineHeight * 2);
          
          // 4. 经度数值
          text(nf(bombData.longitude, 0, 4), valueX, boxY + padding + lineHeight * 3);
      }
  }
  
  // 3. 绘制图标 (在两种模式下都位于地图的右上角)
  drawZoomIcon(offsetX + scaledW, offsetY, !isMapLarge); 

  // 4. --- 新增鼠标样式 ---
  let iconX_right = offsetX + scaledW;
  let iconY_top = offsetY;
  let iconX = iconX_right - ICON_SIZE - ICON_MARGIN;
  let iconY = iconY_top + ICON_MARGIN;
  
  let isHoveringIcon = mouseX >= iconX && mouseX <= iconX + ICON_SIZE &&
                       mouseY >= iconY && mouseY <= iconY + ICON_SIZE;

  // 如果鼠标悬停在图标上，设置为“小手”
  if (isHoveringIcon) {
      document.body.style.cursor = 'pointer';
  } else if (!isMapLarge) {
      // 小地图模式下，鼠标不在图标上，保持默认或 Canvas 默认
      document.body.style.cursor = 'default';
  } else {
      // 大地图模式下，鼠标不在图标上，但如果在地图内部，设置为十字线
      let isHoveringMap = mouseX >= offsetX && mouseX <= offsetX + scaledW && 
                          mouseY >= offsetY && mouseY <= offsetY + scaledH;
      if (isHoveringMap) {
          document.body.style.cursor = 'crosshair';
      } else {
          document.body.style.cursor = 'default';
      }
  }
}

// --- (辅助函数：保持不变) ---

function drawYieldCircles() {
  let d = dist(mouseX, mouseY, centerX, centerY);

  for (let i = 0; i < radii.length; i++) {
    let r = radii[i];
    let innerR = i < radii.length - 1 ? radii[i + 1] : 0;

    if (d <= r && d > innerR) {
      fill(0, 255, 255, 30);
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

  let rInner = mapYieldToRadius(15); 
>>>>>>> Stashed changes
  stroke(0, 255, 255);
  strokeWeight(1);
  noFill();
  ellipse(centerX, centerY, animBlueR * 2);

<<<<<<< Updated upstream
  drawInfo();
}
=======
  let targetR = mapYieldToRadius(bombData.yield_u);
  animR = lerp(animR, targetR, 0.05);
  let rOuter = animR;
  let c = color(getYieldColor(bombData.yield_u));
  let thickness = max(3, rOuter * 0.1);
>>>>>>> Stashed changes

function mapYieldToRadius(y) {
  let minR = 20;
  let maxR = min(width, height) * 0.8;

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
    scaledW = 300;
    scaledH = mapImg.height * (scaledW / mapImg.width);

    offsetX = width - scaledW - 50;
    offsetY = height - scaledH - 90;
  } else {
    scaledW = width * 0.7;
    scaledH = mapImg.height * (scaledW / mapImg.width);

    offsetX = (width - scaledW) / 2;
    offsetY = (height - scaledH) / 2;
  }
}

<<<<<<< Updated upstream
//mappa
function lonToMapX(lon) {
  return map(lon, LON_MIN, LON_MAX, offsetX, offsetX + scaledW);
}

function latToMapY(lat) {
  return map(lat, LAT_MIN, LAT_MAX, offsetY + scaledH, offsetY);
}

function drawInfo() {
=======
function drawTypeInfoBox() {
  drawingContext.filter = 'blur(5px)';
>>>>>>> Stashed changes
  let boxW = 300,
    boxH = 300,
    boxX = width - boxW - 50,
    boxY = 150;
    
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(boxX, boxY, boxW, boxH);
<<<<<<< Updated upstream
=======
  drawingContext.filter = 'none';
>>>>>>> Stashed changes

  if (typeImg) {
    let imgW = boxW, imgH = boxH;
    image(
      typeImg,
      boxX + (boxW - imgW) / 2,
      boxY + (boxH - imgH) / 2,
      imgW,
      imgH
    );
  }
<<<<<<< Updated upstream

  let isHover =
    mouseX >= boxX &&
    mouseX <= boxX + boxW &&
    mouseY >= boxY &&
    mouseY <= boxY + boxH;
=======
}
>>>>>>> Stashed changes

  if (isHover) {
    fill(0, 150);
    noStroke();
    rect(boxX, boxY, boxW, boxH);

<<<<<<< Updated upstream
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    textFont(myFont2);
    text(getTypeText(bombData.type), boxX + 10, boxY + boxH / 2, 280);
=======
  if (y <= 20) {
    return map(y, 0, 20, minR, minR + 50);
  } else if (y <= 10000) {
    return map(y, 20, 10000, minR + 50, maxR - 100);
  } else {
    return map(y, 10000, 50000, maxR - 100, maxR);
>>>>>>> Stashed changes
  }

<<<<<<< Updated upstream
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

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    noStroke();
    textFont(myFont2);
    text(
      "region code: " + bombData.region,
      offsetX,
      offsetY + scaledH / 2,
      280
    );

    noFill();
    stroke(0, 255, 255);
    strokeWeight(2);
    line(
      offsetX + scaledW - 20,
      offsetY + 20,
      offsetX + scaledW - 14,
      offsetY + 20
    );
    line(
      offsetX + scaledW - 20,
      offsetY + 20,
      offsetX + scaledW - 20,
      offsetY + 14
    );
    line(
      offsetX + scaledW - 10,
      offsetY + 10,
      offsetX + scaledW - 16,
      offsetY + 10
    );
    line(
      offsetX + scaledW - 10,
      offsetY + 10,
      offsetX + scaledW - 10,
      offsetY + 16
    );
  } else {
  cursor(ARROW);  
}

  stroke(0, 255, 255, 150);
  strokeWeight(1);
  fill(0, 255, 255, 20);
  rect(50, offsetY, 320, scaledH);

  noStroke();
  textAlign(RIGHT, TOP);
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(14);
  text("Country:" + bombData.country, offsetX + scaledW, 90);
  text("Type: " + bombData.type, offsetX + scaledW, 120);
  text("Longitude: " + bombData.longitude, offsetX + 300, offsetY - 30);
  textAlign(LEFT, TOP);
  text("Nome:", offsetX, 90);
  text("Purpose: " + bombData.purpose, 50, offsetY - 30);
  text("Latitude: " + bombData.latitude, offsetX, offsetY - 30);
  textSize(24);
  text(bombData.name, offsetX, 110);
  textAlign(CENTER, BOTTOM);
  text(bombData.yield_u, width / 2, height - 30);
  textAlign(CENTER, TOP);
  textSize(14);
  text("Yield(kt) ", width / 2, height - 90);
  textAlign(RIGHT, TOP);
  textFont(myFont2);
  text(
    "The blue ring represents the yield of Little Boy, detonated in Hiroshima in 1945.",
    offsetX,
    offsetY + scaledH + 10,
    scaledW
  );
  textAlign(LEFT, TOP);
  fill(200), text(getPurposeText(bombData.purpose), 60, offsetY + 10, 300);

  let px = lonToMapX(bombData.longitude);
  let py = latToMapY(bombData.latitude);

  let c = color(getYieldColor(bombData.yield_u));
  fill(c);
  noStroke();
  circle(px, py, 10);
=======
function getYieldColor(y) {
  if (y >= 0 && y <= 19) return "#fcddbfff";
  else if (y === 20) return "#FFB873";
  else if (y >= 21 && y <= 150) return "#ff7a22ff";
  else if (y >= 151 && y <= 4999) return "#f35601ff";
  else if (y >= 5000) return "#c21d00ff";
}

//--------绘制缩放图标函数----------
function drawZoomIcon(iconX_right, iconY_top, isZoomIn) {
    let x = iconX_right - ICON_SIZE - ICON_MARGIN;
    let y = iconY_top + ICON_MARGIN;
    let s = ICON_SIZE;
    let m = s * 0.15; // 边距

    // 绘制背景框
    fill(20, 20, 20, 200);
    stroke(0, 255, 255);
    strokeWeight(1);
    rect(x, y, s, s, 3);

    // 绘制图标内容
    noFill();
    stroke(0, 255, 255);
    strokeWeight(2);
    
    if (isZoomIn) {
        // --- 放大图标（斜向箭头，代表进入全屏） ---
        let arrowLen = s * 0.4; // 箭头主体长度
        let gap = s * 0.2; // 箭头与中心点的间隙
        let headLen = s * 0.15; // 箭头头部小线段长度
        
        // 左上角箭头 (指向左上)
        line(x + gap, y + gap, x + gap + arrowLen, y + gap); // 水平部分
        line(x + gap, y + gap, x + gap, y + gap + arrowLen); // 垂直部分
        
        // 绘制箭头头部 (左上角)
        line(x + gap, y + gap, x + gap + headLen, y + gap + headLen); 

        // 右下角箭头 (指向右下)
        line(x + s - gap, y + s - gap, x + s - gap - arrowLen, y + s - gap); // 水平部分
        line(x + s - gap, y + s - gap, x + s - gap, y + s - gap - arrowLen); // 垂直部分
        
        // 绘制箭头头部 (右下角)
        line(x + s - gap, y + s - gap, x + s - gap - headLen, y + s - gap - headLen); 

    } else {
        // --- 关闭/缩小图标 (大地图模式) ---
        let cx = x + s / 2;
        let cy = y + s / 2;
        
        // 绘制 X
        line(cx - s / 4, cy - s / 4, cx + s / 4, cy + s / 4);
        line(cx + s / 4, cy - s / 4, cx - s / 4, cy + s / 4);
    }
>>>>>>> Stashed changes
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

function mousePressed() {
  animR = 0;
  animPlaying = true;

  let iconX = offsetX + scaledW - 20;
  let iconY = offsetY + 10;
  let iconSize = 10;

  let clickedIcon =
    mouseX >= offsetX &&
    mouseX <= offsetX + scaledW &&
    mouseY >= offsetY &&
    mouseY <= offsetY + scaledH;

  if (clickedIcon) {
    mapZoomed = !mapZoomed;
    calculateMapDimensions();
  }
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
  line(
    offsetX + scaledW - 20,
    offsetY + 20,
    offsetX + scaledW - 14,
    offsetY + 20
  );
  line(
    offsetX + scaledW - 20,
    offsetY + 20,
    offsetX + scaledW - 20,
    offsetY + 14
  );
  line(
    offsetX + scaledW - 10,
    offsetY + 10,
    offsetX + scaledW - 16,
    offsetY + 10
  );
  line(
    offsetX + scaledW - 10,
    offsetY + 10,
    offsetX + scaledW - 10,
    offsetY + 16
  );

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

  let r = 5 + 3 * sin(frameCount * 0.04);

  noStroke();
  fill(baseColor);
  circle(px, py, r * 2);

  let hoverNearBomb = dist(mouseX, mouseY, px, py) < 20;

  if (hoverNearBomb) {
    const padding = 8;
    const lineHeight = 16;

    fill(0, 0, 0, 200);

    let boxW = 180;
    let boxH = padding * 2 + lineHeight * 4;

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
    text("Region:", boxX + padding, boxY + padding + lineHeight * 1);
    text("Latitude:", boxX + padding, boxY + padding + lineHeight * 2);
    text("Longitude:", boxX + padding, boxY + padding + lineHeight * 3);

    textAlign(RIGHT, TOP);
    const valueX = boxX + boxW - padding;

    fill(0, 255, 255);
    text(bombData.country, valueX, boxY + padding);
    text(bombData.region, valueX, boxY + padding + lineHeight * 1);
    text(nf(bombData.latitude, 0, 4), valueX, boxY + padding + lineHeight * 2);
    text(nf(bombData.longitude, 0, 4), valueX, boxY + padding + lineHeight * 3);
  }

  noStroke();
  textAlign(CENTER, TOP);
  fill(0, 255, 255);
  textFont(myFont3);
  textSize(14);
  text("Region Code:", width / 2, 60);
  textSize(24);
  text(bombData.region, width / 2, 80);
}

window.addEventListener("load", () => {
  if (window.location.hash === "#page2") {
    window.location.href = "index.html#page2";
  }
});