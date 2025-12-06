let img1, img2, img3;
let thumbs = [];
let largeImages = [];
let showPreview = false;
let previewImg = null;

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
    let t = loadImage(`images/img${i}.jpg`);
    thumbs.push(t);
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

  textSize(22);
  imgW = width * 0.62;
  imgH = imgW * 800 / 1200;
}

function draw() {
  background(0);
  fill(255);

  scrollY += (targetScrollY - scrollY) * 0.1;
  thumbOffset += (targetThumbOffset - thumbOffset) * 0.2;

  let topTextW = width - topTextSideMargin * 2;
  let topTextY = topMargin - scrollY;
  
  textFont(myFont1);
  fill(110, 133, 219);
  textSize(20);
  textAlign(CENTER, TOP);
  text("HIROSHIMA E NAGASAKI", width / 2, 20); 

  // 第一行
  let topTextH = estimateTextHeight(topText, topTextW);
  let y1 = topMargin + topTextH + spacing;

  tint(255, 180);
  image(img1, sideMargin, y1 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX1 = sideMargin + imgW + textGap;
  let textW1 = min(width - sideMargin - textX1, maxTextWidth);
  let alpha1 = map(y1 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text1, textX1, y1 + 100 - scrollY, textW1, alpha1, -20, 20);

  // 第二行
  let y2 = y1 + imgH + spacing;
  let imgX2 = width - sideMargin - imgW;
  tint(255, 120);
  image(img2, imgX2, y2 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX2 = sideMargin + 200;
  let textW2 = min(imgX2 - textX2 - textGap, maxTextWidth);
  let alpha2 = map(y2 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text2, textX2, y2 + 200 - scrollY, textW2, alpha2, 20, -20);

  // 第三行
  let y3 = y2 + imgH + spacing;
  tint(255, 180);
  image(img3, sideMargin, y3 - scrollY * 0.9, imgW, imgH);
  noTint();

  let textX3 = sideMargin + imgW + textGap;
  let textW3 = min(width - sideMargin - textX3, maxTextWidth);
  let alpha3 = map(y3 - scrollY, height, 0, 0, 255, true);
  drawTextInteractive(Text3, textX3, y3 + 300 - scrollY, textW3, alpha3, -20, 20);

  // 缩略图区域
  let thumbY = calculateThumbY(scrollY);
  drawThumbnails(thumbY);

  if (showPreview && previewImg) {
    drawPreviewOverlay();
  }
}

function calculateThumbY(yOffset) {
  let topTextW = width - topTextSideMargin * 2;
  let topTextH = estimateTextHeight(topText, topTextW);
  let y1 = topMargin + topTextH + spacing;
  let y2 = y1 + imgH + spacing;
  let y3 = y2 + imgH + spacing;
  return y3 + imgH + spacing - yOffset + 180;
}

function mousePressed() {

  if (showPreview) {
    showPreview = false;
    return;
  }

  let thumbY = calculateThumbY(scrollY);
  let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
  let arrowW = 40, arrowH = thumbSize;
  
  const visibleEnd = width - sideMargin;
  const initialStripStart = (width - totalW) / 2;
  const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
  const maxScroll = Math.min(0, maxScrollNegative); 

  let scrollAmount = thumbSize + thumbGap;

  // 左
  let leftArrowX = sideMargin - arrowW;
  if (targetThumbOffset < -5 &&
      mouseX > leftArrowX && mouseX < leftArrowX + arrowW &&
      mouseY > thumbY && mouseY < thumbY + arrowH) {
    targetThumbOffset = constrain(targetThumbOffset + scrollAmount, maxScroll, 0);
    return;
  }

  // 右
  let rightArrowX = width - sideMargin;
  if (targetThumbOffset > maxScroll + 5 &&
      mouseX > rightArrowX - arrowW && mouseX < rightArrowX &&
      mouseY > thumbY && mouseY < thumbY + arrowH) {
    targetThumbOffset = constrain(targetThumbOffset - scrollAmount, maxScroll, 0);
    return;
  }

  // 图片点击
  if (thumbY > -thumbSize && thumbY < height) {
    let startX = (width - totalW) / 2 + thumbOffset;

    for (let i = 0; i < thumbs.length; i++) {
      let x = startX + i * (thumbSize + thumbGap);

      if (mouseX > x && mouseX < x + thumbSize &&
          mouseY > thumbY && mouseY < thumbY + thumbSize) {
        previewImg = largeImages[i];
        showPreview = true;
        break;
      }
    }
  }
}

function drawThumbnails(y) {
  let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
  let startX = (width - totalW) / 2 + thumbOffset;

  noStroke();
  fill(255);

  let arrowW = 40, arrowH = thumbSize;
  let arrowY = y;

  const visibleEnd = width - sideMargin;
  const initialStripStart = (width - totalW) / 2;
  const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
  const maxScroll = Math.min(0, maxScrollNegative);

  // 左箭头
  if (thumbOffset < -5) {
    let x = sideMargin - arrowW;
    fill(255, 200);
    triangle(x + 15, arrowY + arrowH/2, x + arrowW - 15, arrowY + 20, x + arrowW - 15, arrowY + arrowH - 20);
  }

  // 右箭头
  if (thumbOffset > maxScroll + 5) {
    let x = width - sideMargin;
    fill(255, 200);
    triangle(x - 15, arrowY + arrowH/2, x - arrowW + 15, arrowY + 20, x - arrowW + 15, arrowY + arrowH - 20);
  }

  let hoveredIndex = -1;

  let currentThumbX = (width - totalW) / 2 + thumbOffset;
  if (y > -thumbSize && y < height) {
    for (let i = 0; i < thumbs.length; i++) {
      let x = currentThumbX + i * (thumbSize + thumbGap);
      if (mouseX > x && mouseX < x + thumbSize &&
          mouseY > y && mouseY < y + thumbSize) {
        hoveredIndex = i;
        break;
      }
    }
  }

  for (let i = 0; i < thumbs.length; i++) {
    let x = startX + i * (thumbSize + thumbGap);
    if (x + thumbSize > 0 && x < width) {
        
      let thumbImg = thumbs[i];
      let ratioToCover = max(thumbSize / thumbImg.width, thumbSize / thumbImg.height);

      let displayW = thumbImg.width * ratioToCover;
      let displayH = thumbImg.height * ratioToCover;

      let offsetX = x + (thumbSize - displayW) / 2;
      let offsetY = y + (thumbSize - displayH) / 2;

      fill(50);
      rect(x, y, thumbSize, thumbSize);

      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(x, y, thumbSize, thumbSize);
      drawingContext.clip();

      if (i === hoveredIndex) tint(255, 150);
      else noTint();

      image(thumbImg, offsetX, offsetY, displayW, displayH);
      drawingContext.restore();
      noTint();

      if (i === hoveredIndex) {
        stroke(110, 133, 219);
        strokeWeight(3);
        noFill();
        rect(x, y, thumbSize, thumbSize);
      }
    }
  }
}

function drawPreviewOverlay() {
  push();
  noStroke();
  fill(0, 180);
  rect(0, 0, width, height);

  drawingContext.filter = "none";

  const maxWidth = 900;

  let pw = previewImg.width;
  let ph = previewImg.height;

  if (pw > maxWidth) {
    let ratio = maxWidth / pw;
    pw *= ratio;
    ph *= ratio;
  }

  if (pw > width * 0.9 || ph > height * 0.9) {
    let ratio = min((width * 0.9) / pw, (height * 0.9) / ph);
    pw *= ratio;
    ph *= ratio;
  }

  image(previewImg, (width - pw) / 2, (height - ph) / 2, pw, ph);

  fill(255, 200);
  textSize(16);
  textFont(myFont2);
  textAlign(CENTER, CENTER);
  text("Click anywhere to close", width/2, (height + ph)/2 + 30);
  pop();
}

function drawTextInteractive(txt, x, y, maxW, alpha, o1, o2) {
  fill(255, alpha);
  push();
  let offset = map(alpha, 0, 255, o1, o2);
  translate(offset, 0);
  textSize(18);
  textFont(myFont1);
  textAlign(LEFT, TOP);
  textLeading(24);
  text(txt, x, y, maxW);
  pop();
}

function estimateTextHeight(txt, maxW) {
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

function mouseWheel(event) {
  if (showPreview) return false;
  targetScrollY += event.delta;
  targetScrollY = constrain(targetScrollY, 0, canvasHeight - height);
  return false;
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
