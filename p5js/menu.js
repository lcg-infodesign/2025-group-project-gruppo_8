// menu.js — versione in instance mode per non interferire con altri sketch
let menuSketch = function(p) {

  let btnSize = 60;
  let btnX, btnY;

  let hover = false;
  let pressed = false;
  let btnScale = 1;

  let menuOpen = false;
  let menuX;
  let menuTargetX;
  let menuW = 220;

  let menuLinks = {
    "NUCLEAR": "index.html",
    "overview": "index.html#page2",
    "bombs per year": "year.html",
    "single bomb": "single.html",
    "insight": "insight.html",
    "about": "about.html",
  };

  p.setup = function() {
    let cnv = p.createCanvas(500, 350);
    cnv.position(0, 0);
    cnv.style("pointer-events", "none");

    btnX = 25;
    btnY = 25;

    menuX = -menuW;
    menuTargetX = -menuW;

    cnv.style("position", "fixed");
    cnv.style("z-index", "9999");
  };

  p.draw = function() {
    p.clear();
    menuX = p.lerp(menuX, menuTargetX, 0.15);
    drawSideMenu();
    drawButton();
  };

  function drawButton() {
    hover = p.dist(p.mouseX, p.mouseY, btnX + btnSize/2, btnY + btnSize/2) < btnSize/2;

    let targetScale = hover ? 1.15 : 1.0;
    btnScale = p.lerp(btnScale, targetScale, 0.15);

    p.push();
    p.translate(btnX + btnSize/2, btnY + btnSize/2);
    p.scale(btnScale);

    p.fill(120, 160, 255, hover ? 10 : 0);
    p.noStroke();
    p.ellipse(0, 0, btnSize * 1.06);

    p.fill(255, hover ? 20 : 0);
    p.ellipse(0, 0, btnSize);

    p.stroke(255);
    p.strokeWeight(1);
    p.noFill();
    p.ellipse(0, 0, 30, 16);
    p.ellipse(0, 0, 16, 30);

    p.push();
    p.rotate(p.PI / 4);
    p.ellipse(0, 0, 30, 16);
    p.pop();

    p.fill(255);
    p.noStroke();
    p.ellipse(0, 0, 6);

    p.pop();
  }

  function drawSideMenu() {
    p.fill(30, 30, 40, 0);
    p.noStroke();
    p.rect(menuX, 0, menuW, p.height);

    p.push();
    p.translate(menuX + 40, 120);

    let titleHover =
      p.mouseX > menuX + 40 && p.mouseX < menuX + 160 &&
      p.mouseY > 120 && p.mouseY < 150;

    p.fill(titleHover ? p.color(0, 255, 255) : 255);
    p.textSize(22);
    p.textAlign(p.LEFT, p.TOP);
    p.text("NUCLEAR", 0, 0);
    p.pop();

    p.textSize(18);
    let items = ["overview", "bombs per year", "single bomb", "insight","about"];

    for (let i = 0; i < items.length; i++) {
      let y = 170 + i * 30;
      let label = items[i];

      let hovering =
        p.mouseX > menuX && p.mouseX < menuX + menuW &&
        p.mouseY > y - 5 && p.mouseY < y + 20;

      if (hovering) {
        p.fill(0, 255, 255);
        p.textStyle(p.ITALIC);
      } else {
        p.fill(220);
        p.textStyle(p.NORMAL);
      }

      p.text(label, menuX + 40, y);
    }
  }

  p.mousePressed = function() {
    let d = p.dist(p.mouseX, p.mouseY, btnX + btnSize/2, btnY + btnSize/2);
    if (d < btnSize/2) pressed = true;
  };

  p.mouseReleased = function() {

    let d = p.dist(p.mouseX, p.mouseY, btnX + btnSize/2, btnY + btnSize/2);
    if (pressed && d < btnSize/2) {
      menuOpen = !menuOpen;
      menuTargetX = menuOpen ? 0 : -menuW;
      pressed = false;
      return;
    }
    pressed = false;

    let titleHover =
      p.mouseX > menuX + 40 && p.mouseX < menuX + 160 &&
      p.mouseY > 120 && p.mouseY < 150;

    if (menuOpen && titleHover) {
      window.location.href = "index.html";
      return;
    }

    let items = ["overview", "bombs per year", "single bomb", "insight","about"];

    for (let i = 0; i < items.length; i++) {
      let y = 170 + i * 30;
      let label = items[i];

      let hovering =
        p.mouseX > menuX && p.mouseX < menuX + menuW &&
        p.mouseY > y - 5 && p.mouseY < y + 20;

      if (menuOpen && hovering) {

        // -------------------------
        // FIX DEFINITIVO "overview"
        // -------------------------
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

        window.location.href = menuLinks[label];
        return;
      }
    }

    if (menuOpen && p.mouseX > menuW) {
      menuOpen = false;
      menuTargetX = -menuW;
    }
  };

};

new p5(menuSketch);
