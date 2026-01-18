let img1, img2, img3;
let thumbs = [];
let largeImages = [];
let showPreview = false;
let previewImg = null;

// ----------------------------------------------------
// 文本内容
// ----------------------------------------------------
let topText = "TREATIES";
let Text1 = "This was the first international agreement to egectively limit nuclear testing. It entered into force in 1963 and prohibited nuclear explosions in the atmosphere, underwater, and in outer space, while still allowing underground testing—a compromise that enabled the US, USSR,and UK to continue their programs without formally violating the treaty. The initial goal was to reduce global radioactive fallout; implicitly, it was not intended to slow down the arms race. Many states never ratified it, and in the decades that followed, testing simply shifted underground, becoming the dominant mode until the late 1990s.";
let Text2 = "The atomic bomb dropped on Hiroshima was named Little Boy, it was a uranium gun-type fission weapon developed by the Manhattan Project. It was dropped by the B-29 Enola Gay on Hiroshima on August 6, 1945, marking it the first use of a nuclear weapon in warfare. It exploded with an energy equivalent to approximately 15 kilotons of TNT, causing widespread devastation with an explosion radius of about 1.3 kilometers (0.81 mi).";
let Text3 = "The name of the atomic bomb dropped on Nagasaki was Fat Man, it was a plutonium-based implosion-type nuclear bomb. It was dropped from the B-29 bomber Bockscar on Nagasaki on August 9, 1945. It exploded with an energy equivalent to approximately 21 kilotons of TNT, weighing 10,300 pounds and making it most powerful design to ever be used in warfare.";

// layout variables
let scrollY = 0;
let targetScrollY = 0;
let canvasHeight;

let topMargin = 40;
let sideMargin = 80;
let textGap = -200;
let spacing = 80;
let maxTextWidth = 400;
let topTextSideMargin = 400;

let imgW, imgH;

let previewIndex = -1;     // 当前预览的大图索引
let previewArrowSize = 20; // 左右箭头尺寸


// thumbnails
let thumbOffset = 0;
let targetThumbOffset = 0;
let thumbSize = 120;
let thumbGap = 30;

let myFont1, myFont2, myFont3;

let titleAlpha = map(scrollY, 0, 200, 255, 0, true);

let previewBottomTextPadding = 40; // distance from bottom of image
let screenBottomPadding = 20;      // distance from bottom of the canvas


function preload() {
  // fonts (keep same filenames in your project)
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  // main images — ensure these exist in images/
  img1 = loadImage(`images/hiroshima-bombing-article-about-atomic-bomb.jpg`);
  img2 = loadImage(`images/insight_img2.jpg`);
  img3 = loadImage(`images/hiding_the_radiation_of_the_atomic_bombs_1050x700.avif`);

  // thumbs and largeImages (7 thumbnails expected)
  for (let i = 4; i <= 10; i++) {
    let t = loadImage(`images/insight_img${i}.jpg`);
    thumbs.push(t);
    // for preview we reuse the same images (or replace with high-res paths)
    largeImages.push(loadImage(`images/insight_img${i}.jpg`));
  }
}

function setup() {
  calculateCanvasHeight();
  let c = createCanvas(windowWidth, windowHeight);
  c.style("position", "fixed");
  c.style("top", "0px");
  c.style("left", "0px");
  c.style("z-index", "-1");

  textSize(22);
  imgW = width * 0.62;
  imgH = imgW * 800 / 1200;
}

function draw() {
  background(0);
  fill(255);

  // smooth scrolling
  scrollY += (targetScrollY - scrollY) * 0.12;
  thumbOffset += (targetThumbOffset - thumbOffset) * 0.18;

  // top title
  textFont(myFont1);
  let titleAlpha = map(scrollY, 0, 200, 255, 0, true); 
  fill(110, 133, 219, titleAlpha);
  textSize(20);
  textAlign(CENTER, TOP);
  text(topText, width / 2, 20);

  // compute top text width & height
  let topTextW = width - topTextSideMargin * 2;
  let topTextH = estimateTextHeight(topText, topTextW);

  // -------------------------
  // 第一行 (左图右文)
  // -------------------------
  let y1 = topMargin + topTextH + spacing;
  tint(255, 180);
  image(img1, sideMargin, y1 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX1 = sideMargin + imgW + textGap;
  let textW1 = min(width - sideMargin - textX1, maxTextWidth);
  let alpha1 = map(y1 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text1, textX1, y1 + 100 - scrollY, textW1, alpha1, -20, 20);

  // -------------------------
  // 第二行 (右图左文)
  // -------------------------
  let y2 = y1 + imgH + spacing;
  let imgX2 = width - sideMargin - imgW;
  tint(255, 120);
  image(img2, imgX2, y2 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX2 = sideMargin + 100;
  let textW2 = min(imgX2 - textX2 - textGap, maxTextWidth);
  let alpha2 = map(y2 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text2, textX2, y2 + 200 - scrollY, textW2, alpha2, 20, -20);

  // -------------------------
  // 第三行 (左图右文)
  // -------------------------
  let y3 = y2 + imgH + spacing;
  tint(255, 180);
  image(img3, sideMargin, y3 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX3 = sideMargin + imgW + textGap;
  let textW3 = min(width - sideMargin - textX3, maxTextWidth);
  let alpha3 = map(y3 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text3, textX3, y3 + 300 - scrollY, textW3, alpha3, -20, 20);

  // -------------------------
  // 底部缩略图（固定在文档底部位置，根据 scrollY 变化）
  // -------------------------
  let thumbY = calculateThumbY(scrollY);
  drawThumbnails(thumbY);

  // -------------------------
  // 预览显示
  // -------------------------
  if (showPreview && previewImg) {
    drawPreviewOverlay();
  }
}

// ==============================
// mousePressed: 缩略图、箭头、关闭预览逻辑
// ==============================
function mousePressed() {
  // if preview shown: 点击任意处关闭
  if (showPreview) {
    // 点击左箭头（上一张）
    let leftX = 100;
    let arrowY1 = height / 2 - previewArrowSize;
    let arrowY2 = height / 2 + previewArrowSize;
    if (mouseX > leftX && mouseX < leftX + previewArrowSize &&
        mouseY > arrowY1 && mouseY < arrowY2) {

        previewIndex = (previewIndex - 1 + largeImages.length) % largeImages.length;
        previewImg = largeImages[previewIndex];
        return;
    }

    // 点击右箭头（下一张）
    let rightX = width - 100 - previewArrowSize;
    if (mouseX > rightX && mouseX < rightX + previewArrowSize &&
        mouseY > arrowY1 && mouseY < arrowY2) {

        previewIndex = (previewIndex + 1) % largeImages.length;
        previewImg = largeImages[previewIndex];
        return;
    }

    // 点击空白处关闭
    showPreview = false;
    return;
  }


  // calculate thumb area and scrolling bounds
  let thumbY = calculateThumbY(scrollY);
  let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
  let arrowW = 40, arrowH = thumbSize;

  const visibleEnd = width - sideMargin;
  const initialStripStart = (width - totalW) / 2;
  const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
  const maxScroll = Math.min(0, maxScrollNegative);

  let scrollAmount = (thumbSize + thumbGap);

  // left arrow click
  let leftArrowX = sideMargin - arrowW;
  if (targetThumbOffset < -5 &&
      mouseX > leftArrowX && mouseX < leftArrowX + arrowW &&
      mouseY > thumbY && mouseY < thumbY + arrowH) {
    targetThumbOffset = constrain(targetThumbOffset + scrollAmount, maxScroll, 0);
    return;
  }

  // right arrow click
  let rightArrowX = width - sideMargin;
  if (targetThumbOffset > maxScroll + 5 &&
      mouseX > rightArrowX - arrowW && mouseX < rightArrowX &&
      mouseY > thumbY && mouseY < thumbY + arrowH) {
    targetThumbOffset = constrain(targetThumbOffset - scrollAmount, maxScroll, 0);
    return;
  }

  // click on thumbnails
  if (thumbY > -thumbSize && thumbY < height) {
    let startX = (width - totalW) / 2 + thumbOffset;
    for (let i = 0; i < thumbs.length; i++) {
      let x = startX + i * (thumbSize + thumbGap);
      if (mouseX > x && mouseX < x + thumbSize &&
          mouseY > thumbY && mouseY < thumbY + thumbSize) {
        previewIndex = i;
        previewImg = largeImages[previewIndex];
        showPreview = true;
        return;
      }
    }
  }
}

// ==============================
// drawThumbnails: 绘制缩略图及箭头
// ==============================
function drawThumbnails(y) {
  let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
  let startX = (width - totalW) / 2 + thumbOffset;

  noStroke();
  fill(255);

  // arrow sizing
  let arrowW = 40, arrowH = thumbSize;
  let arrowY = y;

  const visibleEnd = width - sideMargin;
  const initialStripStart = (width - totalW) / 2;
  const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
  const maxScroll = Math.min(0, maxScrollNegative);

  // left arrow (show only if can scroll right)
  if (thumbOffset < -5) {
    let x = sideMargin - arrowW;
    if (mouseX > x && mouseX < x + arrowW && mouseY > arrowY && mouseY < arrowY + arrowH) {
      fill(110, 133, 219, 150);
      rect(x, arrowY, arrowW, arrowH, 0);
      fill(255);
    } else {
      fill(255, 200);
    }
    stroke(0);
    noFill();
    // triangle arrow
    noStroke();
    fill(255);
    triangle(x + 15, arrowY + arrowH/2, x + arrowW - 15, arrowY + 20, x + arrowW - 15, arrowY + arrowH - 20);
  }

  // right arrow (show only if can scroll left)
  if (thumbOffset > maxScroll + 5) {
    let x = width - sideMargin;
    if (mouseX > x - arrowW && mouseX < x && mouseY > arrowY && mouseY < arrowY + arrowH) {
      fill(110, 133, 219, 150);
      rect(x - arrowW, arrowY, arrowW, arrowH, 0);
      fill(255);
    } else {
      fill(255, 200);
    }
    noStroke();
    fill(255);
    triangle(x - 15, arrowY + arrowH/2, x - arrowW + 15, arrowY + 20, x - arrowW + 15, arrowY + arrowH - 20);
  }

  // hovered index detection
  let hoveredIndex = -1;
  let currentThumbX = (width - totalW) / 2 + thumbOffset;
  if (y > -thumbSize && y < height) {
    for (let i = 0; i < thumbs.length; i++) {
      let x = currentThumbX + i * (thumbSize + thumbGap);
      if (mouseX > x && mouseX < x + thumbSize && mouseY > y && mouseY < y + thumbSize) {
        hoveredIndex = i;
        break;
      }
    }
  }

  // draw thumbs (cover mode)
  for (let i = 0; i < thumbs.length; i++) {
    let x = startX + i * (thumbSize + thumbGap);
    if (x + thumbSize > -50 && x < width + 50) {
      let thumbImg = thumbs[i];

      // cover scaling
      let ratioToCover = max(thumbSize / thumbImg.width, thumbSize / thumbImg.height);
      let displayW = thumbImg.width * ratioToCover;
      let displayH = thumbImg.height * ratioToCover;
      let offsetX = x + (thumbSize - displayW) / 2;
      let offsetY = y + (thumbSize - displayH) / 2;

      // background box
      fill(50);
      noStroke();
      rect(x, y, thumbSize, thumbSize, 0);

      // clipping region
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(x, y, thumbSize, thumbSize);
      drawingContext.clip();

      if (i === hoveredIndex) tint(255, 150); else noTint();
      image(thumbImg, offsetX, offsetY, displayW, displayH);
      drawingContext.restore();
      noTint();

      // border
      if (i === hoveredIndex) {
        noFill();
        stroke(110, 133, 219);
        strokeWeight(3);
        rect(x, y, thumbSize, thumbSize, 0);
      } else {
        noFill();
        stroke(255, 50);
        strokeWeight(1);
        rect(x, y, thumbSize, thumbSize, 0);
      }
    }
  }

  noStroke();
}

// ==============================
// drawPreviewOverlay: 放大预览
// ==============================
function drawPreviewOverlay() {
  push();
  noStroke();
  fill(0, 220);
  rect(0, 0, width, height);
  drawingContext.filter = "none";

  // ---- 大图尺寸适配 ----
  // ---- 大图尺寸适配（固定高度，高度一样，宽度自适应） ----
  let targetHeight = 600;  // 你想要的大图高度
  let pw, ph;

  

ph = targetHeight;
pw = (previewImg.width / previewImg.height) * ph;

  // 高度固定
  ph = targetHeight;

  // 按原图比例计算宽度
  pw = (previewImg.width / previewImg.height) * ph;

  

// 居中绘制
image(previewImg, (width - pw) / 2, (height - ph) / 2, pw, ph);


  // ---- 显示大图 ----
  let imgX = (width - pw) / 2;
  let imgY = (height - ph) / 2;
  image(previewImg, imgX, imgY, pw, ph);

  // ============================
  //     左右箭头（可点击）
  // ============================

  // 中心位置
  let midY = height / 2;
  let arrowColorNormal = color(255, 150); // 默认颜色
  let arrowColorHover = color(255);       // 悬停颜色
  

  // 左箭头（⬅）
  let lx = 100;
  let leftHover = mouseX > lx && mouseX < lx + previewArrowSize &&
                mouseY > midY - previewArrowSize && mouseY < midY + previewArrowSize;
  fill(leftHover ? arrowColorHover : arrowColorNormal);

  triangle(
    lx, midY,
    lx + previewArrowSize, midY - previewArrowSize,
    lx + previewArrowSize, midY + previewArrowSize
  );

  // 右箭头（➡）
  let rx = width -  100 - previewArrowSize;
  let rightHover = mouseX > rx && mouseX < rx + previewArrowSize &&
                 mouseY > midY - previewArrowSize && mouseY < midY + previewArrowSize;
  fill(rightHover ? arrowColorHover : arrowColorNormal);
  triangle(
    rx + previewArrowSize,midY,
    rx, midY - previewArrowSize,
    rx, midY + previewArrowSize

  );

  // 根据 previewIndex 显示不同文字
  let bottomTexts = [
  "Carl Mydans Hiroshima Japan 1947, Atomic",
  "A barefoot boy waiting in line and staring ahead at a crematorium after the Nagasaki bombing, with his dead baby brother strapped to his back. \nPhoto by US Marine photographer Joe O’Donnell",
  "From notes by LIFE’s Bernard Hoffman to the magazine’s long-time picture editor, Wilson Hicks, in New York, September 1945",
  "Mother and child in Hiroshima, Japan, December 1945 Alfred Eisenstaedt",
  "A correspondent stands in the rubble in Hiroshima on Sept. 8, 1945, a month after the first atomic bomb ever used in warfare was dropped by the U.S.\nStanley Troutman / AP",
  "The devastated city of Nagasaki after an atomic bomb was dropped on it by a US Air Force B-29 bomber —AFP",
  "The mushroom cloud rising over Hiroshima, Japan on August 6, 1945",

  ];
  // 获取当前图片对应文字
  let currentBottomText = bottomTexts[previewIndex] || "";
  

  textSize(14);
  textAlign(CENTER, CENTER);
  text(currentBottomText, width / 2, imgY + ph + 40 - 15 );
  pop();
}


// ==============================
// drawTextInteractive: 字体渐显与微动
// ==============================
function drawTextInteractive(txt, x, y, maxW, alpha, o1, o2) {
  push();
  fill(255, alpha);
  let offset = map(alpha, 0, 255, o1, o2);
  translate(offset, 0);
  textSize(18);
  textFont(myFont2);
  textAlign(LEFT, TOP);
  textLeading(24);
  text(txt, x, y, maxW);
  pop();
}

// ==============================
// estimateTextHeight: 字数换行估算（用于布局）
// ==============================
function estimateTextHeight(txt, maxW) {
  // ensure text metrics match drawing settings
  textFont(myFont2);
  textSize(22);
  textLeading(24);

  let words = txt.split(/\s+/);
  let lineCount = 1;
  let lineWidth = 0;
  for (let w of words) {
    let wWidth = textWidth(w + " ");
    if (lineWidth + wWidth > maxW) {
      lineCount++;
      lineWidth = wWidth;
    } else {
      lineWidth += wWidth;
    }
  }
  return lineCount * 24;
}

// ==============================
// mouseWheel: 页面滚动
// ==============================
function mouseWheel(event) {
  // when preview is open, block scrolling
  if (showPreview) return false;
  targetScrollY += event.delta;
  targetScrollY = constrain(targetScrollY, 0, max(0, canvasHeight - height));
  return false;
}

// ==============================
// calculateCanvasHeight: 修复 ReferenceError
// ==============================
function calculateCanvasHeight() {
  // recalc image sizes according to current windowWidth
  imgW = windowWidth * 0.62;
  imgH = imgW * 800 / 1200;

  let topTextW = windowWidth - topTextSideMargin * 2;
  let topTextH = estimateTextHeight(topText, topTextW);

  // total height: top + three sections + bottom padding for thumbnails
  canvasHeight = topMargin + topTextH + (spacing + imgH) * 3 + 600;
}

// ==============================
// calculateThumbY: 修复 ReferenceError
// ==============================
// returns the vertical position (in screen coordinates) where thumbnails should be drawn
function calculateThumbY(currentScrollY) {
  // derive positions similar to draw() layout
  let topTextW = width - topTextSideMargin * 2;
  let topTextH = estimateTextHeight(topText, topTextW);
  let y1 = topMargin + topTextH + spacing;
  let y2 = y1 + imgH + spacing;
  let y3 = y2 + imgH + spacing;

  // position thumbnails a bit below the last image
  let base = y3 + imgH + spacing + 180;

  // convert document position to screen position by subtracting scroll offset
  return base - currentScrollY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateCanvasHeight();
}