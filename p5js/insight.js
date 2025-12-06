let img1, img2, img3;
let thumbs = [];
let largeImages = [];
let showPreview = false;
let previewImg = null;

// -----------------------
// 页面载入淡入 + 上浮变量
// -----------------------
let introFade = 0;      
let introFloat = 40;    

// ----------------------------------------------------
// 文本内容
// ----------------------------------------------------
let topText = "HIROSHIMA E NAGASAKI";
let Text1 = "The use of nuclear weapons in armed conflict has occurred only twice: when the United States detonated two atomic bombs over the Japanese cities of Hiroshima and Nagasaki, during World War II. On 6 th and 9 th of August 1945, these aerial attacks claimed the lives of 150,000 to 246,000 people, most of whom were civilians.";
let Text2 = "The atomic bomb dropped on Hiroshima was named Little Boy, it was a uranium gun-type fission weapon developed by the Manhattan Project. It was dropped by the B-29 Enola Gay on Hiroshima on August 6, 1945, marking it the first use of a nuclear weapon in warfare. It exploded with an energy equivalent to approximately 15 kilotons of TNT, causing widespread devastation with an explosion radius of about 1.3 kilometers (0.81 mi).";
let Text3 = "The name of the atomic bomb dropped on Nagasaki was Fat Man,  it was a plutonium-based implosion-type nuclear bomb. It was dropped  from the B-29 bomber Bockscar on Nagasaki on August 9, 1945. It exploded with an energy equivalent to approximately 21 kilotons of TNT, weighing 10,300 pounds and making it most powerful design to ever be used in warfare.";

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

let thumbOffset = 0;
let targetThumbOffset = 0; 
let thumbSize = 120;
let thumbGap = 30;

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  img1 = loadImage(`images/img5.jpg`);
  img2 = loadImage(`images/img2.jpg`);
  img3 = loadImage(`images/img7.jpg`);

  for (let i = 1; i <= 7; i++) {
    thumbs.push(loadImage(`images/img${i}.jpg`));
    largeImages.push(loadImage(`images/img${i}.jpg`));
  }
}

function setup() {
  calculateCanvasHeight();
  let c = createCanvas(windowWidth, windowHeight);
  c.style("position", "fixed");
  c.style("top", "0px");
  c.style("left", "0px");
  c.style("z-index", "-1");

  imgW = width * 0.62;
  imgH = imgW * 800 / 1200;
}

function draw() {
  background(0);

  // --------------------------
  // 页面载入淡入 + 上浮动画
  // --------------------------
  introFade = min(introFade + 3, 255);
  introFloat = max(introFloat - 1, 0);

  scrollY += (targetScrollY - scrollY) * 0.1;
  thumbOffset += (targetThumbOffset - thumbOffset) * 0.2;

  // -----------------------------------------
  // ★ 标题固定显示（不参与淡入或上浮）
  // -----------------------------------------
  textFont(myFont1);
  fill(110, 133, 219);  
  textSize(20);
  textAlign(CENTER, TOP);
  text("HIROSHIMA E NAGASAKI", width / 2, 20);

  // -----------------------------------------
  // ★ 页面内容淡入 + 上浮开始
  // -----------------------------------------
  push();
  translate(0, introFloat);
  tint(255, introFade);

  let topTextW = width - topTextSideMargin * 2;
  let topTextH = estimateTextHeight(topText, topTextW);

  // 第一行
  let y1 = topMargin + topTextH + spacing;

  tint(255, 180 * (introFade / 255));
  image(img1, sideMargin, y1 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX1 = sideMargin + imgW + textGap;
  let textW1 = min(width - sideMargin - textX1, maxTextWidth);
  let alpha1 = map(y1 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text1, textX1, y1 + 100 - scrollY, textW1, alpha1);

  // 第二行
  let y2 = y1 + imgH + spacing;
  let imgX2 = width - sideMargin - imgW;

  tint(255, 120 * (introFade / 255));
  image(img2, imgX2, y2 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX2 = sideMargin + 200;
  let textW2 = min(imgX2 - textX2 - textGap, maxTextWidth);
  let alpha2 = map(y2 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text2, textX2, y2 + 200 - scrollY, textW2, alpha2);

  // 第三行
  let y3 = y2 + imgH + spacing;

  tint(255, 180 * (introFade / 255));
  image(img3, sideMargin, y3 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX3 = sideMargin + imgW + textGap;
  let textW3 = min(width - sideMargin - textX3, maxTextWidth);
  let alpha3 = map(y3 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text3, textX3, y3 + 300 - scrollY, textW3, alpha3);

  // 缩略图
  let thumbY = calculateThumbY(scrollY);
  drawThumbnails(thumbY);

  pop(); // ← 停止淡入 + 上浮处理

  // 预览
  if (showPreview && previewImg) {
    drawPreviewOverlay();
  }
}

// -----------------------------
// 文字淡入函数（叠加 introFade）
// -----------------------------
function drawTextInteractive(txt, x, y, maxW, alpha) {
  let finalAlpha = alpha * (introFade / 255);
  fill(255, finalAlpha);

  textSize(18);
  textFont(myFont1);
  textAlign(LEFT, TOP);
  textLeading(24);
  text(txt, x, y, maxW);
}

function calculateThumbY(yOffset) {
  let topTextW = width - topTextSideMargin * 2;
  let topTextH = estimateTextHeight(topText, topTextW);
  let y1 = topMargin + topTextH + spacing;
  let y2 = y1 + imgH + spacing;
  let y3 = y2 + imgH + spacing;
  return y3 + imgH + spacing - yOffset + 180;
}

// 缩略图绘制（保持原效果）
function drawThumbnails(y) {
  let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
  let startX = (width - totalW) / 2 + thumbOffset;

  for (let i = 0; i < thumbs.length; i++) {
    let x = startX + i * (thumbSize + thumbGap);
    if (x + thumbSize > 0 && x < width) {

      let img = thumbs[i];
      let r = max(thumbSize / img.width, thumbSize / img.height);
      let dw = img.width * r;
      let dh = img.height * r;

      let ox = x + (thumbSize - dw) / 2;
      let oy = y + (thumbSize - dh) / 2;

      fill(50);
      rect(x, y, thumbSize, thumbSize);

      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(x, y, thumbSize, thumbSize);
      drawingContext.clip();

      tint(255, introFade);
      image(img, ox, oy, dw, dh);
      drawingContext.restore();
      noTint();
    }
  }
}

function drawPreviewOverlay() {
  push();
  fill(0, 180);
  rect(0, 0, width, height);

  let pw = previewImg.width;
  let ph = previewImg.height;

  const maxWidth = 900;
  if (pw > maxWidth) {
    let r = maxWidth / pw;
    pw *= r;
    ph *= r;
  }

  image(previewImg, (width - pw)/2, (height - ph)/2, pw, ph);

  fill(255);
  textSize(16);
  textFont(myFont2);
  textAlign(CENTER);
  text("Click anywhere to close", width/2, (height + ph)/2 + 30);

  pop();
}

function mouseWheel(e) {
  if (showPreview) return false;
  targetScrollY += e.delta;
  targetScrollY = constrain(targetScrollY, 0, canvasHeight - height);
  return false;
}

function estimateTextHeight(txt, maxW) {
  textSize(22);
  textLeading(24);
  let words = txt.split(/\s+/);
  let lines = 1;
  let lineW = 0;
  for (let w of words) {
    let ww = textWidth(w + " ");
    if (lineW + ww > maxW) {
      lines++;
      lineW = ww;
    } else {
      lineW += ww;
    }
  }
  return lines * 24;
}

function calculateCanvasHeight() {
  imgW = windowWidth * 0.62;
  imgH = imgW * 800 / 1200;

  let topTextW = windowWidth - topTextSideMargin * 2;
  let topTextH = estimateTextHeight(topText, topTextW);

  canvasHeight = topMargin + topTextH + (spacing + imgH) * 3 + 600;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateCanvasHeight();
}
