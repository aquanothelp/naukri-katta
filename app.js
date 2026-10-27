/* Naukri Katta prototype — static, data-driven SPA (no build step). */
(() => {
  "use strict";

  const DATA_URL = "data/jobs.json";
  const DAY = 86400000;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  // ---------- i18n ----------
  const T = {
    en: {
      brand: "Naukri Katta", tagline: "Jobs · Results · Admit cards",
      demo: "Prototype — all notices below are sample data, not real recruitments.",
      footer: "Always verify details in the official notification before applying.",
      heroTitle: "Find your next government job", heroSub: "Latest recruitments across Maharashtra — updated daily.",
      searchPh: "Search post, department, district…", clear: "Clear",
      openJobs: "Open jobs", totalPosts: "Total posts", closingSoon: "Closing in 7 days",
      tabs: { job: "Jobs", result: "Results", admit: "Admit cards", answerkey: "Answer keys" },
      all: "All", district: "District", qualification: "Qualification", sort: "Sort by",
      sortLast: "Last date (soonest)", sortNew: "Newest first", sortPosts: "Most posts",
      openOnly: "Open only", showing: (n) => `${n} notice${n === 1 ? "" : "s"}`, reset: "Reset filters",
      posts: (n) => n ? `${n.toLocaleString("en-IN")} posts` : "Posts: see notice",
      daysLeft: (d) => `${d} days left`, lastDay: "Last day today", closed: "Closed", tomorrow: "Ends tomorrow",
      published: "Published", newTag: "NEW",
      emptyTitle: "No notices match", emptyBody: "Try a different word or clear the filters.",
      back: "Back", overview: "Overview", impDates: "Important dates", howApply: "How to apply",
      startDate: "Application starts", lastDate: "Last date", examDate: "Exam date",
      salary: "Pay scale", age: "Age limit", fee: "Fee", qual: "Qualification", loc: "Location",
      readNotice: "Official notification", applyNow: "Apply online", remind: "Add reminder", share: "Share",
      whatsapp: "Share on WhatsApp", save: "Save", saved: "Saved", related: "Similar notices",
      daysToGo: "days to apply", sampleLink: "Sample prototype: official links are not connected yet.",
      savedTitle: "Saved notices", savedEmpty: "Nothing saved yet. Tap the bookmark on any notice.",
      toastSaved: "Saved to your list", toastRemoved: "Removed from saved", toastCopied: "Link copied",
      toastIcs: "Reminder file downloaded — open it to add to your calendar",
      notFound: "This notice was not found.", loadErr: "Could not load notices. Please refresh.",
      cats: { police: "Police", bank: "Bank", railway: "Railway", defence: "Defence", teaching: "Teaching", health: "Health", municipal: "Municipal", transport: "Transport", engineering: "Engineering" },
      langBtn: "मराठी",
    },
    mr: {
      brand: "नोकरी कट्टा", tagline: "नोकरी · निकाल · प्रवेशपत्र",
      demo: "प्रोटोटाइप — खालील सर्व जाहिराती नमुना माहिती आहेत, खऱ्या भरती नाहीत.",
      footer: "अर्ज करण्यापूर्वी अधिकृत जाहिरातीतील माहिती नक्की तपासा.",
      heroTitle: "तुमची पुढची सरकारी नोकरी शोधा", heroSub: "महाराष्ट्रातील ताज्या भरती — दररोज अपडेट.",
      searchPh: "पद, विभाग, जिल्हा शोधा…", clear: "पुसा",
      openJobs: "सुरू भरती", totalPosts: "एकूण पदे", closingSoon: "7 दिवसांत बंद",
      tabs: { job: "नोकरी", result: "निकाल", admit: "प्रवेशपत्र", answerkey: "उत्तरतालिका" },
      all: "सर्व", district: "जिल्हा", qualification: "शिक्षण", sort: "क्रम",
      sortLast: "अंतिम तारीख (जवळची)", sortNew: "नवीन आधी", sortPosts: "जास्त पदे",
      openOnly: "फक्त सुरू", showing: (n) => `${n} जाहिराती`, reset: "फिल्टर काढा",
      posts: (n) => n ? `${n.toLocaleString("en-IN")} पदे` : "पदे: जाहिरात पहा",
      daysLeft: (d) => `${d} दिवस बाकी`, lastDay: "आज शेवटचा दिवस", closed: "बंद", tomorrow: "उद्या शेवट",
      published: "प्रसिद्ध", newTag: "नवीन",
      emptyTitle: "जुळणारी जाहिरात नाही", emptyBody: "दुसरा शब्द वापरा किंवा फिल्टर काढा.",
      back: "मागे", overview: "माहिती", impDates: "महत्त्वाच्या तारखा", howApply: "अर्ज कसा करावा",
      startDate: "अर्ज सुरू", lastDate: "अंतिम तारीख", examDate: "परीक्षा तारीख",
      salary: "वेतन", age: "वयोमर्यादा", fee: "शुल्क", qual: "शिक्षण", loc: "ठिकाण",
      readNotice: "अधिकृत जाहिरात", applyNow: "ऑनलाईन अर्ज", remind: "आठवण लावा", share: "शेअर",
      whatsapp: "WhatsApp वर शेअर करा", save: "जतन", saved: "जतन केले", related: "इतर संबंधित जाहिराती",
      daysToGo: "दिवस अर्जासाठी", sampleLink: "नमुना प्रोटोटाइप: अधिकृत लिंक अजून जोडलेल्या नाहीत.",
      savedTitle: "जतन केलेल्या जाहिराती", savedEmpty: "अजून काही जतन केले नाही. कोणत्याही जाहिरातीवरील बुकमार्क दाबा.",
      toastSaved: "यादीत जतन केले", toastRemoved: "जतन यादीतून काढले", toastCopied: "लिंक कॉपी केली",
      toastIcs: "आठवण फाईल डाउनलोड झाली — कॅलेंडरमध्ये जोडण्यासाठी उघडा",
      notFound: "ही जाहिरात सापडली नाही.", loadErr: "जाहिराती लोड झाल्या नाहीत. पुन्हा रिफ्रेश करा.",
      cats: { police: "पोलीस", bank: "बँक", railway: "रेल्वे", defence: "संरक्षण", teaching: "शिक्षक", health: "आरोग्य", municipal: "महानगरपालिका", transport: "परिवहन", engineering: "अभियांत्रिकी" },
      langBtn: "English",
    },
  };
  const CAT_ICON = { police: "🚓", bank: "🏦", railway: "🚆", defence: "🎖️", teaching: "📚", health: "🩺", municipal: "🏛️", transport: "🚌", engineering: "🛠️" };
  const CAT_COLOR = { police: "#1d4ed8", bank: "#7c3aed", railway: "#b91c1c", defence: "#4d7c0f", teaching: "#c2410c", health: "#0e7490", municipal: "#0f766e", transport: "#a16207", engineering: "#475569" };
  const TYPES = ["job", "result", "admit", "answerkey"];

  // ---------- state ----------
  const state = {
    items: [],
    lang: store.get("lang", "en"),
    saved: new Set(store.get("saved", [])),
    f: { type: "job", q: "", cat: "", district: "", qual: "", sort: "last", openOnly: true },
  };
  const t = () => T[state.lang];
  const L = (o) => (o && typeof o === "object" ? (o[state.lang] || o.en) : o || "");

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const parse = (s) => (s ? new Date(s + "T00:00:00") : null);
  const daysLeft = (s) => (s ? Math.round((parse(s) - today()) / DAY) : null);
  const fmtDate = (s) => (s ? parse(s).toLocaleDateString(state.lang === "mr" ? "mr-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
  const isNew = (it) => it.published && (today() - parse(it.published)) / DAY <= 2;
  const isOpen = (it) => it.type !== "job" || daysLeft(it.lastDate) === null || daysLeft(it.lastDate) >= 0;
  const initials = (it) => L(it.org).replace(/\(.*?\)/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const debounce = (fn, ms) => { let h; return (...a) => { clearTimeout(h); h = setTimeout(() => fn(...a), ms); }; };

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function badge(it) {
    if (it.type === "result") return `<span class="badge info">${esc(t().tabs.result)}</span>`;
    if (it.type === "admit") return `<span class="badge info">${esc(t().examDate)}: ${esc(fmtDate(it.examDate))}</span>`;
    const d = daysLeft(it.lastDate);
    if (d === null) return "";
    if (d < 0) return `<span class="badge closed">${esc(t().closed)}</span>`;
    if (d === 0) return `<span class="badge today">${esc(t().lastDay)}</span>`;
    if (d === 1) return `<span class="badge urgent">${esc(t().tomorrow)}</span>`;
    if (d <= 7) return `<span class="badge urgent">${esc(t().daysLeft(d))}</span>`;
    return `<span class="badge">${esc(t().daysLeft(d))}</span>`;
  }

  const ICON = {
    bookmark: '<svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>',
    bookmarkO: '<svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1zm1 2v12.6l5-2.9 5 2.9V5H7z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.5z"/></svg>',
    cap: '<svg viewBox="0 0 24 24"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm-6 9.8V17l6 3 6-3v-4.2l-6 3.2-6-3.2z"/></svg>',
    users: '<svg viewBox="0 0 24 24"><path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4zm8 0c-.3 0-.7 0-1.1.1 1.2.9 2.1 2.1 2.1 3.9v3h7v-3c0-2.7-5.3-4-8-4z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm-2 8h14v10H5V10z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.3.4c.1.2.6 1 1.3 1.6.9.8 1.6 1 1.9 1.1.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.8-.1 1.4z"/></svg>',
  };

  // ---------- filtering ----------
  function filtered() {
    const { f } = state;
    const q = f.q.trim().toLowerCase();
    let list = state.items.filter((it) => it.type === f.type);
    if (f.cat) list = list.filter((it) => it.category === f.cat);
    if (f.district) list = list.filter((it) => it.district === f.district);
    if (f.qual) list = list.filter((it) => (it.qualification || []).includes(f.qual));
    if (f.openOnly) list = list.filter(isOpen);
    if (q) {
      const words = q.split(/\s+/);
      list = list.filter((it) => {
        const hay = [it.title.en, it.title.mr, it.org.en, it.org.mr, it.district, it.category, T.en.cats[it.category], T.mr.cats[it.category], ...(it.qualification || [])].join(" ").toLowerCase();
        return words.every((w) => hay.includes(w));
      });
    }
    const by = {
      last: (a, b) => {
        const da = daysLeft(a.lastDate ?? a.examDate), db = daysLeft(b.lastDate ?? b.examDate);
        const ka = da === null ? 1e9 : da < 0 ? 1e6 - da : da, kb = db === null ? 1e9 : db < 0 ? 1e6 - db : db;
        return ka - kb || (b.published || "").localeCompare(a.published || "");
      },
      new: (a, b) => (b.published || "").localeCompare(a.published || ""),
      posts: (a, b) => (b.posts || 0) - (a.posts || 0),
    };
    return list.sort(by[f.sort] || by.last);
  }

  // ---------- views ----------
  function cardHTML(it, i = 0) {
    const savedOn = state.saved.has(it.id);
    const color = CAT_COLOR[it.category] || "#0f766e";
    return `<article class="card" style="animation-delay:${Math.min(i, 10) * 30}ms">
      <div class="card-head">
        <div class="logo" style="background:${color}" aria-hidden="true">${esc(initials(it))}</div>
        <div>
          <h3><a href="#/notice/${encodeURIComponent(it.id)}">${esc(L(it.title))}</a>${isNew(it) ? `<span class="new-dot">${esc(t().newTag)}</span>` : ""}</h3>
          <div class="org">${esc(L(it.org))}</div>
        </div>
      </div>
      <div class="meta">
        <span class="tag">${ICON.pin}${esc(it.district)}</span>
        <span class="tag">${ICON.cap}${esc((it.qualification || []).join(", "))}</span>
        ${it.type === "job" ? `<span class="tag">${ICON.users}${esc(t().posts(it.posts))}</span>` : ""}
        <span class="tag">${CAT_ICON[it.category] || ""} ${esc(t().cats[it.category] || it.category)}</span>
      </div>
      <div class="card-foot">
        ${badge(it)}
        <button class="save-btn" data-save="${esc(it.id)}" aria-pressed="${savedOn}" aria-label="${esc(savedOn ? t().saved : t().save)}" title="${esc(savedOn ? t().saved : t().save)}">${savedOn ? ICON.bookmark : ICON.bookmarkO}</button>
      </div>
    </article>`;
  }

  function renderHome() {
    const { f } = state;
    const jobs = state.items.filter((i) => i.type === "job");
    const open = jobs.filter(isOpen);
    const soon = open.filter((i) => daysLeft(i.lastDate) <= 7);
    const posts = open.reduce((s, i) => s + (i.posts || 0), 0);
    const ofType = state.items.filter((i) => i.type === f.type);
    const cats = [...new Set(ofType.map((i) => i.category))];
    const districts = [...new Set(state.items.map((i) => i.district))].sort();
    const quals = [...new Set(state.items.flatMap((i) => i.qualification || []))];
    const opt = (v, cur, label = v) => `<option value="${esc(v)}"${v === cur ? " selected" : ""}>${esc(label)}</option>`;

    $("#view").innerHTML = `
      <section class="hero">
        <h1>${esc(t().heroTitle)}</h1>
        <p>${esc(t().heroSub)}</p>
        <div class="search" role="search">
          ${ICON.search}
          <input id="q" type="search" value="${esc(f.q)}" placeholder="${esc(t().searchPh)}" aria-label="${esc(t().searchPh)}" autocomplete="off">
          <kbd>/</kbd>
          ${f.q ? `<button class="clear" id="clearQ">${esc(t().clear)}</button>` : ""}
        </div>
        <div class="stats">
          <div><b data-count="${open.length}">0</b><span>${esc(t().openJobs)}</span></div>
          <div><b data-count="${posts}">0</b><span>${esc(t().totalPosts)}</span></div>
          <div><b data-count="${soon.length}">0</b><span>${esc(t().closingSoon)}</span></div>
        </div>
      </section>

      <div class="tabs" role="tablist">
        ${TYPES.map((ty) => `<button class="tab" role="tab" data-type="${ty}" aria-selected="${f.type === ty}">${esc(t().tabs[ty])}<span class="n">${state.items.filter((i) => i.type === ty && (ty !== "job" || isOpen(i))).length}</span></button>`).join("")}
      </div>

      <div class="chips" role="group" aria-label="Category">
        <button class="chip" data-cat="" aria-pressed="${!f.cat}">${esc(t().all)}</button>
        ${cats.map((c) => `<button class="chip" data-cat="${esc(c)}" aria-pressed="${f.cat === c}">${CAT_ICON[c] || ""} ${esc(t().cats[c] || c)}</button>`).join("")}
      </div>

      <div class="filters">
        <div class="field"><label for="fDistrict">${esc(t().district)}</label>
          <select id="fDistrict">${opt("", f.district, t().all)}${districts.map((d) => opt(d, f.district)).join("")}</select></div>
        <div class="field"><label for="fQual">${esc(t().qualification)}</label>
          <select id="fQual">${opt("", f.qual, t().all)}${quals.map((q) => opt(q, f.qual)).join("")}</select></div>
        <div class="field"><label for="fSort">${esc(t().sort)}</label>
          <select id="fSort">${opt("last", f.sort, t().sortLast)}${opt("new", f.sort, t().sortNew)}${opt("posts", f.sort, t().sortPosts)}</select></div>
        <div class="field"><label>&nbsp;</label>
          <label class="toggle"><input type="checkbox" id="fOpen" ${f.openOnly ? "checked" : ""}>${esc(t().openOnly)}</label></div>
      </div>

      <div class="result-line"><span id="countLine"></span><button class="linkish" id="resetBtn" hidden>${esc(t().reset)}</button></div>
      <div class="grid" id="list"></div>`;

    renderList();
    animateCounts();
  }

  function renderList() {
    const list = filtered();
    const { f } = state;
    $("#countLine").textContent = t().showing(list.length);
    $("#resetBtn").hidden = !(f.q || f.cat || f.district || f.qual || !f.openOnly);
    $("#list").innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<div class="empty" style="grid-column:1/-1"><div class="big">🔍</div><h3>${esc(t().emptyTitle)}</h3><p>${esc(t().emptyBody)}</p></div>`;
  }

  function animateCounts() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const to = +el.dataset.count, start = performance.now(), dur = 700;
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function renderDetail(id) {
    const it = state.items.find((i) => i.id === id);
    if (!it) {
      $("#view").innerHTML = `<a class="back" href="#/">← ${esc(t().back)}</a><div class="empty"><div class="big">🤷</div><h3>${esc(t().notFound)}</h3></div>`;
      return;
    }
    document.title = `${L(it.title)} — ${t().brand}`;
    const d = daysLeft(it.lastDate);
    const savedOn = state.saved.has(it.id);
    const color = CAT_COLOR[it.category] || "#0f766e";
    const related = state.items.filter((i) => i.id !== it.id && (i.category === it.category || i.district === it.district)).slice(0, 4);
    const fact = (label, val) => (val ? `<div class="fact"><span>${esc(label)}</span><b>${esc(val)}</b></div>` : "");
    const dateRow = (label, val) => (val ? `<tr><td>${esc(label)}</td><td>${esc(fmtDate(val))}</td></tr>` : "");

    $("#view").innerHTML = `
      <a class="back" href="#/">← ${esc(t().back)}</a>
      <div class="detail">
        <div>
          <section class="panel">
            <div class="detail-title">
              <div class="logo" style="background:${color};width:56px;height:56px;font-size:20px">${esc(initials(it))}</div>
              <div>
                <h1>${esc(L(it.title))}</h1>
                <div class="muted">${esc(L(it.org))} · ${esc(t().published)} ${esc(fmtDate(it.published))}</div>
              </div>
            </div>
            <div class="facts">
              ${it.type === "job" ? fact(t().totalPosts, t().posts(it.posts)) : ""}
              ${fact(t().qual, (it.qualification || []).join(", "))}
              ${fact(t().loc, it.district)}
              ${fact(t().salary, it.salary)}
              ${fact(t().age, L(it.age))}
              ${fact(t().fee, L(it.fee))}
            </div>
          </section>
          <section class="panel"><h2>${esc(t().overview)}</h2><p style="margin:0">${esc(L(it.summary))}</p></section>
          ${it.startDate || it.lastDate || it.examDate ? `<section class="panel"><h2>${esc(t().impDates)}</h2><table class="dates">
            ${dateRow(t().startDate, it.startDate)}${dateRow(t().lastDate, it.lastDate)}${dateRow(t().examDate, it.examDate)}
          </table></section>` : ""}
          ${it.steps?.length ? `<section class="panel"><h2>${esc(t().howApply)}</h2><ol class="steps">${it.steps.map((s) => `<li>${esc(L(s))}</li>`).join("")}</ol></section>` : ""}
        </div>
        <aside class="side">
          <section class="panel">
            ${d !== null ? `<div class="countdown ${d < 0 ? "closed" : ""}"><b>${d < 0 ? "—" : d}</b><span>${esc(d < 0 ? t().closed : d === 0 ? t().lastDay : t().daysToGo)}</span></div>` : ""}
            <a class="btn primary" href="#" data-sample>${ICON.ext}${esc(it.type === "job" ? t().applyNow : t().readNotice)}</a>
            ${it.type === "job" ? `<a class="btn" href="#" data-sample>${esc(t().readNotice)}</a>` : ""}
            <div class="row-btns" style="margin-bottom:10px">
              <button class="btn" data-save="${esc(it.id)}" aria-pressed="${savedOn}">${savedOn ? ICON.bookmark : ICON.bookmarkO}${esc(savedOn ? t().saved : t().save)}</button>
              <button class="btn" id="shareBtn">${ICON.share}${esc(t().share)}</button>
            </div>
            ${(it.lastDate && d >= 0) || it.examDate ? `<button class="btn" id="icsBtn">${ICON.cal}${esc(t().remind)}</button>` : ""}
            <a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(L(it.title) + "\n" + location.href)}">${ICON.wa}${esc(t().whatsapp)}</a>
          </section>
          ${related.length ? `<section class="panel"><h2>${esc(t().related)}</h2><div class="related">${related.map((r) => `<a href="#/notice/${encodeURIComponent(r.id)}">${esc(L(r.title))}</a>`).join("")}</div></section>` : ""}
        </aside>
      </div>`;

    $("#shareBtn").onclick = async () => {
      const data = { title: L(it.title), url: location.href };
      if (navigator.share) { try { await navigator.share(data); } catch { /* cancelled */ } return; }
      try { await navigator.clipboard.writeText(location.href); toast(t().toastCopied); } catch { prompt("Copy link", location.href); }
    };
    const ics = $("#icsBtn");
    if (ics) ics.onclick = () => downloadICS(it);
  }

  function renderSaved() {
    document.title = `${t().savedTitle} — ${t().brand}`;
    const list = state.items.filter((i) => state.saved.has(i.id));
    $("#view").innerHTML = `
      <a class="back" href="#/">← ${esc(t().back)}</a>
      <div class="section-title"><h1>${esc(t().savedTitle)}</h1><span class="muted">${esc(t().showing(list.length))}</span></div>
      <div class="grid" id="list">${list.length ? list.map(cardHTML).join("") : `<div class="empty" style="grid-column:1/-1"><div class="big">🔖</div><p>${esc(t().savedEmpty)}</p></div>`}</div>`;
  }

  function renderSkeleton() {
    $("#view").innerHTML = `<div class="hero" style="height:220px"></div><div class="grid">${'<div class="skeleton"></div>'.repeat(6)}</div>`;
  }

  // ---------- actions ----------
  function toggleSave(id) {
    const on = !state.saved.has(id);
    on ? state.saved.add(id) : state.saved.delete(id);
    store.set("saved", [...state.saved]);
    updateSavedCount();
    toast(on ? t().toastSaved : t().toastRemoved);
    route(false);
  }

  function updateSavedCount() {
    const el = $("#savedCount");
    el.textContent = state.saved.size;
    el.hidden = state.saved.size === 0;
  }

  function downloadICS(it) {
    const date = it.type === "job" && it.lastDate && daysLeft(it.lastDate) >= 0 ? it.lastDate : it.examDate;
    const d = date.replace(/-/g, "");
    const next = new Date(parse(date).getTime() + DAY).toISOString().slice(0, 10).replace(/-/g, "");
    const what = date === it.lastDate ? t().lastDate : t().examDate;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Naukri Katta//Prototype//EN",
      "BEGIN:VEVENT", `UID:${it.id}-${d}@naukri-katta`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${next}`,
      `SUMMARY:${what}: ${L(it.title)}`, `DESCRIPTION:${location.href}`,
      "BEGIN:VALARM", "TRIGGER:-P2D", "ACTION:DISPLAY", `DESCRIPTION:${what}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${it.id}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t().toastIcs);
  }

  function applyLang() {
    document.documentElement.lang = state.lang === "mr" ? "mr" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t()[el.dataset.i18n]; });
    $("#langBtn").textContent = t().langBtn;
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    store.set("theme", theme);
  }

  // ---------- router ----------
  function route(scroll = true) {
    const hash = location.hash.replace(/^#/, "") || "/";
    const go = () => {
      const [, page, arg] = hash.split("/");
      if (page === "notice" && arg) renderDetail(decodeURIComponent(arg));
      else if (page === "saved") renderSaved();
      else { document.title = `${t().brand} — ${t().tagline}`; renderHome(); }
      if (scroll) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    };
    if (scroll && document.startViewTransition) document.startViewTransition(go); else go();
  }

  // ---------- events (delegated, set once) ----------
  const onSearch = debounce(() => renderList(), 120);
  document.addEventListener("input", (e) => {
    if (e.target.id === "q") {
      state.f.q = e.target.value;
      onSearch();
    }
  });
  document.addEventListener("change", (e) => {
    const id = e.target.id, f = state.f;
    if (id === "fDistrict") f.district = e.target.value;
    else if (id === "fQual") f.qual = e.target.value;
    else if (id === "fSort") f.sort = e.target.value;
    else if (id === "fOpen") f.openOnly = e.target.checked;
    else return;
    renderList();
  });
  document.addEventListener("click", (e) => {
    const el = e.target.closest("button, a");
    if (!el) return;
    const f = state.f;
    if (el.dataset.save) { e.preventDefault(); toggleSave(el.dataset.save); }
    else if (el.dataset.type) { f.type = el.dataset.type; f.cat = ""; renderHome(); }
    else if ("cat" in el.dataset) { f.cat = el.dataset.cat; document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === el)); renderList(); }
    else if (el.id === "clearQ") { f.q = ""; renderHome(); $("#q").focus(); }
    else if (el.id === "resetBtn") { Object.assign(f, { q: "", cat: "", district: "", qual: "", openOnly: true }); renderHome(); }
    else if ("sample" in el.dataset) { e.preventDefault(); toast(t().sampleLink); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/input|select|textarea/i.test(document.activeElement.tagName)) {
      const q = $("#q");
      if (q) { e.preventDefault(); q.focus(); }
    }
  });
  $("#langBtn").addEventListener("click", () => {
    state.lang = state.lang === "en" ? "mr" : "en";
    store.set("lang", state.lang);
    applyLang();
    route(false);
  });
  $("#themeBtn").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  window.addEventListener("hashchange", () => route());

  // ---------- boot ----------
  applyTheme(store.get("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  applyLang();
  updateSavedCount();
  renderSkeleton();
  fetch(DATA_URL, { cache: "no-cache" })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => { state.items = data.items || []; route(false); })
    .catch(() => { $("#view").innerHTML = `<div class="empty" style="margin-top:24px"><div class="big">⚠️</div><p>${esc(t().loadErr)}</p></div>`; });
})();
