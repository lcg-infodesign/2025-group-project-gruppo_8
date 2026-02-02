let topic;
let atoms = [];
let canvas;

// DATASET CONTENT 
const TEXT_MAIN = `
<p class="about-text">
The data is sourced from SIPRI, the Oklahoma Geological Survey, and the Natural Resources Defense Council,
and later consolidated into an open format via the Data Is Plural repository.
The original datasets were created as part of public and academic research initiatives,
supported by national and international public funding.
Each nuclear test is recorded with parameters such as location, date, country, test type, and yield.
</p>
`;

const TEXT_REVIEW = `
<p class="about-text" style="margin-top:2.5rem">
During our review of the original dataset, we identified several inconsistencies and errors.
These issues were corrected to ensure the accuracy of the data.
In addition, certain adjustments were made to improve its usability and visualization.
</p>
`;

const CTA_PRIMARY = [
  { label: "OPEN DATASET REPOSITORY", href: "https://github.com/data-is-plural/nuclear-explosions" },
  { label: "OPEN OFFICIAL REPORT (PDF)", href: "docs/sipri-report-original.pdf" }
];

const CTA_SECONDARY = [
  { label: "OPEN MODIFIED DATASET", href: "https://github.com/GiovanniPalladino/nuclear-explosions-modified" }
];

// NAMES
const ATOM_INFO = [
  { name: "Silvia La Mastra", role: "Project Manager\nUX/UI Designer\nResearcher" },
  { name: "Giovanni Palladino", role: "Front-end Developer\nVisual Designer\nData Editor" },
  { name: "Siyu Yang", role: "Front-end Developer\nVisual Designer\nData Editor" },
  { name: "Fang Ding", role: "Front-end Developer\nUX/UI Designer" },
  { name: "Giulia Yoko Felton", role: "UI Designer\nCopywriter" },
  { name: "Giorgia Milani", role: "Copywriter" },
  { name: "Ziying Shao", role: "Front-end Developer" }
];



function setup() {
  const params = new URLSearchParams(window.location.search);
  topic = params.get("topic") || "dataset";

  canvas = createCanvas(900, 600);
  canvas.parent("about-us-canvas");
  canvas.style("pointer-events", "none");

  updateTabs();
  buildPage();

  // click
  selectAll(".about-tab").forEach(tab => {
    tab.mousePressed(e => {
      e.preventDefault();
      topic = tab.attribute("data-topic");
      updateTabs();
      buildPage();
    });
  });
}


function updateTabs() {
  selectAll(".about-tab").forEach(tab => {
    const tabTopic = tab.attribute("data-topic");
    if (tabTopic === topic) {
      tab.addClass("is-active");
    } else {
      tab.removeClass("is-active");
    }
  });
}

function buildPage() {
  select(".about-title").html("");
  select(".about-text-wrap").html("");
  select(".review-text").html("");
  select(".primary-cta").html("");
  select(".secondary-cta").html("");

  if (topic === "dataset") {
    // hide canvas
    select("#about-us-canvas").hide();

    // fill Dataset content
    select(".about-text-wrap").html(TEXT_MAIN);
    buildCTAs(".primary-cta", CTA_PRIMARY);
    select(".review-text").html(TEXT_REVIEW);
    buildCTAs(".secondary-cta", CTA_SECONDARY);
  }
  else if (topic === "us") {
    // show canvas
    select("#about-us-canvas").show();
    initAtoms();
  }
  setTimeout(adjustAboutHeight, 50);

}

function buildCTAs(selector, ctas) {
  const row = select(selector);
  ctas.forEach(cta => {
    const a = createA(cta.href, "");
    a.parent(row);
    a.addClass("cta-btn");
    a.attribute("target", "_blank");
    a.attribute("rel", "noopener");
    a.html(`${cta.label}<span class="cta-arrow">▶</span>`);
  });
}

function initAtoms() {
  canvas = createCanvas(900, 600);
  canvas.parent("about-us-canvas");
  canvas.style("pointer-events", "none");
  clear();
  atoms = [];

  // first line atoms
  for (let i = 0; i < 4; i++) {
    let x = map(i, 0, 3, 100, width - 100); 
    atoms.push(new AtomicModel(x, 150, i));  
  }

  // second line atoms
  let secondRowIndices = [4, 5, 6];
  for (let i = 0; i < 3; i++) {
    let x = map(i, 0, 2, 200, width - 200); 
    atoms.push(new AtomicModel(x, 420, secondRowIndices[i]));
  }
}

function draw() {
  if (topic !== "us") return;

  clear();
  for (let atom of atoms) {
    atom.update();
    atom.display();
    drawNameAndRole(atom);
  }
}

// Name
function drawNameAndRole(atom) {
  push();

  textAlign(CENTER);
  textSize(20);
  fill(200);
  textFont('LibreFranklin');

  text(ATOM_INFO[atom.type].name, atom.pos.x, atom.pos.y + atom.r + 50);
  fill(200);
  textSize(16);
  text(ATOM_INFO[atom.type].role, atom.pos.x, atom.pos.y + atom.r + 90);
  pop();
}

class AtomicModel {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.type = type;
    this.angle = 0;
    this.baseColor = color(0, 255, 255);
    this.lineColor = color(0, 255, 255, 80);
    this.r = 40;
  }

  update() {
    this.angle += 0.03;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);

    stroke(this.lineColor);
    strokeWeight(1.5);
    noFill();

    fill(this.baseColor);
    noStroke();
    ellipse(0, 0, 10, 10);
    noFill();
    stroke(this.lineColor);

    switch (this.type) {

      case 0:
        stroke(0, 255, 255, 200);
        this.drawElectron(40, this.angle);
        this.drawElectron(40, -this.angle * 0.8);

        for (let step = 0; step < TWO_PI; step += PI / 10) {
          let jitter = noise(step, this.angle) * 2;
          point(
            (40 + jitter) * cos(step),
            (40 + jitter) * sin(step)
          );
        }
        break;

      case 1: 
        for (let i = 0; i < 3; i++) {
          let r = 30 + i * 20;
          let speedMult = (i % 2 === 0) ? 1 : -0.6;
          ellipse(0, 0, r, r);
          this.drawElectron(r / 2, this.angle * speedMult + i);
        }
        break;

      case 2: 
        ellipse(0, 0, 80, 80);
        this.drawElectron(40, this.angle);
        for (let i = 0; i < 2; i++) {
          push();
          rotate(i * PI / 2 + this.angle * 0.5);
          ellipse(0, 0, 30, 80);
          this.drawElectronEllipse(15, 40, this.angle * 2);
          pop();
        }
        break;

      case 3:
        stroke(0, 255, 255, 200);
        strokeWeight(2);
        noFill();
        let rings = 3;
        for (let i = 0; i < rings; i++) {
          let r = 20 + i * 10 + sin(this.angle * (0.5 + i * 0.3)) * 5;
          stroke(0, 255, 255, 150 - i * 40);
          for (let step = 0; step < TWO_PI; step += PI / 15) {
            let jitter = noise(step, this.angle) * 2;
            point(
              (r + jitter) * cos(step),
              (r + jitter) * sin(step)
            );
          }
        }

        fill(this.baseColor);
        noStroke();
        ellipse(0, 0, 10, 10);
        break;

      case 4:
        stroke(0, 255, 255, 80);
        strokeWeight(1.5);
        noFill();
        ellipse(0, 0, 80, 80); 
        push();
        rotate(this.angle);
        ellipse(20, 0, 40, 40);
        fill(this.baseColor);
        noStroke();
        ellipse(40, 0, 5, 5);
        pop();
        break;

      case 5: 
        stroke(0, 255, 255, 200);
        for (let i = 0; i < 3; i++) {
          let r = 40 + i * 15;
          push();
          rotate(this.angle * (0.5 + i * 0.2));
          for (let step = 0; step < TWO_PI; step += PI / 8) {
            point(
              (r / 2) * cos(step),
              (r / 2) * sin(step)
            );
          }
          pop();
        }
        break;

      case 6: 
        let ellipseCount = 4; 
        let rx = 40; 
        let ry = 10; 
        for (let i = 0; i < ellipseCount; i++) {
          push();
          let initialAngle = i * TWO_PI / 8;
          rotate(this.angle + initialAngle);
          stroke(0, 255, 255, 150);
          noFill();
          ellipse(0, 0, rx * 2, ry * 2);
          pop();
        }
        fill(this.baseColor);
        noStroke();
        ellipse(0, 0, 10, 10);
        break;
    }

    pop();
  }
  drawElectron(r, a) {
    push();
    fill(this.baseColor); 
    noStroke();
    ellipse(r * cos(a), r * sin(a), 6, 6);
    pop();
  }

  drawElectronEllipse(rx, ry, a) {
    push();
    fill(this.baseColor); 
    noStroke();          
    ellipse(rx * cos(a), ry * sin(a), 6, 6);
    pop();
  }
}
//FOOTER AFTER WINDOW HEIGHT
function adjustAboutHeight() {
  const main = document.querySelector(".about-content");
  const footer = document.getElementById("about-footer");

  if (!main || !footer) return;
  main.style.minHeight = "auto";

  const viewportH = window.innerHeight;
  const mainRect = main.getBoundingClientRect();
  const footerRect = footer.getBoundingClientRect();
  const contentHeight = main.scrollHeight;

  if (contentHeight < viewportH) {
    main.style.minHeight = viewportH + "px";
  }
}

//load
window.addEventListener("load", adjustAboutHeight);

//resize
window.addEventListener("resize", adjustAboutHeight);
