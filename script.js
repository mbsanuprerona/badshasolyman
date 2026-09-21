/* =========================================================
   OUR MAHESHKHALI — script.js
   Developed by: Badsha Solyman
   All features: Top Bar Clock • Theme • Language • Menus
   Search • Spin Counter • Floating Nav • Toasts • 3D Hero
========================================================= */
"use strict";

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============ 1. LIVE DAY / DATE / TIME ============ */
function tickClock() {
  const now = new Date();
  const day  = $("#current-day");
  const date = $("#current-date");
  const time = $("#live-time");
  if (day)  day.textContent  = now.toLocaleDateString("bn-BD", { weekday: "long" });
  if (date) date.textContent = now.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
  if (time) time.textContent = now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
tickClock();
setInterval(tickClock, 1000);

/* footer year */
const yearEl = $("#current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============ 2. THEME (Light / Dark + LocalStorage) ============ */
const themeBtns = [$("#theme-toggle"), $("#mobile-theme-button")].filter(Boolean);
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("omk-theme", theme);
  themeBtns.forEach(b => {
    b.setAttribute("aria-pressed", theme === "dark");
    const label = b.querySelector("span") ? null : null;
    b.childNodes.forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) n.textContent = theme === "dark" ? " ☀️ THEME" : " 🌙 THEME";
    });
  });
  showToast(theme === "dark" ? "🌙 ডার্ক মোড চালু হয়েছে" : "☀️ লাইট মোড চালু হয়েছে", "gold");
}
(function initTheme() {
  const saved = localStorage.getItem("omk-theme");
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (sysDark ? "dark" : "light");
  root.setAttribute("data-theme", theme);
  localStorage.setItem("omk-theme", theme);
  themeBtns.forEach(b => b.setAttribute("aria-pressed", theme === "dark"));
})();
themeBtns.forEach(b => b.addEventListener("click", () =>
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")));

/* ============ 3. LANGUAGE TOGGLE ============ */
const langBtn = $("#language-toggle");
let lang = "bn";
if (langBtn) langBtn.addEventListener("click", () => {
  lang = lang === "bn" ? "en" : "bn";
  showToast(lang === "en"
    ? "🌐 English selected — full translation coming soon"
    : "🌐 বাংলা ভাষা নির্বাচিত হয়েছে", "green");
});

/* ============ 4. STICKY HEADER SHADOW ============ */
const siteHeader = $("#site-header");
window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 12);
}, { passive: true });

/* ============ 5. MOBILE NAVIGATION ============ */
const menuBtn = $("#mobile-menu-button");
const mobileNav = $("#mobile-navigation");

function closeMobileNav() {
  mobileNav.hidden = true;
  menuBtn.classList.remove("active");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
if (menuBtn) menuBtn.addEventListener("click", () => {
  const willOpen = mobileNav.hidden;
  if (willOpen) {
    mobileNav.hidden = false;
    requestAnimationFrame(() => {}); // transition handled by CSS :not([hidden])
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  } else closeMobileNav();
});
// close drawer when any link inside is clicked
$$("#mobile-navigation a").forEach(a => a.addEventListener("click", closeMobileNav));

/* ============ 6. SEARCH DATA ============ */
const SEARCH_DATA = [
  { name: "আদিনাথ মন্দির — Adinath Temple",      cat: "tourist",      link: "#explore-maheshkhali" },
  { name: "মৈনাক পাহাড় — Mainak Hill",           cat: "tourist",      link: "#explore-maheshkhali" },
  { name: "সোনাদিয়া দ্বীপ — Sonadia Island",     cat: "tourist",      link: "#explore-maheshkhali" },
  { name: "উপকূলীয় এলাকা — Beaches & Coastal",   cat: "tourist",      link: "#explore-maheshkhali" },
  { name: "শুঁটকি — Shutki",                      cat: "product",      link: "#local-products" },
  { name: "লবণ — Salt",                           cat: "product",      link: "#local-products" },
  { name: "চিংড়ি — Shrimp",                      cat: "product",      link: "#local-products" },
  { name: "পান — Betel Leaf",                     cat: "product",      link: "#local-products" },
  { name: "হস্তশিল্প — Handicrafts",              cat: "product",      link: "#local-products" },
  { name: "উপজেলা স্বাস্থ্য কমপ্লেক্স",            cat: "health",       link: "#health" },
  { name: "হাসপাতাল ও ক্লিনিক",                   cat: "health",       link: "#health" },
  { name: "ফার্মেসি ও ডায়াগনস্টিক",               cat: "health",       link: "#health" },
  { name: "অ্যাম্বুলেন্স সেবা",                    cat: "health",       link: "#emergency" },
  { name: "প্রাথমিক বিদ্যালয়সমূহ",               cat: "education",    link: "#education" },
  { name: "মাধ্যমিক বিদ্যালয় ও কলেজ",            cat: "education",    link: "#education" },
  { name: "মাদ্রাসা ও কারিগরি প্রতিষ্ঠান",         cat: "education",    link: "#education" },
  { name: "কম্পিউটার প্রশিক্ষণ কেন্দ্র",            cat: "education",    link: "#education" },
  { name: "ইউনিয়ন পরিষদসমূহ — Unions",            cat: "union",        link: "#administration" },
  { name: "ওয়ার্ড — Wards",                       cat: "ward",         link: "#administration" },
  { name: "গ্রাম — Villages",                     cat: "village",      link: "#unions-villages" },
  { name: "কক্সবাজার জেলা — Cox's Bazar",          cat: "district",     link: "#administration" },
  { name: "মহেশখালী উপজেলা — Maheshkhali",         cat: "upazila",      link: "#administration" },
  { name: "রেস্টুরেন্ট ও হোটেল",                   cat: "business",     link: "#business" },
  { name: "পরিবহন সেবা — Transport",               cat: "business",     link: "#business" },
  { name: "স্থানীয় উদ্যোক্তা — Entrepreneurs",    cat: "business",     link: "#business" },
  { name: "সরকারি অফিস — Government Offices",      cat: "government",   link: "#administration" },
  { name: "স্থানীয় সংবাদ — Local News",           cat: "news",         link: "#news" },
  { name: "পাবলিক নোটিশ — Public Notices",          cat: "notice",       link: "#notices" },
  { name: "ইভেন্টস — Events",                      cat: "event",        link: "#events" },
  { name: "জরুরি তথ্য — Emergency",                 cat: "emergency",    link: "#emergency" },
  { name: "গুরুত্বপূর্ণ যোগাযোগ — Contacts",        cat: "contact",      link: "#important-contacts" },
];

/* ============ 7. GLOBAL SEARCH OVERLAY ============ */
const searchOverlay   = $("#search-overlay");
const searchInput     = $("#global-search-input");
const searchResultsEl = $("#global-search-results");
const openSearchBtns  = [$("#open-search"), $("#mobile-search-button"),
                         $('[data-action="search"]')].filter(Boolean);
let activeSearchCat = "all";

function renderGlobalResults(query) {
  const q = query.trim().toLowerCase();
  let items = SEARCH_DATA;
  if (activeSearchCat !== "all") {
    const map = {
      "maheshkhali": ["upazila"], "districts": ["district"], "upazilas": ["upazila"],
      "thanas": ["government"], "unions": ["union"], "wards": ["ward"], "villages": ["village"],
      "education": ["education"], "hospitals": ["health"], "businesses": ["business"],
      "products": ["product"], "tourist spots": ["tourist"], "government offices": ["government"],
      "personalities": ["tourism"], "news": ["news"], "notices": ["notice"], "events": ["event"]
    };
    const cats = map[activeSearchCat.toLowerCase()];
    if (cats) items = items.filter(i => cats.includes(i.cat));
  }
  if (q) items = items.filter(i => i.name.toLowerCase().includes(q));
  if (!items.length) {
    searchResultsEl.innerHTML = `<div class="empty-state"><span>😕</span>
      <h3>কোনো ফলাফল পাওয়া যায়নি</h3><p>No results found — try another keyword</p></div>`;
    return;
  }
  searchResultsEl.innerHTML = items.slice(0, 12).map(i => `
    <div class="result-item" data-link="${i.link}" tabindex="0" role="link">
      <span>${i.name}</span><span class="r-cat">${i.cat}</span>
    </div>`).join("");
  $$(".result-item", searchResultsEl).forEach(item => {
    const go = () => { closeSearch(); document.querySelector(item.dataset.link)?.scrollIntoView({ behavior: "smooth" }); };
    item.addEventListener("click", go);
    item.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  });
}

function openSearch() {
  searchOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  renderGlobalResults(searchInput.value);
  setTimeout(() => searchInput.focus(), 90);
}
function closeSearch() {
  searchOverlay.hidden = true;
  document.body.style.overflow = "";
}
openSearchBtns.forEach(b => b.addEventListener("click", () => {
  closeMobileNav();
  openSearch();
}));
$("#close-search").addEventListener("click", closeSearch);
$(".search-overlay-backdrop").addEventListener("click", closeSearch);

// category chips
$$(".search-category-list button").forEach(chip => {
  chip.addEventListener("click", () => {
    $$(".search-category-list button").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeSearchCat = chip.textContent.trim();
    renderGlobalResults(searchInput.value);
  });
});
// live search (debounced)
let searchDebounce;
searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => renderGlobalResults(searchInput.value), 150);
});
renderGlobalResults("");

/* ============ 8. ADMINISTRATIVE DIRECTORY SEARCH ============ */
const adminInput   = $("#administrative-search");
const adminBtn     = $("#administrative-search-button");
const adminResults = $("#administrative-results");
const ADMIN_DATA = [
  { name: "🇧🇩 Bangladesh → Cox's Bazar District",  meta: "district" },
  { name: "🏝️ Maheshkhali Upazila",                 meta: "upazila" },
  { name: "🏢 Maheshkhali Thana — [Verified info will be added]", meta: "thana" },
  { name: "🏛️ Union Parishads — [Verified info will be added]",   meta: "union" },
  { name: "🔢 Wards — [Verified info will be added]",             meta: "ward" },
  { name: "🏡 Villages — [Verified info will be added]",          meta: "village" },
];
function renderAdminResults(q) {
  const query = q.trim().toLowerCase();
  const items = query ? ADMIN_DATA.filter(i => i.name.toLowerCase().includes(query)) : [];
  if (!query) {
    adminResults.innerHTML = `<div class="empty-state"><span>📚</span>
      <h3>Verified data will appear here</h3><p>[Information will be added]</p></div>`;
    return;
  }
  if (!items.length) {
    adminResults.innerHTML = `<div class="empty-state"><span>😕</span>
      <h3>No match found</h3><p>Try: union, ward, village, thana…</p></div>`;
    return;
  }
  adminResults.innerHTML = items.map(i =>
    `<div class="result-item"><span>${i.name}</span><span class="r-cat">${i.meta}</span></div>`).join("");
}
adminBtn.addEventListener("click", () => renderAdminResults(adminInput.value));
adminInput.addEventListener("input", () => renderAdminResults(adminInput.value));
adminInput.addEventListener("keydown", e => { if (e.key === "Enter") renderAdminResults(adminInput.value); });

/* ============ 9. SPIN COUNTER (LocalStorage) ============ */
const spinBtn = $("#spin-button");
const spinCountEl = $("#spin-count");
const spinIcon = $(".spin-icon", spinBtn);
let spinCount = parseInt(localStorage.getItem("omk-spin") || "0", 10) || 0;
spinCountEl.textContent = spinCount;
spinBtn.addEventListener("click", () => {
  spinCount++;
  localStorage.setItem("omk-spin", spinCount);
  spinCountEl.textContent = spinCount;
  spinIcon.classList.remove("spinning");
  void spinIcon.offsetWidth;
  spinIcon.classList.add("spinning");
  if (spinCount % 10 === 0) showToast(`↻ দারুণ! ${spinCount} বার স্পিন হয়েছে 🎉`, "gold");
});

/* ============ 10. FLOATING & QUICK NAVIGATION ============ */
const sections = $$("main section[id]");
$("#quick-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("#nav-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("#nav-footer").addEventListener("click", () =>
  $("#site-footer").scrollIntoView({ behavior: "smooth" }));

function sectionIndex() {
  const y = window.scrollY + 140;
  let idx = 0;
  sections.forEach((s, i) => { if (s.offsetTop <= y) idx = i; });
  return idx;
}
$("#nav-next").addEventListener("click", () => {
  const next = sections[Math.min(sectionIndex() + 1, sections.length - 1)];
  next?.scrollIntoView({ behavior: "smooth" });
});
$("#nav-prev").addEventListener("click", () => {
  const prev = sections[Math.max(sectionIndex() - 1, 0)];
  prev?.scrollIntoView({ behavior: "smooth" });
});

/* ============ 11. TOAST SYSTEM ============ */
const toastContainer = $("#toast-container");
function showToast(msg, type = "") {
  const toast = document.createElement("div");
  toast.className = "toast" + (type ? " toast-" + type : "");
  toast.textContent = msg;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }, 2600);
}

/* ============ 12. SCROLL REVEAL (Intersection Observer) ============ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("reveal-in"); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
$$(".section").forEach(s => revealObserver.observe(s));

/* ============ 13. ACTIVE NAV LINK ON SCROLL ============ */
const navLinks = $$('.navigation-list a[href^="#"]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => navObserver.observe(s));

/* ============ 14. 3D HERO — PARTICLES + MOUSE PARALLAX ============ */
const heroSection = $(".hero-section");
const particlesEl = $(".hero-particles");
const floatCards  = $$(".floating-card");

if (!reduceMotion && particlesEl) {
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("i");
    const size = 2 + Math.random() * 4.5;
    p.style.left = Math.random() * 100 + "%";
    p.style.bottom = Math.random() * 42 + "%";
    p.style.width = p.style.height = size + "px";
    p.style.animationDuration = 7 + Math.random() * 11 + "s";
    p.style.animationDelay = Math.random() * 9 + "s";
    particlesEl.appendChild(p);
  }
  // mouse parallax on floating cards + island
  const island = $(".hero-island");
  heroSection.addEventListener("mousemove", e => {
    const r = heroSection.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    floatCards.forEach((card, i) => {
      const depth = 22 + i * 12;
      card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
    if (island) island.style.marginLeft = x * 34 + "px";
  });
  heroSection.addEventListener("mouseleave", () => {
    floatCards.forEach(card => card.style.transform = "");
    if (island) island.style.marginLeft = "0";
  });
}

/* ============ 15. LOGO FALLBACK (if image missing) ============ */
$$(".brand-logo").forEach(img => {
  img.addEventListener("error", () => {
    const fb = document.createElement("span");
    fb.className = "brand-logo-fallback";
    fb.textContent = "🌴";
    img.replaceWith(fb);
  });
});

/* ============ 16. KEYBOARD SHORTCUTS ============ */
document.addEventListener("keydown", e => {
  const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
  if (e.key === "/" && !typing && searchOverlay.hidden) { e.preventDefault(); openSearch(); }
  if (e.key === "Escape" && !searchOverlay.hidden) closeSearch();
});

/* welcome toast */
window.addEventListener("load", () => {
  setTimeout(() => showToast("🌴 OUR MAHESHKHALI-তে স্বাগতম! • Welcome!", "green"), 900);
});/* =========================================================
   MATARBARI UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-matarbari-toggle]"
    );

    const details = document.getElementById(
        "matarbariFullDetails"
    );

    if (!buttons.length || !details) {
        return;
    }

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");

            if (isHidden) {

                details.removeAttribute("hidden");

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                        btn.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                });

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                details.setAttribute(
                    "hidden",
                    ""
                );

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                        btn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

            }

        });

    });

});/* =========================================================
   DHALGHATA UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-dhalghata-toggle]"
    );

    const details = document.getElementById(
        "dhalghataFullDetails"
    );

    if (!buttons.length || !details) {
        return;
    }

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");

            if (isHidden) {

                details.removeAttribute("hidden");

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                        btn.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                });

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                details.setAttribute(
                    "hidden",
                    ""
                );

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                        btn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

            }

        });

    });

});/* =========================================================
   KALARMARCHHARA UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-kalarmarchhara-toggle]"
    );

    const details = document.getElementById(
        "kalarmarchharaFullDetails"
    );

    if (!buttons.length || !details) {
        return;
    }

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");

            if (isHidden) {

                details.removeAttribute("hidden");

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                        btn.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                });

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                details.setAttribute(
                    "hidden",
                    ""
                );

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                        btn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

            }

        });

    });

});/* =========================================================
   SHAPLAPUR UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-shaplapur-toggle]"
    );

    const details = document.getElementById(
        "shaplapurFullDetails"
    );

    /* -----------------------------------------
       SAFETY CHECK
    ----------------------------------------- */

    if (!buttons.length || !details) {
        return;
    }


    /* -----------------------------------------
       OPEN / CLOSE DETAILS
    ----------------------------------------- */

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");


            /* =====================================
               OPEN
            ===================================== */

            if (isHidden) {

                details.removeAttribute("hidden");


                buttons.forEach((btn) => {

                    btn.setAttribute(
                        "aria-expanded",
                        "true"
                    );


                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                    }

                });


                /* Smooth scroll */

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            /* =====================================
               CLOSE
            ===================================== */

            else {

                details.setAttribute(
                    "hidden",
                    ""
                );


                buttons.forEach((btn) => {

                    btn.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                    }

                });


                /* Return to card */

                const card =
                    document.querySelector(
                        '[data-union-card="shaplapur"]'
                    );

                if (card) {

                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }

        });

    });

});/* =========================================================
   HOANAK UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-hoanak-toggle]"
    );

    const details = document.getElementById(
        "hoanakFullDetails"
    );

    if (!buttons.length || !details) {
        return;
    }

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");


            /* =====================================
               OPEN DETAILS
            ===================================== */

            if (isHidden) {

                details.removeAttribute("hidden");

                buttons.forEach((btn) => {

                    btn.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                    }

                });

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            /* =====================================
               CLOSE DETAILS
            ===================================== */

            else {

                details.setAttribute(
                    "hidden",
                    ""
                );

                buttons.forEach((btn) => {

                    btn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                    }

                });

                const card =
                    document.querySelector(
                        '[data-union-card="hoanak"]'
                    );

                if (card) {

                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }

        });

    });

});/* =========================================================
   BARA MAHESHKHALI UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-bara-maheshkhali-toggle]"
    );

    const details = document.getElementById(
        "baraMaheshkhaliFullDetails"
    );

    if (!buttons.length || !details) {
        return;
    }

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");

            if (isHidden) {

                details.removeAttribute("hidden");

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                        btn.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                });

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                details.setAttribute(
                    "hidden",
                    ""
                );

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                        btn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

            }

        });

    });

});/* =========================================================
   KUTUBJOM UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-kutubjom-toggle]"
    );

    const details = document.getElementById(
        "kutubjomFullDetails"
    );

    if (!buttons.length || !details) {
        return;
    }

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");

            if (isHidden) {

                details.removeAttribute("hidden");

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                        btn.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                });

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                details.setAttribute(
                    "hidden",
                    ""
                );

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                        btn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

            }

        });

    });

});/* =========================================================
   CHHOTA MAHESHKHALI UNION — DETAILS TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(
        "[data-chhotamaheshkhali-toggle]"
    );

    const details = document.getElementById(
        "chhotamaheshkhaliFullDetails"
    );

    if (!buttons.length || !details) {
        return;
    }

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const isHidden =
                details.hasAttribute("hidden");

            if (isHidden) {

                details.removeAttribute("hidden");

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য বন্ধ করুন ×";

                        btn.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                });

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                details.setAttribute(
                    "hidden",
                    ""
                );

                buttons.forEach((btn) => {

                    if (
                        btn.classList.contains(
                            "details-btn"
                        )
                    ) {

                        btn.textContent =
                            "বিস্তারিত তথ্য দেখুন →";

                        btn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

            }

        });

    });

});/* =========================================================
   OUR MAHESHKHALI — INTERACTIVE 3D MAP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const mapStage = document.getElementById("mapStage");
    const mapIsland = document.getElementById("mapIsland");

    const zoomIn = document.getElementById("mapZoomIn");
    const zoomOut = document.getElementById("mapZoomOut");
    const resetMap = document.getElementById("mapReset");

    const searchInput = document.getElementById("mapSearch");
    const searchButton = document.getElementById("mapSearchButton");

    const categories =
        document.querySelectorAll(".map-category");


    if (!mapStage || !mapIsland) {
        return;
    }


    /* =====================================================
       MAP STATE
    ===================================================== */

    let mapScale = 1;
    let rotationX = 58;
    let rotationZ = -14;


    function updateMap() {

        mapIsland.style.transform = `
            translate(-50%, -45%)
            rotateX(${rotationX}deg)
            rotateZ(${rotationZ}deg)
            scale(${mapScale})
        `;

    }


    /* =====================================================
       ZOOM IN
    ===================================================== */

    if (zoomIn) {

        zoomIn.addEventListener("click", () => {

            mapScale = Math.min(
                mapScale + 0.1,
                1.6
            );

            updateMap();

        });

    }


    /* =====================================================
       ZOOM OUT
    ===================================================== */

    if (zoomOut) {

        zoomOut.addEventListener("click", () => {

            mapScale = Math.max(
                mapScale - 0.1,
                0.75
            );

            updateMap();

        });

    }


    /* =====================================================
       RESET
    ===================================================== */

    if (resetMap) {

        resetMap.addEventListener("click", () => {

            mapScale = 1;
            rotationX = 58;
            rotationZ = -14;

            updateMap();

        });

    }


    /* =====================================================
       MOUSE 3D PARALLAX
    ===================================================== */

    mapStage.addEventListener(
        "pointermove",
        (event) => {

            const rect =
                mapStage.getBoundingClientRect();

            const x =
                (event.clientX - rect.left)
                / rect.width;

            const y =
                (event.clientY - rect.top)
                / rect.height;

            const tiltX =
                54 + ((0.5 - y) * 10);

            const tiltZ =
                -14 + ((x - 0.5) * 12);

            mapIsland.style.transform = `
                translate(-50%, -45%)
                rotateX(${tiltX}deg)
                rotateZ(${tiltZ}deg)
                scale(${mapScale})
            `;

        }
    );


    /* =====================================================
       RESET POINTER EFFECT
    ===================================================== */

    mapStage.addEventListener(
        "pointerleave",
        () => {

            updateMap();

        }
    );


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    categories.forEach((category) => {

        category.addEventListener("click", () => {

            categories.forEach((item) => {
                item.classList.remove("active");
            });

            category.classList.add("active");

            const selectedCategory =
                category.dataset.mapCategory;

            console.log(
                "Selected map category:",
                selectedCategory
            );

        });

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    function performMapSearch() {

        const query =
            searchInput
                ? searchInput.value.trim()
                : "";

        if (!query) {

            if (searchInput) {
                searchInput.focus();
            }

            return;
        }


        /*
         * IMPORTANT:
         * No fake coordinates are generated here.
         *
         * Verified location data can later be connected
         * through JSON/API/Google Maps/other map provider.
         */

        console.info(
            "Map search:",
            query
        );

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            performMapSearch
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performMapSearch();

                }

            }
        );

    }


    /* =====================================================
       KEYBOARD ZOOM
    ===================================================== */

    mapStage.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "+") {

                mapScale =
                    Math.min(
                        mapScale + 0.1,
                        1.6
                    );

                updateMap();

            }


            if (event.key === "-") {

                mapScale =
                    Math.max(
                        mapScale - 0.1,
                        0.75
                    );

                updateMap();

            }


            if (event.key === "0") {

                mapScale = 1;

                rotationX = 58;

                rotationZ = -14;

                updateMap();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateMap();

});/* =========================================================
   OUR MAHESHKHALI
   SMART TOP BAR JAVASCRIPT
   EXISTING STRUCTURE SAFE
========================================================= */

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    function () {

        omDateTime();

        omLanguage();

        omNetwork();

        omTicker();

        omEmergency();

        omAlerts();

        omNotifications();

        omSearch();

        omKeyboard();

    }
);


/* =========================================================
   DATE + TIME
========================================================= */

function omDateTime() {

    const day =
        document.getElementById("current-day");

    const date =
        document.getElementById("current-date");

    const time =
        document.getElementById("live-time");


    if (!day || !date || !time) {
        return;
    }


    function updateTime() {

        const now = new Date();

        const language =
            localStorage.getItem("om-language") || "bn";


        if (language === "bn") {

            day.textContent =
                new Intl.DateTimeFormat(
                    "bn-BD",
                    {
                        weekday: "long"
                    }
                ).format(now);


            date.textContent =
                new Intl.DateTimeFormat(
                    "bn-BD",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                ).format(now);


            time.textContent =
                new Intl.DateTimeFormat(
                    "bn-BD",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    }
                ).format(now);

        } else {

            day.textContent =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        weekday: "long"
                    }
                ).format(now);


            date.textContent =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                ).format(now);


            time.textContent =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    }
                ).format(now);
        }
    }


    updateTime();

    setInterval(
        updateTime,
        1000
    );


    window.addEventListener(
        "omLanguageChanged",
        updateTime
    );
}


/* =========================================================
   LANGUAGE
========================================================= */

function omLanguage() {

    const button =
        document.getElementById(
            "language-toggle"
        );


    const label =
        document.getElementById(
            "language-label"
        );


    if (!button) {
        return;
    }


    let language =
        localStorage.getItem(
            "om-language"
        ) || "bn";


    function applyLanguage() {

        if (label) {

            label.textContent =
                language === "bn"
                    ? "বাংলা / English"
                    : "English / বাংলা";
        }


        document.documentElement.lang =
            language === "bn"
                ? "bn"
                : "en";


        localStorage.setItem(
            "om-language",
            language
        );


        window.dispatchEvent(
            new CustomEvent(
                "omLanguageChanged",
                {
                    detail: {
                        language: language
                    }
                }
            )
        );
    }


    button.addEventListener(
        "click",
        function () {

            language =
                language === "bn"
                    ? "en"
                    : "bn";


            applyLanguage();
        }
    );


    applyLanguage();
}


/* =========================================================
   NETWORK
========================================================= */

function omNetwork() {

    const status =
        document.getElementById(
            "network-status"
        );


    const text =
        document.getElementById(
            "network-text"
        );


    if (!status || !text) {
        return;
    }


    function updateNetwork() {

        if (navigator.onLine) {

            status.classList.add(
                "online"
            );

            status.classList.remove(
                "offline"
            );

            text.textContent =
                "Online";

        } else {

            status.classList.add(
                "offline"
            );

            status.classList.remove(
                "online"
            );

            text.textContent =
                "Offline";
        }
    }


    updateNetwork();


    window.addEventListener(
        "online",
        updateNetwork
    );


    window.addEventListener(
        "offline",
        updateNetwork
    );
}


/* =========================================================
   LIVE TICKER
========================================================= */

function omTicker() {

    const ticker =
        document.getElementById(
            "ticker-message"
        );


    if (!ticker) {
        return;
    }


    const messages = {

        bn: [
            "OUR MAHESHKHALI — গুরুত্বপূর্ণ তথ্যের জন্য সরকারি ও বিশ্বস্ত উৎস যাচাই করুন।",
            "দুর্যোগের সময় স্থানীয় প্রশাসনের নির্দেশনা অনুসরণ করুন।",
            "জরুরি পরিস্থিতিতে সংশ্লিষ্ট জরুরি সেবা নম্বরে যোগাযোগ করুন।"
        ],

        en: [
            "OUR MAHESHKHALI — Verify important information through trusted official sources.",
            "During disasters, follow instructions from local authorities.",
            "In an emergency, contact the appropriate emergency service."
        ]

    };


    let index = 0;


    function updateTicker() {

        const language =
            localStorage.getItem(
                "om-language"
            ) || "bn";


        const list =
            messages[language] ||
            messages.bn;


        ticker.textContent =
            list[
                index % list.length
            ];


        index++;
    }


    updateTicker();


    setInterval(
        updateTicker,
        7000
    );


    window.addEventListener(
        "omLanguageChanged",
        updateTicker
    );
}


/* =========================================================
   EMERGENCY COMMAND CENTER
========================================================= */

function omEmergency() {

    const modal =
        document.getElementById(
            "emergency-command-modal"
        );


    const openButton =
        document.getElementById(
            "emergency-link"
        );


    const closeButton =
        document.getElementById(
            "command-close"
        );


    if (!modal || !openButton) {
        return;
    }


    function openEmergency() {

        modal.classList.add(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );
    }


    function closeEmergency() {

        modal.classList.remove(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );
    }


    openButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openEmergency();
        }
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeEmergency
        );
    }


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeEmergency();
            }
        }
    );


    window.OMEmergency = {

        open: openEmergency,

        close: closeEmergency

    };
}


/* =========================================================
   ALERT MODAL
========================================================= */

function omAlerts() {

    const modal =
        document.getElementById(
            "alert-subscribe-modal"
        );


    const button =
        document.getElementById(
            "alert-subscribe"
        );


    if (!modal || !button) {
        return;
    }


    const closeButton =
        modal.querySelector(
            ".alert-modal-close"
        );


    function openAlerts() {

        modal.classList.add(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );
    }


    function closeAlerts() {

        modal.classList.remove(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openAlerts();
        }
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeAlerts
        );
    }


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeAlerts();
            }
        }
    );


    window.OMAlerts = {

        open: openAlerts,

        close: closeAlerts

    };
}


/* =========================================================
   BROWSER NOTIFICATIONS
========================================================= */

function omNotifications() {

    const button =
        document.getElementById(
            "enable-browser-notifications"
        );


    if (!button) {
        return;
    }


    if (
        !("Notification" in window)
    ) {

        button.disabled = true;

        button.textContent =
            "Browser notification unavailable";

        return;
    }


    button.addEventListener(
        "click",
        async function () {

            try {

                const permission =
                    await Notification
                        .requestPermission();


                if (
                    permission === "granted"
                ) {

                    button.textContent =
                        "Notifications Enabled";


                    new Notification(
                        "OUR MAHESHKHALI",
                        {
                            body:
                                "Browser notifications are enabled."
                        }
                    );

                } else {

                    button.textContent =
                        "Notification Not Enabled";
                }

            } catch (error) {

                console.error(
                    "Notification error:",
                    error
                );
            }
        }
    );
}


/* =========================================================
   SEARCH CONNECTION
========================================================= */

function omSearch() {

    const button =
        document.getElementById(
            "top-search-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const overlay =
                document.getElementById(
                    "global-search-overlay"
                );


            const input =
                document.getElementById(
                    "global-search-input"
                );


            if (!overlay) {

                console.info(
                    "Global search overlay not found."
                );

                return;
            }


            overlay.classList.add(
                "is-open"
            );


            overlay.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "modal-open"
            );


            if (input) {

                setTimeout(
                    function () {

                        input.focus();

                    },
                    100
                );
            }
        }
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function omKeyboard() {

    document.addEventListener(
        "keydown",
        function (event) {


            /* ESC */

            if (
                event.key === "Escape"
            ) {

                if (
                    window.OMEmergency
                ) {

                    window.OMEmergency.close();
                }


                if (
                    window.OMAlerts
                ) {

                    window.OMAlerts.close();
                }


                const search =
                    document.getElementById(
                        "global-search-overlay"
                    );


                if (search) {

                    search.classList.remove(
                        "is-open"
                    );


                    search.setAttribute(
                        "aria-hidden",
                        "true"
                    );


                    document.body.classList.remove(
                        "modal-open"
                    );
                }
            }


            /* "/" SEARCH */

            if (
                event.key === "/" &&
                !omTypingField(event.target)
            ) {

                event.preventDefault();


                const searchButton =
                    document.getElementById(
                        "top-search-button"
                    );


                if (searchButton) {

                    searchButton.click();
                }
            }

        }
    );
}


/* =========================================================
   INPUT CHECK
========================================================= */

function omTypingField(element) {

    if (!element) {
        return false;
    }


    const tag =
        element.tagName.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
    );
}


/* =========================================================
   WEATHER / DISASTER CONTROL
========================================================= */

window.OUR_MAHESHKHALI = {

    updateWeather: function (
        text,
        icon
    ) {

        const weatherText =
            document.getElementById(
                "weather-text"
            );


        const weatherStatus =
            document.getElementById(
                "weather-status"
            );


        if (weatherText) {

            weatherText.textContent =
                text;
        }


        if (weatherStatus) {

            weatherStatus.textContent =
                icon || "🌤️";
        }
    },


    updateDisaster: function (
        text,
        icon
    ) {

        const disasterText =
            document.getElementById(
                "disaster-text"
            );


        const disasterStatus =
            document.getElementById(
                "disaster-status"
            );


        if (disasterText) {

            disasterText.textContent =
                text;
        }


        if (disasterStatus) {

            disasterStatus.textContent =
                icon || "✓";
        }
    }

};


/* =========================================================
   DEFAULT STATUS
========================================================= */

window.OUR_MAHESHKHALI.updateWeather(
    "Weather",
    "🌤️"
);


window.OUR_MAHESHKHALI.updateDisaster(
    "Alert Status",
    "✓"
);/* =========================================================
   OUR MAHESHKHALI
   TOP BAR FUNCTIONAL SYSTEM
   Existing HTML structure preserved
========================================================= */

(function () {

    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        omTopDateTime();
        omTopLanguage();
        omTopNetwork();
        omTopTicker();
        omTopEmergency();
        omTopSearch();

    });


    /* =====================================================
       DATE + TIME
       BANGLADESH TIME
    ===================================================== */

    function omTopDateTime() {

        const dayElement =
            document.getElementById("current-day");

        const dateElement =
            document.getElementById("current-date");

        const timeElement =
            document.getElementById("live-time");

        if (
            !dayElement &&
            !dateElement &&
            !timeElement
        ) return;


        const language =
            localStorage.getItem(
                "our-maheshkhali-language"
            ) || "en";


        function updateTime() {

            const now = new Date();

            const locale =
                language === "bn"
                    ? "bn-BD"
                    : "en-BD";


            if (dayElement) {

                dayElement.textContent =
                    new Intl.DateTimeFormat(
                        locale,
                        {
                            timeZone: "Asia/Dhaka",
                            weekday: "long"
                        }
                    ).format(now);

            }


            if (dateElement) {

                dateElement.textContent =
                    new Intl.DateTimeFormat(
                        locale,
                        {
                            timeZone: "Asia/Dhaka",
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    ).format(now);

            }


            if (timeElement) {

                timeElement.textContent =
                    new Intl.DateTimeFormat(
                        locale,
                        {
                            timeZone: "Asia/Dhaka",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true
                        }
                    ).format(now);

            }

        }


        updateTime();

        setInterval(
            updateTime,
            1000
        );


        window.addEventListener(
            "omLanguageChanged",
            updateTime
        );

    }


    /* =====================================================
       LANGUAGE
    ===================================================== */

    function omTopLanguage() {

        const button =
            document.getElementById(
                "language-toggle"
            );

        const label =
            document.getElementById(
                "language-label"
            );

        if (!button) return;


        let language =
            localStorage.getItem(
                "our-maheshkhali-language"
            ) || "en";


        function updateLanguageUI() {

            if (label) {

                label.textContent =
                    language === "bn"
                        ? "English / বাংলা"
                        : "বাংলা / English";

            }

            window.dispatchEvent(
                new Event("omLanguageChanged")
            );

        }


        updateLanguageUI();


        button.addEventListener(
            "click",
            function () {

                language =
                    language === "bn"
                        ? "en"
                        : "bn";

                localStorage.setItem(
                    "our-maheshkhali-language",
                    language
                );

                updateLanguageUI();

            }
        );

    }


    /* =====================================================
       ONLINE / OFFLINE
    ===================================================== */

    function omTopNetwork() {

        const network =
            document.getElementById(
                "network-status"
            );

        const text =
            document.getElementById(
                "network-text"
            );

        if (!network) return;


        function updateNetwork() {

            const online =
                navigator.onLine;


            network.classList.toggle(
                "online",
                online
            );

            network.classList.toggle(
                "offline",
                !online
            );


            if (text) {

                text.textContent =
                    online
                        ? "Online"
                        : "Offline";

            }

        }


        updateNetwork();


        window.addEventListener(
            "online",
            updateNetwork
        );

        window.addEventListener(
            "offline",
            updateNetwork
        );

    }


    /* =====================================================
       LIVE TICKER
    ===================================================== */

    function omTopTicker() {

        const ticker =
            document.getElementById(
                "ticker-message"
            );

        if (!ticker) return;


        const messages = [

            "OUR MAHESHKHALI — Important information and verified public updates.",

            "Explore Maheshkhali — History, Heritage, Tourism, Education and Community.",

            "One Island. One Community. One Platform.",

            "Stay connected with OUR MAHESHKHALI.",

            "Public information should be clear, useful and easy to access."

        ];


        let index = 0;


        function showMessage() {

            ticker.textContent =
                messages[index];

            index =
                (index + 1) %
                messages.length;

        }


        showMessage();


        setInterval(
            showMessage,
            6000
        );

    }


    /* =====================================================
       EMERGENCY COMMAND CENTER
    ===================================================== */

    function omTopEmergency() {

        const openButton =
            document.getElementById(
                "emergency-link"
            );

        const modal =
            document.getElementById(
                "emergency-command-modal"
            );

        if (
            !openButton ||
            !modal
        ) return;


        const panel =
            modal.querySelector(
                ".emergency-command-panel"
            );


        let closeButton =
            modal.querySelector(
                ".command-close"
            );


        function openEmergency() {

            modal.classList.add(
                "is-open"
            );

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-open"
            );


            if (closeButton) {

                setTimeout(
                    function () {
                        closeButton.focus();
                    },
                    100
                );

            }

        }


        function closeEmergency() {

            modal.classList.remove(
                "is-open"
            );

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "modal-open"
            );

        }


        openButton.addEventListener(
            "click",
            openEmergency
        );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeEmergency
            );

        }


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeEmergency();

                }

            }
        );


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    modal.classList.contains(
                        "is-open"
                    )
                ) {

                    closeEmergency();

                }

            }
        );


        window.OMTopEmergency = {
            open: openEmergency,
            close: closeEmergency
        };

    }


    /* =====================================================
       TOP SEARCH
       Connects to existing header search
    ===================================================== */

    function omTopSearch() {

        const button =
            document.getElementById(
                "top-search-button"
            );

        if (!button) return;


        button.addEventListener(
            "click",
            function () {

                /* Existing header search */

                if (
                    window.OMHeaderSearch &&
                    typeof window.OMHeaderSearch.open ===
                    "function"
                ) {

                    window.OMHeaderSearch.open();

                    return;

                }


                /* Existing search button */

                const headerSearch =
                    document.getElementById(
                        "open-search"
                    );

                if (headerSearch) {

                    headerSearch.click();

                }

            }
        );

    }


})();/* =========================================================
   OUR MAHESHKHALI
   HERO — 3D UNION FLOATING INTERACTION
========================================================= */

(function () {

    "use strict";


    function initHeroUnionMotion() {

        const hero =
            document.querySelector(".hero-section");

        const floatingArea =
            document.querySelector(".hero-floating-cards");

        const unionCards =
            document.querySelectorAll(".union-card");


        if (
            !hero ||
            !floatingArea ||
            !unionCards.length
        ) {
            return;
        }


        /* -------------------------------------------------
           RESPECT REDUCED MOTION
        ------------------------------------------------- */

        const reduceMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        if (reduceMotion.matches) {
            return;
        }


        /* -------------------------------------------------
           DESKTOP 3D PARALLAX
        ------------------------------------------------- */

        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;


        function updateMousePosition(event) {

            const rect =
                hero.getBoundingClientRect();

            const centerX =
                rect.left + rect.width / 2;

            const centerY =
                rect.top + rect.height / 2;


            mouseX =
                (event.clientX - centerX)
                / rect.width;

            mouseY =
                (event.clientY - centerY)
                / rect.height;

        }


        function animateParallax() {

            currentX +=
                (mouseX - currentX) * 0.035;

            currentY +=
                (mouseY - currentY) * 0.035;


            unionCards.forEach(
                function (card, index) {

                    const depth =
                        3 + (index % 4);

                    const moveX =
                        currentX * depth * 10;

                    const moveY =
                        currentY * depth * 8;


                    card.style.setProperty(
                        "--om-mouse-x",
                        moveX.toFixed(2) + "px"
                    );

                    card.style.setProperty(
                        "--om-mouse-y",
                        moveY.toFixed(2) + "px"
                    );

                }
            );


            requestAnimationFrame(
                animateParallax
            );

        }


        /* -------------------------------------------------
           APPLY MOUSE MOVEMENT
        ------------------------------------------------- */

        hero.addEventListener(
            "pointermove",
            updateMousePosition,
            { passive: true }
        );


        hero.addEventListener(
            "pointerleave",
            function () {

                mouseX = 0;
                mouseY = 0;

            },
            { passive: true }
        );


        animateParallax();


        /* -------------------------------------------------
           CARD HOVER
        ------------------------------------------------- */

        unionCards.forEach(
            function (card) {

                card.addEventListener(
                    "pointerenter",
                    function () {

                        card.classList.add(
                            "union-card-active"
                        );

                    }
                );


                card.addEventListener(
                    "pointerleave",
                    function () {

                        card.classList.remove(
                            "union-card-active"
                        );

                    }
                );

            }
        );

    }


    /* -----------------------------------------------------
       INITIALIZE
    ----------------------------------------------------- */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initHeroUnionMotion
        );

    } else {

        initHeroUnionMotion();

    }


})();/* =========================================================
   OUR MAHESHKHALI
   MAIN NAVIGATION FUNCTIONALITY
   DOES NOT CHANGE HTML STRUCTURE
========================================================= */

(function () {

    "use strict";

    function initMainNavigation() {

        const navigation =
            document.querySelector("#main-navigation");

        if (!navigation) return;

        const dropdownItems =
            navigation.querySelectorAll(".has-dropdown");

        const dropdownButtons =
            navigation.querySelectorAll(".dropdown-trigger");

        const allLinks =
            navigation.querySelectorAll("a");

        /* =====================================================
           CLOSE ALL DROPDOWNS
        ===================================================== */

        function closeAllDropdowns(except = null) {

            dropdownItems.forEach(function (item) {

                if (item === except) return;

                item.classList.remove("is-open");

                const button =
                    item.querySelector(".dropdown-trigger");

                if (button) {
                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });

        }

        /* =====================================================
           OPEN / CLOSE DROPDOWN
        ===================================================== */

        dropdownButtons.forEach(function (button) {

            button.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                const parent =
                    button.closest(".has-dropdown");

                if (!parent) return;

                const isOpen =
                    parent.classList.contains("is-open");

                closeAllDropdowns(parent);

                if (isOpen) {

                    parent.classList.remove("is-open");

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                } else {

                    parent.classList.add("is-open");

                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            });

        });

        /* =====================================================
           HOVER / KEYBOARD SUPPORT
        ===================================================== */

        dropdownItems.forEach(function (item) {

            item.addEventListener("mouseenter", function () {

                if (window.innerWidth > 900) {

                    closeAllDropdowns(item);

                    item.classList.add("is-open");

                    const button =
                        item.querySelector(".dropdown-trigger");

                    if (button) {
                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );
                    }

                }

            });

            item.addEventListener("mouseleave", function () {

                if (window.innerWidth > 900) {

                    item.classList.remove("is-open");

                    const button =
                        item.querySelector(".dropdown-trigger");

                    if (button) {
                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }

                }

            });

        });

        /* =====================================================
           SUB MENU LINK CLICK
        ===================================================== */

        allLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                const parentDropdown =
                    link.closest(".has-dropdown");

                if (parentDropdown) {

                    parentDropdown.classList.remove(
                        "is-open"
                    );

                    const button =
                        parentDropdown.querySelector(
                            ".dropdown-trigger"
                        );

                    if (button) {
                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }

                }

            });

        });

        /* =====================================================
           NORMAL MENU LINK ACTIVE STATE
        ===================================================== */

        allLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                const parent =
                    link.closest(".navigation-list");

                if (!parent) return;

                parent
                    .querySelectorAll(".nav-link.active")
                    .forEach(function (activeLink) {

                        activeLink.classList.remove(
                            "active"
                        );

                    });

                if (!link.classList.contains(
                    "dropdown-trigger"
                )) {

                    link.classList.add("active");

                }

            });

        });

        /* =====================================================
           HOME
        ===================================================== */

        const homeLink =
            navigation.querySelector(
                'a[href="#home"]'
            );

        if (homeLink) {

            homeLink.addEventListener(
                "click",
                function (event) {

                    const home =
                        document.querySelector("#home");

                    if (!home) return;

                    event.preventDefault();

                    home.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }

        /* =====================================================
           ESC KEY
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") return;

                closeAllDropdowns();

            }
        );

        /* =====================================================
           CLICK OUTSIDE
        ===================================================== */

        document.addEventListener(
            "click",
            function (event) {

                if (!navigation.contains(event.target)) {

                    closeAllDropdowns();

                }

            }
        );

        /* =====================================================
           RESIZE
        ===================================================== */

        window.addEventListener(
            "resize",
            function () {

                if (window.innerWidth > 900) {

                    navigation
                        .querySelectorAll(
                            ".has-dropdown.is-open"
                        )
                        .forEach(function (item) {

                            item.classList.remove(
                                "is-open"
                            );

                            const button =
                                item.querySelector(
                                    ".dropdown-trigger"
                                );

                            if (button) {

                                button.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                            }

                        });

                }

            }
        );

    }

    /* =========================================================
       DOM READY
    ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initMainNavigation
        );

    } else {

        initMainNavigation();

    }

})();/* =========================================================
   🌍 SPIN UNIVERSAL LEARNING HUB
   BS~9Q-5F + AI + EDUCATION + ISLAMIC + BUSINESS
   + ENTREPRENEUR + RESEARCH + DEVELOPER + PROJECTS

   IMPORTANT:
   Existing SPIN HTML/CSS is preserved.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const spinButton = document.getElementById("spin-button");
    const spinCount = document.getElementById("spin-count");

    if (!spinButton || !spinCount) {
        console.warn("SPIN button/count not found.");
        return;
    }


    /* =====================================================
       STORAGE
    ===================================================== */

    let spinNumber =
        parseInt(localStorage.getItem("spinNumber")) || 0;

    let learningScore =
        parseInt(localStorage.getItem("learningScore")) || 0;

    spinCount.textContent = spinNumber;


    /* =====================================================
       🌱 YOUR PROJECT LINKS
    ===================================================== */

    const PROJECTS = {

        asa:
            "https://anuprerona.com/",

        ai:
            "https://anuprerona.com/",

        bs9q5f:
            "https://bs9q5f.com/",

        agl:
            "https://anuprerona.com/"

    };


    /* =====================================================
       🔗 UNIVERSAL RESOURCE DATABASE
    ===================================================== */

    const resources = [

        /* ================= AI ================= */

        {
            category: "AI",
            icon: "🤖",
            title: "AIxploria",
            description:
                "Explore AI tools and AI categories.",
            url: "https://www.aixploria.com/"
        },

        {
            category: "AI",
            icon: "🧰",
            title: "Toolify AI",
            description:
                "Discover AI tools and AI resources.",
            url: "https://www.toolify.ai/"
        },

        {
            category: "AI",
            icon: "💬",
            title: "Poe",
            description:
                "Explore AI assistants and bots.",
            url: "https://poe.com/"
        },

        {
            category: "AI",
            icon: "🔎",
            title: "Perplexity",
            description:
                "AI-powered search and research.",
            url: "https://www.perplexity.ai/"
        },

        {
            category: "AI",
            icon: "🧠",
            title: "Hugging Face",
            description:
                "AI models, datasets and machine learning resources.",
            url: "https://huggingface.co/"
        },

        {
            category: "AI",
            icon: "✨",
            title: "Google AI",
            description:
                "Explore Google's AI ecosystem.",
            url: "https://ai.google/"
        },

        {
            category: "AI",
            icon: "🧪",
            title: "Google AI Studio",
            description:
                "Experiment with generative AI.",
            url: "https://aistudio.google.com/"
        },

        {
            category: "AI",
            icon: "📓",
            title: "NotebookLM",
            description:
                "AI-assisted research and document learning.",
            url: "https://notebooklm.google/"
        },

        {
            category: "AI",
            icon: "💻",
            title: "GitHub Copilot",
            description:
                "AI assistance for coding.",
            url: "https://github.com/features/copilot"
        },


        /* ================= PRESENTATION ================= */

        {
            category: "Presentation",
            icon: "📊",
            title: "Gamma",
            description:
                "Create presentations and visual documents.",
            url: "https://gamma.app/"
        },

        {
            category: "Presentation",
            icon: "🎨",
            title: "Canva",
            description:
                "Design presentations, graphics and documents.",
            url: "https://www.canva.com/"
        },

        {
            category: "Presentation",
            icon: "📑",
            title: "Beautiful.ai",
            description:
                "Presentation design and automation.",
            url: "https://www.beautiful.ai/"
        },


        /* ================= IMAGE ================= */

        {
            category: "Creative",
            icon: "🖼️",
            title: "Adobe Firefly",
            description:
                "Generative AI creative tools.",
            url: "https://firefly.adobe.com/"
        },

        {
            category: "Creative",
            icon: "🎨",
            title: "Leonardo AI",
            description:
                "AI-powered creative image generation.",
            url: "https://leonardo.ai/"
        },

        {
            category: "Creative",
            icon: "🖌️",
            title: "Ideogram",
            description:
                "AI creative image generation.",
            url: "https://ideogram.ai/"
        },


        /* ================= VIDEO ================= */

        {
            category: "Video",
            icon: "🎬",
            title: "Runway",
            description:
                "AI-powered video creation and editing.",
            url: "https://runwayml.com/"
        },

        {
            category: "Video",
            icon: "🎥",
            title: "HeyGen",
            description:
                "AI video and avatar creation.",
            url: "https://www.heygen.com/"
        },

        {
            category: "Video",
            icon: "✂️",
            title: "CapCut",
            description:
                "Video editing and creative tools.",
            url: "https://www.capcut.com/"
        },


        /* ================= CODING ================= */

        {
            category: "Developer",
            icon: "🌐",
            title: "MDN Web Docs",
            description:
                "HTML, CSS and JavaScript documentation.",
            url: "https://developer.mozilla.org/"
        },

        {
            category: "Developer",
            icon: "💻",
            title: "W3Schools",
            description:
                "Beginner-friendly web development learning.",
            url: "https://www.w3schools.com/"
        },

        {
            category: "Developer",
            icon: "👨‍💻",
            title: "freeCodeCamp",
            description:
                "Free programming and web development courses.",
            url: "https://www.freecodecamp.org/"
        },

        {
            category: "Developer",
            icon: "🐙",
            title: "GitHub",
            description:
                "Code hosting and developer collaboration.",
            url: "https://github.com/"
        },

        {
            category: "Developer",
            icon: "⚡",
            title: "Replit",
            description:
                "Online coding and development environment.",
            url: "https://replit.com/"
        },


        /* ================= RESEARCH ================= */

        {
            category: "Research",
            icon: "🔬",
            title: "Google Scholar",
            description:
                "Search academic literature and scholarly resources.",
            url: "https://scholar.google.com/"
        },

        {
            category: "Research",
            icon: "📚",
            title: "Khan Academy",
            description:
                "Free educational resources.",
            url: "https://www.khanacademy.org/"
        },


        /* ================= ISLAMIC ================= */

        {
            category: "Islamic",
            icon: "🕌",
            title: "Quran.com",
            description:
                "Read and study the Quran.",
            url: "https://quran.com/"
        },

        {
            category: "Islamic",
            icon: "📖",
            title: "Sunnah.com",
            description:
                "Hadith collection and Islamic resources.",
            url: "https://sunnah.com/"
        },


        /* ================= BUSINESS ================= */

        {
            category: "Business",
            icon: "💼",
            title: "Entrepreneur",
            description:
                "Entrepreneurship and business resources.",
            url: "https://www.entrepreneur.com/"
        },

        {
            category: "Business",
            icon: "🚀",
            title: "U.S. Small Business Administration",
            description:
                "Business planning and entrepreneurship resources.",
            url: "https://www.sba.gov/business-guide"
        },


        /* ================= YOUR PROJECTS ================= */

        {
            category: "Anuprerona",
            icon: "🎓",
            title: "Anuprerona Skill Academy",
            description:
                "Learn Skill, Build Future — skill, entrepreneurship and digital business learning.",
            url: PROJECTS.asa
        },

        {
            category: "Anuprerona",
            icon: "🤖",
            title: "Anuprerona AI",
            description:
                "AI, learning, productivity and innovation.",
            url: PROJECTS.ai
        },

        {
            category: "Anuprerona",
            icon: "🧠",
            title: "BS~9Q-5F Mindmap Method™",
            description:
                "Universal thinking, research and problem-solving framework.",
            url: PROJECTS.bs9q5f
        },

        {
            category: "Anuprerona",
            icon: "🌐",
            title: "Anuprerona Global Limited",
            description:
                "Build Future Together.",
            url: PROJECTS.agl
        }

    ];


    /* =====================================================
       🎓 EDUCATION TOPICS
    ===================================================== */

    const educationTopics = [

        "⌨️ Typing & Keyboard Skills",
        "💻 Computer Basics",
        "📚 English Learning",
        "➗ Mathematics",
        "🔬 Science",
        "🌐 HTML",
        "🎨 CSS",
        "⚡ JavaScript",
        "🖥️ Web Development",
        "📱 Digital Skills",
        "🔐 Cyber Security",
        "☁️ Cloud Computing",
        "📊 Data Analysis",
        "🤖 Artificial Intelligence",
        "🧠 Prompt Engineering",
        "📢 Digital Marketing",
        "💼 Freelancing"

    ];


    /* =====================================================
       🕌 ISLAMIC LEARNING PATH
    ===================================================== */

    const islamicTopics = [

        "📖 Introduction to Holy Quran",

        "🌙 Revelation of Quran",

        "🕋 Makki & Madani Surahs",

        "📚 114 Surahs",

        "📜 Ayah & Juz",

        "🇧🇩 Bengali Translation",

        "🇬🇧 English Translation",

        "📖 Tafsir",

        "🧠 Quran Understanding",

        "💡 Reflection & Learning",

        "🕌 Salah",

        "🌙 Sawm / Ramadan",

        "💰 Zakat",

        "🕋 Hajj",

        "🤲 Du'a",

        "📜 Hadith",

        "❤️ Akhlaq",

        "🧔 Seerah",

        "🏺 Islamic History"

    ];


    /* =====================================================
       🚀 ENTREPRENEURSHIP TOPICS
    ===================================================== */

    const businessTopics = [

        "💡 Business Idea",

        "🔍 Problem Identification",

        "👥 Customer Research",

        "🌍 Market Research",

        "🏪 Competitor Analysis",

        "🎯 Target Market",

        "📦 Product Development",

        "💰 Pricing",

        "📢 Marketing",

        "🛒 Sales",

        "📊 Financial Planning",

        "🧾 Business Plan",

        "🏗️ Business Model",

        "🚀 Startup",

        "🌐 E-commerce",

        "📱 Digital Business",

        "👨‍💼 Career Development",

        "📈 Business Growth"

    ];


    /* =====================================================
       🧠 BS~9Q-5F COMMAND
    ===================================================== */

    const BS9Q5F_COMMAND = `

🌍 BS~9Q-5F Mindmap Method™
Universal AI Master Command

🎭 ROLE & MISSION

Act as an elite multi-disciplinary expert panel:

🎓 World-Class Researcher
⚙️ Systems Engineer
💼 Business Consultant
🤖 AI Specialist
🗺️ Visual Strategist

Mission:
Analyze the TARGET TOPIC using the
BS~9Q-5F Intelligence Architecture and
produce a professional PDF-ready report.

────────────────────────

🔴 LAYER 1 — 9Q MINDMAP ENGINE

What?
Why?
When?
Where?
How?
Who?
Which?
Whose?
Whom?

Find hidden questions.
Identify information gaps.
Connect the answers.
Extract the highest-value insight.

────────────────────────

🟤 LAYER 2 — MINDMAP SETUP

FAST
FOCUS
FUN
FLEXIBLE
FEEDBACK

Apply 80/20.
Use analogies.
Use multiple perspectives.
Improve through feedback.

────────────────────────

🟢 LAYER 3 — REALITY SETUP

FOCUS
FILTER
FRAME
FORM
FLOW

Convert knowledge into
practical execution.

────────────────────────

🔵 LAYER 4 — VISUAL ARCHITECTURE

Use the most useful:

📊 Charts
🌳 Mindmaps
🔁 Flowcharts
📐 Matrices
🧭 Decision Trees
🎯 Fishbone
📅 Timeline
📌 Gantt
🏗️ Architecture
🔗 ERD
📋 Comparison
🕸️ Radar

Use visuals strategically.

────────────────────────

📋 20-STEP OUTPUT

1. Executive Summary
2. Definition & Importance
3. Origin & Etymology
4. History & Timeline
5. Deep 9Q Analysis
6. Mindmap Setup
7. Nested Mindmap
8. Process Flowchart
9. Strategic Matrix
10. System Architecture
11. Performance Analysis
12. Reality Setup
13. Comparative Intelligence
14. Implementation Roadmap
15. 30-Day Project Plan
16. Essential Tools & AI Prompts
17. Practical Projects
18. Business & Career Mapping
19. Cause & Effect
20. Final Summary & Next Action

────────────────────────

🔍 INTELLIGENCE CHECKS

Assumption Check
Hypothesis Test
Red Team
Devil's Advocate
Gap Analysis
Pattern Finder
Cross-Domain Analysis
Future Scenarios
Trade-Off Analysis
Decision Intelligence
Noise Filter
80/20 Analysis
Iteration
Self-Critique
Quality Check

────────────────────────

⚠️ RULES

FACT → LOGIC → CONTEXT →
COMPLETENESS → CLARITY →
CREATIVITY → PRACTICAL VALUE

Separate:

FACT
ASSUMPTION
OPINION
UNCERTAINTY

Do not invent numerical data.

Use evidence where available.

Use Mermaid.js for diagrams.

Provide Bengali + English when useful.

Always finish with:

🚀 NEXT ACTION

────────────────────────

👤 CREATOR

Badsha Solyman
⚓ Mariner | 💻 Developer | 🚀 Founder

🎯 TARGET TOPIC:

[Write Topic / Question / Problem]

FINAL PRINCIPLE:

Minimum Complexity
→ Maximum Insight
→ Maximum Practical Value
`;


    /* =====================================================
       🎨 DYNAMIC STYLE
    ===================================================== */

    function injectStyles() {

        if (document.getElementById("spin-universal-style")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "spin-universal-style";

        style.textContent = `

        #spin-learning-hub {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            background: rgba(0,0,0,.75);
            font-family: Arial, sans-serif;
        }

        .suh-box {
            width: min(980px,100%);
            max-height: 94vh;
            overflow-y: auto;
            background: #fff;
            border: 4px solid #800000;
            border-radius: 20px;
            padding: 20px;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,.35);
        }

        .suh-header {
            text-align: center;
            border-bottom: 2px solid #228B22;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }

        .suh-header h2 {
            color: #800000;
            margin: 0;
        }

        .suh-header p {
            color: #228B22;
            font-weight: bold;
        }

        .suh-close {
            position: absolute;
            top: 10px;
            right: 12px;
            width: 38px;
            height: 38px;
            border: 2px solid #800000;
            border-radius: 50%;
            background: #fff;
            color: #800000;
            font-size: 24px;
            cursor: pointer;
        }

        .suh-stats {
            display: grid;
            grid-template-columns: repeat(3,1fr);
            gap: 10px;
            margin-bottom: 15px;
        }

        .suh-stat {
            text-align: center;
            border: 2px solid #228B22;
            border-radius: 12px;
            padding: 10px;
        }

        .suh-stat strong {
            display: block;
            color: #800000;
            font-size: 21px;
        }

        .suh-menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit,minmax(135px,1fr));
            gap: 9px;
        }

        .suh-menu {
            border: 2px solid #800000;
            border-radius: 12px;
            background: #fff;
            color: #800000;
            padding: 13px 7px;
            font-weight: bold;
            cursor: pointer;
        }

        .suh-menu:hover {
            border-color: #228B22;
            transform: translateY(-2px);
        }

        .suh-content {
            margin-top: 18px;
        }

        .suh-card {
            border: 2px solid #228B22;
            border-radius: 13px;
            padding: 15px;
            margin: 10px 0;
        }

        .suh-card h3,
        .suh-card h4 {
            color: #800000;
            margin-top: 0;
        }

        .suh-card p {
            line-height: 1.55;
        }

        .suh-btn {
            display: inline-block;
            border: 2px solid #800000;
            background: #fff;
            color: #800000;
            padding: 9px 13px;
            border-radius: 9px;
            cursor: pointer;
            font-weight: bold;
            text-decoration: none;
            margin: 3px;
        }

        .suh-btn:hover {
            border-color: #228B22;
            color: #228B22;
        }

        .suh-input,
        .suh-textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 11px;
            border: 2px solid #800000;
            border-radius: 9px;
            margin: 6px 0;
        }

        .suh-command {
            white-space: pre-wrap;
            background: #fff;
            border: 2px solid #800000;
            border-radius: 12px;
            padding: 15px;
            max-height: 500px;
            overflow-y: auto;
            line-height: 1.55;
            font-size: 13px;
        }

        .suh-result {
            border: 2px solid #D4AF37;
            border-radius: 10px;
            padding: 12px;
            margin-top: 10px;
            text-align: center;
            font-weight: bold;
        }

        .suh-footer {
            text-align: center;
            border-top: 2px solid #228B22;
            margin-top: 18px;
            padding-top: 12px;
            color: #D4AF37;
            font-weight: bold;
        }

        @media(max-width:600px) {

            .suh-stats {
                grid-template-columns: 1fr;
            }

            .suh-box {
                padding: 14px;
            }

        }

        `;

        document.head.appendChild(style);

    }


    /* =====================================================
       🚪 OPEN HUB
    ===================================================== */

    function openHub() {

        injectStyles();

        const old =
            document.getElementById("spin-learning-hub");

        if (old) {
            old.remove();
        }

        const hub = document.createElement("div");

        hub.id = "spin-learning-hub";

        hub.innerHTML = `

            <div class="suh-box">

                <button
                    class="suh-close"
                    id="suh-close"
                >×</button>

                <div class="suh-header">

                    <h2>
                        🌍 SPIN Universal Learning Hub
                    </h2>

                    <p>
                        Learn • Think • Practice • Build • Grow
                    </p>

                </div>

                <div class="suh-stats">

                    <div class="suh-stat">
                        <strong id="suh-spin">
                            ${spinNumber}
                        </strong>
                        SPIN
                    </div>

                    <div class="suh-stat">
                        <strong id="suh-score">
                            ${learningScore}
                        </strong>
                        Learning Score
                    </div>

                    <div class="suh-stat">
                        <strong>
                            BS~9Q-5F
                        </strong>
                        Intelligence
                    </div>

                </div>

                <div class="suh-menu-grid">

                    <button class="suh-menu"
                        data-action="typing">
                        ⌨️ Typing
                    </button>

                    <button class="suh-menu"
                        data-action="education">
                        🎓 Education
                    </button>

                    <button class="suh-menu"
                        data-action="ai">
                        🤖 AI World
                    </button>

                    <button class="suh-menu"
                        data-action="islamic">
                        🕌 Islamic
                    </button>

                    <button class="suh-menu"
                        data-action="business">
                        🚀 Business
                    </button>

                    <button class="suh-menu"
                        data-action="research">
                        🔬 Research
                    </button>

                    <button class="suh-menu"
                        data-action="developer">
                        💻 Developer
                    </button>

                    <button class="suh-menu"
                        data-action="creative">
                        🎨 Creative
                    </button>

                    <button class="suh-menu"
                        data-action="bs9q5f">
                        🧠 BS~9Q-5F
                    </button>

                    <button class="suh-menu"
                        data-action="projects">
                        🌱 My Projects
                    </button>

                    <button class="suh-menu"
                        data-action="links">
                        🔗 All Tools
                    </button>

                    <button class="suh-menu"
                        data-action="challenge">
                        🎯 Challenge
                    </button>

                </div>

                <div
                    class="suh-content"
                    id="suh-content"
                ></div>

                <div class="suh-footer">
                    Build Future Together
                </div>

            </div>

        `;

        document.body.appendChild(hub);


        document.getElementById("suh-close").onclick =
            closeHub;


        hub.addEventListener("click", function (event) {

            if (event.target === hub) {
                closeHub();
            }

        });


        hub.querySelectorAll(".suh-menu")
            .forEach(function (button) {

                button.onclick = function () {

                    const action =
                        button.dataset.action;

                    if (action === "typing")
                        showTyping();

                    if (action === "education")
                        showEducation();

                    if (action === "ai")
                        showAI();

                    if (action === "islamic")
                        showIslamic();

                    if (action === "business")
                        showBusiness();

                    if (action === "research")
                        showCategory("Research");

                    if (action === "developer")
                        showCategory("Developer");

                    if (action === "creative")
                        showCreative();

                    if (action === "bs9q5f")
                        showBS9Q5F();

                    if (action === "projects")
                        showProjects();

                    if (action === "links")
                        showAllTools();

                    if (action === "challenge")
                        showChallenge();

                };

            });

    }


    /* =====================================================
       CLOSE
    ===================================================== */

    function closeHub() {

        const hub =
            document.getElementById("spin-learning-hub");

        if (hub) {
            hub.remove();
        }

    }


    /* =====================================================
       CONTENT
    ===================================================== */

    function content(html) {

        const box =
            document.getElementById("suh-content");

        if (box) {
            box.innerHTML = html;
        }

    }


    /* =====================================================
       SCORE
    ===================================================== */

    function addScore(points) {

        learningScore += points;

        localStorage.setItem(
            "learningScore",
            learningScore
        );

        const score =
            document.getElementById("suh-score");

        if (score) {
            score.textContent =
                learningScore;
        }

    }


    /* =====================================================
       ⌨️ TYPING
    ===================================================== */

    function showTyping() {

        const texts = [

            "The quick brown fox jumps over the lazy dog.",

            "Pack my box with five dozen liquor jugs.",

            "Sphinx of black quartz, judge my vow.",

            "How quickly daft jumping zebras vex.",

            "Learning skills can create new opportunities.",

            "Build skills today and create value tomorrow."

        ];

        const text =
            texts[
                Math.floor(
                    Math.random() * texts.length
                )
            ];

        content(`

            <div class="suh-card">

                <h3>⌨️ Typing Academy</h3>

                <p>
                    <strong>Type this sentence:</strong>
                </p>

                <p>${text}</p>

                <textarea
                    id="typing-area"
                    class="suh-textarea"
                    rows="5"
                    placeholder="Start typing..."
                ></textarea>

                <button
                    class="suh-btn"
                    id="typing-test"
                >
                    Check Result
                </button>

                <button
                    class="suh-btn"
                    id="typing-new"
                >
                    New Text
                </button>

                <div
                    id="typing-result"
                ></div>

            </div>

        `);


        const start =
            Date.now();


        document.getElementById(
            "typing-test"
        ).onclick = function () {

            const typed =
                document.getElementById(
                    "typing-area"
                ).value;

            if (!typed.trim()) {

                alert(
                    "Please type something first."
                );

                return;
            }

            let correct = 0;

            const compare =
                Math.min(
                    typed.length,
                    text.length
                );

            for (
                let i = 0;
                i < compare;
                i++
            ) {

                if (
                    typed[i] === text[i]
                ) {
                    correct++;
                }

            }

            const accuracy =
                Math.round(
                    (correct / text.length) * 100
                );

            const minutes =
                Math.max(
                    (Date.now() - start) / 60000,
                    0.01
                );

            const words =
                typed.trim()
                    .split(/\s+/)
                    .length;

            const wpm =
                Math.round(
                    words / minutes
                );

            const points =
                accuracy >= 80 ? 10 : 5;

            addScore(points);

            document.getElementById(
                "typing-result"
            ).innerHTML = `

                <div class="suh-result">

                    ⌨️ WPM: ${wpm}
                    <br>

                    🎯 Accuracy: ${accuracy}%
                    <br>

                    🏆 +${points} Score

                </div>

            `;

        };


        document.getElementById(
            "typing-new"
        ).onclick = showTyping;

    }


    /* =====================================================
       🎓 EDUCATION
    ===================================================== */

    function showEducation() {

        let html = `

            <div class="suh-card">

                <h3>
                    🎓 Education Learning Path
                </h3>

        `;

        educationTopics.forEach(
            function (topic) {

                html += `
                    <div class="suh-card">
                        ${topic}
                    </div>
                `;

            }
        );

        html += `

            </div>

            <div class="suh-card">

                <h3>
                    🌱 Anuprerona Skill Academy
                </h3>

                <p>
                    Learn Skill, Build Future.
                </p>

                <a
                    class="suh-btn"
                    href="${PROJECTS.asa}"
                    target="_blank"
                    rel="noopener"
                >
                    🎓 Explore ASA
                </a>

            </div>

        `;

        content(html);

    }


    /* =====================================================
       🤖 AI WORLD
    ===================================================== */

    function showAI() {

        const ai =
            resources.filter(
                item => item.category === "AI"
            );

        let html = `

            <div class="suh-card">

                <h3>
                    🤖 AI World
                </h3>

                <p>
                    AI Search • Research • Coding •
                    Productivity • Models • Tools
                </p>

            </div>

        `;

        ai.forEach(function (item) {

            html += toolCard(item);

        });


        html += `

            <div class="suh-card">

                <h3>
                    🌱 Anuprerona AI
                </h3>

                <p>
                    AI learning, productivity,
                    research and innovation.
                </p>

                <a
                    class="suh-btn"
                    href="${PROJECTS.ai}"
                    target="_blank"
                    rel="noopener"
                >
                    🤖 Explore Anuprerona AI
                </a>

            </div>

        `;

        content(html);

    }


    /* =====================================================
       🕌 ISLAMIC
    ===================================================== */

    function showIslamic() {

        let html = `

            <div class="suh-card">

                <h3>
                    🕌 Islamic Learning — Step by Step
                </h3>

                <p>
                    Learn → Understand → Reflect → Practice
                </p>

            </div>

        `;

        islamicTopics.forEach(
            function (topic, index) {

                html += `

                    <div class="suh-card">

                        <strong>
                            ${index + 1}.
                            ${topic}
                        </strong>

                    </div>

                `;

            }
        );


        html += `

            <div class="suh-card">

                <h3>
                    📖 Quran Resources
                </h3>

                <a
                    class="suh-btn"
                    href="https://quran.com/"
                    target="_blank"
                    rel="noopener"
                >
                    Quran.com ↗
                </a>

                <a
                    class="suh-btn"
                    href="https://sunnah.com/"
                    target="_blank"
                    rel="noopener"
                >
                    Sunnah.com ↗
                </a>

            </div>

        `;

        content(html);

    }


    /* =====================================================
       🚀 BUSINESS
    ===================================================== */

    function showBusiness() {

        let html = `

            <div class="suh-card">

                <h3>
                    🚀 Entrepreneurship & Business
                </h3>

                <p>
                    Problem → Idea → Customer →
                    Market → Business → Income → Growth
                </p>

            </div>

        `;

        businessTopics.forEach(
            function (topic, index) {

                html += `

                    <div class="suh-card">

                        <strong>
                            ${index + 1}.
                            ${topic}
                        </strong>

                    </div>

                `;

            }
        );


        html += `

            <div class="suh-card">

                <h3>
                    🎓 ASA Entrepreneurship
                </h3>

                <p>
                    Skill → Idea → Plan → Startup →
                    Business → Finance → Market →
                    Income → Employment → Growth
                </p>

                <a
                    class="suh-btn"
                    href="${PROJECTS.asa}"
                    target="_blank"
                    rel="noopener"
                >
                    Explore ASA
                </a>

            </div>

        `;

        content(html);

    }


    /* =====================================================
       🔬 CATEGORY
    ===================================================== */

    function showCategory(category) {

        const items =
            resources.filter(
                item => item.category === category
            );

        let html = `

            <div class="suh-card">

                <h3>
                    ${category}
                </h3>

            </div>

        `;

        items.forEach(
            item => {
                html += toolCard(item);
            }
        );

        content(html);

    }


    /* =====================================================
       🎨 CREATIVE
    ===================================================== */

    function showCreative() {

        const categories = [
            "Creative",
            "Presentation",
            "Video"
        ];

        let html = `

            <div class="suh-card">

                <h3>
                    🎨 Creative & Presentation
                </h3>

            </div>

        `;

        categories.forEach(
            function (category) {

                const items =
                    resources.filter(
                        item =>
                            item.category === category
                    );

                items.forEach(
                    item => {
                        html += toolCard(item);
                    }
                );

            }
        );

        content(html);

    }


    /* =====================================================
       🔗 TOOL CARD
    ===================================================== */

    function toolCard(item) {

        return `

            <div class="suh-card">

                <h3>
                    ${item.icon}
                    ${item.title}
                </h3>

                <p>
                    ${item.description}
                </p>

                <a
                    class="suh-btn"
                    href="${item.url}"
                    target="_blank"
                    rel="noopener"
                >
                    Open ↗
                </a>

            </div>

        `;

    }


    /* =====================================================
       🔗 ALL TOOLS
    ===================================================== */

    function showAllTools() {

        let html = `

            <div class="suh-card">

                <h3>
                    🔗 Universal Tools Directory
                </h3>

                <input
                    id="tool-search"
                    class="suh-input"
                    placeholder="Search AI, Quran, Business, Coding..."
                >

            </div>

            <div id="tool-list"></div>

        `;

        content(html);

        renderTools(resources);


        document.getElementById(
            "tool-search"
        ).addEventListener(
            "input",
            function () {

                const query =
                    this.value
                        .toLowerCase()
                        .trim();

                const filtered =
                    resources.filter(
                        item =>
                            item.title
                                .toLowerCase()
                                .includes(query)
                            ||
                            item.category
                                .toLowerCase()
                                .includes(query)
                            ||
                            item.description
                                .toLowerCase()
                                .includes(query)
                    );

                renderTools(filtered);

            }
        );

    }


    function renderTools(items) {

        const list =
            document.getElementById(
                "tool-list"
            );

        if (!list) return;

        if (!items.length) {

            list.innerHTML = `

                <div class="suh-result">
                    No resource found.
                </div>

            `;

            return;
        }

        list.innerHTML =
            items
                .map(toolCard)
                .join("");

    }


    /* =====================================================
       🧠 BS~9Q-5F UNIVERSAL COMMAND
    ===================================================== */

    function showBS9Q5F() {

        content(`

            <div class="suh-card">

                <h3>
                    🌍 BS~9Q-5F Universal AI Master Command
                </h3>

                <p>
                    একটি Topic / Question / Problem লিখে
                    Universal Intelligence Framework ব্যবহার করুন।
                </p>

                <textarea
                    id="bs-topic"
                    class="suh-textarea"
                    rows="4"
                    placeholder="Example: How can I start a small digital business?"
                ></textarea>

                <button
                    class="suh-btn"
                    id="copy-command"
                >
                    📋 Copy Master Command
                </button>

                <button
                    class="suh-btn"
                    id="copy-topic-command"
                >
                    🧠 Copy + Add My Topic
                </button>

                <div
                    class="suh-command"
                >${BS9Q5F_COMMAND}</div>

                <div
                    id="copy-result"
                ></div>

            </div>

            <div class="suh-card">

                <h3>
                    🧠 BS~9Q-5F Method™
                </h3>

                <p>
                    প্রশ্ন করুন → বিশ্লেষণ করুন →
                    কাঠামো তৈরি করুন → বাস্তবে প্রয়োগ করুন।
                </p>

                <a
                    class="suh-btn"
                    href="${PROJECTS.bs9q5f}"
                    target="_blank"
                    rel="noopener"
                >
                    Explore BS~9Q-5F ↗
                </a>

            </div>

        `);


        document.getElementById(
            "copy-command"
        ).onclick = async function () {

            await copyText(
                BS9Q5F_COMMAND
            );

            showCopyMessage(
                "Master Command copied!"
            );

        };


        document.getElementById(
            "copy-topic-command"
        ).onclick = async function () {

            const topic =
                document.getElementById(
                    "bs-topic"
                ).value.trim();

            if (!topic) {

                alert(
                    "Please enter your Topic / Question / Problem."
                );

                return;
            }

            const finalCommand =
                BS9Q5F_COMMAND.replace(
                    "[Write Topic / Question / Problem]",
                    topic
                );

            await copyText(
                finalCommand
            );

            showCopyMessage(
                "Your customized BS~9Q-5F command copied!"
            );

            addScore(10);

        };

    }


    /* =====================================================
       📋 COPY
    ===================================================== */

    async function copyText(text) {

        try {

            await navigator.clipboard.writeText(
                text
            );

        } catch (error) {

            const textarea =
                document.createElement("textarea");

            textarea.value = text;

            document.body.appendChild(
                textarea
            );

            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();

        }

    }


    function showCopyMessage(message) {

        const result =
            document.getElementById(
                "copy-result"
            );

        if (result) {

            result.innerHTML = `

                <div class="suh-result">
                    ✅ ${message}
                </div>

            `;

        }

    }


    /* =====================================================
       🎯 CHALLENGE
    ===================================================== */

    function showChallenge() {

        const challenges = [

            "⌨️ Type the pangram without looking at the keyboard.",

            "💻 Create a simple HTML webpage.",

            "🎨 Design one CSS card.",

            "⚡ Write one JavaScript function.",

            "🤖 Learn one new AI tool.",

            "🔬 Research one topic using multiple sources.",

            "🚀 Write one business idea that solves a real problem.",

            "💼 Identify one customer problem.",

            "🕌 Read and understand one Quran passage.",

            "🇬🇧 Learn 10 new English words.",

            "🧠 Analyze one problem using the 9Q Engine.",

            "📊 Create a simple business plan.",

            "🎤 Create a five-slide presentation.",

            "🌐 Build one small website section."

        ];

        const challenge =
            challenges[
                Math.floor(
                    Math.random() *
                    challenges.length
                )
            ];

        content(`

            <div class="suh-card">

                <h3>
                    🎯 Universal Daily Challenge
                </h3>

                <div class="suh-result">

                    ${challenge}

                </div>

                <button
                    class="suh-btn"
                    id="challenge-done"
                >
                    ✅ Completed
                </button>

                <button
                    class="suh-btn"
                    id="challenge-new"
                >
                    🔄 New Challenge
                </button>

                <div
                    id="challenge-message"
                ></div>

            </div>

        `);


        document.getElementById(
            "challenge-done"
        ).onclick = function () {

            addScore(15);

            document.getElementById(
                "challenge-message"
            ).innerHTML = `

                <div class="suh-result">
                    🏆 Excellent!
                    <br>
                    +15 Learning Score
                </div>

            `;

        };


        document.getElementById(
            "challenge-new"
        ).onclick =
            showChallenge;

    }


    /* =====================================================
       🌍 SPIN CLICK
    ===================================================== */

    spinButton.addEventListener(
        "click",
        function () {

            spinNumber++;

            localStorage.setItem(
                "spinNumber",
                spinNumber
            );

            spinCount.textContent =
                spinNumber;

            openHub();

        }
    );


    /* =====================================================
       ESC TO CLOSE
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeHub();

            }

        }
    );

/* =========================================================
   📖 UNIVERSAL ENGLISH DICTIONARY
   Alphabet → Word → Meaning → Sentence → Practice → Quiz
   ========================================================= */

const dictionaryWords = [

    {
        word: "Ability",
        pronunciation: "অ্যাবিলিটি",
        meaning: "ক্ষমতা",
        englishMeaning: "The power or skill to do something.",
        sentence: "She has the ability to learn quickly.",
        sentenceBangla: "তার দ্রুত শেখার ক্ষমতা আছে।"
    },

    {
        word: "Achieve",
        pronunciation: "অ্যাচিভ",
        meaning: "অর্জন করা",
        englishMeaning: "To successfully reach a goal.",
        sentence: "You can achieve your goals through practice.",
        sentenceBangla: "অনুশীলনের মাধ্যমে তুমি তোমার লক্ষ্য অর্জন করতে পারো।"
    },

    {
        word: "Action",
        pronunciation: "অ্যাকশন",
        meaning: "কাজ / পদক্ষেপ",
        englishMeaning: "Something that is done.",
        sentence: "Knowledge becomes useful through action.",
        sentenceBangla: "কাজের মাধ্যমে জ্ঞান কার্যকর হয়।"
    },

    {
        word: "Business",
        pronunciation: "বিজনেস",
        meaning: "ব্যবসা",
        englishMeaning: "An activity of buying, selling or providing services.",
        sentence: "He wants to start a small business.",
        sentenceBangla: "সে একটি ছোট ব্যবসা শুরু করতে চায়।"
    },

    {
        word: "Build",
        pronunciation: "বিল্ড",
        meaning: "তৈরি করা / নির্মাণ করা",
        englishMeaning: "To make or create something.",
        sentence: "We can build a better future together.",
        sentenceBangla: "আমরা একসাথে একটি ভালো ভবিষ্যৎ তৈরি করতে পারি।"
    },

    {
        word: "Challenge",
        pronunciation: "চ্যালেঞ্জ",
        meaning: "চ্যালেঞ্জ / কঠিন কাজ",
        englishMeaning: "A difficult task or problem.",
        sentence: "Every challenge can teach us something.",
        sentenceBangla: "প্রতিটি চ্যালেঞ্জ আমাদের কিছু শেখাতে পারে।"
    },

    {
        word: "Create",
        pronunciation: "ক্রিয়েট",
        meaning: "সৃষ্টি করা / তৈরি করা",
        englishMeaning: "To make something new.",
        sentence: "Technology helps people create new solutions.",
        sentenceBangla: "প্রযুক্তি মানুষকে নতুন সমাধান তৈরি করতে সাহায্য করে।"
    },

    {
        word: "Develop",
        pronunciation: "ডেভেলপ",
        meaning: "উন্নত করা / বিকশিত করা",
        englishMeaning: "To grow, improve or create something.",
        sentence: "Students should develop useful skills.",
        sentenceBangla: "শিক্ষার্থীদের প্রয়োজনীয় দক্ষতা উন্নত করা উচিত।"
    },

    {
        word: "Education",
        pronunciation: "এডুকেশন",
        meaning: "শিক্ষা",
        englishMeaning: "The process of learning knowledge and skills.",
        sentence: "Education can create new opportunities.",
        sentenceBangla: "শিক্ষা নতুন সুযোগ তৈরি করতে পারে।"
    },

    {
        word: "Entrepreneur",
        pronunciation: "এন্টারপ্রেনার",
        meaning: "উদ্যোক্তা",
        englishMeaning: "A person who starts and develops a business.",
        sentence: "An entrepreneur looks for problems that can be solved.",
        sentenceBangla: "একজন উদ্যোক্তা সমাধানযোগ্য সমস্যা খুঁজে বের করেন।"
    },

    {
        word: "Future",
        pronunciation: "ফিউচার",
        meaning: "ভবিষ্যৎ",
        englishMeaning: "The time that is yet to come.",
        sentence: "We should prepare for the future.",
        sentenceBangla: "আমাদের ভবিষ্যতের জন্য প্রস্তুত হওয়া উচিত।"
    },

    {
        word: "Growth",
        pronunciation: "গ্রোথ",
        meaning: "বৃদ্ধি / উন্নতি",
        englishMeaning: "The process of becoming larger or better.",
        sentence: "Continuous learning supports personal growth.",
        sentenceBangla: "নিয়মিত শেখা ব্যক্তিগত উন্নতিতে সহায়তা করে।"
    },

    {
        word: "Idea",
        pronunciation: "আইডিয়া",
        meaning: "ধারণা / চিন্তা",
        englishMeaning: "A thought or plan about something.",
        sentence: "Every great project starts with an idea.",
        sentenceBangla: "প্রতিটি বড় প্রকল্প একটি ধারণা দিয়ে শুরু হয়।"
    },

    {
        word: "Improve",
        pronunciation: "ইমপ্রুভ",
        meaning: "উন্নতি করা",
        englishMeaning: "To make something better.",
        sentence: "Practice helps you improve your skills.",
        sentenceBangla: "অনুশীলন তোমার দক্ষতা উন্নত করতে সাহায্য করে।"
    },

    {
        word: "Knowledge",
        pronunciation: "নলেজ",
        meaning: "জ্ঞান",
        englishMeaning: "Information and understanding gained through learning.",
        sentence: "Knowledge becomes powerful when we use it wisely.",
        sentenceBangla: "জ্ঞান সঠিকভাবে ব্যবহার করলে শক্তিতে পরিণত হয়।"
    },

    {
        word: "Learn",
        pronunciation: "লার্ন",
        meaning: "শেখা",
        englishMeaning: "To gain knowledge or skill.",
        sentence: "We should learn something new every day.",
        sentenceBangla: "আমাদের প্রতিদিন নতুন কিছু শেখা উচিত।"
    },

    {
        word: "Opportunity",
        pronunciation: "অপরচুনিটি",
        meaning: "সুযোগ",
        englishMeaning: "A suitable chance to do something.",
        sentence: "Learning can create new opportunities.",
        sentenceBangla: "শেখা নতুন সুযোগ তৈরি করতে পারে।"
    },

    {
        word: "Practice",
        pronunciation: "প্র্যাকটিস",
        meaning: "অনুশীলন",
        englishMeaning: "Repeated activity to improve a skill.",
        sentence: "Practice makes your skills stronger.",
        sentenceBangla: "অনুশীলন তোমার দক্ষতাকে আরও শক্তিশালী করে।"
    },

    {
        word: "Problem",
        pronunciation: "প্রবলেম",
        meaning: "সমস্যা",
        englishMeaning: "A situation that needs a solution.",
        sentence: "A good business can solve a real problem.",
        sentenceBangla: "একটি ভালো ব্যবসা বাস্তব সমস্যার সমাধান করতে পারে।"
    },

    {
        word: "Research",
        pronunciation: "রিসার্চ",
        meaning: "গবেষণা",
        englishMeaning: "Careful study to discover information.",
        sentence: "Good research helps us make better decisions.",
        sentenceBangla: "ভালো গবেষণা আমাদের ভালো সিদ্ধান্ত নিতে সাহায্য করে।"
    },

    {
        word: "Skill",
        pronunciation: "স্কিল",
        meaning: "দক্ষতা",
        englishMeaning: "The ability to do something well.",
        sentence: "A useful skill can create career opportunities.",
        sentenceBangla: "একটি প্রয়োজনীয় দক্ষতা ক্যারিয়ারের সুযোগ তৈরি করতে পারে।"
    },

    {
        word: "Success",
        pronunciation: "সাকসেস",
        meaning: "সাফল্য",
        englishMeaning: "The achievement of a desired result.",
        sentence: "Consistent effort can lead to success.",
        sentenceBangla: "নিয়মিত প্রচেষ্টা সাফল্যের দিকে নিয়ে যেতে পারে।"
    },

    {
        word: "Technology",
        pronunciation: "টেকনোলজি",
        meaning: "প্রযুক্তি",
        englishMeaning: "The use of scientific knowledge for practical purposes.",
        sentence: "Technology is changing the way we learn.",
        sentenceBangla: "প্রযুক্তি আমাদের শেখার পদ্ধতি পরিবর্তন করছে।"
    },

    {
        word: "Understand",
        pronunciation: "আন্ডারস্ট্যান্ড",
        meaning: "বোঝা",
        englishMeaning: "To know the meaning of something.",
        sentence: "Try to understand before you memorize.",
        sentenceBangla: "মুখস্থ করার আগে বোঝার চেষ্টা করো।"
    },

    {
        word: "Value",
        pronunciation: "ভ্যালু",
        meaning: "মূল্য / গুরুত্ব",
        englishMeaning: "The importance or usefulness of something.",
        sentence: "A good product should provide value to customers.",
        sentenceBangla: "একটি ভালো পণ্য গ্রাহকের জন্য মূল্য তৈরি করা উচিত।"
    },

    {
        word: "Vision",
        pronunciation: "ভিশন",
        meaning: "দৃষ্টিভঙ্গি / ভবিষ্যৎ লক্ষ্য",
        englishMeaning: "A clear idea of a desired future.",
        sentence: "A strong vision can guide a project.",
        sentenceBangla: "একটি শক্তিশালী দৃষ্টিভঙ্গি একটি প্রকল্পকে পথ দেখাতে পারে।"
    },

    {
        word: "Wisdom",
        pronunciation: "উইজডম",
        meaning: "প্রজ্ঞা",
        englishMeaning: "The ability to use knowledge and experience wisely.",
        sentence: "Knowledge and wisdom are not exactly the same.",
        sentenceBangla: "জ্ঞান ও প্রজ্ঞা একই বিষয় নয়।"

    }

];


/* =========================================================
   📖 DICTIONARY MAIN SCREEN
   ========================================================= */

function showDictionary() {

    content(`

        <div class="suh-card">

            <h3>
                📖 English Learning Dictionary
            </h3>

            <p>
                Word → Meaning → Pronunciation →
                Sentence → Practice → Quiz
            </p>

            <input
                id="dictionary-search"
                class="suh-input"
                placeholder="Search English word..."
            >

        </div>


        <div class="suh-card">

            <h3>
                🔤 Alphabet
            </h3>

            <div id="alphabet-buttons"></div>

        </div>


        <div id="dictionary-list"></div>

    `);


    createAlphabetButtons();

    renderDictionary(
        dictionaryWords
    );


    document.getElementById(
        "dictionary-search"
    ).addEventListener(
        "input",
        function () {

            const query =
                this.value
                    .toLowerCase()
                    .trim();

            const results =
                dictionaryWords.filter(
                    item =>
                        item.word
                            .toLowerCase()
                            .includes(query)
                        ||
                        item.meaning
                            .toLowerCase()
                            .includes(query)
                        ||
                        item.sentence
                            .toLowerCase()
                            .includes(query)
                );

            renderDictionary(
                results
            );

        }
    );

}


/* =========================================================
   🔤 ALPHABET
   ========================================================= */

function createAlphabetButtons() {

    const box =
        document.getElementById(
            "alphabet-buttons"
        );

    if (!box) return;

    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            .split("");

    box.innerHTML = alphabet
        .map(
            letter => `

                <button
                    class="suh-btn"
                    data-letter="${letter}"
                >
                    ${letter}
                </button>

            `
        )
        .join("");


    box.querySelectorAll(
        "[data-letter]"
    ).forEach(
        function (button) {

            button.onclick =
                function () {

                    const letter =
                        button.dataset.letter;

                    const results =
                        dictionaryWords.filter(
                            item =>
                                item.word
                                    .toUpperCase()
                                    .startsWith(
                                        letter
                                    )
                        );

                    renderDictionary(
                        results
                    );

                };

        }
    );

}


/* =========================================================
   📚 RENDER WORDS
   ========================================================= */

function renderDictionary(
    words
) {

    const list =
        document.getElementById(
            "dictionary-list"
        );

    if (!list) return;


    if (!words.length) {

        list.innerHTML = `

            <div class="suh-result">
                ❌ Word not found.
            </div>

        `;

        return;

    }


    list.innerHTML =
        words
            .map(
                function (item, index) {

                    return `

                        <div
                            class="suh-card"
                        >

                            <h3>
                                ${item.word}
                            </h3>

                            <p>
                                🔊
                                ${item.pronunciation}
                            </p>

                            <p>
                                🇧🇩
                                <strong>
                                    ${item.meaning}
                                </strong>
                            </p>

                            <p>
                                🇬🇧
                                ${item.englishMeaning}
                            </p>

                            <p>
                                📝
                                <strong>
                                    ${item.sentence}
                                </strong>
                            </p>

                            <p>
                                🇧🇩
                                ${item.sentenceBangla}
                            </p>

                            <button
                                class="suh-btn"
                                data-learn="${index}"
                            >
                                🧠 Learn Word
                            </button>

                            <button
                                class="suh-btn"
                                data-speak="${index}"
                            >
                                🔊 Listen
                            </button>

                        </div>

                    `;

                }
            )
            .join("");


    list.querySelectorAll(
        "[data-learn]"
    ).forEach(
        function (button) {

            button.onclick =
                function () {

                    const index =
                        parseInt(
                            button.dataset.learn
                        );

                    showWordPractice(
                        words[index]
                    );

                };

        }
    );


    list.querySelectorAll(
        "[data-speak]"
    ).forEach(
        function (button) {

            button.onclick =
                function () {

                    const index =
                        parseInt(
                            button.dataset.speak
                        );

                    speakWord(
                        words[index].word
                    );

                };

        }
    );

}


/* =========================================================
   🧠 WORD PRACTICE
   ========================================================= */

function showWordPractice(
    item
) {

    content(`

        <div class="suh-card">

            <h3>
                🧠 Learn This Word
            </h3>

            <h2>
                ${item.word}
            </h2>

            <p>
                🔊 ${item.pronunciation}
            </p>

            <p>
                🇧🇩 ${item.meaning}
            </p>

            <p>
                🇬🇧 ${item.englishMeaning}
            </p>

            <hr>

            <p>
                📝 ${item.sentence}
            </p>

            <p>
                🇧🇩 ${item.sentenceBangla}
            </p>

        </div>


        <div class="suh-card">

            <h3>
                ✍️ Practice Writing
            </h3>

            <input
                id="word-practice"
                class="suh-input"
                placeholder="Type: ${item.word}"
            >

            <button
                class="suh-btn"
                id="check-word"
            >
                Check
            </button>

            <div id="word-result"></div>

        </div>


        <div class="suh-card">

            <h3>
                🧠 Quick Quiz
            </h3>

            <p>
                What is the Bengali meaning of
                <strong>${item.word}</strong>?
            </p>

            <button
                class="suh-btn"
                data-answer="correct"
            >
                ${item.meaning}
            </button>

            <button
                class="suh-btn"
                data-answer="wrong"
            >
                Problem
            </button>

            <button
                class="suh-btn"
                data-answer="wrong"
            >
                Future
            </button>

            <div id="word-quiz-result"></div>

        </div>

        <button
            class="suh-btn"
            id="dictionary-back"
        >
            ← Back to Dictionary
        </button>

    `);


    document.getElementById(
        "check-word"
    ).onclick =
        function () {

            const value =
                document.getElementById(
                    "word-practice"
                ).value
                    .trim()
                    .toLowerCase();

            const result =
                document.getElementById(
                    "word-result"
                );

            if (
                value ===
                item.word.toLowerCase()
            ) {

                addScore(5);

                result.innerHTML = `

                    <div class="suh-result">
                        ✅ Correct!
                        <br>
                        +5 Learning Score
                    </div>

                `;

            } else {

                result.innerHTML = `

                    <div class="suh-result">
                        ❌ Try again.
                        <br>
                        Correct word:
                        ${item.word}
                    </div>

                `;

            }

        };


    document.querySelectorAll(
        "[data-answer]"
    ).forEach(
        function (button) {

            button.onclick =
                function () {

                    const result =
                        document.getElementById(
                            "word-quiz-result"
                        );

                    if (
                        button.dataset.answer ===
                        "correct"
                    ) {

                        addScore(10);

                        result.innerHTML = `

                            <div class="suh-result">
                                🎉 Correct!
                                <br>
                                +10 Learning Score
                            </div>

                        `;

                    } else {

                        result.innerHTML = `

                            <div class="suh-result">
                                ❌ Not correct.
                                <br>
                                Try learning the word again.
                            </div>

                        `;

                    }

                };

        }
    );


    document.getElementById(
        "dictionary-back"
    ).onclick =
        showDictionary;

}


/* =========================================================
   🔊 TEXT TO SPEECH
   ========================================================= */

function speakWord(
    word
) {

    if (
        "speechSynthesis" in window
    ) {

        const speech =
            new SpeechSynthesisUtterance(
                word
            );

        speech.lang = "en-US";

        speech.rate = 0.8;

        window.speechSynthesis.speak(
            speech
        );

    } else {

        alert(
            "Speech feature is not supported by this browser."
        );

    }

}});/* =========================================================
   ABOUT MAHESHKHALI — FUNCTIONAL INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const readMoreBtn =
        document.getElementById("about-read-more");

    const extraContent =
        document.getElementById("about-extra-content");


    const verificationBtn =
        document.getElementById("about-verification");

    const verificationPanel =
        document.getElementById("about-verification-panel");


    const copyBtn =
        document.getElementById("about-copy");


    /* =====================================================
       READ FULL PROFILE
    ===================================================== */

    if (readMoreBtn && extraContent) {

        readMoreBtn.addEventListener("click", function () {

            const isOpen =
                readMoreBtn.getAttribute("aria-expanded") === "true";


            if (isOpen) {

                extraContent.hidden = true;

                readMoreBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                readMoreBtn.innerHTML =
                    "📖 Read Full Profile";

            } else {

                extraContent.hidden = false;

                readMoreBtn.setAttribute(
                    "aria-expanded",
                    "true"
                );

                readMoreBtn.innerHTML =
                    "📕 Hide Full Profile";

            }

        });

    }


    /* =====================================================
       VERIFICATION PANEL
    ===================================================== */

    if (verificationBtn && verificationPanel) {

        verificationBtn.addEventListener("click", function () {

            const isOpen =
                verificationBtn.getAttribute("aria-expanded") === "true";


            if (isOpen) {

                verificationPanel.hidden = true;

                verificationBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                verificationBtn.innerHTML =
                    "✓ Verification";

            } else {

                verificationPanel.hidden = false;

                verificationBtn.setAttribute(
                    "aria-expanded",
                    "true"
                );

                verificationBtn.innerHTML =
                    "✓ Hide Verification";

            }

        });

    }


    /* =====================================================
       COPY INFORMATION
    ===================================================== */

    if (copyBtn) {

        copyBtn.addEventListener("click", async function () {

            const aboutSection =
                document.getElementById("about");


            if (!aboutSection) return;


            const text =
                aboutSection.innerText;


            try {

                await navigator.clipboard.writeText(text);


                const originalText =
                    copyBtn.innerHTML;


                copyBtn.innerHTML =
                    "✅ Copied!";


                setTimeout(function () {

                    copyBtn.innerHTML =
                        originalText;

                }, 1800);


            } catch (error) {

                /* Fallback */

                const textarea =
                    document.createElement("textarea");

                textarea.value = text;

                textarea.style.position = "fixed";

                textarea.style.opacity = "0";

                document.body.appendChild(textarea);

                textarea.select();

                document.execCommand("copy");

                textarea.remove();


                copyBtn.innerHTML =
                    "✅ Copied!";


                setTimeout(function () {

                    copyBtn.innerHTML =
                        "📋 Copy Information";

                }, 1800);

            }

        });

    }

});/* =========================================================
   ABOUT INFORMATION CARDS — FUNCTIONAL NAVIGATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const aboutButtons =
        document.querySelectorAll(
            ".info-card-action[data-about-topic]"
        );


    aboutButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const topic =
                button.getAttribute("data-about-topic");


            /*
             * যদি তোমার website-এ পরে dedicated pages থাকে,
             * এখানে সেই pages-এর ID/URL বসানো যাবে।
             */

            const targetMap = {

                geography: "geography",

                nature: "hills-nature",

                coastal: "coastal-areas",

                community: "community-people"

            };


            const targetId =
                targetMap[topic];


            if (!targetId) return;


            const target =
                document.getElementById(targetId);


            if (target) {

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                target.setAttribute(
                    "data-highlighted",
                    "true"
                );


                setTimeout(function () {

                    target.removeAttribute(
                        "data-highlighted"
                    );

                }, 1200);

            }

        });

    });

});