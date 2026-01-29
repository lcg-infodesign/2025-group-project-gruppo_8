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
  let titleAlpha = map(scrollY, 0, 200, 255, 0, true); 
  fill(200, titleAlpha);
  textAlign(CENTER, TOP);
  textFont(myFont1);
  noStroke();
  textSize(20);
  text(topText, width / 2, 30);

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

    if (showPreview && previewImg && currentTopic === "hiroshima") {
      drawPreviewOverlay();
    }
  };

  function drawTextWithFloat(txt, x, y, maxW, alpha, o1, o2) {
    p.push();
    let finalAlpha = p.min(alpha, fadeIn);
    p.fill(255, finalAlpha);
    
    let offsetY = floatOffset * (1 - fadeIn / 255);
    let offset = p.map(finalAlpha, 0, 255, o1, o2);
    p.translate(offset, offsetY);
    
    p.textSize(21);
    p.textFont(myFont2);
    p.textAlign(p.LEFT, p.TOP);
    p.textLeading(28);
    p.text(txt, x, y, maxW);
    p.pop();
  }

  function drawTextInteractive(txt, x, y, maxW, alpha, o1, o2) {
    p.push();
    p.fill(255, alpha);
    let offset = p.map(alpha, 0, 255, o1, o2);
    p.translate(offset, 0);
    p.textSize(21);
    p.textFont(myFont2);
    p.textAlign(p.LEFT, p.TOP);
    p.textLeading(28);
    p.text(txt, x, y, maxW);
    p.pop();
  }

  function estimateTextHeight(txt, maxW) {
    p.textFont(myFont2);
    p.textSize(21);
    p.textLeading(28);

    let words = txt.split(/\s+/);
    let lineCount = 1;
    let lineWidth = 0;
    for (let w of words) {
      let wWidth = p.textWidth(w + " ");
      if (lineWidth + wWidth > maxW) {
        lineCount++;
        lineWidth = wWidth;
      } else {
        lineWidth += wWidth;
      }
    }
    return lineCount * 28;
  }

  function calculateCanvasHeight() {
    imgW = p.windowWidth * 0.62;
    imgH = imgW * 800 / 1200;

    let topTextW = p.windowWidth - topTextSideMargin * 2;
    let topTextH = estimateTextHeight(pageTitle, topTextW);

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThreeSections = config.hasThreeSections;

    if (hasThreeSections) {
      let height = topMargin + topTextH + 140 + (spacing + imgH) * 3;
      
      if (currentTopic === "hiroshima") {
        height += 600;
      } else {
        height += 200;
      }
      
      canvasHeight = height;
    } else {
      let contentHeight = topMargin + topTextH + 140 + imgH + 100;
      canvasHeight = Math.min(contentHeight, p.windowHeight);
    }
  }

  function calculateThumbY(currentScrollY) {
    if (currentTopic !== "hiroshima") return -1000;

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThreeSections = config.hasThreeSections;
    
    if (!hasThreeSections) return -1000;

    let topTextW = p.width - topTextSideMargin * 2;
    let topTextH = estimateTextHeight(pageTitle, topTextW);
    let y1 = topMargin + topTextH + 140;
    let y2 = y1 + imgH + spacing;
    let y3 = y2 + imgH + spacing;

    let base = y3 + imgH + spacing + 180;
    return base - currentScrollY;
  }

  function drawThumbnails(y) {
    if (currentTopic !== "hiroshima") return;
    
    if (y < -100) return;

    let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
    let startX = (p.width - totalW) / 2 + thumbOffset;

    p.noStroke();
    p.fill(255);

    let arrowW = 40, arrowH = thumbSize;
    let arrowY = y;

    const visibleEnd = p.width - sideMargin;
    const initialStripStart = (p.width - totalW) / 2;
    const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
    const maxScroll = p.min(0, maxScrollNegative);

    if (thumbOffset < -5) {
      let x = sideMargin - arrowW;
      if (p.mouseX > x && p.mouseX < x + arrowW && p.mouseY > arrowY && p.mouseY < arrowY + arrowH) {
        p.fill(110, 133, 219, 150);
        p.rect(x, arrowY, arrowW, arrowH, 0);
        p.fill(255);
      }
      p.noStroke();
      p.fill(255);
      p.triangle(x + 15, arrowY + arrowH/2, x + arrowW - 15, arrowY + 20, x + arrowW - 15, arrowY + arrowH - 20);
    }

    if (thumbOffset > maxScroll + 5) {
      let x = p.width - sideMargin;
      if (p.mouseX > x - arrowW && p.mouseX < x && p.mouseY > arrowY && p.mouseY < arrowY + arrowH) {
        p.fill(110, 133, 219, 150);
        p.rect(x - arrowW, arrowY, arrowW, arrowH, 0);
        p.fill(255);
      }
      p.noStroke();
      p.fill(255);
      p.triangle(x - 15, arrowY + arrowH/2, x - arrowW + 15, arrowY + 20, x - arrowW + 15, arrowY + arrowH - 20);
    }

    let hoveredIndex = -1;
    let currentThumbX = (p.width - totalW) / 2 + thumbOffset;
    if (y > -thumbSize && y < p.height) {
      for (let i = 0; i < thumbs.length; i++) {
        let x = currentThumbX + i * (thumbSize + thumbGap);
        if (p.mouseX > x && p.mouseX < x + thumbSize && p.mouseY > y && p.mouseY < y + thumbSize) {
          hoveredIndex = i;
          break;
        }
      }
    }

    for (let i = 0; i < thumbs.length; i++) {
      let x = startX + i * (thumbSize + thumbGap);
      if (x + thumbSize > -50 && x < p.width + 50) {
        let thumbImg = thumbs[i];

        let ratioToCover = p.max(thumbSize / thumbImg.width, thumbSize / thumbImg.height);
        let displayW = thumbImg.width * ratioToCover;
        let displayH = thumbImg.height * ratioToCover;
        let offsetX = x + (thumbSize - displayW) / 2;
        let offsetY = y + (thumbSize - displayH) / 2;

        p.fill(20);
        p.noStroke();
        p.rect(x, y, thumbSize, thumbSize, 0);

        p.drawingContext.save();
        p.drawingContext.beginPath();
        p.drawingContext.rect(x, y, thumbSize, thumbSize);
        p.drawingContext.clip();

        if (i === hoveredIndex) p.tint(255, 150); else p.noTint();
        p.image(thumbImg, offsetX, offsetY, displayW, displayH);
        p.drawingContext.restore();
        p.noTint();

        if (i === hoveredIndex) {
          p.noFill();
          p.stroke(110, 133, 219);
          p.strokeWeight(3);
          p.rect(x, y, thumbSize, thumbSize, 0);
        } else {
          p.noFill();
          p.stroke(255, 50);
          p.strokeWeight(1);
          p.rect(x, y, thumbSize, thumbSize, 0);
        }
      }
    }

    p.noStroke();
  }

  function drawPreviewOverlay() {
    if (currentTopic !== "hiroshima") return;

    p.push();
    p.noStroke();
    p.fill(0, 220);
    p.rect(0, 0, p.width, p.height);

    let targetHeight = 600;
    let ph = targetHeight;
    let pw = (previewImg.width / previewImg.height) * ph;

    let imgX = (p.width - pw) / 2;
    let imgY = (p.height - ph) / 2;
    p.image(previewImg, imgX, imgY, pw, ph);

    let midY = p.height / 2;

    let lx = 100;
    let leftHover = p.mouseX > lx && p.mouseX < lx + previewArrowSize &&
                  p.mouseY > midY - previewArrowSize && p.mouseY < midY + previewArrowSize;
    p.fill(leftHover ? p.color(255, 255, 255) : p.color(255, 150));
    p.triangle(
      lx, midY,
      lx + previewArrowSize, midY - previewArrowSize,
      lx + previewArrowSize, midY + previewArrowSize
    );

    let rx = p.width - 100 - previewArrowSize;
    let rightHover = p.mouseX > rx && p.mouseX < rx + previewArrowSize &&
                   p.mouseY > midY - previewArrowSize && p.mouseY < midY + previewArrowSize;
    p.fill(rightHover ? p.color(255, 255, 255) : p.color(255, 150));
    p.triangle(
      rx + previewArrowSize, midY,
      rx, midY - previewArrowSize,
      rx, midY + previewArrowSize
    );

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    let currentBottomText = config.bottomTexts[previewIndex] || "";

    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255);
    p.text(currentBottomText, p.width / 2, imgY + ph + 40);
    p.pop();
  }

  p.mousePressed = function() {
    if (currentTopic === "hiroshima" && showPreview && previewImg) {
      let leftX = 100;
      let arrowY1 = p.height / 2 - previewArrowSize;
      let arrowY2 = p.height / 2 + previewArrowSize;
      
      if (p.mouseX > leftX && p.mouseX < leftX + previewArrowSize &&
          p.mouseY > arrowY1 && p.mouseY < arrowY2) {
          previewIndex = (previewIndex - 1 + largeImages.length) % largeImages.length;
          previewImg = largeImages[previewIndex];
          return;
      }

      let rightX = p.width - 100 - previewArrowSize;
      if (p.mouseX > rightX && p.mouseX < rightX + previewArrowSize &&
          p.mouseY > arrowY1 && p.mouseY < arrowY2) {
          previewIndex = (previewIndex + 1) % largeImages.length;
          previewImg = largeImages[previewIndex];
          return;
      }

      showPreview = false;
      return;
    }

    if (currentTopic === "hiroshima") {
      let thumbY = calculateThumbY(scrollY);
      if (thumbY > -thumbSize && thumbY < p.height) {
        let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
        let startX = (p.width - totalW) / 2 + thumbOffset;
        
        for (let i = 0; i < thumbs.length; i++) {
          let x = startX + i * (thumbSize + thumbGap);
          if (p.mouseX > x && p.mouseX < x + thumbSize &&
              p.mouseY > thumbY && p.mouseY < thumbY + thumbSize) {
            previewIndex = i;
            previewImg = largeImages[previewIndex];
            showPreview = true;
            return;
          }
        }
      }
    }
  };

  p.mouseWheel = function(event) {
    if (showPreview) return false;
    
    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThreeSections = config.hasThreeSections;
    
    if (!hasThreeSections) {
      targetScrollY = 0;
      return false;
    }
    
    targetScrollY += event.delta;
    
    if (currentTopic === "hiroshima") {
      targetScrollY = p.constrain(targetScrollY, 0, p.max(0, canvasHeight - p.height));
    } else {
      let maxScrollY = topMargin + estimateTextHeight(pageTitle, p.width - topTextSideMargin * 2) + 140 + (spacing + imgH) * 3 + 200 - p.height;
      targetScrollY = p.constrain(targetScrollY, 0, p.max(0, maxScrollY));
    }
    
    return false;
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calculateCanvasHeight();
  };
};

new p5(insightSketch);