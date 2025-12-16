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

  // link menu
  const menuLinks = {
    "home": "index.html",
    "overview": "index.html#page2",
    "bombs per year": "year.html",
    "insight": "insight.html",
    "about": "about.html"
  };

  // ora include home
  const items = ["home", "overview", "bombs per year", "insight", "about"];

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
      p.mouseX >= menuX && p.mouseX <= menuX + menuW &&
      p.mouseY >= 0 && p.mouseY <= p.height;

    if (menuOpen && !insideMenu && distToButton >= btnSize / 2) {
      menuOpen = false;
      menuTargetX = -menuW;
    }
  }

  // ---- BOTTONE ----
  function drawButton() {

    let targetScale = hoverButton ? 1.65 : 1.5;
    btnScale = p.lerp(btnScale, targetScale, 0.15);

    p.push();
    p.translate(btnX + btnSize / 2, btnY + btnSize / 2);
    p.scale(btnScale);

    // sfondo bianco trasparente
    p.noStroke();
    p.fill(hoverButton ? p.color(0, 255, 255, 0) : p.color(255, 255, 255, 10));
    p.ellipse(0, 0, 45, 45);

    // cerchi pulsante
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

    // punto centrale
    p.fill(hoverButton ? p.color(0, 255, 255) : 255);
    p.noStroke();
    p.ellipse(0, 0, 4);

    p.pop();
  }

  // ---- MENU LATERALE ----
  function drawSideMenu() {

    if (!menuOpen && menuX <= -menuW + 1) return;

    p.fill(0, 0, 0, 0);
    p.noStroke();
    p.rect(menuX, 0, menuW, p.height);

    p.textFont(font);
    p.textSize(14);

    for (let i = 0; i < items.length; i++) {

      let label = items[i];
      let y = 110 + i * 28;
      let x = menuX + 38;

      let displayLabel =
        label === "home" ? "NE ARCHIVE" : label;

      let w = p.textWidth(displayLabel);
      let h = 18;

      let hovering =
        p.mouseX >= x &&
        p.mouseX <= x + w &&
        p.mouseY >= y &&
        p.mouseY <= y + h;

      p.fill(hovering ? p.color(0, 255, 255) : 220);
      p.text(displayLabel, x, y);
    }
  }

  p.mouseReleased = function () {

    if (!menuOpen) return;

    for (let i = 0; i < items.length; i++) {

      let label = items[i];
      let y = 120 + i * 28;
      let x = menuX + 38;

      let displayLabel =
        label === "home" ? "NE ARCHIVE" : label;

      let w = p.textWidth(displayLabel);
      let h = 10;

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
