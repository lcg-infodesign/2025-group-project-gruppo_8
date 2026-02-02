[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ScyD1Fym)

# Nuclear Bombs Archive
**Information Design (2025/26)** — Politecnico di Milano, Communication Design  
**Group Project — Gruppo 8**

**Live website:** https://lcg-infodesign.github.io/2025-group-project-gruppo_8/  

## Overview
**Nuclear Bombs Archive** is a web-based interactive data visualization project about documented nuclear test explosions from **1945 to 1998**.  
The experience is designed around three levels of exploration: a global timeline overview, a year-focused analysis, and a single-explosion inspection—supporting both pattern recognition and historical interpretation.

---

## Authors
- Fang Ding
- Felton Giulia Yoko
- La Mastra Silvia
- Milani Giorgia
- Palladino Giovanni
- Yang Siyu
- Ziying Shao

**Contact:** nuclearexplosionsarchive@gmail.com

---

## License
### Code & original design
© 2026 Gruppo 8 — Politecnico di Milano. **All rights reserved.**  
No reuse, redistribution, or modification of this website’s code and original visual design without written permission from the authors.

### Data
This project uses an upstream dataset that is MIT-licensed. Any derived datasets must preserve upstream attribution and licensing requirements.

- Upstream dataset repository: https://github.com/data-is-plural/nuclear-explosions (MIT License)
- Our cleaned/modified dataset repository: https://github.com/GiovanniPalladino/nuclear-explosions-modified

---

## Knowledge objectives

### Level 1 — Global overview (1945–1998)
- Understand the temporal evolution of nuclear tests.
- Understand the distribution and variation of explosion yield (power).
- Detect anomalies, peaks, and shifts in relation to historical context.


### Level 2 — Year-by-year analysis
- Compare states by number of tests and yield.
- Identify number of explosions and involved states.
- Distinguish test typologies (atmospheric vs underground) and their evolution over time.


### Level 3 — Single explosion
- Access detailed attributes of a single test (name, country, yield, type, purpose).
- Locate the explosion geographically.
- Evaluate yield by comparison with **Hiroshima** as a reference.


### Bonus level — Insights
- Interpret the data within historical and political context.

---

## Data & sources

### Dataset
This project is based on the dataset **“Nuclear Explosions 1945–1998”**, available as open data in:
https://github.com/data-is-plural/nuclear-explosions

As documented by the dataset repository, the data are compiled from specialized international sources and reports (e.g., SIPRI and geophysical catalogues), and include structured records for each test (date, country, yield, type, location, purpose).

### Fields used in the website
We used the following variables for the visualizations:
- `country`, `region`
- `latitude`, `longitude`
- `yield_u`
- `purpose`, `name`, `type`
- `year` and formatted date (`date_DMY`)
- `id`

---

## Data processing (our modifications)
To improve consistency and usability, we performed cleaning standardization and correction, including:

- **Yield:** missing values replaced with `0`
- **Dates:** converted `date_long` to EU format `DD/MM/YYYY` stored in `date_DMY`
- **Names:** empty `name` values replaced with `UNKNOWN`
- **Purpose:** missing values filled with `UNKNOWN`; corrected scan/transcription errors; standardized combined labels ordering
- **Type:** corrected inconsistencies (e.g., `WATER SU` → `WATERSUR`) and regrouped test modalities into two macro-categories:
  - `ATMOSPH` (atmospheric/surface-related)
  - `UG` (underground-related)

The cleaned and modified dataset is maintained here:
https://github.com/GiovanniPalladino/nuclear-explosions-modified

---

## Team contributions (organization)
**Shared early-stage work (Silvia La Mastra, Giovanni Palladino, Siyu Yang)**
- Project concept, site structure, information architecture
- Visual system and interaction direction (charts, UI components, animation approach)

**Giovanni Palladino**
- Core development (homepage, global chart, year visualization)
- Dataset editing/cleaning workflow
- Menu system, style consistency supervision
- Image research and visual treatment
- Text coherence review
- Debugging

**Siyu Yang**
- Initial development of homepage and general visualizzation 
- Initial visual design
- Development of single-bomb page + year page components
- p5.js animations and interactions
- Dataset edits and final polishing

**Silvia La Mastra**
- Wireframes (paper + digital) and Figma prototyping
- Development contributions (homepage + main chart)
- Usability and visual-detail refinement
- Knowledge objectives definition
- Research support and oral presentations

**Ding Fang**
- Early prototypes
- Single-explosion page work
- Final complete implementation of the Year page

**Giulia Yoko Felton**
- Text writing
- First implementation of the Insight page
- Completion of the About page
- Image research

**Giorgia Milani**
- Text writing
- Early draft of the Year page
- Functionality testing and feedback
- Support in small UI adjustments

**Ziying Shao**
- Insight page development
- First implementation of the About page
- Image research

---

## Design & engineering choices supporting the objectives
- **Timeline + histogram** enables Level 1 pattern reading (trends, intensity across decades).
- **Color encoding for yield** makes “power” interpretable at a glance at the overview scale.
- **Country filtering** supports comparisons and isolates national testing strategies (Level 1–2).
- **Scroll-based guidance (CTA)** supports discoverability and smooth onboarding.
- **Year view comparisons** support Level 2 tasks (who tested, how much, how powerful).
- **Single explosion inspection** supports Level 3 understanding (purpose/type/location + Hiroshima yield comparison).
- **p5.js** enables custom 2D interactive components and animation-driven transitions suited for narrative exploration.

---

## Tech stack
- HTML / CSS / JavaScript (static website)
- **p5.js** for interactive visuals and animations
- Data loaded from **CSV**
- Deployed via **GitHub Pages**

---

## AI tools disclosure
During development we used AI assistants (including **ChatGPT** and **Google Gemini**) to:
- clarify JavaScript / p5.js logic,
- support debugging and error fixing,
- assist small refactors and implementation checks.

All final design decisions, code integration, and data processing were performed and validated by the team.

## Images & media credits
Historical images were collected primarily from archival/editorial sources (e.g., **Magnum Photos**, and additional sources such as **Getty Images**) for educational purposes.  
Copyright remains with the original rights holders.

---

## Run locally
Because the project loads CSV files, it must be served from a local server (do not open as `file://`).

