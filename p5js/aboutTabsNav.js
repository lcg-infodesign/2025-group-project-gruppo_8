let topic;
let atoms = [];
let canvas;

// ---------- DATASET CONTENT ----------

const TEXT_MAIN = `
<p class="about-text">
The data is sourced from SIPRI, the Oklahoma Geological Survey, and the Natural Resources Defense Council,
and later consolidated into an open format via the <em>Data Is Plural</em> repository.
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

// ---------- ATOM NAMES + ROLES ----------

const ATOM_INFO = [
  { name: "Silvia La Mastra", role: "Project Manager\nResearcher\nUX/UI Designer" },
  { name: "Giovanni Palladino", role: "Front-end Developer\nVisual Designer\nData Eeditor" },
  { name: "Siyu Yang", role: "Front-end Developer\nVisual Designer\nData Eeditor" },
  { name: "Fang Ding", role: "UX/UI Designer\nFront-end Developer" },
  { name: "Giulia Felton", role: "Copywriter\nUI Designer" },
  { name: "Giorgia Milani", role: "Copywriter" },
  { name: "ziying shao", role: "Front-end Developer" }
];

// ---------- SETUP ----------

function setup() {
  const params = new URLSearchParams(window.location.search);
  topic = params.get("topic") || "dataset";

  updateTabs();
  buildPage();

  if (topic === "us") initAtoms();
  else noCanvas();
}

// ---------- UI ----------

function updateTabs() {
  selectAll(".about-tab").forEach(tab => {
    const active = tab.attribute("data-topic") === topic;
    tab.toggleClass("is-active", active);
  });
}

function buildPage() {
  select(".about-title").html("");
  select(".about-text-wrap").html("");
  select(".review-text").html("");
  select(".primary-cta").html("");
  select(".secondary-cta").html("");
  select("#about-us-canvas").html("");

  if (topic === "dataset") {
    select(".about-title").html("About the Dataset");
    select(".about-text-wrap").html(TEXT_MAIN);
    buildCTAs(".primary-cta", CTA_PRIMARY);
    select(".review-text").html(TEXT_REVIEW);
    buildCTAs(".secondary-cta", CTA_SECONDARY);
  }
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

// ---------- ATOMS (ORIGINAL FULL VERSION) ----------

function initAtoms() {
  canvas = createCanvas(800, 450);
  canvas.parent("about-us-canvas");

  // fondo trasparente
  clear();
  canvas.style("background", "transparent");

  atoms = [];

  for (let i = 0; i < 4; i++) {
    let x = map(i, 0, 3, 150, width - 150);
    atoms.push(new AtomicModel(x, 120, i));
  }

  let secondRowIndices = [4, 5, 6];
  for (let i = 0; i < 3; i++) {
    let x = map(i, 0, 2, 220, width - 220);
    atoms.push(new AtomicModel(x, height - 120, secondRowIndices[i]));
  }
}

function draw() {
  if (topic !== "us") return;

  clear(); // sfondo trasparente
  for (let atom of atoms) {
    atom.update();
    atom.display();
    drawNameAndRole(atom);
  }
}

// ---------- NOME + RUOLO SOTTO L'ATOMO ----------

function drawNameAndRole(atom) {
  push();
  fill(0, 255, 255); // colore ciano
  textAlign(CENTER);
  textSize(14);

  text(ATOM_INFO[atom.type].name, atom.pos.x, atom.pos.y + atom.r + 25);

  textSize(12);
  text(ATOM_INFO[atom.type].role, atom.pos.x, atom.pos.y + atom.r + 45);
  pop();
}

// ---------- AtomicModel (IDENTICO AL TUO) ----------

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
        this.drawElectron(30, this.angle);
        this.drawElectron(30, -this.angle * 0.8);
        for (let s = 0; s < TWO_PI; s += PI / 10) {
          let j = noise(s, this.angle) * 2;
          point((30 + j) * cos(s), (30 + j) * sin(s));
        }
        break;

      case 1:
        for (let i = 0; i < 3; i++) {
          let r = 30 + i * 20;
          ellipse(0, 0, r, r);
          this.drawElectron(r / 2, this.angle + i);
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
        for (let i = 0; i < 3; i++) {
          let r = 20 + i * 10 + sin(this.angle) * 5;
          for (let s = 0; s < TWO_PI; s += PI / 15) {
            point((r) * cos(s), (r) * sin(s));
          }
        }
        break;

      case 4:
        ellipse(0, 0, 80, 80);
        push();
        rotate(this.angle);
        ellipse(20, 0, 40, 40);
        pop();
        break;

      case 5:
        ellipse(0, 0, 80, 80);
        push();
        rotate(this.angle);
        ellipse(20, 0, 40, 40);
        pop();
        break;

      case 6:
        for (let i = 0; i < 3; i++) {
          push();
          rotate(this.angle * (0.5 + i * 0.2));
          for (let s = 0; s < TWO_PI; s += PI / 8) {
            point(20 * cos(s), 20 * sin(s));
          }
          pop();
        }
        break;
    }
    pop();
  }

  drawElectron(r, a) {
    ellipse(r * cos(a), r * sin(a), 6, 6);
  }

  drawElectronEllipse(rx, ry, a) {
    ellipse(rx * cos(a), ry * sin(a), 6, 6);
  }
}
