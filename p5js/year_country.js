let table;
let data = [];
let particles2 = [];
let startYear = 1945;
let endYear = 1998;
let margin = 80;
let yAxis;

let myFont1, myFont2, myFont3;
let countryData = [];

let hoveredYear = null;
let hoveredParticle = null;

const UGTypes = ["UG","SHAFT","TUNNEL","GALLERY","MINE","SHAFT/GR","SHAFT/LG"];

// ===============================
// Preload
// ===============================
function preload() {
  myFont1 = loadFont("fonts/LexendZetta-Regular.ttf");
  myFont2 = loadFont("fonts/LibreFranklin-Regular.otf");
  myFont3 = loadFont("fonts/LoRes9PlusOTWide-Regular.ttf");

  table = loadTable("dataset/dataset-singleb.csv", "csv", "header");
}

// ===============================
// URL param
// ===============================
function getSelectedCountryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("country") || "USA";
}

// ===============================
// Setup
// ===============================
function setup() {
  createCanvas(windowWidth, windowHeight);
  yAxis = height / 2 + 70;

  selectedCountry = getSelectedCountryFromURL();

  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    //correzione PAKISTAN
    let cName = row.getString("country").trim().toUpperCase();
    if (cName === "PAKIST") cName = "PAKISTAN"; 
    data.push({
      // altri country 
      country: cName
    });

    data.push({
      id: i,
      year: row.getNum("year"),
      type: row.getString("type"),
      yield: row.getNum("yield_u"),
      country: row.getString("country")
    });
  }

  countryData = data.filter(d => d.country === selectedCountry);

  creaParticlesDaTabella();

  noLoop();
}

// ===============================
// Draw
// ===============================
function draw() {
  background(20);

  updateHover();

  // Titolo (标题)
  textFont(myFont1);
  textSize(20);
  fill(200);
  textAlign(CENTER, TOP);
  text("TOTAL AMOUNT OF " + selectedCountry.toUpperCase(), width / 2, 30);

  // Numero totale (总数)
  textFont(myFont3);
  textSize(60);
  fill(0, 255, 255);
  text(countryData.length, width / 2, 90);

  // Disegna particelle (绘制粒子)
  for (let p of particles2) {
    p.draw();
  }

  // --- AGGIUNTO: Visualizzazione quantità per anno (新增：显示每年数量) ---
  disegnaQuantitaPerAnno();

  // Asse anni (年份轴)
  disegnaAsseEAnni();

  // Legenda (图例)
  drawLegend();
}

// ===============================
// Hover detection
// ===============================
function updateHover() {
  hoveredYear = null;
  hoveredParticle = null;

  const yearStep = (width - 2 * margin) / (endYear - startYear);
  const hitX = yearStep * 0.45;
  const hitYTop = yAxis - 40;
  const hitYBottom = yAxis + 40;

  // Year hover
  for (let year = startYear; year <= endYear; year++) {
    let x = map(year, startYear, endYear, margin, width - margin) + 3;
    if (
      abs(mouseX - x) < hitX &&
      mouseY > hitYTop &&
      mouseY < hitYBottom
    ) {
      hoveredYear = year;
      cursor(HAND);
      return;
    }
  }

  // Particle hover
  for (let p of particles2) {
    if (dist(mouseX, mouseY, p.x, p.y) < p.r + 2) {
      hoveredParticle = p;
      hoveredYear = p.year;
      cursor(HAND);
      return;
    }
  }

  cursor(ARROW);
}

// ===============================
// Mouse move redraw
// ===============================
function mouseMoved() {
  redraw();
}

// ===============================
// Legend
// ===============================
function drawLegend() {
  let offsetX = margin - 8;
  let offsetY = height - margin - 80;

  textFont(myFont2);
  textSize(14);
  fill(200);
  textAlign(LEFT, TOP);
  text("YIELD (kt)", offsetX, offsetY - 40);

  const legend = [
    {range:"0-19", y:10},
    {range:"20", y:20},
    {range:"21-150", y:100},
    {range:"151-4999", y:1000},
    {range:"5000+", y:5000},
  ];

  let circleSize = 10;
  let lineSpacing = 20;

  legend.forEach((item,i)=>{
    fill(getYieldColor(item.y));
    let cx = offsetX + circleSize/2;
    let cy = offsetY + i*lineSpacing;
    circle(cx, cy, circleSize);

    fill(200);
    textAlign(LEFT,CENTER);
    text(item.range, cx+circleSize+5, cy);
  });

  textAlign(LEFT, TOP);
  text("ATMOSPHERIC", offsetX, margin+280);
  textAlign(LEFT, BOTTOM);
  text("UNDERGROUND", offsetX, offsetY-85);
}

// ===============================
// Particle class
// ===============================
class Particle2 {
  constructor(year, isUG, yieldVal, tx, ty, country) {
    this.year = year;
    this.isUG = isUG;
    this.yieldVal = yieldVal;
    this.x = tx;
    this.y = ty;
    this.country = country;
    
    // Color logic
    let baseCol = color(getYieldColor(yieldVal));

    if (country === selectedCountry) {
      this.col = baseCol;
    } else {
      // Desaturate and darken for other countries
      let darkCol = lerpColor(baseCol, color(20), 0.7); 
      darkCol.setAlpha(120); 
      this.col = darkCol;
    }

    this.r = 4;
}


  draw() {
    const isHover =
      hoveredParticle === this ||
      hoveredYear === this.year;

    noStroke();

    // if (isHover) {
    //   fill(255);
    //   circle(this.x, this.y, this.r * 2.1);
    // }

    fill(this.col);
    
    circle(this.x, this.y, isHover ? this.r * 1.4 : this.r);
  }
}

// ===============================
// Create particles
// ===============================
function creaParticlesDaTabella() {
  let cellSize = 5, gap = 1, cols = 2;
  let colWidth = cols * cellSize + (cols - 1) * gap;

  for (let year = startYear; year <= endYear; year++) {
    let x = map(year, startYear, endYear, margin, width - margin);

    let nonUG = data.filter(d => d.year === year && !UGTypes.includes(d.type));
    nonUG.sort((a,b)=>getColorLevel(a.yield)-getColorLevel(b.yield));

    nonUG.forEach((d,i)=>{
      let row = floor(i/cols);
      let col = i%cols;
      let cx = x - colWidth/2 + col*(cellSize+gap);
      let cy = yAxis - (row+6)*(cellSize+gap);
      particles2.push(new Particle2(year,false,d.yield,cx,cy,d.country));
    });

    let ug = data.filter(d => d.year === year && UGTypes.includes(d.type));
    ug.sort((a,b)=>getColorLevel(a.yield)-getColorLevel(b.yield));

    ug.forEach((d,i)=>{
      let row = floor(i/cols);
      let col = i%cols;
      let cx = x - colWidth/2 + col*(cellSize+gap);
      let cy = yAxis + (row+6)*(cellSize+gap);
      particles2.push(new Particle2(year,true,d.yield,cx,cy,d.country));
    });
  }
}

// ===============================
// Colors
// ===============================
function getYieldColor(y){
  if(y<=19) return "#fcddbfff";
  if(y===20) return "#FFB873";
  if(y<=150) return "#ff7a22ff";
  if(y<=4999) return "#f35601ff";
  return "#c21d00ff";
}

function getColorLevel(y){
  if(y<=19) return 0;
  if(y===20) return 1;
  if(y<=150) return 2;
  if(y<=4999) return 3;
  return 4;
}

// ===============================
// Year axis
// ===============================
function disegnaAsseEAnni(){
  textAlign(CENTER, TOP);
  noStroke();

  for(let year=startYear; year<=endYear; year++){
    let x = map(year,startYear,endYear,margin,width-margin)+3;

    push();
    translate(x+3,yAxis);
    rotate(HALF_PI);

    if (year === hoveredYear) {
      fill(255);
      textSize(14);
      scale(1.08);
    } else {
      fill(0, 255, 255, 120);
      textSize(12);
    }

    textFont(myFont2);
    text(year,0,0);
    pop();
  }
}

function mousePressed() {
  // particle click
  for (let p of particles2) {
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < p.r) {
      let targetYear = p.year;
      window.location.href = `year.html?year=${targetYear}`;
      break;
    }
  }

  // time axis year click
  for (let year = startYear; year <= endYear; year++) {
    let x = map(year, startYear, endYear, margin, width - margin) + 3;
    let y = yAxis;
    let tw = textWidth(year);
    let th = 12; // textSize

    let dx = mouseX - x;
    let dy = mouseY - y;
    let rx = dx * cos(-HALF_PI) - dy * sin(-HALF_PI);
    let ry = dx * sin(-HALF_PI) + dy * cos(-HALF_PI);

    if (rx >= -tw / 2 && rx <= tw / 2 && ry >= 0 && ry <= th) {
      window.location.href = `year.html?year=${year}`;
      break;
    }
  }
}


// ===============================
// Mostra la quantità del paese selezionato sopra l'intera colonna
// ===============================
function disegnaQuantitaPerAnno() {
  let cellSize = 5;
  let gap = 1;
  let cols = 2;

  textFont(myFont1);
  
  for (let year = startYear; year <= endYear; year++) {
    let countryTestsInYear = countryData.filter(d => d.year === year);
    let countToDisplay = countryTestsInYear.length;

    if (countToDisplay > 0) {
      let x = map(year, startYear, endYear, margin, width - margin) - 2;

      let allAtmInYear = data.filter(d => d.year === year && !UGTypes.includes(d.type));
      let allUgInYear = data.filter(d => d.year === year && UGTypes.includes(d.type));

      if (year === hoveredYear) {
        fill(255);      
        textSize(12);   
      } else {
        fill("#ff7a22ff"); 
        textSize(10);   
      }

      // at
      if (allAtmInYear.length > 0) {
        let totalAtmRows = ceil(allAtmInYear.length / cols);
        let yPosTop = yAxis - (totalAtmRows + 6) * (cellSize + gap) - 5;
        
        textAlign(CENTER, BOTTOM);
        text(countToDisplay, x, yPosTop);
      } 
      // un
      else if (allUgInYear.length > 0) {
        let totalUgRows = ceil(allUgInYear.length / cols);
        let yPosBottom = yAxis + (totalUgRows + 6) * (cellSize + gap) + 15;

        textAlign(CENTER, TOP);
        text(countToDisplay, x, yPosBottom);
      }
    }
  }
}
