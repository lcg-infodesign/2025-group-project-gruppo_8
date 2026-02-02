let menuSketch = function (p) {

  let btnSize = 60;
  let btnX = 25;
  let btnY = 25;
  let btnScale = 1;

  let hoverButton = false;
  let hoverIcon = false;
  let hoverAnyItem = false;

  let menuOpen = false;
  let menuX;
  let menuTargetX;
  let menuW = 250;

  let font;

  const menuStartY = 110;
  const menuStepY = 28;
  const menuTextH = 18;

  let menuHoverTop = 0;
  let menuHoverBottom = 0;

  const menuLinks = {
    "home": "index.html",
    "overview": "index.html#page2",
    "bombs per year": "year.html",
    "insight": "insight.html?topic=hiroshima",
    "about": "about.html?topic=dataset",
  };

  const items = ["home", "overview", "bombs per year", "insight", "about"];

  const insightItems = [
    "Hiroshima & Nagasaki",
    "Moratorium 1958",
    "Test Ban Treaty 1963",
    "Test Ban Treaty 1996",
    "RDS-200"
  ];

  const insightLinks = {
    "Hiroshima & Nagasaki": "insight.html?topic=hiroshima",
    "Moratorium 1958": "insight.html?topic=moratoria58",
    "Test Ban Treaty 1963": "insight.html?topic=trattato63",
    "Test Ban Treaty 1996": "insight.html?topic=trattato96",
    "RDS-200": "insight.html?topic=tsarbomba"
  };

  const aboutItems = ["about the dataset", "about us"];
  const aboutLinks = {
    "about the dataset": "about.html?topic=dataset",
    "about us": "about.html?topic=us",
  };

  // submenu open state
  let insightSubOpen = false;
  let aboutSubOpen = false;

  // DOM clickable triangles
  let insightArrowBtn, aboutArrowBtn;

  const ON_INSIGHT_PAGE = window.location.pathname.includes("insight.html");

  let hitBoxes = [];

  p.preload = function () {
    font = p.loadFont("fonts/LibreFranklin-Regular.otf");
  };

  p.setup = function () {
    let cnv = p.createCanvas(520, window.innerHeight);
    cnv.position(0, 0);
    cnv.style("pointer-events", "none");
    cnv.style("position", "fixed");
    cnv.style("top", "0");
    cnv.style("left", "0");
    cnv.style("z-index", "9999");
    cnv.style("background-color", "transparent");

    menuX = -menuW;
    menuTargetX = -menuW;

    p.textFont(font);
    p.textSize(14);

    //arrow buttons
    insightArrowBtn = p.createDiv("");
    insightArrowBtn.style("position", "fixed");
    insightArrowBtn.style("width", "22px");
    insightArrowBtn.style("height", "22px");
    insightArrowBtn.style("display", "none");
    insightArrowBtn.style("z-index", "10000");
    insightArrowBtn.style("cursor", "pointer");
    insightArrowBtn.style("background", "transparent");
    insightArrowBtn.mousePressed(() => {
      insightSubOpen = !insightSubOpen;
    });

    aboutArrowBtn = p.createDiv("");
    aboutArrowBtn.style("position", "fixed");
    aboutArrowBtn.style("width", "22px");
    aboutArrowBtn.style("height", "22px");
    aboutArrowBtn.style("display", "none");
    aboutArrowBtn.style("z-index", "10000");
    aboutArrowBtn.style("cursor", "pointer");
    aboutArrowBtn.style("background", "transparent");
    aboutArrowBtn.mousePressed(() => {
      aboutSubOpen = !aboutSubOpen;
    });
  };

  p.windowResized = function () {
    p.resizeCanvas(520, window.innerHeight);
  };

  p.draw = function () {
    p.clear();

    checkMenuLogic();
    const isClosing = menuTargetX < menuX;
    const t = isClosing ? 0.08 : 0.22;
    menuX = p.lerp(menuX, menuTargetX, t);

    drawSideMenu();
    drawButton();

    document.body.classList.toggle("menu-pointer", hoverIcon || hoverAnyItem);
  };


  function checkMenuLogic() {
    let distToButton = p.dist(
      p.mouseX,
      p.mouseY,
      btnX + btnSize / 2,
      btnY + btnSize / 2
    );

    const hoverRadius = (btnSize / 2) * btnScale + 6;
    hoverIcon = distToButton < hoverRadius;
    hoverButton = hoverIcon || menuOpen;

    if (hoverIcon) {
      menuOpen = true;
      menuTargetX = 0;
    }

    const insidePanel =
      p.mouseX >= menuX &&
      p.mouseX <= menuX + menuW &&
      p.mouseY >= menuHoverTop &&
      p.mouseY <= menuHoverBottom;


    if (menuOpen && !hoverIcon && !hoverAnyItem && !insidePanel) {
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

    p.noStroke();
    p.fill(0, 0, 0, 0);
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
    hoverAnyItem = false;
    hitBoxes = [];

    if (!menuOpen && menuX <= -menuW + 1) {
      if (insightArrowBtn) insightArrowBtn.style("display", "none");
      if (aboutArrowBtn) aboutArrowBtn.style("display", "none");
      return;
    }

    p.textFont(font);
    p.textSize(14);

    let currentY = menuStartY;

    insightArrowBtn.style("display", "none");
    aboutArrowBtn.style("display", "none");

    const x = menuX + 38;
    const indent = 18;
    const arrowZone = 40;

    for (let i = 0; i < items.length; i++) {
      let label = items[i];
      let displayLabel = label === "home" ? "NE ARCHIVE" : label;

      let y = currentY;
      let w = p.textWidth(displayLabel);

      let hoveringText =
        p.mouseX >= x &&
        p.mouseX <= x + w + arrowZone &&
        p.mouseY >= y - menuTextH &&
        p.mouseY <= y;

      p.fill(hoveringText ? p.color(0, 255, 255) : 220);
      p.text(displayLabel, x, y);

      if (hoveringText) hoverAnyItem = true;

      hitBoxes.push({
        kind: "main",
        label,
        x,
        y,
        w,
        h: menuTextH,
        href: menuLinks[label],
      });

      if (label === "insight" && hoveringText) {
        const triX = x + w + 14;
        const triY = y - 4;

        p.push();
        p.noStroke();
        p.fill(180);
        p.triangle(triX - 6, triY - 4, triX + 6, triY - 4, triX, triY + 6);
        p.pop();

        const cnvRect = p.canvas.getBoundingClientRect();
        insightArrowBtn.style("left", `${cnvRect.left + triX - 11}px`);
        insightArrowBtn.style("top", `${cnvRect.top + triY - 11}px`);
        insightArrowBtn.style("display", "block");
        hoverAnyItem = true;
      }

      if (label === "about" && hoveringText) {
        const triX = x + w + 14;
        const triY = y - 4;

        p.push();
        p.noStroke();
        p.fill(180);
        p.triangle(triX - 6, triY - 4, triX + 6, triY - 4, triX, triY + 6);
        p.pop();

        const cnvRect = p.canvas.getBoundingClientRect();
        aboutArrowBtn.style("left", `${cnvRect.left + triX - 11}px`);
        aboutArrowBtn.style("top", `${cnvRect.top + triY - 11}px`);
        aboutArrowBtn.style("display", "block");
        hoverAnyItem = true;
      }

      currentY += menuStepY;

      if (label === "insight" && insightSubOpen && !ON_INSIGHT_PAGE) {
        for (let k = 0; k < insightItems.length; k++) {
          let subLabel = insightItems[k];
          let subY = currentY;
          let subW = p.textWidth(subLabel);

          let hovering =
            p.mouseX >= x + indent &&
            p.mouseX <= x + indent + subW &&
            p.mouseY >= subY - menuTextH &&
            p.mouseY <= subY;

          p.fill(hovering ? p.color(0, 255, 255) : 160);
          p.text(subLabel, x + indent, subY);

          hitBoxes.push({
            kind: "insightSub",
            label: subLabel,
            x: x + indent,
            y: subY,
            w: subW,
            h: menuTextH,
            href: insightLinks[subLabel],
          });

          if (hovering) hoverAnyItem = true;
          currentY += menuStepY;
        }
      }

      if (label === "about" && aboutSubOpen) {
        for (let k = 0; k < aboutItems.length; k++) {
          let subLabel = aboutItems[k];
          let subY = currentY;
          let subW = p.textWidth(subLabel);

          let hovering =
            p.mouseX >= x + indent &&
            p.mouseX <= x + indent + subW &&
            p.mouseY >= subY - menuTextH &&
            p.mouseY <= subY;

          p.fill(hovering ? p.color(0, 255, 255) : 160);
          p.text(subLabel, x + indent, subY);

          hitBoxes.push({
            kind: "aboutSub",
            label: subLabel,
            x: x + indent,
            y: subY,
            w: subW,
            h: menuTextH,
            href: aboutLinks[subLabel],
          });

          if (hovering) hoverAnyItem = true;
          currentY += menuStepY;
        }
      }
    }
    menuHoverTop = menuStartY - menuTextH;
    menuHoverBottom = currentY + 6;
  }

  p.mouseReleased = function () {
    if (!menuOpen) return;

    for (let i = 0; i < hitBoxes.length; i++) {
      const b = hitBoxes[i];

      const hovering =
        p.mouseX >= b.x &&
        p.mouseX <= b.x + b.w &&
        p.mouseY >= b.y - b.h &&
        p.mouseY <= b.y;

      if (!hovering) continue;

      if (b.kind === "main" && b.label === "overview") {
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

      window.location.href = b.href;
      return;
    }
  };
};

if (!window.menuCreated) {
  new p5(menuSketch);
  window.menuCreated = true;
}
