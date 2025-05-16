gsap.registerPlugin(CustomEase, InertiaPlugin, DrawSVGPlugin, Flip, ScrollTrigger, ScrollSmoother, SplitText);

ScrollSmoother.create({
  smooth: 1.2,
  effects: true,
  smoothTouch: 0.1,
});

CustomEase.create("primary-ease", "0.62, 0.05, 0.01, 0.99");
CustomEase.create("primary-ease-out", "0.17,0.84,0.44,1");

ScrollTrigger.defaults({
  markers: false, // untuk debugging
});

gsap.defaults({
  duration: 1.25,
});

const splitInstances = []; // mirip seperti textSplit global

function splitText() {
  document.querySelectorAll("[split-2]").forEach((el) => {
    const split = SplitText.create(el, {
      type: "lines, words, chars",
      //linesClass: 'line',
    });

    // Optional masking per line
    split.lines.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.classList.add("line-mask");
      if (line.parentNode) {
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      }
    });

    // Simpan instance dan element-nya
    splitInstances.push({ el, split });
  });
}

function linesAnimation() {
  splitInstances.forEach(({ el, split }) => {
    if (!el.hasAttribute("text-reveal")) return; // Hanya yang punya [text-reveal]

    gsap.from(split.lines, {
      yPercent: 100,
      opacity: 0,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
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

function initLoad() {
  const hero = document.querySelector(".header");

  const bg = hero.querySelector(".hero-absolute");
  const heading = hero.querySelector(".h1");
  const tittle = hero.querySelector(".section-tittle");
  const desc = hero.querySelector(".hero-text");
  const btn = hero.querySelector(".btn-link");
  const nav = hero.querySelector(".navbar");

  const splitHeading = new SplitText(heading, {
    type: "lines, words, chars",
  });
  const splitDesc = new SplitText(desc, {
    type: "lines, words, chars",
  });

  const tl = gsap.timeline();

  tl.set(bg, {
    clipPath: "inset(25% round 1.5em)",
  });

  tl.from(bg, {
    y: "70svh",
    duration: 1.25,
    ease: "snappy",
  });

  ScrollSmoother.get().scrollTo(0, true);

  tl.to(
    bg,
    {
      clipPath: "inset(0% round 0em)",
      duration: 1.25,
      ease: "snappy",
    },
    "+=0.3"
  );

  tl.from(
    splitHeading.chars,
    {
      x: "100px",
      opacity: 0,
      stagger: 0.03,
      duration: 0.5,
      ease: "power4,out",
    },
    1.8
  );

  tl.from(
    splitDesc.chars,
    {
      x: "80px",
      opacity: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power4,out",
    },
    2
  );

  tl.from(
    tittle,
    {
      x: "5em",
      width: "3.25em",
      opacity: 0,
      duration: 0.8,
      ease: "power4,out",
    },
    2.2
  );

  tl.from(
    btn,
    {
      x: "5em",
      opacity: 0,
      duration: 0.8,
      ease: "power4,out",
    },
    2.2
  );

  tl.from(
    nav,
    {
      y: "-2em",
      opacity: 0,
      duration: 0.8,
      ease: "power4,out",
    },
    2
  );
}

function initBtnLinkAnimation(selector = ".btn-link") {
  document.querySelectorAll(selector).forEach((link) => {
    // Set initial state using GSAP CSSVars
    gsap.set(link, {
      "--before-opacity": 1,
      "--before-scale": 1,
      "--after-opacity": 0,
      "--after-scale": 0,
    });

    // Timeline for animation
    const timeline = gsap.timeline({ paused: true });

    timeline
      .to(
        link,
        {
          "--before-opacity": 1,
          "--before-scale": 0,
          duration: 1.25,
          delay: 0,
          ease: "power4.out",
          onUpdate: () => updateCSSVars(link),
        },
        0
      )
      .to(
        link,
        {
          "--after-opacity": 1,
          "--after-scale": 1,
          duration: 1.25,
          delay: 0.3,
          ease: "power4.out",
          onUpdate: () => updateCSSVars(link),
        },
        0
      );

    // Event listeners to restart animation on hover in/out
    link.addEventListener("mouseenter", () => {
      timeline.restart();
    });
    link.addEventListener("mouseleave", () => {
      timeline.restart();
    });
  });

  function updateCSSVars(link) {
    link.style.setProperty("--before-opacity", gsap.getProperty(link, "--before-opacity"));
    link.style.setProperty("--before-scale", gsap.getProperty(link, "--before-scale"));
    link.style.setProperty("--after-opacity", gsap.getProperty(link, "--after-opacity"));
    link.style.setProperty("--after-scale", gsap.getProperty(link, "--after-scale"));
  }
}

function initParallaxEffect() {
  document.querySelectorAll("[trigger-paralax]").forEach((trigger) => {
    const target = trigger.querySelector("[target-paralax]");

    if (target) {
      gsap.to(target, {
        yPercent: 30, // Sesuaikan efek paralaks
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

function initSolution() {
  function animateSolution1In(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");
    const inner = el.querySelector(".solution-1-inner");

    gsap.fromTo(block, { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(text, { x: 0 }, { x: "0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(iconWrap, { x: 0 }, { x: "-0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(icon, { xPercent: -100 }, { xPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(img, { x: "0em" }, { x: "1em", duration: 0.5, ease: "power2.out" });

    //custom animation for solution 1
    gsap.fromTo(inner, { width: "5em" }, { width: "10.625em", duration: 0.5, ease: "power2.out" });
  }

  function animateSolution1Out(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");

    gsap.to(block, { yPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(text, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(iconWrap, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(icon, { xPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.to(img, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(".solution-1-inner", { width: "5em", duration: 0.5, ease: "power2.out" });
  }

  function animateSolution2In(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");

    gsap.fromTo(block, { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(text, { x: 0 }, { x: "0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(iconWrap, { x: 0 }, { x: "-0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(icon, { xPercent: -100 }, { xPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(img, { x: "0em" }, { x: "1em", duration: 0.5, ease: "power2.out" });

    gsap.fromTo(
      ".solution2-circle",
      { backgroundColor: "#DEDEDE" },
      {
        backgroundColor: "#CEFE54",
        duration: 0.4,
        stagger: { each: 0.03, from: "start" },
        ease: "power2.out",
      }
    );
    gsap.fromTo(".solution-img-2", { width: "7.6875em" }, { width: "14.875em", duration: 0.4, ease: "power2.out" });
  }

  function animateSolution2Out(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");

    gsap.to(block, { yPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(text, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(iconWrap, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(icon, { xPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.to(img, { x: "0em", duration: 0.5, ease: "power2.out" });

    gsap.to(".solution2-circle", {
      backgroundColor: "#DEDEDE",
      duration: 0.4,
      stagger: { each: 0.03, from: "end" },
      ease: "power2.out",
    });
    gsap.to(".solution-img-2", {
      width: "7.6875em",
      duration: 0.4,
      ease: "power2.out",
    });
  }

  function animateSolution3In(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");

    gsap.set(".solution-img-3", { width: "5.75em", height: "2.25em" });

    gsap.fromTo(block, { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(text, { x: 0 }, { x: "0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(iconWrap, { x: 0 }, { x: "-0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(icon, { xPercent: -100 }, { xPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(img, { x: "0em" }, { x: "1em", duration: 0.5, ease: "power2.out" });

    gsap.fromTo(".solution-img-3", { width: "5.75em", height: "2.25em" }, { width: "14.875em", height: "2.8125em", duration: 0.5, ease: "power2.out" });
  }

  function animateSolution3Out(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");

    gsap.to(block, { yPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(text, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(iconWrap, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(icon, { xPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.to(img, { x: "0em", duration: 0.5, ease: "power2.out" });

    gsap.to(".solution-img-3", {
      width: "5.75em",
      height: "2.25em",
      duration: 0.5,
      ease: "power2.out",
    });
  }

  function animateSolution4In(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");

    gsap.fromTo(block, { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(text, { x: 0 }, { x: "0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(iconWrap, { x: 0 }, { x: "-0.75em", duration: 0.5, ease: "power2.out" });
    gsap.fromTo(icon, { xPercent: -100 }, { xPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(img, { x: "0em" }, { x: "1em", duration: 0.5, ease: "power2.out" });

    const tl = gsap.timeline();
    tl.to(".solution-img-4", { width: "14.875em", duration: 0.5, ease: "power2.out" });
    tl.to(".solution4-left", { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.2);
  }

  function animateSolution4Out(el) {
    const block = el.querySelector(".solution-block");
    const text = el.querySelector(".solution-text-wrap");
    const iconWrap = el.querySelector(".solution-icon-wrap");
    const icon = el.querySelectorAll(".solution-icon");
    const img = el.querySelector(".solution-img-wrap");

    gsap.to(block, { yPercent: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(text, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(iconWrap, { x: "0em", duration: 0.5, ease: "power2.out" });
    gsap.to(icon, { xPercent: -100, duration: 0.5, ease: "power2.out" });
    gsap.to(img, { x: "0em", duration: 0.5, ease: "power2.out" });

    const tl = gsap.timeline();
    tl.to(".solution-img-4", { width: "3.4375em", duration: 0.5 }, 0);
    tl.to(".solution4-left", { opacity: 0, duration: 0.3 }, 0);
  }

  document.querySelectorAll(".solution-item").forEach((item) => {
    const solutionType = item.getAttribute("data-solution");

    item.addEventListener("mouseenter", () => {
      switch (solutionType) {
        case "solution-1":
          animateSolution1In(item);
          break;
        case "solution-2":
          animateSolution2In(item);
          break;
        case "solution-3":
          animateSolution3In(item);
          break;
        case "solution-4":
          animateSolution4In(item);
          break;
      }
    });

    item.addEventListener("mouseleave", () => {
      switch (solutionType) {
        case "solution-1":
          animateSolution1Out(item);
          break;
        case "solution-2":
          animateSolution2Out(item);
          break;
        case "solution-3":
          animateSolution3Out(item);
          break;
        case "solution-4":
          animateSolution4Out(item);
          break;
      }
    });
  });
}

function initWork() {
  ScrollTrigger.create({
    trigger: ".work-content-block",
    pin: ".work-content",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    pinSpacing: true,
  });

  gsap.from(".work-list", {
    x: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".work-content-block",
      start: "top top",
      end: "90% bottom",
      scrub: 1,
    },
  });

  gsap.to(".work-progres", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".work-content-block",
      start: "top top",
      end: "90% bottom",
      scrub: 1,
    },
  });

  gsap.to(".work-progres-wrap", {
    opacity: 0,
    rotate: "6deg",
    ease: "none",
    scrollTrigger: {
      trigger: ".work-content-block",
      start: "90% bottom",
      end: "bottom bottom",
      scrub: 1,
    },
  });
}

function initFeature() {
  document.querySelectorAll(".feature-item").forEach((item) => {
    const path = item.querySelector(".path-line");
    if (!path) return;

    const leftText = item.querySelector(".left-text");
    const rightText = item.querySelector(".right-text");
    const isReverse = path.classList.contains("is-reverse");

    // Set awal posisi
    gsap.set(path, {
      drawSVG: isReverse ? "100% 100%" : "0%",
    });
    gsap.set(leftText, {
      opacity: 0,
      x: "-1.5em",
    });
    gsap.set(rightText, {
      opacity: 0,
      x: "1.5em",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 70%", // Ubah sesuai kebutuhan (misal 'top 80%')
        toggleActions: "play none none none",
      },
    });

    tl.to(
      path,
      {
        drawSVG: isReverse ? "0% 100%" : "100%",
        duration: 1.2,
        ease: "power2.out",
      },
      0
    ); // Mulai dari awal timeline

    tl.to(
      leftText,
      {
        opacity: 1,
        x: "0em",
        duration: 1.2,
        ease: "power2.out",
      },
      0.4
    ); // Delay sedikit setelah path

    tl.to(
      rightText,
      {
        opacity: 1,
        x: "0em",
        duration: 1.2,
        ease: "power2.out",
      },
      0.4
    );
  });
}

function aosAnimation() {
  gsap.from(".feature-item-head", {
    xPercent: 50,
    opacity: 0,
    ease: "power4.out",
    duration: 1.25,
    stagger: { each: 0.2, from: "start" },
    scrollTrigger: {
      trigger: ".feature-head",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  const marqueeTrack = document.querySelectorAll(".marquee-track");
  const content = document.querySelectorAll(".marquee-content");

  const width = content.offsetWidth;

  gsap.to(content, {
    x: "-100%",
    duration: 10,
    ease: "none",
    repeat: -1,
  });

  gsap.from(".draw-svg", {
    drawSVG: "0%",
    duration: 2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".draw-svg",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  gsap.from(".why-item", {
    xPercent: 50,
    opacity: 0,
    ease: "power4.out",
    duration: 2,
    stagger: 0.3,
    scrollTrigger: {
      trigger: ".why-content",
      start: "top 20%",
      toggleActions: "play none none none",
    },
  });

  document.querySelectorAll(".cta-wrapper").forEach((item) => {
    const tittle = item.querySelector(".section-tittle");
    const head = item.querySelector(".h2");

    const splitTittle = new SplitText(head, {
      type: "lines, words, chars",
    });

    gsap.from(splitTittle.chars, {
      x: "100px",
      opacity: 0,
      duration: 1.25,
      ease: "power4.out",
      stagger: 0.03,
      scrollTrigger: {
        trigger: head,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    gsap.from(tittle, {
      width: "3.25em",
      x: "5em",
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: tittle,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  document.querySelectorAll("[aos]").forEach((el) => {
    gsap.from(el, {
      y: "5svh",
      opacity: 0,
      ease: "power4.out",
      duration: 1.25,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });
}

function initHeroOverlap() {
  const hero = document.querySelector(".header");
  const wrapper = hero.querySelector(".hero-wrapper");

  gsap.to(wrapper, {
    //y: '10svh',
    //opacity: 0,
    duration: 1.25,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "bottom bottom",
      end: "bottom 25%",
      scrub: true,
    },
  });
}

function initAllAnimations() {
  splitText();
  linesAnimation();
  initBtnLinkAnimation(".btn-link");
  initParallaxEffect();
  initSectionOverlap();
  initSolution();
  initWork();
  initFeature();
  aosAnimation();
  initHeroOverlap();
}

window.addEventListener("load", () => {
  initLoad();
});

window.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    initAllAnimations();
  });
});
