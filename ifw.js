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

function initParallaxEffect() {
  document.querySelectorAll("[trigger-paralax]").forEach((trigger) => {
    const target = trigger.querySelector("[target-paralax]");

    if (target) {
      gsap.to(target, {
        yPercent: -10, // Sesuaikan efek paralaks
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
  });
}

function eventSection() {
  const triggerElement = document.querySelectorAll(".section.is-event");
  const head = document.querySelectorAll(".event-head");
  const content = document.querySelectorAll(".event-content");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: "bottom 80%",
        scrub: 1,
      },
    })
    .to(head, {
      scale: 0.8,
      duration: 2,
      ease: "none",
    })
    .to(
      content,
      {
        scale: 1,
        y: "10svh",
        duration: 2,
        ease: "power3.inOut",
      },
      0
    );
}

function initTrFlip() {
  function e(e, t) {
    const r = typeof e;
    return "string" !== typeof t || "" === t.trim() ? e : ("true" === t && "boolean" === r) || (("false" !== t || "boolean" !== r) && (isNaN(t) && "string" === r ? t : isNaN(t) || "number" !== r ? e : +t));
  }
  $("[tr-scrollflip-element='component']").each(function (t) {
    function r() {
      o &&
        (o.kill(),
        gsap.set(l, {
          clearProps: "all",
        }),
        gsap.set(".hero_home_layout", {
          clearProps: "all",
        })),
        $("body").addClass("scrollflip-relative"),
        gsap.matchMedia().add(`(min-width: ${f}px)`, () => {
          const e = Flip.getState(i);
          (o = gsap.timeline({
            scrollTrigger: {
              trigger: s,
              endTrigger: c,
              start: u,
              end: p,
              scrub: !0,
            },
          })),
            o.add(
              Flip.from(e, {
                targets: l,
                ease: "none",
                scale: g,
                stagger: {
                  amount: m,
                  from: d,
                },
              }),
              0
            );
        }),
        $("body").removeClass("scrollflip-relative");
    }
    let o,
      a,
      n = $(this),
      i = n.find("[tr-scrollflip-element='origin']"),
      l = n.find("[tr-scrollflip-element='target']"),
      s = n.find("[tr-scrollflip-scrubstart]"),
      c = n.find("[tr-scrollflip-scrubend]"),
      u = e("top top", s.attr("tr-scrollflip-scrubstart")),
      p = e("bottom bottom", c.attr("tr-scrollflip-scrubend")),
      m = e(0, n.attr("tr-scrollflip-staggerspeed")),
      d = e("start", n.attr("tr-scrollflip-staggerdirection")),
      g = e(!1, n.attr("tr-scrollflip-scale")),
      f = e(0, n.attr("tr-scrollflip-breakpoint")),
      y = t;
    i.each(function (e) {
      const t = `${y}-${e}`;
      $(this).attr("data-flip-id", t), l.eq(e).attr("data-flip-id", t);
    }),
      r(),
      window.addEventListener("resize", function () {
        clearTimeout(a),
          (a = setTimeout(function () {
            r();
          }, 250));
      });
  });
}

function intLoader() {
  const splitText = new SplitType(".[split-2]", {
    types: "lines",
    tagName: "div",
  });

  const tl = gsap.timeline();
  tl.from(
    ".hero-img",
    {
      scale: 0,
      duration: 1.5,
      ease: "power3.inOut",
    },
    0
  ).from(
    "[split-2] .line",
    {
      yPercent: 50,
      duration: 1.25,
      ease: "power3.inOut",
    },
    0.3
  );
}

function whySection() {
  const triggerElement = document.querySelectorAll(".section.is-why");
  const headLeft = document.querySelectorAll(".why-head-left");
  const headRight = document.querySelectorAll(".why-head-right");
  const reels = document.querySelectorAll(".why-img");
  const item = document.querySelectorAll(".why-content-item");
  const triggerHead = document.querySelectorAll(".why-head-block");
  const triggerContent = document.querySelectorAll(".why-content-block");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: triggerHead,
        start: "top top",
        end: "bottom 50%",
        scrub: 1,
      },
    })
    .to(
      headLeft,
      {
        x: "7.5vw",
        duration: 2,
        ease: "none",
      },
      0
    )
    .to(
      headRight,
      {
        x: "-7.5vw",
        duration: 2,
        ease: "none",
      },
      0
    );

  gsap
    .timeline({
      scrollTrigger: {
        trigger: triggerContent,
        start: "top top",
        end: "90% bottom",
        scrub: 1,
      },
    })
    .from(
      item,
      {
        y: "50svh",
        duration: 2,
        stagger: { each: 0.3 },
        ease: "none",
      },
      0
    );
}

function initAllAnimations() {
  initSplitText();
  initTrMarquee();
  linesAnimation();
  initLenis();

  // Home
  document.addEventListener("DOMContentLoaded", initParallaxEffect);
  document.addEventListener("DOMContentLoaded", eventSection);
  document.addEventListener("DOMContentLoaded", whySection);
  //document.addEventListener('DOMContentLoaded', initTrFlip);
  initTrFlip();
  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      initSectionOverlap();
    },
  });
}

initGSAP(), initAllAnimations();
