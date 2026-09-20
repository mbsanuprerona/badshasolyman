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


})();