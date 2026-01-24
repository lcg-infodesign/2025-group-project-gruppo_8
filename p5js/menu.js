let menuSketch = function (p) {

  let btnSize = 60;
  let btnX = 25;
  let btnY = 25;
  let btnScale = 1;

  let hoverButton = false;

  let menuOpen = false;
  let menuX;
  let menuTargetX;
  let menuW = 250;

  let font;

  // ---- MENU CONFIG ----
  const menuStartY = 110;
  const menuStepY = 28;
  const menuTextH = 18;

  const menuLinks = {
    "home": "index.html",
    "overview": "index.html#page2",
    "bombs per year": "year.html",
    "insight": "insight.html",
    "about": "about.html"
  };

  const items = ["home", "overview", "bombs per year", "insight", "about"];

  const insightItems = [
    "Hiroshima & Nagasaki",
    "Moratorium 1958",
    "Test Ban Treaty 1963",
    "Test Ban Treaty 1996",
    "Tsar Bomba - 50 MT"
  ];

  const insightLinks = {
    "Hiroshima & Nagasaki": "insight.html?topic=hiroshima",
    "Moratorium 1958": "insight.html?topic=moratoria58",
    "Test Ban Treaty 1963": "insight.html?topic=trattato63",
    "Test Ban Treaty 1996": "insight.html?topic=trattato96",
    "Tsar Bomba - 50 MT": "insight.html?topic=tsarbomba"
  };

  let insightY = null;

  p.preload = function () {
    font = p.loadFont("fonts/LibreFranklin-Regular.otf");
  };

  p.setup = function () {
    let cnv = p.createCanvas(520, 350);
    cnv.position(0, 0);
    cnv.style("pointer-events", "auto");
    cnv.style("position", "fixed");
    cnv.style("z-index", "9999");
    cnv.style("background-color", "transparent"); // 透明背景

    menuX = -menuW;
    menuTargetX = -menuW;

    p.textFont(font);
    p.textSize(14);
  };

  p.draw = function () {
    // 完全透明清除
    p.clear();
    
    checkMenuLogic();
    menuX = p.lerp(menuX, menuTargetX, 0.2);

    drawSideMenu();
    drawButton();
  };

  function checkMenuLogic() {
    let distToButton = p.dist(
      p.mouseX,
      p.mouseY,
      btnX + btnSize / 2,
      btnY + btnSize / 2
    );

    hoverButton = distToButton < btnSize / 2 || menuOpen;

    if (distToButton < btnSize / 2) {
      menuOpen = true;
      menuTargetX = 0;
    }

    let insideMenu =
      p.mouseX >= menuX &&
      p.mouseX <= menuX + menuW + 180 &&
      p.mouseY >= 0 &&
      p.mouseY <= 280; // 只检测菜单区域

    // 检测是否在insight子菜单区域
    let insideSubMenu = false;
    if (insightY !== null) {
      let subX = menuX + 38 + 55;
      let subY = insightY;
      insideSubMenu =
        p.mouseX >= subX &&
        p.mouseX <= subX + 250 &&
        p.mouseY >= subY - menuTextH &&
        p.mouseY <= subY + insightItems.length * menuStepY;
    }

    if (menuOpen && !insideMenu && !insideSubMenu && distToButton >= btnSize / 2) {
      menuOpen = false;
      menuTargetX = -menuW;
    }
  }

  function drawButton() {
    let targetScale = hoverButton ? 1.65 : 1.5;
    btnScale = p.lerp(btnScale, targetScale, 0.15);

    p.push();
    p.translate(btnX + btnSize / 2, btnY + btnSize / 2);
    p.scale(btnScale);

    // 按钮背景保持透明
    p.noStroke();
    p.fill(0, 0, 0, 0); // 完全透明
    p.ellipse(0, 0, 45, 45);

    p.stroke(hoverButton ? p.color(0, 255, 255) : 255);
    p.strokeWeight(0.4);
    p.noFill();
    p.ellipse(0, 0, 30, 10);

    p.push();
    p.rotate(p.radians(60));
    p.ellipse(0, 0, 30, 10);
    p.pop();

    p.push();
    p.rotate(p.radians(-60));
    p.ellipse(0, 0, 30, 10);
    p.pop();

    p.fill(hoverButton ? p.color(0, 255, 255) : 255);
    p.noStroke();
    p.ellipse(0, 0, 4);

    p.pop();
  }

  function drawSideMenu() {
    if (!menuOpen && menuX <= -menuW + 1) return;

    // 不绘制任何背景矩形，只绘制文字
    p.textFont(font);
    p.textSize(14);

    let currentY = menuStartY;
    insightY = null;

    for (let i = 0; i < items.length; i++) {
      let label = items[i];
      let displayLabel = label === "home" ? "NE ARCHIVE" : label;

      let x = menuX + 38;
      let y = currentY;
      let w = p.textWidth(displayLabel);

      let hovering =
        p.mouseX >= x &&
        p.mouseX <= x + w &&
        p.mouseY >= y - menuTextH &&
        p.mouseY <= y;

      p.fill(hovering ? p.color(0, 255, 255) : 220);
      p.text(displayLabel, x, y);

      if (label === "insight") insightY = y;

      currentY += menuStepY;
    }

    if (insightY !== null) {
      let subX = menuX + 38 + 55;
      let baseY = insightY;

      // 扩大insight子菜单检测区域
      let insideInsight =
        p.mouseX >= menuX + 38 &&
        p.mouseX <= subX + 250 &&
        p.mouseY >= baseY - menuTextH &&
        p.mouseY <= baseY + menuStepY * insightItems.length;

      if (insideInsight) {
        for (let i = 0; i < insightItems.length; i++) {
          let label = insightItems[i];
          let y = baseY + i * menuStepY;
          let w = p.textWidth(label);

          let hovering =
            p.mouseX >= subX &&
            p.mouseX <= subX + w &&
            p.mouseY >= y - menuTextH &&
            p.mouseY <= y;

          p.fill(hovering ? p.color(0, 255, 255) : 160);
          p.text(label, subX, y);
        }
      }
    }
  }

  p.mouseReleased = function () {
    if (!menuOpen) return;

    // 主菜单点击
    let currentY = menuStartY;

    for (let i = 0; i < items.length; i++) {
      let label = items[i];
      let displayLabel = label === "home" ? "NE ARCHIVE" : label;

      let x = menuX + 38;
      let y = currentY;
      let w = p.textWidth(displayLabel);

      let hovering =
        p.mouseX >= x &&
        p.mouseX <= x + w &&
        p.mouseY >= y - menuTextH &&
        p.mouseY <= y;

      if (hovering) {
        if (label === "overview") {
          let onIndex =
            window.location.pathname.includes("index.html") ||
            window.location.pathname.endsWith("/");

          if (onIndex) {
            window.dispatchEvent(
              new CustomEvent("changePage", { detail: { page: 2 } })
            );
          } else {
            window.location.href = "index.html#page2";
          }
          return;
        }

        // 如果是insight主项，不跳转，让子菜单显示
        if (label === "insight") {
          return;
        }

        window.location.href = menuLinks[label];
        return;
      }

      currentY += menuStepY;
    }

    // 子菜单点击
    if (insightY !== null) {
      let subX = menuX + 38 + 55;
      let baseY = insightY;

      for (let i = 0; i < insightItems.length; i++) {
        let label = insightItems[i];
        let y = baseY + i * menuStepY;
        let w = p.textWidth(label);

        let hovering =
          p.mouseX >= subX &&
          p.mouseX <= subX + w &&
          p.mouseY >= y - menuTextH &&
          p.mouseY <= y;

        if (hovering) {
          // 使用新的英文标题作为键
          window.location.href = insightLinks[label];
          return;
        }
      }
    }
  }
};

// 只在全局window对象上创建一次菜单
if (!window.menuCreated) {
  new p5(menuSketch);
  window.menuCreated = true;
}