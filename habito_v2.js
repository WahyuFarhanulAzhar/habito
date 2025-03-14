import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/ScrollTrigger.js";
import { Flip } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/Flip.js";
import { CustomEase } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/CustomEase.js";
import barbaCore from "https://cdn.skypack.dev/@barba/core@2.10.3";
import Lenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.19/dist/lenis.mjs";
import SplitType from "https://cdn.jsdelivr.net/npm/split-type@0.3.3/+esm";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

function initGSAP() {
  gsap.registerPlugin(CustomEase, Flip, ScrollTrigger);
  CustomEase.create("primary-ease", "0.62, 0.05, 0.01, 0.99"),
    CustomEase.create("primary-ease-out", "0.17,0.84,0.44,1"),
    ScrollTrigger.defaults({
      markers: false,
    });
  gsap.defaults({
    duration: 1.25,
  });
}

function initLenis() {
  if (Webflow.env("editor") === undefined) {
    // Inisialisasi Lenis
    const lenis = new Lenis();

    // Sinkronisasi Lenis dengan GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Tambahkan ke GSAP ticker agar animasi tetap smooth
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP memberikan waktu dalam detik, perlu dikonversi ke milidetik
    });

    // Matikan lag smoothing agar tidak ada delay di scroll animasi
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }
}

function resetWebflow(e) {
  const t = $(new DOMParser().parseFromString(e.next.html, "text/html")).find("html");
  $("html").attr("data-wf-page", t.attr("data-wf-page")),
    window.Webflow && window.Webflow.destroy(),
    window.Webflow && window.Webflow.ready(),
    window.Webflow && window.Webflow.require("ix2").init(),
    $(".w--current").removeClass("w--current"),
    $("a").each(function () {
      $(this).attr("href") === window.location.pathname && $(this).addClass("w--current");
    }),
    t.find("[data-barba-script]").each(function () {
      let e = $(this).text();
      if (e.includes("DOMContentLoaded")) {
        const t = e.replace(/window\.addEventListener\("DOMContentLoaded",\s*\(\s*event\s*\)\s*=>\s*{\s*/, "");
        e = t.replace(/\s*}\s*\);\s*$/, "");
      }
      const t = document.createElement("script");
      (t.type = "text/javascript"), $(this).attr("src") && (t.src = $(this).attr("src")), (t.text = e), document.body.appendChild(t).remove();
    });
}

function disableCurrentLinks() {
  document.addEventListener("click", function (e) {
    const t = e.target.closest("a");
    if (t) {
      if (window.location.href.split("#")[0] === t.href.split("#")[0]) return void e.preventDefault();
    }
  });
}

function initSplitText() {
  const typeSplit1 = new SplitType("[split-1]", {
    types: "chars",
    tagName: "span",
  });

  const typeSplit2 = new SplitType("[split-2]", {
    types: "lines, words, chars",
    tagName: "div",
  });

  $("[split-2] .line").each(function () {
    $(this).wrap('<div class="line-wrap"></div>');
  });
}

function initMarquee() {
  gsap.to("[marquee]", {
    xPercent: -100,
    ease: "linear",
    duration: 50,
    repeat: -1,
  });
}

function initTrMarquee() {
  function e(e, t) {
    const r = typeof e;
    return "string" !== typeof t || "" === t.trim() ? e : ("true" === t && "boolean" === r) || (("false" !== t || "boolean" !== r) && (isNaN(t) && "string" === r ? t : isNaN(t) || "number" !== r ? e : +t));
  }
  $("[tr-marquee-element='component']").each(function () {
    function t(e) {
      d = e;
      const t = {
          value: 1,
        },
        r = gsap.timeline({
          onUpdate: () => g.timeScale(t.value),
        });
      e
        ? (r.fromTo(
            t,
            {
              value: m,
            },
            {
              value: 0,
              duration: 0.5,
            }
          ),
          n.addClass("is-paused"))
        : (r.fromTo(
            t,
            {
              value: 0,
            },
            {
              value: m,
              duration: 0.5,
            }
          ),
          n.removeClass("is-paused"));
    }
    let r = $(this),
      o = r.find("[tr-marquee-element='panel']"),
      a = r.find("[tr-marquee-element='triggerhover']"),
      n = r.find("[tr-marquee-element='triggerclick']"),
      i = e(100, r.attr("tr-marquee-speed")),
      l = e(!1, r.attr("tr-marquee-vertical")),
      s = e(!1, r.attr("tr-marquee-reverse")),
      c = e(!1, r.attr("tr-marquee-scrolldirection")),
      u = e(!1, r.attr("tr-marquee-scrollscrub")),
      p = -100,
      m = 1,
      d = !1;
    s && (p = 100);
    const g = gsap.timeline({
      repeat: -1,
      onReverseComplete: () => g.progress(1),
    });
    l
      ? ((i = o.first().height() / i),
        g.fromTo(
          o,
          {
            yPercent: 0,
          },
          {
            yPercent: p,
            ease: "none",
            duration: i,
          }
        ))
      : ((i = o.first().width() / i),
        g.fromTo(
          o,
          {
            xPercent: 0,
          },
          {
            xPercent: p,
            ease: "none",
            duration: i,
          }
        ));
    const f = {
      value: 1,
    };
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (e) => {
        if (!d && (c && m !== e.direction && ((m = e.direction), g.timeScale(e.direction)), u)) {
          let t = 0.006 * e.getVelocity();
          (t = gsap.utils.clamp(-20, 20, t)),
            gsap
              .timeline({
                onUpdate: () => g.timeScale(f.value),
              })
              .fromTo(
                f,
                {
                  value: t,
                },
                {
                  value: m,
                  duration: 0.5,
                }
              );
        }
      },
    }),
      window.matchMedia("(pointer: fine)").matches && (a.on("mouseenter", () => t(!0)), a.on("mouseleave", () => t(!1))),
      n.on("click", function () {
        $(this).hasClass("is-paused") ? t(!1) : t(!0);
      });
  });
}

function initScrollToTop(lenisInstance) {
  const btn = document.querySelector("[scroll-to-top]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    lenisInstance.scrollTo(0, {
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  });
}

function initReelsAnimation() {
  $(".about-wrapper").each(function () {
    const triggerElement = $(this);
    const targetElement = $(".reels-wrap");

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 70%",
          end: "bottom 50%",
          scrub: 1,
        },
      })
      .fromTo(targetElement, { width: "100%", y: "0svh" }, { width: "25%", y: "167svh" });
  });
}

function aboutReelsAnimation() {
  $(".section-hero-group").each(function () {
    const triggerElement = $(this);
    const targetElement = $(".reels-wrap");

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top top",
          end: "90% bottom",
          scrub: 1,
        },
      })
      .fromTo(targetElement, { y: "-88svh", x: "70svw", width: "25%" }, { y: "0", x: "0", width: "100%" });
  });
}

function initReelsFlip() {
  $(document).ready(function () {
    const $reelsWrap = $(".reels-wrap");
    const $originalParent = $reelsWrap.parent();
    const $targetParent = $(".about-reels");

    ScrollTrigger.create({
      trigger: ".section.is-about",
      start: "top 30%",
      end: "bottom 50%",
      onEnter: () => moveReels($targetParent),
      onLeaveBack: () => moveReels($originalParent),
    });
  });
}

function moveReels($newParent) {
  const state = Flip.getState($(".reels-wrap")[0]);
  $newParent.append($(".reels-wrap"));
  Flip.from(state, { duration: 1.5, ease: "none" });
}

function initWorkSectionAnimation() {
  $(".work-head-block").each(function () {
    const triggerElement = $(this);
    const targetElement = $(".section.is-work");

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "bottom 75%",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .fromTo(targetElement, { backgroundColor: "#CBEB3A", color: "#111" }, { backgroundColor: "#111", color: "#fff" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top top",
          end: "bottom 50%",
          scrub: 1,
        },
      })
      .from(".work-head-wrap", { scale: 1.75 });
  });
}

function initBrandingAnimation() {
  $(".section.is-branding").each(function () {
    const triggerElement = $(this);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top top",
          end: "80% bottom",
          scrub: 1,
        },
      })
      .fromTo(".branding-head", { scale: 0.55 }, { scale: 1 })
      .fromTo(".branding-head-wrap", { scale: 1.6 }, { scale: 1 }, 0.0);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "10% top",
          end: "80% bottom",
          scrub: 1,
        },
      })
      .fromTo(".section-nav", { opacity: 0 }, { opacity: 1 })
      .fromTo("[branding-img]", { width: "0em" }, { width: "7.5em" })
      .fromTo("[text-wrap]", { x: "-0.75em" }, { x: "0em" })
      .from(".branding-head-wrap", { yPercent: 35 }, { yPercent: 0 });
  });
}

function initPartnerAccordion() {
  $(".partner-item").each(function () {
    const $item = $(this);
    const $clientImg = $item.find(".client-img");
    const $clientName = $item.find(".client-name");
    const $text = $item.find(".partner-item-content");

    // Set default state
    gsap.set($clientImg, { scale: 0 });
    gsap.set($clientName, { x: -52 });

    // Hover Animation
    $item.hover(
      function () {
        if (!$(this).hasClass("active")) {
          gsap.to($clientImg, { scale: 1, duration: 0.3, ease: "power2.out" });
          gsap.to($clientName, { x: 0, duration: 0.3, ease: "power2.out" });
        }
      },
      function () {
        if (!$(this).hasClass("active")) {
          gsap.to($clientImg, { scale: 0, duration: 0.3, ease: "power2.out" });
          gsap.to($clientName, { x: -52, duration: 0.3, ease: "power2.out" });
        }
      }
    );

    // Click Event for Accordion
    $item.on("click", function () {
      const isActive = $(this).hasClass("active");

      // Reset semua item lain
      $(".partner-item").removeClass("active");
      $(".partner-item-content").stop(true, true).slideUp();
      gsap.to($(".client-img"), { scale: 0, duration: 0.3, ease: "power2.out" });
      gsap.to($(".client-name"), { x: -52, duration: 0.3, ease: "power2.out" });

      // Toggle current item
      if (!isActive) {
        $(this).addClass("active");
        $text.stop(true, true).slideDown();
        gsap.to($clientImg, { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to($clientName, { x: 0, duration: 0.3, ease: "power2.out" });
      }
    });
  });
}

function initServiceAnimation() {
  $(".section.is-service").each(function () {
    const triggerElement = $(this);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 80%",
          end: "bottom top",
          scrub: 1,
        },
      })
      .fromTo(".service-head", { x: "50vw" }, { x: "-80vw" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 80%",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .from(".service-text .char", { y: "75svh", scale: 1.5, stagger: { each: 0.3 } });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .fromTo(".service-item", { y: "100svh", stagger: 0.2 }, { y: "0", stagger: 0.2 });
  });
}

function initHeadOverlay() {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".section.is-about",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
    .to(".overlay", { opacity: 0.5 });
}

function initSectionOverlap() {
  gsap.utils.toArray("[data-overlap-previous]").forEach((e) => {
    const t = e.previousElementSibling;
    if (!t) return;
    const r = document.createElement("div");
    (r.className = "g_section-overlay"), t.appendChild(r);
    const o = () => window.innerHeight / 4,
      a = gsap.timeline({
        scrollTrigger: {
          trigger: e,
          start: "top bottom",
          end: "top top",
          scrub: !0,
          onRefresh: (e) => {
            e.end = `bottom+=${o()}px top`;
          },
        },
      });
    a.to(
      t,
      {
        y: () => o(),
        rotate: 0.001,
        ease: "none",
      },
      0
    ),
      a.to(
        r,
        {
          opacity: 0.5,
          ease: "none",
        },
        0
      ),
      ScrollTrigger.create({
        trigger: e,
        start: "top bottom",
        end: "top top",
        onEnter: () => {
          gsap.set(e, {
            zIndex: 1,
          }),
            gsap.set(t, {
              zIndex: 0,
            });
        },
        onLeaveBack: () => {
          gsap.set(e, {
            zIndex: "auto",
          }),
            gsap.set(t, {
              zIndex: "auto",
            });
        },
      });
  });
}
function reviewSwiper() {
  const swiper = new Swiper(".swiper.is-review", {
    direction: "horizontal",
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    speed: 400,
    navigation: {
      nextEl: ".swiper-btn-next",
      prevEl: ".swiper-btn-prev",
    },
  });
}

function linesAnimation() {
  $("[text-reveal]").each(function () {
    const triggerElement = $(this); // Elemen yang memicu animasi
    const lines = triggerElement.find(".line"); // Ambil semua line-wrap

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top 80%", // Mulai animasi saat elemen masuk viewport
      },
    });

    tl.from(lines, {
      yPercent: 110, // Geser ke bawah saat masuk
      stagger: 0.1, // Delay antar line
      duration: 1.25,
      ease: "primary-ease-out",
    });
  });
}

function leaveAnimation(e) {
  const t = document.querySelector(".transition-overlay"),
    r = gsap.timeline();
  return (
    gsap.set(t, {
      display: "block",
    }),
    "closed" !== navStatus && (setNavStatus("closing"), closeNav(navStatus, setNavStatus)),
    r
      .to(e, {
        opacity: 0,
        ease: "primary-ease",
      })
      .from(
        t,
        {
          autoAlpha: 0,
        },
        0
      ),
    r
  );
}

function enterAnimation(e) {
  const t = gsap.timeline({
    onComplete: () => {
      ScrollTrigger.refresh(),
        gsap.set(e, {
          clearProps: "transform",
        });
    },
  });
  return (
    t.from(e, {
      y: "100svh",
      ease: "primary-ease",
      duration: 1.25,
    }),
    t
  );
}

function initAllAnimations() {
  const lenis = initLenis();

  initSplitText();
  initMarquee();
  initTrMarquee();
  //initScrollToTop(lenis);
  linesAnimation();

  // Home
  initHeadOverlay();
  //initReelsAnimation();
  //aboutReelsAnimation();
  //initReelsFlip();
  initWorkSectionAnimation();
  initBrandingAnimation();
  initServiceAnimation();
  initPartnerAccordion();
  reviewSwiper();
  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      initSectionOverlap();
    },
  });
}

function firstLoad() {
  const e = document.getElementById("loader"),
    t =
      (document.querySelector(".loader_overlay"),
      document.querySelector(".loader_logo_wrap"),
      document.querySelector(".loader_logo_fill"),
      gsap.timeline({
        onComplete: () => {
          e.remove();
        },
      }));
  return (
    t.to(e, {
      yPercent: -100,
      ease: "primary-ease",
      duration: 1.25,
    }),
    t
  );
}

function initHomeAnimation() {
  const tl = gsap.timeline();
  const typeSplit = new SplitType("[load-split]", {
    types: "lines, words, chars",
    tagName: "span",
  });

  tl.from(
    "[hero-text] .char",
    {
      yPercent: 110,
      stagger: { amount: 0.4 },
      duration: 1.25,
      ease: "primary-ease-out",
    },
    0.4
  );
  tl.from("[hero-head] .char", { yPercent: 110, duration: 1.25, ease: "primary-ease" }, 0.2);
  tl.from("[hero-btn]", { yPercent: 50, opacity: 0, ease: "primary-ease", duration: 1.25 }, 0.6);
  tl.from(".reels-wrap", { scale: 0, ease: "primary-ease-out", duration: 1.25 }, 0.6);
}

function initWorkAnimation() {
  const tl = gsap.timeline();
  const typeSplit = new SplitType("[load-split]", {
    types: "lines, words, chars",
    tagName: "span",
  });

  tl.from(
    "[hero-text] .char",
    {
      yPercent: 110,
      stagger: { amount: 0.8 },
      duration: 1.25,
      ease: "primary-ease-out",
    },
    0.4
  );
  tl.from(".hero-marquee", { yPercent: 110, duration: 1.25, ease: "primary-ease-out" }, 0.2);
}

function pageTransitionHome(e) {
  const t = gsap.timeline();
  return t.add(enterAnimation(e)).add(initHomeAnimation(e), 0.8), t;
}

function pageTransitionWork(e) {
  const t = gsap.timeline();
  return t.add(enterAnimation(e)).add(initWorkAnimation(e), 0.8), t;
}

function homeFirstLoad(e) {
  const t = gsap.timeline();
  return t.add(firstLoad()).add(initHomeAnimation(e), 0.8), t;
}

function initPageTransitions() {
  scroll = initLenis();
  const e = barba;
  e.hooks.once(() => {
    initAllAnimations();
    disableCurrentLinks();
  }),
    e.hooks.beforeLeave((e) => {
      scroll.stop(), resetWebflow(e);
    }),
    e.hooks.enter((e) => {
      gsap.set(e.next.container, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 3,
      }),
        disableCurrentLinks();
    }),
    e.hooks.afterEnter(() => {
      window.scrollTo(0, 0);
    }),
    e.hooks.after((e) => {
      gsap.set(e.next.container, {
        position: "relative",
      }),
        initAllAnimations(),
        scroll.resize(),
        scroll.start(),
        ScrollTrigger.refresh();
    }),
    e.init({
      transitions: [
        {
          name: "to-home",
          to: {
            namespace: "home",
          },
          sync: !0,
          once({ next: e }) {
            pageTransitionHome(e.container);
          },
          async leave({ current: e }) {
            await leaveAnimation(e.container);
          },
          enter({ next: e }) {
            pageTransitionHome(e.container);
          },
        },
        {
          name: "to-work",
          to: {
            namespace: "work",
          },
          sync: !0,
          once({ next: e }) {
            pageTransitionWork(e.container);
          },
          async leave({ current: e }) {
            await leaveAnimation(e.container);
          },
          enter({ next: e }) {
            pageTransitionWork(e.container);
          },
        },
        {
          name: "default",
          sync: !0,
          once({ next: e }) {
            enterAnimation(e.container);
          },
          async leave({ current: e }) {
            await leaveAnimation(e.container);
          },
          enter({ next: e }) {
            enterAnimation(e.container);
          },
        },
      ],
    });
}

let mm = gsap.matchMedia(),
  navStatus = "closed";
const setNavStatus = (e) => {
  (navStatus = e), console.log(navStatus);
};
initGSAP(), initPageTransitions();
