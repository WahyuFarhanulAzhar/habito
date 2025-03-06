import { gsap } from "https://cdn.skypack.dev/gsap@3.12.2";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import { Flip } from "https://cdn.skypack.dev/gsap/Flip";
import { CustomEase } from "https://cdn.skypack.dev/gsap/CustomEase";
import Lenis from "https://cdn.skypack.dev/lenis@1.0.19";
import SplitType from "https://cdn.skypack.dev/split-type@0.3.3";
import Swiper from "https://cdn.skypack.dev/swiper@11.0.5";

gsap.registerPlugin(CustomEase, Flip, ScrollTrigger);
CustomEase.create("primary-ease", "0.62, 0.05, 0.01, 0.99"),
  CustomEase.create("primary-ease-out", "0.17,0.84,0.44,1"),
  ScrollTrigger.defaults({
    markers: true,
  });

function initLenis() {
  if (Webflow.env("editor") === undefined) {
    const lenis = new Lenis({
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
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

function initMarquee() {
  gsap.to("[marquee]", {
    xPercent: -100,
    ease: "linear",
    duration: 50,
    repeat: -1,
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
      .fromTo(targetElement, { width: "100%", y: "0svh" }, { width: "25%", y: "150svh" });
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
          start: "55% top",
          end: "80% bottom",
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

function initServiceAnimation() {
  $(".section.is-service").each(function () {
    const triggerElement = $(this);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 80%",
          end: "bottom bottom",
          scrub: 1,
        },
      })
      .fromTo(".service-head", { x: "50vw" }, { x: "-50vw" });

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
      .from(".service-item", { y: "100svh", stagger: 0.2 });
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

function homeLoad() {
  const tl = gsap.timeline();

  tl.from("[hero-text] .char", {
    yPercent: 110,
    stagger: { amount: 0.3 },
    duration: 1.25,
    ease: "primary-ease-out",
  });
  tl.from(".hero-marquee-item", { yPercent: 110, duration: 1.25, ease: "primary-ease-out" }, 0.2);
}

function initAllAnimations() {
  initLenis();
  initSplitText();
  initMarquee();
  initReelsAnimation();
  //aboutReelsAnimation();
  initReelsFlip();
  linesAnimation();
  initSectionOverlap();
  initWorkSectionAnimation();
  initBrandingAnimation();
  initServiceAnimation();
  reviewSwiper();
  homeLoad();
}

$(document).ready(initAllAnimations);
