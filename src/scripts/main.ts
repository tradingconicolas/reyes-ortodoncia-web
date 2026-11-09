import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll(s)) as T[];
const html = document.documentElement;
const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
// El visitante manda: "off" pausa todo; "on" activa las animaciones aunque el sistema pida reducir movimiento.
const motionAllowed = () => html.dataset.motion !== "off" && (!reduceQuery.matches || html.dataset.motion === "on");
ScrollTrigger.config({ ignoreMobileResize: true });

/* ═════════ Pantalla de carga con el logo ═════════ */
let loaderDone = false;
function finishLoader() {
  loaderDone = true;
  html.classList.add("loaded");
  html.classList.remove("loading");
  $("#loader")?.remove();
}

function runLoader(onDone: () => void) {
  const loader = $("#loader");
  if (!loader || !motionAllowed()) { finishLoader(); onDone(); return; }
  const mark = $(".loader-mark", loader)!;
  const shine = $(".shine", loader)!;
  const bar = $(".loader-line i", loader)!;
  const tag = $(".loader-tag", loader)!;
  // listo cuando el video del inicio puede reproducirse (o a los 4 s como máximo)
  const hv = $<HTMLVideoElement>("#heroVideo");
  let loaded = !hv || hv.readyState >= 3;
  if (!loaded) {
    hv!.addEventListener("canplay", () => (loaded = true), { once: true });
    setTimeout(() => (loaded = true), 4000);
  }

  const tl = gsap.timeline();
  tl.from(mark, { opacity: 0, scale: 0.9, duration: 1, ease: "power3.out" }, 0)
    .from(tag, { opacity: 0, y: 8, duration: 0.8 }, 0.3)
    .to(bar, { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0.2)
    .fromTo(shine, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 1.5, ease: "power2.inOut" }, 0.6);
  // espera a que termine la carga y la animación mínima
  tl.eventCallback("onComplete", () => {
    const go = () => {
      gsap.timeline({ onComplete: () => { finishLoader(); } })
        .to(mark, { y: -24, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
        .to([bar.parentElement, tag], { opacity: 0, duration: 0.3 }, 0)
        .add(() => onDone(), 0.35)
        .to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, 0.3);
    };
    if (loaded) go();
    else { const t = setInterval(() => { if (loaded) { clearInterval(t); go(); } }, 120); }
  });
}

/* ═════════ Movimiento: Lenis + GSAP + ScrollTrigger (un solo reloj, con limpieza) ═════════ */
let lenis: Lenis | null = null;
let unmountMotion: (() => void) | null = null;
let introPlayed = false;

function heroIntro() {
  if (introPlayed) return;
  introPlayed = true;
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from("[data-hero=line]", { yPercent: 115, duration: 1.3, stagger: 0.14, ease: "power4.out" }, 0)
    .from("[data-hero=fade]", { y: 26, opacity: 0, duration: 1, stagger: 0.12 }, 0.5);
}

function mountMotion() {
  if (unmountMotion) return;
  const cleanups: (() => void)[] = [];

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  cleanups.push(() => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; });

  if (!loaderDone) lenis.stop();
  runLoader(() => { lenis?.start(); heroIntro(); });

  /* video del hero: se atenúa al reiniciar el ciclo para que no se note el salto */
  const hv = $<HTMLVideoElement>("#heroVideo");
  if (hv) {
    const onTime = () => {
      if (!hv.duration) return;
      const left = hv.duration - hv.currentTime;
      hv.style.opacity = left < 0.7 ? String(Math.max(0.15, left / 0.7)) : "1";
    };
    hv.addEventListener("timeupdate", onTime);
    hv.play().catch(() => {});
    cleanups.push(() => { hv.removeEventListener("timeupdate", onTime); hv.style.opacity = "1"; });
  }

  const ctx = gsap.context(() => {
    gsap.to(".hero-media video", { scale: 1.12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-in", { y: -80, opacity: 0.1, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 30%", scrub: true } });

    /* texto de la meta: se llena palabra por palabra al bajar */
    const rt = $("#revealText");
    if (rt && !rt.dataset.split) {
      rt.dataset.split = "1";
      const words = (rt.textContent || "").trim().split(/\s+/);
      rt.setAttribute("aria-label", words.join(" "));
      rt.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w} </span>`).join("");
    }
    const ws = $$(".reveal-text .w");
    if (ws.length) {
      gsap.fromTo(ws, { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "#revealText", start: "top 78%", end: "bottom 50%", scrub: true } });
    }
    gsap.fromTo(".intro-img img", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".intro", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo("#outroBg", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".outro-hero", start: "top bottom", end: "bottom top", scrub: true } });

    $$("[data-reveal]").forEach((el) => {
      gsap.from(el, { y: 56, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });

    const baRange = $<HTMLInputElement>("#baRange");
    const ba = $("#ba");
    if (baRange && ba) {
      const o = { v: 94 };
      ScrollTrigger.create({
        trigger: ba, start: "top 80%", once: true,
        onEnter: () => gsap.to(o, { v: 50, duration: 1.8, ease: "power3.inOut", onUpdate: () => { baRange.value = String(o.v); ba.style.setProperty("--pos", o.v + "%"); } }),
      });
    }
  });
  cleanups.push(() => ctx.revert());

  const mm = gsap.matchMedia();

  /* Tratamientos: paneles fijados que cambian de imagen al bajar (escritorio y celular) */
  mm.add("(min-width: 1px)", () => {
    const stage = $("#svcStage")!;
    const panels = $$(".svc-panel", stage);
    const idx = $$(".svc-index span", stage);
    let cur = 0;
    stage.classList.add("is-pinned");
    const set = (i: number) => {
      if (i === cur) return;
      panels.forEach((p, k) => p.classList.toggle("is-active", k === i));
      idx.forEach((s, k) => s.classList.toggle("on", k === i));
      cur = i;
    };
    const st = ScrollTrigger.create({
      trigger: stage, start: "top top", end: () => "+=" + window.innerHeight * panels.length * 0.9, pin: true, anticipatePin: 1,
      onUpdate: (self) => set(Math.min(panels.length - 1, Math.floor(self.progress * panels.length))),
    });
    return () => { st.kill(); stage.classList.remove("is-pinned"); panels.forEach((p, k) => p.classList.toggle("is-active", k === 0)); };
  });

  /* Proceso: el video del alambre avanza con el scroll y los pasos cambian */
  const pv = $<HTMLVideoElement>("#procVideo");
  const steps = $$(".step");
  const nums = $$("#procNum b");
  const setStep = (() => {
    let cur = -1;
    return (i: number) => {
      if (i === cur) return;
      steps.forEach((s, k) => s.classList.toggle("on", k === i));
      nums.forEach((n, k) => { n.className = k === i ? "" : k < i ? "out-up" : "out-down"; });
      cur = i;
    };
  })();
  mm.add("(min-width: 1px)", () => {
    const bar = $("#procBar");
    const pst = $("#procStage")!;
    pst.classList.add("is-pinned");
    setStep(0);
    if (pv) {
      // iOS no carga el video hasta que se reproduce una vez: se "despierta" y se pausa
      pv.loop = false;
      pv.play().then(() => { pv.pause(); pv.currentTime = 0; }).catch(() => { pv.pause(); });
    }
    let target = 0;
    let shown = 0;
    const seek = () => {
      if (!pv || !pv.duration) return;
      shown += (target - shown) * 0.2;
      if (Math.abs(target - shown) > 0.001) pv.currentTime = shown * (pv.duration - 0.05);
    };
    gsap.ticker.add(seek);
    const st = ScrollTrigger.create({
      trigger: "#procStage", start: "top top", end: () => "+=" + Math.round(window.innerHeight * 3.2), pin: true, anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        target = p;
        setStep(Math.min(steps.length - 1, Math.floor(p * steps.length)));
        if (bar) gsap.set(bar, { scaleX: p });
      },
    });
    return () => { gsap.ticker.remove(seek); st.kill(); pst.classList.remove("is-pinned"); };
  });
  cleanups.push(() => mm.revert());

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  unmountMotion = () => {
    cleanups.reverse().forEach((fn) => fn());
    unmountMotion = null;
    ScrollTrigger.getAll().forEach((t) => t.kill());
    // sin movimiento: todo visible y en su sitio
    steps.forEach((s) => s.classList.add("on"));
    if (pv) { pv.pause(); pv.currentTime = 0; }
  };
}

function syncMotion() {
  if (motionAllowed()) mountMotion();
  else { unmountMotion?.(); if (!loaderDone) finishLoader(); $<HTMLVideoElement>("#heroVideo")?.pause(); }
}

/* ═════════ Cabecera, menú, navegación ═════════ */
function initChrome() {
  const header = $("#top")!;
  const bar = $("#progress")!;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const btn = $("#menuBtn")!;
  const nav = $("#nav")!;
  const setMenu = (open: boolean) => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); btn.focus(); } });

  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!;
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    setMenu(false);
    if (lenis) { e.preventDefault(); lenis.scrollTo(target, { offset: -60, duration: 1.6 }); history.replaceState(null, "", id); }
  });

  const links = $$<HTMLAnchorElement>('.nav a[href^="#"]:not(.btn)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle("on", l.getAttribute("href") === "#" + en.target.id));
      else links.forEach((l) => { if (l.getAttribute("href") === "#" + en.target.id) l.classList.remove("on"); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")!); if (s) io.observe(s); });
}

/* ═════════ Caso destacado: antes/después, plan y esquema dental ═════════ */
function initFeatured() {
  const ba = $("#ba");
  const range = $<HTMLInputElement>("#baRange");
  range?.addEventListener("input", () => ba?.style.setProperty("--pos", range.value + "%"));

  const tabs = $$<HTMLButtonElement>("#plan button");
  const odo = $("#odo");
  const stepLabel = $("#odoStep");
  const apply = (i: number) => {
    tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    if (!odo) return;
    $$(".tooth, .fdi, .xmark", odo).forEach((el) => el.classList.remove("hi", "pend", "x", "show"));
    const t = tabs[i];
    const teeth = (t.dataset.teeth || "").split(",").filter(Boolean);
    const mark = (t.dataset.mark || "").split(",").filter(Boolean);
    const pend = !!t.dataset.pend;
    teeth.forEach((n) => {
      const g = $(`[data-fdi="${n}"]`, odo);
      if (!g) return;
      const isMark = mark.includes(n);
      $(".tooth", g)?.classList.add(isMark ? "x" : "hi");
      if (pend && !isMark) $(".tooth", g)?.classList.add("pend");
      $(".fdi", g)?.classList.add(isMark ? "x" : "hi");
      if (isMark) $(".xmark", g)?.classList.add("show");
    });
    if (stepLabel) stepLabel.textContent = pend ? "Falta" : "Paso " + (i + 1);
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => apply(i));
    t.addEventListener("keydown", (e) => {
      let n = -1;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (n >= 0) { e.preventDefault(); tabs[n].focus(); apply(n); }
    });
  });
  apply(0);

  $("#featPlay")?.addEventListener("click", () => {
    const wrap = $("#featPlay")!.parentElement!;
    const v = document.createElement("video");
    v.src = "/casos/destacado.mp4";
    v.controls = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute("aria-label", "Video del caso explicado");
    wrap.replaceChildren(v);
    v.focus();
  });
}

/* ═════════ Galería de casos: filtros y video en ventana ═════════ */
function initCases() {
  const cards = $$<HTMLButtonElement>("#grid .card");
  const filters = $$<HTMLButtonElement>("#filters button");
  filters.forEach((b) => b.addEventListener("click", () => {
    filters.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const f = b.dataset.f!;
    const shown: HTMLElement[] = [];
    cards.forEach((c) => {
      const ok = f === "todos" || (c.dataset.tags || "").split(" ").includes(f);
      c.hidden = !ok;
      if (ok) shown.push(c);
    });
    if (motionAllowed()) gsap.from(shown, { y: 24, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", clearProps: "all" });
    ScrollTrigger.refresh();
  }));

  const modal = $<HTMLDialogElement>("#modal")!;
  const video = $<HTMLVideoElement>("#mVideo")!;
  const close = () => modal.close();
  cards.forEach((c) => c.addEventListener("click", () => {
    video.poster = `/casos/${c.dataset.id}.jpg`;
    video.src = `/casos/${c.dataset.id}.mp4`;
    $("#mTitle")!.textContent = c.dataset.title || "";
    $("#mSum")!.textContent = c.dataset.sum || "";
    modal.showModal();
    video.play().catch(() => {});
  }));
  $("#mClose")!.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  modal.addEventListener("close", () => { video.pause(); video.removeAttribute("src"); video.load(); });
  $("#mCta")!.addEventListener("click", () => close());
}

/* ═════════ Reserva: día + horario → mensaje de WhatsApp ═════════ */
function initBooking() {
  const form = $<HTMLFormElement>("#bookForm");
  if (!form) return;
  const days = (form.dataset.days || "").split(",").map(Number);
  const slots = (form.dataset.slots || "").split("|").filter(Boolean);
  const wa = form.dataset.wa || "";
  const dayBox = $("#days")!, slotBox = $("#slots")!, summary = $("#summary")!;
  const fmtD = new Intl.DateTimeFormat("es-PE", { weekday: "short" });
  const fmtM = new Intl.DateTimeFormat("es-PE", { month: "short" });
  const fmtLong = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" });
  let day: Date | null = null;
  let slot = "";

  const render = () => {
    const d = day ? `<b>${fmtLong.format(day)}</b>` : "un día";
    const s = slot ? `<b>${slot}</b>` : "un horario";
    summary.innerHTML = day && slot ? `Preferencia: ${d} a las ${s}.` : `Elige ${day ? "" : "un día"}${!day && !slot ? " y " : ""}${slot ? "" : "un horario"}.`;
  };

  const start = new Date(); start.setHours(0, 0, 0, 0);
  let added = 0;
  for (let i = 1; i < 21 && added < 10; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    if (!days.includes(d.getDay())) continue;
    added++;
    const b = document.createElement("button");
    b.type = "button"; b.className = "day"; b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<small>${fmtD.format(d).replace(".", "")}</small><b>${d.getDate()}</b><em>${fmtM.format(d).replace(".", "")}</em>`;
    b.setAttribute("aria-label", fmtLong.format(d));
    b.addEventListener("click", () => { day = d; $$("button", dayBox).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); render(); });
    dayBox.appendChild(b);
  }
  slots.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "slot"; b.textContent = s; b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => { slot = s; $$("button", slotBox).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); render(); });
    slotBox.appendChild(b);
  });
  render();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = ($<HTMLInputElement>("#fn")!.value || "").trim().slice(0, 80);
    const tel = ($<HTMLInputElement>("#fp")!.value || "").trim();
    const motivo = $<HTMLSelectElement>("#fm")!.value;
    const digits = tel.replace(/\D/g, "");
    $("#en")!.textContent = nombre.length < 2 ? "Escribe tu nombre." : "";
    $("#ep")!.textContent = digits.length < 9 || digits.length > 15 ? "Escribe un celular válido (9 dígitos)." : "";
    if (nombre.length < 2 || digits.length < 9 || digits.length > 15) { (nombre.length < 2 ? $("#fn") : $("#fp"))!.focus(); return; }
    if (!day || !slot) { summary.innerHTML = "<b>Falta elegir día y horario.</b>"; return; }
    const msg = `Hola, soy ${nombre}. Quiero agendar: ${motivo}. Prefiero el ${fmtLong.format(day)} a las ${slot}. Mi celular: ${tel}.`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  const tCal = $("#tabCal"), tWa = $("#tabWa"), pCal = $("#panCal");
  if (tCal && tWa && pCal) {
    const sel = (cal: boolean) => {
      tCal.setAttribute("aria-selected", String(cal)); tWa.setAttribute("aria-selected", String(!cal));
      pCal.hidden = !cal; form.hidden = cal;
    };
    tCal.addEventListener("click", () => sel(true));
    tWa.addEventListener("click", () => sel(false));
  }
}

/* ═════════ Pausa manual de animaciones ═════════ */
function initPause() {
  const btn = $("#pauseBtn")!;
  const save = (v: string | null) => { try { v ? localStorage.setItem("motion", v) : localStorage.removeItem("motion"); } catch (e) {} };
  const label = () => {
    const on = motionAllowed();
    btn.setAttribute("aria-pressed", String(!on));
    btn.textContent = on ? "Pausar animaciones" : reduceQuery.matches && html.dataset.motion !== "off" ? "Activar animaciones (tu dispositivo pide menos movimiento)" : "Reanudar animaciones";
  };
  btn.addEventListener("click", () => {
    if (motionAllowed()) { html.dataset.motion = "off"; save("off"); }
    else if (reduceQuery.matches) { html.dataset.motion = "on"; save("on"); introPlayed = true; }
    else { delete html.dataset.motion; save(null); introPlayed = true; }
    syncMotion();
    label();
  });
  reduceQuery.addEventListener("change", () => { syncMotion(); label(); });
  label();
}

initChrome();
initFeatured();
initCases();
initBooking();
initPause();
syncMotion();
