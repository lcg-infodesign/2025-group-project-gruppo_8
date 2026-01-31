// p5js/aboutTabsNav.js
// One-page About: about.html?topic=dataset|project|us
(() => {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic") || "dataset";

  const content = {
    dataset: {
      //title: "About the Dataset",
      text: "The SIPRI–FOA dataset documents all known nuclear explosions from 1945 up to 1998, the year when India and Pakistan conducted their last declared nuclear tests. After the adoption of the CTBT, states relied on simulations.",
      ctas: [
        {
          label: "OPEN DATASET REPOSITORY",
          href: "https://github.com/data-is-plural/nuclear-explosions"
        },
        {
          label: "OPEN OFFICIAL REPORT (PDF)",
          href: "docs/sipri-report-original.pdf"
        }
      ]
    },

    project: {
      //title: "About the Project",
      text: "The dataset provides structured details for each nuclear test, including the responsible country, location, date, test type, explosive yield, and declared purpose. Test types have been grouped into atmospheric/surface and underground categories.",
      ctas: [
        {
          label: "OPEN PROJECT REPOSITORY",
          href: "https://github.com/lcg-infodesign/2025-group-project-gruppo_8"
        }
      ]
    },

    us: {
      //title: "About Us",
      text: "The SIPRI–FOA dataset documents all known nuclear explosions from 1945 up to 1998, the year when India and Pakistan conducted their last declared nuclear tests. After the adoption of the CTBT, states relied on simulations.",
      ctas: []
    }
  };

  const conf = content[topic] || content.dataset;

  // Active state tabs
  document.querySelectorAll(".about-tab").forEach(a => {
    a.classList.toggle("is-active", a.dataset.topic === topic);
    if (a.dataset.topic === topic) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  // Fill content
  const titleEl = document.querySelector(".about-title");
  const textEl = document.querySelector(".about-text");
  const ctaRow = document.querySelector(".about-cta-row");

  if (titleEl) titleEl.textContent = conf.title;
  if (textEl) textEl.textContent = conf.text;

  // Build CTAs
  if (ctaRow) {
    ctaRow.innerHTML = "";

    conf.ctas.forEach(cta => {
      const a = document.createElement("a");
      a.className = "cta-btn";
      a.href = cta.href;

      // apri in nuova tab SOLO se è un link esterno o un pdf
      const isExternal = /^https?:\/\//.test(cta.href);
      const isPdf = /\.pdf(\?|#|$)/i.test(cta.href);

      if (isExternal || isPdf) {
        a.target = "_blank";
        a.rel = "noopener";
      }

      a.innerHTML = `${cta.label}<span class="cta-arrow" aria-hidden="true">▶</span>`;
      ctaRow.appendChild(a);
    });
  }
})();

