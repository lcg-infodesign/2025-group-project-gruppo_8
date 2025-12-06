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

//==================================================
// 处理点击事件（包括缩略图和箭头）
//==================================================
function mousePressed() {
  
  // -----------------------------
  // ⭐ 新增: 菜单图标点击逻辑 (来自 single.js)
  // -----------------------------
  let d = dist(mouseX, mouseY, 50, 50);
  if (d < 15) {
    menuOpen = !menuOpen;
    return;
  }


  if (showPreview) {
    // 1. 点击任意处关闭预览
    showPreview = false; 
    return;
  }
  
  // 计算缩略图的当前屏幕 Y 坐标
  let thumbY = calculateThumbY(scrollY);
  let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
  let arrowW = 40, arrowH = thumbSize;
  
  // 计算边界：以居中方式对齐缩略图，并以 sideMargin 为可见区域边界。
  const visibleEnd = width - sideMargin;
  const initialStripStart = (width - totalW) / 2;
  
  // 最大可向左滚动的负值 (使右边缘对齐右侧 margin)
  const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
  // 确保 maxScroll 不会是正数 (即如果所有缩略图都可见，则 maxScroll 为 0)
  const maxScroll = Math.min(0, maxScrollNegative); 
  
  // 1. 检查箭头点击
  let scrollAmount = (thumbSize + thumbGap); // 一次滚动一张图的距离

  // 左箭头点击区域
  let leftArrowX = sideMargin - arrowW;
  // 检查是否可以继续向右滚动 (即 targetThumbOffset < -5)
  if (targetThumbOffset < -5 && mouseX > leftArrowX && mouseX < leftArrowX + arrowW && mouseY > thumbY && mouseY < thumbY + arrowH) {
    // 目标偏移量向右移动 (增加)
    targetThumbOffset = constrain(targetThumbOffset + scrollAmount, maxScroll, 0);
    return;
  }

  // 右箭头点击区域
  let rightArrowX = width - sideMargin;
  // 检查是否可以继续向左滚动 (即 targetThumbOffset > maxScroll + 5)
  if (targetThumbOffset > maxScroll + 5 && mouseX > rightArrowX - arrowW && mouseX < rightArrowX && mouseY > thumbY && mouseY < thumbY + arrowH) {
    // 目标偏移量向左移动 (减少)
    targetThumbOffset = constrain(targetThumbOffset - scrollAmount, maxScroll, 0);
    return;
  }

  // 2. 检查缩略图点击 (只有在 thumbY 在屏幕范围内才检查)
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


//==================================================
// 缩略图区域 + 左右尖头（绘图）
//==================================================
function drawThumbnails(y) {
  let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
  
  // 起始位置先居中 + 当前偏移量
  let startX = (width - totalW) / 2 + thumbOffset;

  noStroke();
  fill(255);

  // ------------------ 左右箭头绘制 ------------------
  let arrowW = 40, arrowH = thumbSize;
  let arrowY = y;
  
  // 计算边界：用于判断箭头是否应该显示
  const visibleEnd = width - sideMargin;
  const initialStripStart = (width - totalW) / 2;
  const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
  const maxScroll = Math.min(0, maxScrollNegative); 
  
  // 左箭头 (只有当可以向右滚动时才显示, 即当前 thumbOffset < -5)
  if (thumbOffset < -5) { 
    let x = sideMargin - arrowW;
    
    // 悬停高亮
    if (mouseX > x && mouseX < x + arrowW && mouseY > arrowY && mouseY < arrowY + arrowH) {
      fill(110, 133, 219, 150); // 紫色/蓝色悬停效果
      rect(x, arrowY, arrowW, arrowH, 0); // 移除圆角
      fill(255); 
    } else {
      fill(255, 200);
    }
    
    // 绘制左箭头
    triangle(x + 15, arrowY + arrowH/2, x + arrowW - 15, arrowY + 20, x + arrowW - 15, arrowY + arrowH - 20);
  }

  // 右箭头 (只有当右侧有内容被隐藏时才显示, 即当前 thumbOffset > maxScroll + 5)
  if (thumbOffset > maxScroll + 5) {
    let x = width - sideMargin;
    
    // 悬停高亮
    if (mouseX > x - arrowW && mouseX < x && mouseY > arrowY && mouseY < arrowY + arrowH) {
      fill(110, 133, 219, 150); // 紫色/蓝色悬停效果
      rect(x - arrowW, arrowY, arrowW, arrowH, 0); // 移除圆角
      fill(255); 
    } else {
      fill(255, 200);
    }
    
    // 绘制右箭头
    triangle(x - 15, arrowY + arrowH/2, x - arrowW + 15, arrowY + 20, x - arrowW + 15, arrowY + arrowH - 20);
  }


  // ------------------ 绘制缩略图 ------------------
  
  let hoveredIndex = -1; // 跟踪哪个缩略图被悬停
  
  // 1. 检查悬停
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

  // 2. 绘制缩略图
  for (let i = 0; i < thumbs.length; i++) {
    let x = startX + i * (thumbSize + thumbGap);

    // 只绘制在屏幕范围内的缩略图
    if (x + thumbSize > 0 && x < width) {
        
      let thumbImg = thumbs[i];
      let displayW, displayH;
      
      // ⭐ Cover 模式逻辑：确保图片完全覆盖 120x120 区域，同时保持比例
      // 计算所需的最小缩放比例，以使图片的任意一边达到 120px
      let ratioToCover = max(thumbSize / thumbImg.width, thumbSize / thumbImg.height);

      displayW = thumbImg.width * ratioToCover;
      displayH = thumbImg.height * ratioToCover;

      // 3. 计算居中绘制的偏移量（图片会超出 120x120 区域）
      let offsetX = x + (thumbSize - displayW) / 2;
      let offsetY = y + (thumbSize - displayH) / 2;
        
      // 绘制背景框 (提供直角视觉效果)
      fill(50);
      noStroke();
      rect(x, y, thumbSize, thumbSize, 0); // 移除圆角

      // ========== 实现裁剪 (使用方正裁剪路径) ==========
      drawingContext.save(); // 保存当前绘图状态
      
      // 定义裁剪路径：一个 120x120 的矩形框
      drawingContext.beginPath();
      drawingContext.rect(x, y, thumbSize, thumbSize);
      drawingContext.clip(); // 应用裁剪
      
      if (i === hoveredIndex) {
          // 悬停时使用 tint() 稍微变暗
          tint(255, 150); 
      } else {
          noTint(); // 非悬停时重置
      }
        
      noStroke(); // 确保 image() 没有边框

      // 绘制图片 (这将在裁剪区域内绘制)
      image(
        thumbImg, 
        offsetX, 
        offsetY, 
        displayW, 
        displayH
      );

      // 恢复绘图状态，移除裁剪路径
      drawingContext.restore(); 
      
      noTint(); // 绘制后重置 tint

      // ========== 绘制边框 (在裁剪之后，因此会显示直角) ==========
      if (i === hoveredIndex) {
        // 添加悬停边框
        noFill();
        stroke(110, 133, 219);
        strokeWeight(3);
        rect(x, y, thumbSize, thumbSize, 0); // 绘制直角边框
      } else {
        // 绘制一个柔和的背景边框来分隔
        noFill();
        stroke(255, 50);
        strokeWeight(1);
        rect(x, y, thumbSize, thumbSize, 0); // 绘制直角边框
      }
    }
  }
  
  // ⭐ 修复：确保在函数结束时重置 stroke 状态，防止它影响其他绘制元素。
  noStroke(); 
}


//==================================================
// 大图预览 + 背景模糊
//==================================================
function drawPreviewOverlay() {
  push();
  noStroke();

  // 半透明黑色遮罩
  fill(0, 180);
  rect(0, 0, width, height);
  
  // 重置滤镜，以免影响后续绘制
  drawingContext.filter = "none"; 

  // ⭐ 大图最大宽度保持 900px
  const maxWidth = 900;
  
  // 初始尺寸设为图片的原始尺寸
  let pw = previewImg.width;
  let ph = previewImg.height;
  
  // 1. 如果图片宽度大于最大允许宽度 (900px)，则按比例缩小
  if (pw > maxWidth) {
      let ratio = maxWidth / pw;
      pw *= ratio;
      ph *= ratio;
  }
  
  // 2. 额外检查：确保图片不会超出屏幕的 90% (防止在小屏幕上溢出)
  if (pw > width * 0.9 || ph > height * 0.9) {
      let screenRatio = min((width * 0.9) / pw, (height * 0.9) / ph);
      pw *= screenRatio;
      ph *= screenRatio;
  }

  // 显示大图，居中对齐
  image(previewImg, (width - pw) / 2, (height - ph) / 2, pw, ph);

  // 提示文字
  fill(255, 200);
  textSize(16);
  textFont(myFont2);
  textAlign(CENTER, CENTER);
  text("Click anywhere to close", width/2, (height + ph)/2 + 30);
  pop();
}

//==================================================
// 文字微动 + 渐显
//==================================================
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
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateCanvasHeight();
}
