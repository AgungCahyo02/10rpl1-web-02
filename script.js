const themeToggle = document.querySelector("#theme-toggle");
const darkModeTrigger = document.querySelector("#dark-mode-trigger");

function updateThemeControls(theme) {
    const isDark = theme === "dark";

    if (themeToggle) {
        const themeLabel = themeToggle.querySelector(".theme-toggle-label");
        const themeIcon = themeToggle.querySelector(".theme-toggle-icon img");

        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeLabel.textContent = isDark ? "Mode terang" : "Mode gelap";
        themeIcon.src = isDark ? "sun-icon.png" : "moon-icon.png";
    }

    if (darkModeTrigger) {
        const label = isDark ? "Kembalikan mode terang" : "Aktifkan mode gelap";
        darkModeTrigger.setAttribute("aria-label", label);
        darkModeTrigger.title = label;
    }
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    updateThemeControls(theme);
}

const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme = savedTheme === "dark" ? "dark" : "light";

document.documentElement.dataset.theme = initialTheme;
updateThemeControls(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    });
}

if (darkModeTrigger) {
    let isAnimating = false;

    darkModeTrigger.addEventListener("click", () => {
        if (isAnimating) {
            return;
        }

        isAnimating = true;
        darkModeTrigger.disabled = true;

        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        const isAbsorbing = currentTheme === "dark";
        const bounds = darkModeTrigger.getBoundingClientRect();
        const originX = bounds.left + bounds.width / 2;
        const originY = bounds.top + bounds.height / 2;
        const radius = Math.max(
            Math.hypot(originX, originY),
            Math.hypot(window.innerWidth - originX, originY),
            Math.hypot(originX, window.innerHeight - originY),
            Math.hypot(window.innerWidth - originX, window.innerHeight - originY)
        );
        const currentBackground = getComputedStyle(document.documentElement)
            .getPropertyValue("--background")
            .trim();
        const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 720;
        const startRadius = isAbsorbing ? radius : 0;
        const endRadius = isAbsorbing ? 0 : radius;
        const reveal = document.createElement("div");
        let finished = false;

        reveal.className = "theme-reveal";
        reveal.style.backgroundColor = currentBackground;
        reveal.style.transitionDuration = `${duration}ms`;
        reveal.style.clipPath = `circle(${startRadius}px at ${originX}px ${originY}px)`;
        document.body.append(reveal);

        if (isAbsorbing) {
            setTheme(nextTheme);
        }

        if (themeToggle) {
            themeToggle.disabled = true;
        }

        const finishAnimation = () => {
            if (finished) {
                return;
            }

            finished = true;
            if (!isAbsorbing) {
                setTheme(nextTheme);
            }

            reveal.remove();
            if (themeToggle) {
                themeToggle.disabled = false;
            }
            darkModeTrigger.disabled = false;
            isAnimating = false;
        };

        reveal.addEventListener("transitionend", (event) => {
            if (event.propertyName === "clip-path") {
                finishAnimation();
            }
        }, { once: true });

        window.requestAnimationFrame(() => {
            reveal.style.clipPath = `circle(${endRadius}px at ${originX}px ${originY}px)`;
        });

        window.setTimeout(finishAnimation, duration + 100);
    });
}

const loadingScreen = document.querySelector("#loading-screen");

if (loadingScreen) {
    const loadingProgress = loadingScreen.querySelector(".loading-progress");
    const minimumDisplayTime = 800;
    const startedAt = performance.now();

    window.addEventListener("load", () => {
        const delay = Math.max(0, minimumDisplayTime - (performance.now() - startedAt));

        window.setTimeout(() => {
            loadingProgress.classList.add("is-complete");
            window.setTimeout(() => {
                loadingScreen.classList.add("is-hidden");
                window.setTimeout(() => {
                    loadingScreen.hidden = true;
                }, 300);
            }, 250);
        }, delay);
    }, { once: true });
}