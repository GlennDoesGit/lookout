// Random splash text + wave animation.

const splashTexts = [
    "A portfolio website!",
    "All pixel art self-drawn!",
    "0 games bug free.",
    "Probably sleep deprived.",
    "Let's make games.",
    "Optimized eventually.",
    "A place to see everything.",
    "Likely programming.",
    "Responsive!",
    "Make it exist first.",
    "Make it good later.",
    "SplashText.txt",
    "Works for me.",
    "WIP",
];

const splashElement = document.getElementById("splash-text");

const randomIndex = Math.floor(Math.random() * splashTexts.length);

splashElement.textContent = splashTexts[randomIndex];

const waveText = document.querySelector(".wave-text");

if (waveText) {
    const string = waveText.textContent;
    waveText.textContent = "";

    [...string].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.animationDelay = `${i * 0.1}s`;
        waveText.appendChild(span);
    });
}

// Back to top.
const backToTopBtn = document.getElementById("backToTopBtn");

// Show button after scrolling down a bit.
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
    } else {
        backToTopBtn.classList.remove("visible");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

const menuBtn = document.getElementById("menuToggleBtn");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");

function openMenu() {
    mobileMenu.classList.add("open");
    overlay.classList.add("active");
}

function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("active");
}

menuBtn.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

overlay.addEventListener("click", closeMenu);

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});
