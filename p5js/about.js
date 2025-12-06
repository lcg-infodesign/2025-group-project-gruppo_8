let myFont1, myFont2, myFont3;
let projectText, aboutUsText;

let fadeIn = 0;         // 控制透明度
let floatOffset = 20;   // 控制上浮偏移（初始向下 20px）

function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  projectText =
    "This project visualizes the global history of nuclear testing through an interactive and minimal system. " +
    "By mapping tests across years, countries, and yields, it reveals patterns that raw data alone cannot show. " +
    "The aim is to make a complex historical timeline accessible, readable, and reflective.";

  aboutUsText =
    "We are a group of seven from Politecnico di Milano. " +
    "United by our interest in data visualization and interactive storytelling, " +
    "we developed this project to explore how design can make complex information understandable and meaningful.";
}

function draw() {
  background(0);

  // ----------- 淡入 + 上浮动画控制逻辑 -----------
  fadeIn = min(fadeIn + 3, 255);
  floatOffset = max(floatOffset - 0.6, 0); 
  // 越小越快，你可以把 0.6 改大，让上浮更快

  drawAboutContent();
}

function drawAboutContent() {

  // ----------------------------------------
  // ① 主标题 ABOUT（不淡入，不上浮，立即显示）
  // ----------------------------------------
  textFont(myFont1);
  fill(110, 133, 219);   // ★ 固定颜色，不使用 fadeIn
  textSize(20);
  textAlign(CENTER, TOP);
  text("ABOUT", width / 2, 20); // 永远固定，不动

  // ----------------------------------------
  // 内容区居中计算
  // ----------------------------------------
  let boxWidth = width * 0.55;
  let x = width / 2 - boxWidth / 2;

  textFont(myFont1);
  textSize(18);
  let titleH = 28;

  textSize(14);
  let p1H = textHeight(projectText, boxWidth);
  let p2H = textHeight(aboutUsText, boxWidth);

  let spacingBetween = 180;

  let totalH =
      titleH + p1H +
      spacingBetween +
      titleH + p2H;

  // ★ 内容整体垂直居中，但加入 floatOffset 上浮动画
  let startY = (height - totalH) / 2 + 40 + floatOffset;

  // ----------------------------------------
  // ② ABOUT THE PROJECT（淡入 + 上浮）
  // ----------------------------------------
  fill(255, fadeIn);
  textFont(myFont1);
  textSize(18);
  textAlign(CENTER, TOP);
  text("ABOUT THE PROJECT", width / 2, startY);

  // 正文段落 1（淡入 + 上浮）
  textSize(14);
  textAlign(LEFT, TOP);
  text(projectText, x, startY + titleH, boxWidth);

  // ----------------------------------------
  // ③ ABOUT US（淡入 + 上浮）
  // ----------------------------------------
  let y2 = startY + titleH + p1H + spacingBetween;

  textAlign(CENTER, TOP);
  textSize(18);
  text("ABOUT US", width / 2, y2);

  // 正文段落 2
  textSize(14);
  textAlign(LEFT, TOP);
  text(aboutUsText, x, y2 + titleH, boxWidth);
}

function textHeight(txt, boxWidth) {
  let bbox = myFont1.textBounds(txt, 0, 0, 14);
  let approxLines = ceil(bbox.w / boxWidth);
  return approxLines * 18;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}