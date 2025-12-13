let menuSketch = function (p) {

  let btnSize = 60;
  let btnX = 25;
  let btnY = 25;
  let btnScale = 1;

  let hoverButton = false;

  let menuOpen = false;
  let menuX;
  let menuTargetX;
  let menuW = 220;

  let font;

  const menuLinks = {
    "NUCLEAR": "index.html",
    "overview": "index.html#page2",
    "bombs per year": "year.html",
    "insight": "insight.html",
    "about": "about.html"
  };

  const items = ["overview", "bombs per year", "insight", "about"];

  p.preload = function () {
    font = p.loadFont("fonts/LibreFranklin-Regular.otf");
  };

  p.setup = function () {
    let cnv = p.createCanvas(500, 350);
    cnv.position(0, 0);
    cnv.style("pointer-events", "none");
    cnv.style("position", "fixed");
    cnv.style("z-index", "9999");

    menuX = -menuW;
    menuTargetX = -menuW;

    p.textFont(font);
    p.textSize(14);
  };

  p.draw = function () {
    p.clear();
    checkMenuLogic();
    menuX = p.lerp(menuX, menuTargetX, 0.2);

    drawSideMenu();
    drawButton();
    drawTitleOutside();
  };

  function checkMenuLogic() {

    let distToButton = p.dist(
      p.mouseX,
      p.mouseY,
      btnX + btnSize / 2,
      btnY + btnSize / 2
    );

    // hover bott
    hoverButton = distToButton < btnSize / 2 || menuOpen;

    if (distToButton < btnSize / 2) {
      menuOpen = true;
      menuTargetX = 0;
    }

    let insideMenu =
      p.mouseX >= menuX && p.mouseX <= menuX + menuW &&
      p.mouseY >= 0 && p.mouseY <= p.height;

    if (menuOpen && !insideMenu && distToButton >= btnSize / 2) {
      menuOpen = false;
      menuTargetX = -menuW;
    }
  }

  function drawTitleOutside() {
    p.textFont(font);
    p.textSize(14);

    let title = "NUCLEAR EXPLOSIONS ARCHIVE";
    let x = btnX + btnSize;
    let y = btnY + 35;

    let hover =
      p.mouseX >= x &&
      p.mouseX <= x + p.textWidth(title) &&
      p.mouseY >= y - 5 &&
      p.mouseY <= y + 20;

    p.fill(hover ? p.color(0, 255, 255) : 255);
    p.text(title, x, y);
  }


  // bottone
  function drawButton() {

    let targetScale = hoverButton ? 1.15 : 1.0;
    btnScale = p.lerp(btnScale, targetScale, 0.15);

    p.push();
    p.translate(btnX + btnSize / 2, btnY + btnSize / 2);
    p.scale(btnScale);

    p.stroke(255);
    p.strokeWeight(1);
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

    p.fill(255);
    p.noStroke();
    p.ellipse(0, 0, 5);

    p.pop();
  }

  function drawSideMenu() {

    if (!menuOpen && menuX <= -menuW + 1) return;

    p.fill(0, 0, 0, 0);
    p.noStroke();
    p.rect(menuX, 0, menuW, p.height);

    p.textFont(font);
    p.textSize(14);

    for (let i = 0; i < items.length; i++) {

      let label = items[i];
      let y = 120 + i * 28;

      // voci menu
      let x = menuX + 38;

      let w = p.textWidth(label);
      let h = 18;

      let hovering =
        p.mouseX >= x &&
        p.mouseX <= x + w &&
        p.mouseY >= y &&
        p.mouseY <= y + h;

      p.fill(hovering ? p.color(0, 255, 255) : 220);

      p.text(label, x, y);
    }
  }

  p.mouseReleased = function () {

    let title = "NUCLEAR EXPLOSIONS ARCHIVE";
    let x = btnX + btnSize;
    let y = btnY + 35;

    if (
      p.mouseX >= x &&
      p.mouseX <= x + p.textWidth(title) &&
      p.mouseY >= y - 5 &&
      p.mouseY <= y + 20
    ) {
      window.location.href = "index.html";
      return;
    }

    if (!menuOpen) return;

    for (let i = 0; i < items.length; i++) {

      let label = items[i];
      let y = 120 + i * 28;
      let x = menuX + 38;
      let w = p.textWidth(label);
      let h = 18;

      let hovering =
        p.mouseX >= x &&
        p.mouseX <= x + w &&
        p.mouseY >= y &&
        p.mouseY <= y + h;

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

        window.location.href = menuLinks[label];
        return;
      }
    }
  };
};

new p5(menuSketch);
