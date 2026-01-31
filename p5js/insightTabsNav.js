
// - mette .is-active al tab corretto leggendo ?topic=...
// - replica la logica "scaleFactor = min(1, (width - PAD_X*2)/totalW)" 

(() => {
  const PAD_X = 28;

  const nav = document.getElementById("insightTabs");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll(".insight-tab"));

  function getTopic() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("topic") || "hiroshima";
  }

  function setActive() {
    const topic = getTopic();
    links.forEach(a => {
      const isActive = a.dataset.topic === topic;
      a.classList.toggle("is-active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function setScale() {
    // totalW = somma larghezze pill + GAP*(n-1)
    // in HTML è più affidabile usare scrollWidth (non viene influenzato da transform scale)
    const totalW = nav.scrollWidth;
    const availableW = Math.max(0, window.innerWidth - PAD_X * 2);
    const scale = totalW > 0 ? Math.min(1, availableW / totalW) : 1;

    nav.style.setProperty("--insight-tabs-scale", String(scale));
  }

  // prima attivazione (dopo layout)
  function init() {
    setActive();
    setScale();
  }

  // aspetta un frame: evita misure sbagliate al primo paint
  requestAnimationFrame(init);

  window.addEventListener("resize", () => {
    // resize = ricalcola scala
    setScale();
  });
})();
