document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 12));

  menuButton.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  const sections = [...document.querySelectorAll("main section[id]")];
  const anchors = [...document.querySelectorAll(".nav-links a")];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px" });
  sections.forEach(s => sectionObserver.observe(s));

  const slides = [...document.querySelectorAll(".review-slide")];
  const dotsBox = document.querySelector(".slider-dots");
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Show review ${i + 1}`);
    dot.addEventListener("click", () => show(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.querySelectorAll("button")];

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("active", j === current));
    dots.forEach((d, j) => d.classList.toggle("active", j === current));
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 6000);
  }
  document.querySelector(".next").addEventListener("click", () => show(current + 1));
  document.querySelector(".prev").addEventListener("click", () => show(current - 1));
  show(0);

  document.querySelector("#enquiry-form").addEventListener("submit", e => {
    e.preventDefault();
    const value = id => document.querySelector(id).value.trim();
    const message = [
      "Hello PR Yanda Travels, I would like to enquire about a trip.",
      "",
      `Name: ${value("#name") || "Not provided"}`,
      `Pickup: ${value("#pickup") || "Not provided"}`,
      `Destination: ${value("#destination") || "Not provided"}`,
      `Date: ${value("#date") || "Not provided"}`,
      `Passengers: ${value("#passengers") || "Not provided"}`,
      `Additional details: ${value("#details") || "None"}`
    ].join("\n");
    window.open(`https://wa.me/918639740364?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
});