let insightSketch = function(p) {
  // Variabili contenuto
  let img1, img2, img3;
  let thumbs = [];
  let largeImages = [];
  let showPreview = false;
  let previewImg = null;

  let currentTopic = "hiroshima";
  let pageTitle = "Insight";
  let contentTitle = "";
  let Text1, Text2, Text3;

  const contentConfig = {
    "hiroshima": {
      title: "Hiroshima & Nagasaki",
      texts: [
        "The use of nuclear weapons in armed conflict has occurred only twice: when the United States detonated two atomic bombs over the Japanese cities of Hiroshima and Nagasaki, during World War II. On 6 th and 9 th of August 1945, these aerial attacks claimed the lives of 150,000 to 246,000 people, most of whom were civilians.",
        "The atomic bomb dropped on Hiroshima was named Little Boy, it was a uranium gun-type fission weapon developed by the Manhattan Project. It was dropped by the B-29 Enola Gay on Hiroshima on August 6, 1945, marking it the first use of a nuclear weapon in warfare. It exploded with an energy equivalent to approximately 15 kilotons of TNT, causing widespread devastation with an explosion radius of about 1.3 kilometers (0.81 mi).",
        "The name of the atomic bomb dropped on Nagasaki was Fat Man, it was a plutonium-based implosion-type nuclear bomb. It was dropped from the B-29 bomber Bockscar on Nagasaki on August 9, 1945. It exploded with an energy equivalent to approximately 21 kilotons of TNT, weighing 10,300 pounds and making it most powerful design to ever be used in warfare."
      ],
      imagePaths: [
        "images/hiroshima-bombing-article-about-atomic-bomb.jpg",
        "images/insight_img2.jpg",
        "images/hiding_the_radiation_of_the_atomic_bombs_1050x700.avif"
      ],
      thumbnails: ["4", "5", "6", "7", "8", "9", "10"],
      bottomTexts: [
        "Carl Mydans Hiroshima Japan 1947, Atomic",
        "A barefoot boy waiting in line and staring ahead at a crematorium after the Nagasaki bombing, with his dead baby brother strapped to his back. \nPhoto by US Marine photographer Joe O'Donnell",
        "From notes by LIFE's Bernard Hoffman to the magazine's long-time picture editor, Wilson Hicks, in New York, September 1945",
        "Mother and child in Hiroshima, Japan, December 1945 Alfred Eisenstaedt",
        "A correspondent stands in the rubble in Hiroshima on Sept. 8, 1945, a month after the first atomic bomb ever used in warfare was dropped by the U.S.\nStanley Troutman / AP",
        "The devastated city of Nagasaki after an atomic bomb was dropped on it by a US Air Force B-29 bomber —AFP",
        "The mushroom cloud rising over Hiroshima, Japan on August 6, 1945"
      ],
      hasThreeSections: true
    },
    "moratoria58": {
      title: "Moratorium 1958",
      texts: [
        "The 1958 nuclear test moratorium was a unilateral suspension of nuclear weapons testing announced by the Soviet Union on March 31, 1958, and followed by the United States and United Kingdom.",
        "This moratorium lasted from November 1958 to September 1961, representing the first significant pause in nuclear testing since the beginning of the atomic age.",
        "The moratorium broke down when the Soviet Union resumed testing in 1961, citing the need to respond to increased international tensions and the Berlin Crisis."
      ],
      imagePaths: [
        "images/insight_1958_img1.jpg",
        "images/insight_img2.jpg",
        "images/hiding_the_radiation_of_the_atomic_bombs_1050x700.avif"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: false
    },
    "trattato63": {
      title: "Test Ban Treaty 1963",
      texts: [
        "The Partial Test Ban Treaty (PTBT), also known as the Limited Test Ban Treaty, was signed on August 5, 1963, by the United States, United Kingdom, and Soviet Union.",
        "The treaty prohibited all test detonations of nuclear weapons except for those conducted underground, effectively banning nuclear weapons tests in the atmosphere, underwater, and in outer space.",
        "The treaty was a response to growing international concern about radioactive fallout from atmospheric tests and represented a first step toward nuclear arms control."
      ],
      imagePaths: [
        "images/1963.png",
        "images/insight_img2.jpg",
        "images/hiding_the_radiation_of_the_atomic_bombs_1050x700.avif"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: false
    },
    "trattato96": {
      title: "Test Ban Treaty 1996",
      texts: [
        "The Comprehensive Nuclear-Test-Ban Treaty (CTBT) is a multilateral treaty that bans all nuclear explosions, for both civilian and military purposes, in all environments.",
        "Adopted by the United Nations General Assembly on September 10, 1996, the treaty has been signed by 185 nations and ratified by 170, but has not entered into force due to the non-ratification by eight specific nuclear technology holder countries.",
        "The treaty established the Comprehensive Nuclear-Test-Ban Treaty Organization (CTBTO) to monitor compliance through a global network of monitoring stations."
      ],
      imagePaths: [
        "images/1996.png",
        "images/insight_img2.jpg",
        "images/hiding_the_radiation_of_the_atomic_bombs_1050x700.avif"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: false
    },
    "tsarbomba": {
      title: "Tsar Bomba - 50 MT",
      texts: [
        "The Tsar Bomba was the most powerful nuclear weapon ever detonated, with a yield of 50 megatons of TNT, developed by the Soviet Union and tested on October 30, 1961.",
        "The bomb was originally designed for a 100-megaton yield, but was scaled down to reduce radioactive fallout. Even at half its potential yield, it was 3,800 times more powerful than the Hiroshima bomb.",
        "The fireball was about 8 kilometers (5.0 mi) in diameter and the mushroom cloud reached a height of 67 km (42 mi). The heat from the explosion could have caused third-degree burns 100 km (62 mi) away."
      ],
      imagePaths: [
        "images/tsar1.jpg",
        "images/tsar2.png",
        "images/tsar3.png"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: true
    }
  };

  // Variabili layout
  let scrollY = 0;
  let targetScrollY = 0;
  let canvasHeight;
  

  let topMargin = 40;
  let sideMargin = 80;
  let textGap = -200;
  let spacing = 100;
  let maxTextWidth = 500;
  let topTextSideMargin = 400;

  let imgW, imgH;

  let previewIndex = -1;
  let previewArrowSize = 20;

  let thumbOffset = 0;
  let targetThumbOffset = 0;
  let thumbSize = 120;
  let thumbGap = 30;

  let myFont1, myFont2;

  let fadeIn = 0;
  let floatOffset = 20;
  let hoverClickable = false; // true quando sei sopra elementi cliccabili (thumbs / arrows)


  p.preload = function() {
    myFont1 = p.loadFont("fonts/LexendZetta-Regular.ttf");
    myFont2 = p.loadFont("fonts/LibreFranklin-Regular.otf");
    myFont3 = p.loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

    const urlParams = new URLSearchParams(window.location.search);
    currentTopic = urlParams.get('topic') || 'hiroshima';
    
    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    
    img1 = p.loadImage(config.imagePaths[0]);
    img2 = config.hasThreeSections ? p.loadImage(config.imagePaths[1]) : null;
    img3 = config.hasThreeSections ? p.loadImage(config.imagePaths[2]) : null;
    
    thumbs = [];
    largeImages = [];
    if (currentTopic === "hiroshima") {
      config.thumbnails.forEach(thumbName => {
        let t = p.loadImage(`images/insight_img${thumbName}.jpg`);
        thumbs.push(t);
        largeImages.push(t);
      });
    }
    
    contentTitle = config.title;
    Text1 = config.texts[0];
    Text2 = config.hasThreeSections ? config.texts[1] : "";
    Text3 = config.hasThreeSections ? config.texts[2] : "";
  };

  p.setup = function() {
    calculateCanvasHeight();
    let c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.style("position", "fixed");
    c.style("top", "0px");
    c.style("left", "0px");
    c.style("z-index", "1");

    p.textSize(22);
    imgW = p.windowWidth * 0.62;
    imgH = imgW * 800 / 1200;
    
    fadeIn = 0;
    floatOffset = 20;
  };

  p.draw = function() {
    p.background(20);
    p.fill(255);
    hoverClickable = false; // reset ogni frame


    scrollY += (targetScrollY - scrollY) * 0.12;
    thumbOffset += (targetThumbOffset - thumbOffset) * 0.18;
    
    fadeIn = p.min(fadeIn + 3, 255);
    floatOffset = p.max(floatOffset - 0.6, 0);

    // TITLE "Insight" REMOVED:
    // la navbar HTML/CSS sopra al canvas sostituisce questo titolo.
    // (teniamo comunque pageTitle per i calcoli di layout/canvasHeight)
    titleAlpha = p.map(scrollY, 0, 200, 255, 0, true);


    let topTextW = p.width - topTextSideMargin * 2;
    let topTextH = estimateTextHeight(pageTitle, topTextW);

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThreeSections = config.hasThreeSections;

    let y1 = topMargin + topTextH + 100 + floatOffset;
    
    p.tint(255, 180 * fadeIn / 255);
    p.image(img1, sideMargin, y1 - scrollY * 0.9, imgW, imgH);
    p.noTint();

    let titleX = sideMargin + imgW + textGap + maxTextWidth + 180;
    let titleY = y1 - scrollY * 0.9 + 0;
    
    p.textAlign(p.RIGHT, p.TOP);
    p.textFont(myFont1);
    p.noStroke();
    p.fill(0, 255, 255, fadeIn);
    p.textSize(16);
    p.text(contentTitle, titleX, titleY);

    let textX1 = sideMargin + imgW + textGap;
    let textW1 = maxTextWidth;
    
    let textCenterY = y1 - scrollY * 0.9 + imgH / 2;
    let textHeight1 = estimateTextHeight(Text1, textW1);
    let textY1 = textCenterY - textHeight1 / 2;
    
    let alpha1 = p.map(y1 - scrollY, p.height, 0, 0, 255, true);
    drawTextWithFloat(Text1, textX1, textY1, textW1, alpha1, -20, 20);

    if (hasThreeSections && img2) {
      let y2 = y1 + imgH + spacing;
      
      let imgX2 = p.width - sideMargin - imgW;
      p.tint(255, 120 * fadeIn / 255);
      p.image(img2, imgX2, y2 - scrollY * 0.9, imgW, imgH);
      p.noTint();

      let textX2 = sideMargin + 100;
      let textW2 = maxTextWidth;
      
      let textCenterY2 = y2 - scrollY * 0.9 + imgH / 2;
      let textHeight2 = estimateTextHeight(Text2, textW2);
      let textY2 = textCenterY2 - textHeight2 / 2;
      
      let alpha2 = p.map(y2 - scrollY, p.height, 0, 0, 255, true);
      drawTextWithFloat(Text2, textX2, textY2, textW2, alpha2, 20, -20);

      let y3 = y2 + imgH + spacing;
      
      p.tint(255, 180 * fadeIn / 255);
      p.image(img3, sideMargin, y3 - scrollY * 0.9, imgW, imgH);
      p.noTint();

      let textX3 = sideMargin + imgW + textGap;
      let textW3 = maxTextWidth;
      
      let textCenterY3 = y3 - scrollY * 0.9 + imgH / 2;
      let textHeight3 = estimateTextHeight(Text3, textW3);
      let textY3 = textCenterY3 - textHeight3 / 2;
      
      let alpha3 = p.map(y3 - scrollY, p.height, 0, 0, 255, true);
      drawTextWithFloat(Text3, textX3, textY3, textW3, alpha3, -20, 20);

      if (currentTopic === "hiroshima") {
        let thumbY = calculateThumbY(scrollY);
        if (thumbY < p.height + 200 && thumbs.length > 0) {
          drawThumbnails(thumbY);
        }
      }
    }

    if (showPreview && previewImg && currentTopic === "hiroshima") {
      drawPreviewOverlay();
    }

    // Nasconde navbar/back quando la preview è aperta (solo su Hiroshima)
    document.body.classList.toggle("photo-open", showPreview && currentTopic === "hiroshima");


      // Cursor globale per elementi cliccabili (thumbs + arrows)
    p.cursor(hoverClickable ? p.HAND : p.ARROW);

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

    // Se la preview è aperta, i thumbnails dietro NON devono influenzare hover/cursor
    // (restano visivamente lì sotto, ma non “interagiscono”)
    if (showPreview) return;
  
    if (currentTopic !== "hiroshima") return;
    
    if (y < -100) return;

    let totalW = thumbs.length * thumbSize + (thumbs.length - 1) * thumbGap;
    let startX = (p.width - totalW) / 2 + thumbOffset;

    p.noStroke();
    p.fill(255);

    let arrowW = 40, arrowH = thumbSize;
    let arrowY = y;

    let hoverLeftStripArrow = false;
    let hoverRightStripArrow = false;


    const visibleEnd = p.width - sideMargin;
    const initialStripStart = (p.width - totalW) / 2;
    const maxScrollNegative = visibleEnd - (initialStripStart + totalW);
    const maxScroll = p.min(0, maxScrollNegative);

    if (thumbOffset < -5) {
      let x = sideMargin - arrowW;

      hoverLeftStripArrow =
        p.mouseX > x && p.mouseX < x + arrowW &&
        p.mouseY > arrowY && p.mouseY < arrowY + arrowH;
      
      if (hoverLeftStripArrow) {
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

      hoverRightStripArrow =
        p.mouseX > x - arrowW && p.mouseX < x &&
        p.mouseY > arrowY && p.mouseY < arrowY + arrowH;

      if (hoverRightStripArrow) {
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
    
if (hoveredIndex !== -1 || hoverLeftStripArrow || hoverRightStripArrow) {
          hoverClickable = true;
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

    if (leftHover || rightHover) {
      hoverClickable = true;
    }
               
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