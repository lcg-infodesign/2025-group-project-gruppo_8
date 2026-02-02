let insightSketch = function (p) {
  let img1, img2, img3, img4;
  let thumbs = [];
  let largeImages = [];
  let showPreview = false;
  let previewImg = null;

  let currentTopic = "hiroshima";
  let pageTitle = "Insight";
  let contentTitle = "";
  let Text1, Text2, Text3, Text4;

  const contentConfig = {
    "hiroshima": {
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
      texts: [
        "The 1958 moratorium on nuclear testing was a direct response to the growing tensions of the Cold War and increasing fears of nuclear proliferation. The accumulation of atomic weapons by the superpowers and the environmental and strategic effects of testing, especially atmospheric testing, fueled the urgency for international control.",
        "In November 1958, the United Kingdom, the United States, and the Soviet Union initiated a voluntary suspension of nuclear testing, which lasted until September 1961. This period marked the first concrete attempt to regulate the arms race through voluntary moratoriums.",
        "In 1959, diplomatic efforts continued in parallel, aiming to turn this pause into a stable system of control through negotiations that would later lead to agreements in the following years. Subsequently, other moratoriums were announced by individual states: for example, Soviet President Gorbachev declared a suspension of tests in July 1985, but since the United States did not adhere to it, both military tests and civilian nuclear explosions resumed in February 1987. "
      ],
      imagePaths: [
        "images/insight_1958_img1.jpg",
        "images/581.jpeg",
        "images/582.jpeg"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: true
    },

    "trattato63": {
      texts: [
        "Since 1945, more than 2,000 nuclear explosions have been conducted, mainly for the purpose of testing nuclear weapons and studying their effects. Before 1963, many of these tests took place in the atmosphere or underwater, causing widespread radioactive contamination with serious environmental and health consequences on a global scale.",
        "Signed in 1963 by the United States, the Soviet Union, and the United Kingdom, the Partial Test Ban Treaty (PTBT) prohibited nuclear tests in the atmosphere, outer space, and underwater, while still allowing underground testing. As a result of the treaty, none of these three countries has carried out atmospheric nuclear tests since 1963.",
        "Other nuclear-armed states gradually followed suit: France restricted its testing to underground explosions starting in 1974, and China did so from 1980 onward.Although the treaty did not put an end to all nuclear testing, it marked a crucial step in arms control. It significantly reduced global radioactive pollution and helped pave the way for later disarmament agreements."
      ],
      imagePaths: [
        "images/1963.png",
        "images/63.jpeg",
        "images/631.jpeg"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: true
    },

    "trattato96": {
      texts: [
        "The Comprehensive Nuclear-Test-Ban Treaty (CTBT) is an international agreement that prohibits all nuclear explosions, aiming to prevent the proliferation of nuclear weapons and to limit the development of new or more advanced weapons. It was adopted by the UN General Assembly in 1996 and opened for signature in the same year.",
        "A key distinction in international treaties is between signing and ratifying: signing shows a country’s intention to follow the rules, while ratification makes the treaty legally binding through formal approval. The CTBT has been signed by 185 countries, but not all major nuclear powers have ratified it.",
        "In the dataset, the United States, Russian Federation, and China signed the treaty but did not ratify it; India and Pakistan have neither signed nor ratified it; France and the United Kingdom have both signed and ratified it.",
        "The treaty establishes a global verification system with seismic, hydroacoustic, infrasound, and radionuclide monitoring stations, as well as the possibility of on-site inspections. Although the CTBT has not yet entered into force due to the lack of ratification by some key countries, it has effectively limited nuclear testing since the 1990s."
      ],
      imagePaths: [
        "images/1996.png",
        "images/96.jpeg",
        "images/961.jpeg",
        "images/963.jpeg"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: false,
      hasFourSections: true
    },

    "tsarbomba": {
      texts: [
        "RDS-220, also known as Tsar Bomba and code-named Vanya, was the most powerful thermonuclear weapon ever detonated and the largest nuclear explosion in human history.",
        "Developed and tested by the Soviet Union on October 30, 1961, the device was exploded over Novaya Zemlya in the Russian Arctic during the Cold War for military and research purposes. Although originally designed to yield 100 megatons, it was deliberately scaled down to about 50 megatons (50,000 kilotons) of TNT to reduce radioactive fallout, still making it approximately 3,800 times more powerful than the Hiroshima bomb.",
        "Dropped from a bomber aircraft and detonated at high altitude to minimize ground contamination while maximizing the shockwave, the explosion produced a fireball about 8 kilometers (5 miles) in diameter and a mushroom cloud rising to 67 kilometers (42 miles). The heat was intense enough to cause third-degree burns up to 100 kilometers (62 miles) away, and the blast was detected across vast distances worldwide, remaining an enduring symbol of the nuclear arms race."
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


  let scrollY = 0;
  let targetScrollY = 0;

  let snapTargets = [];
  let currentStep = 0;
  let showScrollLabel = true;
  let lastStepMs = 0;
  let isSnapping = false;
  let freeScrollMode = false;

  let viewBombBtnBox = null;
  let overViewBombBtn = false;

  let viewFatManBtnBox = null;
  let viewLittleBoyBtnBox = null;

  const FAT_MAN_ID = 45003;
  const LITTLE_BOY_ID = 45002;

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

  let myFont1, myFont2, myFont3;

  let fadeIn = 0;
  let floatOffset = 20;
  let hoverClickable = false;

  const imgAlpha = 100;

  p.preload = function () {
    myFont1 = p.loadFont("fonts/LexendZetta-Regular.ttf");
    myFont2 = p.loadFont("fonts/LibreFranklin-Regular.otf");
    myFont3 = p.loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

    const urlParams = new URLSearchParams(window.location.search);
    currentTopic = urlParams.get('topic') || 'hiroshima';

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThree = !!config.hasThreeSections;
    const hasFour = !!config.hasFourSections;

    img1 = p.loadImage(config.imagePaths[0]);
    img2 = (hasThree || hasFour) ? p.loadImage(config.imagePaths[1]) : null;
    img3 = (hasThree || hasFour) ? p.loadImage(config.imagePaths[2]) : null;
    img4 = hasFour ? p.loadImage(config.imagePaths[3]) : null;

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

    Text1 = config.texts[0] || "";
    Text2 = (hasThree || hasFour) ? (config.texts[1] || "") : "";
    Text3 = (hasThree || hasFour) ? (config.texts[2] || "") : "";
    Text4 = hasFour ? (config.texts[3] || "") : "";
  };

  p.setup = function () {
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

  p.draw = function () {
    p.background(20);
    p.fill(255);
    hoverClickable = false;

    scrollY += (targetScrollY - scrollY) * 0.12;
    if (isSnapping && Math.abs(targetScrollY - scrollY) < 0.6) {
      isSnapping = false;
    }

    thumbOffset += (targetThumbOffset - thumbOffset) * 0.18;

    fadeIn = p.min(fadeIn + 3, 255);
    floatOffset = p.max(floatOffset - 0.55, 0);

    titleAlpha = p.map(scrollY, 0, 200, 255, 0, true);

    let topTextW = p.width - topTextSideMargin * 2;
    let topTextH = estimateTextHeight(pageTitle, topTextW);

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThreeSections = !!config.hasThreeSections;
    const hasFourSections = !!config.hasFourSections;
    const hasLongSections = hasThreeSections || hasFourSections;

    let y1 = topMargin + topTextH + 100 + floatOffset;

    p.tint(255, (fadeIn * imgAlpha) / 255);
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

    // SECTION 2/3
    if (hasLongSections && img2) {
      let y2 = y1 + imgH + spacing;

      let imgX2 = p.width - sideMargin - imgW;
      p.tint(255, (fadeIn * imgAlpha) / 255);
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

      p.tint(255, (fadeIn * imgAlpha) / 255);
      p.image(img3, sideMargin, y3 - scrollY * 0.9, imgW, imgH);
      p.noTint();

      let textX3 = sideMargin + imgW + textGap;
      let textW3 = maxTextWidth;

      let textCenterY3 = y3 - scrollY * 0.9 + imgH / 2;
      let textHeight3 = estimateTextHeight(Text3, textW3);
      let textY3 = textCenterY3 - textHeight3 / 2;

      let alpha3 = p.map(y3 - scrollY, p.height, 0, 0, 255, true);
      drawTextWithFloat(Text3, textX3, textY3, textW3, alpha3, -20, 20);

      //  SECTION 4
      if (hasFourSections && img4) {
        let y4 = y3 + imgH + spacing;

        let imgX4 = p.width - sideMargin - imgW;
        p.tint(255, (fadeIn * imgAlpha) / 255);
        p.image(img4, imgX4, y4 - scrollY * 0.9, imgW, imgH);
        p.noTint();

        let textX4 = sideMargin + 100;
        let textW4 = maxTextWidth;

        let textCenterY4 = y4 - scrollY * 0.9 + imgH / 2;
        let textHeight4 = estimateTextHeight(Text4, textW4);
        let textY4 = textCenterY4 - textHeight4 / 2;

        let alpha4 = p.map(y4 - scrollY, p.height, 0, 0, 255, true);
        drawTextWithFloat(Text4, textX4, textY4, textW4, alpha4, 20, -20);
      }

      if (currentTopic === "hiroshima") {
        let thumbY = calculateThumbY(scrollY);
        if (thumbY < p.height + 200 && thumbs.length > 0) {
          drawThumbnails(thumbY);
        }
      }
    }

    overViewBombBtn = drawViewBombButton();

    const overHint = drawScrollHintIfNeeded(hasLongSections);
    drawFirstBombButtons(hasThreeSections);

    if (showPreview && previewImg && currentTopic === "hiroshima") {
      drawPreviewOverlay();
    }

    document.body.classList.toggle("photo-open", showPreview && currentTopic === "hiroshima");
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
    const sectionsCount = config.hasFourSections ? 4 : (config.hasThreeSections ? 3 : 1);

    if (sectionsCount >= 3) {
      let height = topMargin + topTextH + 140 + (spacing + imgH) * sectionsCount;

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

  function getSectionBaseYs() {
    let topTextW = p.width - topTextSideMargin * 2;
    let topTextH = estimateTextHeight(pageTitle, topTextW);

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const sectionsCount = config.hasFourSections ? 4 : (config.hasThreeSections ? 3 : 1);

    let y1 = topMargin + topTextH + 100;
    let ys = [y1];
    for (let i = 1; i < sectionsCount; i++) {
      ys.push(ys[i - 1] + imgH + spacing);
    }
    return ys;
  }

  function rebuildSnapTargets() {
    const ys = getSectionBaseYs();
    const centers = ys.map(y => y + imgH / 2);
    snapTargets = centers.map(c => Math.max(0, (c - p.height / 2) / 0.9));
  }

  function nearestStepIndex() {
    if (!snapTargets.length) return 0;
    let bestI = 0;
    let bestD = Infinity;
    for (let i = 0; i < snapTargets.length; i++) {
      let d = Math.abs(scrollY - snapTargets[i]);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    return bestI;
  }

  function snapToStep(i) {
    if (!snapTargets.length) rebuildSnapTargets();
    currentStep = Math.max(0, Math.min(i, snapTargets.length - 1));
    targetScrollY = snapTargets[currentStep];
  }

  function stepScroll(dir) {
    if (isSnapping) return;

    rebuildSnapTargets();
    const idx = nearestStepIndex();

    // scroll: Hiroshima goes into gallery
    if (dir > 0 && idx >= snapTargets.length - 1) {
      if (currentTopic === "hiroshima") {
        // Enter gallery and move on the first click
        if (!freeScrollMode) {
          freeScrollMode = true;
          showScrollLabel = false;
        }
        nudgeFreeScroll(+1); 
      }
      return;
    }


    if (dir < 0) {
      freeScrollMode = false;
    }

    isSnapping = true;
    snapToStep(idx + (dir > 0 ? 1 : -1));
  }


  function nudgeFreeScroll(dir) {
    // At the moment only Hiroshima enters a gallery (freeScrollMode)
    if (currentTopic !== "hiroshima") return;

    rebuildSnapTargets();

    const bottomMargin = 120;
    const baseThumbY = calculateThumbY(0);

    // If calculateThumbY() is disabled, don't try to scroll gallery
    if (baseThumbY <= -999) return;

    const maxScrollY = baseThumbY - (p.height - bottomMargin - thumbSize);
    const minScrollY = snapTargets[snapTargets.length - 1];
    const upper = Math.max(minScrollY, maxScrollY);

    const STEP = Math.max(220, p.height * 0.75); // one “click/press” worth of scroll
    targetScrollY = p.constrain(targetScrollY + dir * STEP, minScrollY, upper);

    // If you reach the top of the gallery going up, exit free scroll
    const eps = 0.8;
    if (dir < 0 && targetScrollY <= minScrollY + eps) {
      targetScrollY = minScrollY;
      freeScrollMode = false;
      isSnapping = false;
    }
  }


  function drawScrollHintIfNeeded(hasLongSections) {
    if (!hasLongSections) return false;
    if (showPreview) return false;

    rebuildSnapTargets();
    const idx = nearestStepIndex();
    const isLast = idx >= snapTargets.length - 1;
    if (!freeScrollMode) {
      const allowLastToEnterGallery = (currentTopic === "hiroshima" && isLast);
      if (isLast && !allowLastToEnterGallery) return false;
    } else {
      // freeScrollMode: show arrow until we reach the bottom of the gallery
      if (currentTopic !== "hiroshima") return false;

      const bottomMargin = 120;
      const baseThumbY = calculateThumbY(0);
      if (baseThumbY <= -999) return false;

      const maxScrollY = baseThumbY - (p.height - bottomMargin - thumbSize);
      const minScrollY = snapTargets[snapTargets.length - 1];
      const upper = Math.max(minScrollY, maxScrollY);

      const eps = 0.8;
      const atBottom = targetScrollY >= upper - eps;
      if (atBottom) return false;
    }

    const cx = p.width / 2;
    const baseCy = p.height - 34;

    const bob = p.sin(p.frameCount * 0.08) * 4;
    const cy = baseCy + bob;
    const labelY = cy - 24;

    const hitW = 240;
    const hitH = 60;
    const over =
      p.mouseX > cx - hitW / 2 && p.mouseX < cx + hitW / 2 &&
      p.mouseY > baseCy - hitH / 2 && p.mouseY < baseCy + hitH / 2;

    const halfW = 10;
    const h = 8;

    p.push();
    p.noFill();

    const a = over ? 220 : 160;
    p.stroke(0, 255, 255, a);
    p.strokeWeight(over ? 2 : 1.6);

    p.line(cx - halfW, cy - h, cx, cy);
    p.line(cx + halfW, cy - h, cx, cy);

    if (idx === 0 && showScrollLabel) {
      p.noStroke();
      p.fill(0, 255, 255, over ? 255 : 200);
      p.textFont(myFont2);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("SCROLL DOWN FOR MORE", cx, labelY);
    }

    p.pop();

    if (over) hoverClickable = true;
    return over;
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

  // Button
  function drawViewBombButton() {
    if (currentTopic !== "tsarbomba") {
      viewBombBtnBox = null;
      return false;
    }

    if (showPreview) {
      viewBombBtnBox = null;
      return false;
    }

    rebuildSnapTargets();
    const idx = nearestStepIndex();
    const isLast = idx >= snapTargets.length - 1;

    if (!isLast) {
      viewBombBtnBox = null;
      return false;
    }

    const label = "VIEW THE BOMB";
    const btnH = 40;
    const padX = 18;

    p.push();
    p.textFont(myFont3);
    p.textSize(14);
    const btnW = p.textWidth(label) + padX * 2 + 18;

    const btnX = p.width / 2 - btnW / 2;
    const btnY = p.height - 74;

    const isHover =
      p.mouseX > btnX && p.mouseX < btnX + btnW &&
      p.mouseY > btnY && p.mouseY < btnY + btnH;

    viewBombBtnBox = { x: btnX, y: btnY, w: btnW, h: btnH };

    if (isHover) {
      p.fill(20, 20, 20, 200);
      p.stroke(0, 255, 255, 200);
      hoverClickable = true;
    } else {
      p.fill(20, 20, 20, 200);
      p.stroke(0, 255, 255, 120);
    }

    p.strokeWeight(1);
    p.rect(btnX, btnY, btnW, btnH, 8);

    p.noStroke();
    p.fill(0, 255, 255, isHover ? 255 : 180);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, btnX + btnW / 2 - 6, btnY + btnH / 2 - 1);

    let triSize = 5;
    let triX = btnX + btnW - 12;
    let triY = btnY + btnH / 2;
    if (isHover) triX += p.sin(p.frameCount * 0.2) * 2;

    p.push();
    p.translate(triX, triY);
    p.noStroke();
    p.fill(0, 255, 255, isHover ? 255 : 180);
    p.triangle(-triSize, -triSize, -triSize, triSize, triSize, 0);
    p.pop();

    p.pop();
    return isHover;
  }

  //Hiroshima buttons
  function drawFirstBombButtons(hasThreeSections) {
    if (currentTopic !== "hiroshima") {
      viewFatManBtnBox = null;
      viewLittleBoyBtnBox = null;
      return;
    }

    if (!hasThreeSections) return;

    if (showPreview) {
      viewFatManBtnBox = null;
      viewLittleBoyBtnBox = null;
      return;
    }

    if (!freeScrollMode) {
      viewFatManBtnBox = null;
      viewLittleBoyBtnBox = null;
      return;
    }

    
    rebuildSnapTargets();

    const bottomMargin = 120;
    const baseThumbY = calculateThumbY(0);
    if (baseThumbY <= -999) {
      viewFatManBtnBox = null;
      viewLittleBoyBtnBox = null;
      return;
    }

    const maxScrollY = baseThumbY - (p.height - bottomMargin - thumbSize);
    const minScrollY = snapTargets[snapTargets.length - 1];
    const upper = Math.max(minScrollY, maxScrollY);

    const eps = 0.8;
    const atBottom = targetScrollY >= upper - eps;

    if (!atBottom) {
      viewFatManBtnBox = null;
      viewLittleBoyBtnBox = null;
      return;
    }


    const btnH = 40;
    const padX = 18;
    const gap = 18;

    const labelLeft = "VIEW FAT MAN";
    const labelRight = "VIEW LITTLE BOY";

    p.push();
    p.textFont(myFont3);
    p.textSize(14);

    const wLeft = p.textWidth(labelLeft) + padX * 2 + 18;
    const wRight = p.textWidth(labelRight) + padX * 2 + 18;

    const totalW = wLeft + gap + wRight;
    const groupX = p.width / 2 - totalW / 2;

    const btnY = p.height - 74;

    const leftX = groupX;
    const rightX = groupX + wLeft + gap;

    const hoverLeft =
      p.mouseX > leftX && p.mouseX < leftX + wLeft &&
      p.mouseY > btnY && p.mouseY < btnY + btnH;

    const hoverRight =
      p.mouseX > rightX && p.mouseX < rightX + wRight &&
      p.mouseY > btnY && p.mouseY < btnY + btnH;

    viewFatManBtnBox = { x: leftX, y: btnY, w: wLeft, h: btnH };
    viewLittleBoyBtnBox = { x: rightX, y: btnY, w: wRight, h: btnH };

    drawOneButton(leftX, btnY, wLeft, btnH, labelLeft, hoverLeft);
    drawOneButton(rightX, btnY, wRight, btnH, labelRight, hoverRight);

    if (hoverLeft || hoverRight) hoverClickable = true;

    p.pop();
  }

  function drawOneButton(btnX, btnY, btnW, btnH, label, isHover) {
    if (isHover) {
      p.fill(20, 20, 20, 200);
      p.stroke(0, 255, 255, 200);
    } else {
      p.fill(20, 20, 20, 200);
      p.stroke(0, 255, 255, 120);
    }

    p.strokeWeight(1);
    p.rect(btnX, btnY, btnW, btnH, 8);

    p.noStroke();
    p.fill(0, 255, 255, isHover ? 255 : 180);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, btnX + btnW / 2 - 6, btnY + btnH / 2 - 1);

    let triSize = 5;
    let triX = btnX + btnW - 12;
    let triY = btnY + btnH / 2;
    if (isHover) triX += p.sin(p.frameCount * 0.2) * 2;

    p.push();
    p.translate(triX, triY);
    p.noStroke();
    p.fill(0, 255, 255, isHover ? 255 : 180);
    p.triangle(-triSize, -triSize, -triSize, triSize, triSize, 0);
    p.pop();
  }

  function drawThumbnails(y) {
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
      p.triangle(x + 15, arrowY + arrowH / 2, x + arrowW - 15, arrowY + 20, x + arrowW - 15, arrowY + arrowH - 20);
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
      p.triangle(x - 15, arrowY + arrowH / 2, x - arrowW + 15, arrowY + 20, x - arrowW + 15, arrowY + arrowH - 20);
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
          p.stroke(0, 255, 255);
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

  p.mousePressed = function () {
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

    if (viewFatManBtnBox) {
      const overFat =
        p.mouseX >= viewFatManBtnBox.x && p.mouseX <= viewFatManBtnBox.x + viewFatManBtnBox.w &&
        p.mouseY >= viewFatManBtnBox.y && p.mouseY <= viewFatManBtnBox.y + viewFatManBtnBox.h;

      if (overFat) {
        if (FAT_MAN_ID) window.location.href = `single.html?id=${FAT_MAN_ID}`;
        return;
      }
    }

    if (viewLittleBoyBtnBox) {
      const overLB =
        p.mouseX >= viewLittleBoyBtnBox.x && p.mouseX <= viewLittleBoyBtnBox.x + viewLittleBoyBtnBox.w &&
        p.mouseY >= viewLittleBoyBtnBox.y && p.mouseY <= viewLittleBoyBtnBox.y + viewLittleBoyBtnBox.h;

      if (overLB) {
        if (LITTLE_BOY_ID) window.location.href = `single.html?id=${LITTLE_BOY_ID}`;
        return;
      }
    }

    if (viewBombBtnBox) {
      const overBtn =
        p.mouseX >= viewBombBtnBox.x && p.mouseX <= viewBombBtnBox.x + viewBombBtnBox.w &&
        p.mouseY >= viewBombBtnBox.y && p.mouseY <= viewBombBtnBox.y + viewBombBtnBox.h;

      if (overBtn) {
        window.location.href = "single.html?id=61053";
        return;
      }
    }

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasLongSections = !!config.hasThreeSections || !!config.hasFourSections;

    if (hasLongSections) {
      rebuildSnapTargets();
      const idx = nearestStepIndex();
      const isLast = idx >= snapTargets.length - 1;

      const cx = p.width / 2;
      const baseCy = p.height - 44;
      const hitW = 240;
      const hitH = 60;

      const overHint =
        p.mouseX > cx - hitW / 2 && p.mouseX < cx + hitW / 2 &&
        p.mouseY > baseCy - hitH / 2 && p.mouseY < baseCy + hitH / 2;

            if (overHint) {
        if (!freeScrollMode) {
          // Allow the extra click on the last text ONLY for Hiroshima
          if (!isLast || currentTopic === "hiroshima") {
            stepScroll(+1);
            return;
          }
        } else {
          // In the gallery, clicking the arrow nudges you down
          nudgeFreeScroll(+1);
          return;
        }
      }

    }
  };

   
  p.keyPressed = function () {
    if (showPreview) return false;

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasLongSections = !!config.hasThreeSections || !!config.hasFourSections;
    if (!hasLongSections) return false;
    if (isSnapping) return false;

    // DOWN -> next step / continue in gallery
    if (p.keyCode === p.DOWN_ARROW) {
      if (!freeScrollMode) stepScroll(+1);
      else nudgeFreeScroll(+1);
      return false; // prevent browser/page scroll
    }

    // UP -> previous step / go back inside gallery
    if (p.keyCode === p.UP_ARROW) {
      if (!freeScrollMode) stepScroll(-1);
      else nudgeFreeScroll(-1);
      return false; // prevent browser/page scroll
    }

    return false;
  };


  let wheelAccum = 0;

  p.mouseWheel = function (event) {
    if (showPreview) return false;

    const config = contentConfig[currentTopic];
    const hasLongSections = !!config.hasThreeSections || !!config.hasFourSections;
    if (!hasLongSections) return false;
    if (Math.abs(event.delta) < 6) return false;
    if (isSnapping) return false;

    rebuildSnapTargets();

    if (!freeScrollMode) {
      wheelAccum += event.delta;

      if (wheelAccum > 60) {
        wheelAccum = 0;
        stepScroll(+1);
      } else if (wheelAccum < -60) {
        wheelAccum = 0;
        stepScroll(-1);
      }
    }
    else {
      targetScrollY += event.delta * 0.8;

      const bottomMargin = 120;
      const baseThumbY = calculateThumbY(0);

      const maxScrollY =
        baseThumbY - (p.height - bottomMargin - thumbSize);

      const minScrollY = snapTargets[snapTargets.length - 1];

      targetScrollY = p.constrain(
        targetScrollY,
        minScrollY,
        Math.max(minScrollY, maxScrollY)
      );

      const eps = 0.8;
      if (event.delta < 0 && targetScrollY <= minScrollY + eps) {
        targetScrollY = minScrollY;
        freeScrollMode = false;
        isSnapping = false;
      }
    }

    return false;
  };

};

new p5(insightSketch);
