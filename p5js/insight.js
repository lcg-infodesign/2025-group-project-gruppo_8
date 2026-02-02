let insightSketch = function (p) {
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
      //title: "Hiroshima & Nagasaki",
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
      //title: "Moratorium 1958",
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
      hasThreeSections: true
    },
    "trattato63": {
      //title: "Test Ban Treaty 1963",
texts: [
  "Partial Test Ban Treaty – PTBT (1963): This was the first international agreement to effectively limit nuclear testing.",
  "It entered into force in 1963 and prohibited nuclear explosions in the atmosphere, underwater, and in outer space, while still allowing underground testing—a compromise that enabled the US, USSR, and UK to continue their programs without formally violating the treaty.",
  "The initial goal was to reduce global radioactive fallout; implicitly, it was not intended to slow down the arms race. Many states never ratified it, and in the decades that followed, testing simply shifted underground, becoming the dominant mode until the late 1990s."
],

      imagePaths: [
        "images/1963.png",
        "images/insight_img2.jpg",
        "images/hiding_the_radiation_of_the_atomic_bombs_1050x700.avif"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: true
    },
    "trattato96": {
      //title: "Test Ban Treaty 1996",
texts: [
  "The Comprehensive Nuclear-Test-Ban Treaty (CTBT) is an international agreement that prohibits all nuclear explosions, aiming to prevent the proliferation of nuclear weapons and to limit the development of new or more advanced weapons. It was adopted by the UN General Assembly in 1996 and opened for signature in the same year.",
  "A key distinction in international treaties is between signing and ratifying: signing shows a country’s intention to follow the rules, while ratification makes the treaty legally binding through formal approval. The CTBT has been signed by 185 countries, but not all major nuclear powers have ratified it. In the dataset, the United States, Russian Federation, and China signed the treaty but did not ratify it; India and Pakistan have neither signed nor ratified it; France and the United Kingdom have both signed and ratified it.",
  "The treaty establishes a global verification system with seismic, hydroacoustic, infrasound, and radionuclide monitoring stations, as well as the possibility of on-site inspections. Although the CTBT has not yet entered into force due to the lack of ratification by some key countries, it has effectively limited nuclear testing, as most nuclear-armed states have observed a voluntary moratorium since the 1990s. Overall, the CTBT remains a crucial instrument for global security and nuclear non-proliferation, but its full effectiveness depends on the commitment of all major nuclear powers."
],

      imagePaths: [
        "images/1996.png",
        "images/insight_img2.jpg",
        "images/hiding_the_radiation_of_the_atomic_bombs_1050x700.avif"
      ],
      thumbnails: [],
      bottomTexts: [],
      hasThreeSections: true
    },
    "tsarbomba": {
      //title: "Tsar Bomba - 50 MT",
      texts: [
        "The RDS-200, known as Tsar Bomba, was the most powerful nuclear weapon ever detonated, with a yield of 50 megatons of TNT, developed by the Soviet Union and tested on October 30, 1961.",
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

  // --- [ADD] Scroll hint + snap-to-section (solo per insight lunghi) ---
  let snapTargets = [];          // targetScrollY per ogni sezione (centrata)
  let currentStep = 0;           // 0..2
  let showScrollLabel = true;    // al primo scroll diventa false
  let lastStepMs = 0;            // throttle wheel
  let isSnapping = false; // blocca wheel mentre stai ancora animando verso un target
  let freeScrollMode = false; // 是否已经进入 gallery 自由滚动


  let viewBombBtnBox = null;     // hitbox per click
  let overViewBombBtn = false;   // hover state

  // --- [ADD] first page buttons (Hiroshima) ---
  let viewFatManBtnBox = null;
  let viewLittleBoyBtnBox = null;

  // TODO: 用你 dataset 里对应条目的 id 替换
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

  let myFont1, myFont2;

  let fadeIn = 0;
  let floatOffset = 20;
  let hoverClickable = false; // true quando sei sopra elementi cliccabili (thumbs / arrows)

  const imgAlpha = 100; // prova 200–220 (255 = pieno)


  p.preload = function () {
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
    hoverClickable = false; // reset ogni frame


    scrollY += (targetScrollY - scrollY) * 0.12;
    // sblocca wheel quando sei praticamente arrivata
    if (isSnapping && Math.abs(targetScrollY - scrollY) < 0.6) {
      isSnapping = false;
    }

    thumbOffset += (targetThumbOffset - thumbOffset) * 0.18;

    fadeIn = p.min(fadeIn + 3, 255);
    floatOffset = p.max(floatOffset - 0.55, 0);

    // TITLE "Insight" REMOVED:
    // la navbar HTML/CSS sopra al canvas sostituisce questo titolo.
    // (teniamo comunque pageTitle per i calcoli di layout/canvasHeight)
    titleAlpha = p.map(scrollY, 0, 200, 255, 0, true);


    let topTextW = p.width - topTextSideMargin * 2;
    let topTextH = estimateTextHeight(pageTitle, topTextW);

    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThreeSections = config.hasThreeSections;

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

    if (hasThreeSections && img2) {
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

      if (currentTopic === "hiroshima") {
        let thumbY = calculateThumbY(scrollY);
        if (thumbY < p.height + 200 && thumbs.length > 0) {
          drawThumbnails(thumbY);
        }
      }
    }

    // --- [ADD] Tsar button ---
    overViewBombBtn = drawViewBombButton();

    // --- [ADD] Scroll hint (solo per insight lunghi) ---
    const overHint = drawScrollHintIfNeeded(hasThreeSections);
    drawFirstBombButtons(hasThreeSections);



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

  // --- [ADD] calcola y base delle 3 sezioni (senza scroll) ---
  function getSectionBaseYs() {
    // Stessi calcoli del draw, ma senza floatOffset per avere targets stabili
    let topTextW = p.width - topTextSideMargin * 2;
    let topTextH = estimateTextHeight(pageTitle, topTextW);

    let y1 = topMargin + topTextH + 100;          // come in draw (senza floatOffset)
    let y2 = y1 + imgH + spacing;
    let y3 = y2 + imgH + spacing;
    return [y1, y2, y3];
  }

  // --- [ADD] costruisce targets scroll che centrano il testo (via centro immagine) ---
  function rebuildSnapTargets() {
    const ys = getSectionBaseYs();
    const centers = ys.map(y => y + imgH / 2);

    // nel draw: centerY = (y - scrollY*0.9) + imgH/2
    // voglio centerY == p.height/2  => scrollY = (center - p.height/2)/0.9
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

// 到最后一个 section 往下：只有 Hiroshima 才进入 gallery 自由滚动
if (dir > 0 && idx >= snapTargets.length - 1) {
  if (currentTopic === "hiroshima") {
    freeScrollMode = true;
    showScrollLabel = false;
  }
  return;
}


    // 往上回到 section 区 → 退出自由滚动
    if (dir < 0) {
      freeScrollMode = false;
    }

    isSnapping = true;
    snapToStep(idx + (dir > 0 ? 1 : -1));
  }



  // --- CTA tipo page1: label + freccia. La label torna quando risali. A fine pagina sparisce tutto.
  function drawScrollHintIfNeeded(hasThreeSections) {
    if (!hasThreeSections) return false;
    if (showPreview) return false;

    rebuildSnapTargets();
    const idx = nearestStepIndex();
    const isLast = idx >= snapTargets.length - 1;

    // A fine pagina: NON disegnare nulla
    if (isLast) return false;

    const cx = p.width / 2;

    // FONDO PAGINA (più giù possibile senza tagliare)
    const baseCy = p.height - 34;

    // bobbing condiviso: testo e freccia si muovono insieme
    const bob = p.sin(p.frameCount * 0.08) * 4;
    const cy = baseCy + bob;

    // label sopra la freccia, e si muove con lei
    const labelY = cy - 24;

    // hitbox generosa (include area label)
    const hitW = 240;
    const hitH = 60;
    const over =
      p.mouseX > cx - hitW / 2 && p.mouseX < cx + hitW / 2 &&
      p.mouseY > baseCy - hitH / 2 && p.mouseY < baseCy + hitH / 2;

    // freccia “chevron”
    const halfW = 10;
    const h = 8;

    p.push();
    p.noFill();

    // hover = più chiara
    const a = over ? 220 : 160;
    p.stroke(0, 255, 255, a);
    p.strokeWeight(over ? 2 : 1.6);

    // chevron down
    p.line(cx - halfW, cy - h, cx, cy);
    p.line(cx + halfW, cy - h, cx, cy);

    // label: font come page1, ma colore ciano richiesto
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

  // --- [ADD] Button stile "VIEW HISTORIC INSIGHTS" ma con link alla bomba ---
  function drawViewBombButton() {
    // Solo su Tsar insight
    if (currentTopic !== "tsarbomba") {
      viewBombBtnBox = null;
      return false;
    }

    if (showPreview) {
      viewBombBtnBox = null;
      return false;
    }

    // MOSTRA SOLO ALLA FINE (ultimo step)
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
    const btnW = p.textWidth(label) + padX * 2 + 18; // + spazio freccetta

    const btnX = p.width / 2 - btnW / 2;
    // lo metto "in basso" ma NON attaccato alla freccia scroll-hint (che sta più giù)
    const btnY = p.height - 74;

    const isHover =
      p.mouseX > btnX && p.mouseX < btnX + btnW &&
      p.mouseY > btnY && p.mouseY < btnY + btnH;

    // salva hitbox per mousePressed
    viewBombBtnBox = { x: btnX, y: btnY, w: btnW, h: btnH };

    // stile: dark fill + cyan stroke (come year)
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

    // testo
    p.noStroke();
    p.fill(0, 255, 255, isHover ? 255 : 180);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, btnX + btnW / 2 - 6, btnY + btnH / 2 - 1);

    // triangolino a destra (stesso linguaggio del bottone year)
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

  // --- [ADD] Two buttons on first page (Hiroshima): VIEW FAT MAN / VIEW LITTLE BOY ---
 // --- [REPLACE] Two buttons for Hiroshima, same timing logic as last-page button ---
// 出现时机：必须 scroll 到最后一个 section 再往下 → 进入 freeScrollMode(gallery) 才出现
function drawFirstBombButtons(hasThreeSections) {
  // 只在 Hiroshima
  if (currentTopic !== "hiroshima") {
    viewFatManBtnBox = null;
    viewLittleBoyBtnBox = null;
    return;
  }

  if (!hasThreeSections) return;

  // preview 开着就不显示
  if (showPreview) {
    viewFatManBtnBox = null;
    viewLittleBoyBtnBox = null;
    return;
  }

  // ✅ 关键：和最后一页一样，“滚到某个阶段才出现”
  // 这里用你已有的 freeScrollMode：进入 gallery 才显示按钮
  if (!freeScrollMode) {
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

  const wLeft = p.textWidth(labelLeft) + padX * 2 + 18;   // + spazio freccetta
  const wRight = p.textWidth(labelRight) + padX * 2 + 18;

  const totalW = wLeft + gap + wRight;
  const groupX = p.width / 2 - totalW / 2;

  // 和最后一页按钮同位置
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


  // helper：画一个按钮（完全复用“最后一页按钮”的视觉语言）
  function drawOneButton(btnX, btnY, btnW, btnH, label, isHover) {
    // 背景 + 描边
    if (isHover) {
      p.fill(20, 20, 20, 200);
      p.stroke(0, 255, 255, 200);
    } else {
      p.fill(20, 20, 20, 200);
      p.stroke(0, 255, 255, 120);
    }

    p.strokeWeight(1);
    p.rect(btnX, btnY, btnW, btnH, 8);

    // 文本
    p.noStroke();
    p.fill(0, 255, 255, isHover ? 255 : 180);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, btnX + btnW / 2 - 6, btnY + btnH / 2 - 1);

    // 右侧小三角（hover 时轻微抖动）
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

    // --- [ADD] click first-page buttons (Hiroshima) ---
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


    // --- [ADD] click "View the bomb" (RDS-200 / 1961) ---
    if (viewBombBtnBox) {
      const overBtn =
        p.mouseX >= viewBombBtnBox.x && p.mouseX <= viewBombBtnBox.x + viewBombBtnBox.w &&
        p.mouseY >= viewBombBtnBox.y && p.mouseY <= viewBombBtnBox.y + viewBombBtnBox.h;

      if (overBtn) {
        // RDS-200 nel tuo dataset ha id_no = 61053
        window.location.href = "single.html?id=61053";
        return;
      }
    }

    // --- [ADD] click sulla freccia/CTA: stesso comportamento dello scroll down ---
    const config = contentConfig[currentTopic] || contentConfig["hiroshima"];
    const hasThreeSections = config.hasThreeSections;

    if (hasThreeSections) {
      // ricostruisco e verifico hover sulla stessa hitbox del draw
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

      if (overHint && !isLast) {
        stepScroll(+1);
        return;
      }
    }


  };

  p.mouseWheel = function (event) {

    if (showPreview) return false;

    const config = contentConfig[currentTopic];
    if (!config.hasThreeSections) return false;

    if (isSnapping) return false;

    rebuildSnapTargets();

    // =========================
    // SECTION SNAP MODE
    // =========================
    if (!freeScrollMode) {

      if (event.delta > 0) stepScroll(+1);
      else if (event.delta < 0) stepScroll(-1);

    }

    // =========================
    // GALLERY FREE SCROLL MODE
    // =========================
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

  // ✅关键修复：往上滚到 gallery 顶部时，退出自由滚动，回到 section snap
  const eps = 0.8; // 容差，避免浮点抖动
  if (event.delta < 0 && targetScrollY <= minScrollY + eps) {
    targetScrollY = minScrollY;
    freeScrollMode = false;
    isSnapping = false; // 让下一次 wheel 能正常触发 stepScroll(-1)
  }
}


    return false;
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calculateCanvasHeight();
  };
};

new p5(insightSketch);

