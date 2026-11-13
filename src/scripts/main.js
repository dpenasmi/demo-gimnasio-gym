// Interacciones de la landing GYM. Astro procesa este archivo al importarlo.
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav?.classList.toggle("open", open);
});
nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("open");
}));
// Carrusel: un índice y un indicador por actividad.
const slider = document.querySelector(".class-slider");
if (slider) {
    const cards = Array.from(slider.querySelectorAll(".class-card"));
    const section = slider.closest(".classes-section");
    const dotsContainer = section?.querySelector(".slider-dots");
    const previousButton = section?.querySelector('[data-slide="-1"]');
    const nextButton = section?.querySelector('[data-slide="1"]');
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentIndex = 0;
    const dots = cards.map(() => document.createElement("i"));
    dotsContainer?.replaceChildren(...dots);
    const updateControls = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.setAttribute("aria-current", "true");
            }
            else {
                card.removeAttribute("aria-current");
            }
        });
        if (previousButton)
            previousButton.disabled = currentIndex === 0;
        if (nextButton) {
            nextButton.disabled =
                !cards.length || currentIndex === cards.length - 1;
        }
    };
    const showCard = (index, animate = true) => {
        if (!cards.length)
            return;
        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        const targetLeft = cards[currentIndex].getBoundingClientRect().left -
            cards[0].getBoundingClientRect().left;
        slider.scrollTo({
            left: targetLeft,
            behavior: animate && !reducedMotion.matches ? "smooth" : "instant",
        });
        updateControls();
    };
    previousButton?.addEventListener("click", () => {
        showCard(currentIndex - 1);
    });
    nextButton?.addEventListener("click", () => {
        showCard(currentIndex + 1);
    });
    slider.addEventListener("keydown", (event) => {
        if (event.target !== slider)
            return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            showCard(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
        }
    });
    window.addEventListener("resize", () => showCard(currentIndex, false));
    showCard(0, false);
}
const schedule = document.querySelector("#schedule-dialog");
const spot = document.querySelector("#spot-dialog");
const openModal = (dialog) => {
    if (!dialog || dialog.open)
        return;
    dialog.showModal();
    document.body.classList.add("modal-open");
};
// Abrir la ventana de horarios.
document
    .querySelector("#schedule-open")
    ?.addEventListener("click", () => openModal(schedule));
// Reproductor de YouTube.
const youtubePlayer = document.querySelector("#spot-youtube");
const youtubeUrl = "https://www.youtube-nocookie.com/embed/9X0jQtDB_qs?autoplay=1&playsinline=1&controls=0";
// Abrir el spot y cargar el vídeo.
document.querySelectorAll("[data-spot]").forEach((button) => {
    button.addEventListener("click", () => {
        openModal(spot);
        if (youtubePlayer) {
            youtubePlayer.src = youtubeUrl;
        }
    });
});
// Cerrar las ventanas con su botón o pulsando fuera.
document
    .querySelectorAll("dialog")
    .forEach((dialog) => {
    dialog
        .querySelector("[data-close]")
        ?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target !== dialog)
            return;
        const rect = dialog.getBoundingClientRect();
        const clickedOutside = event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;
        if (clickedOutside) {
            dialog.close();
        }
    });
    dialog.addEventListener("close", () => {
        document.body.classList.toggle("modal-open", document.querySelector("dialog[open]") !== null);
        // Detener el vídeo al cerrar la ventana del spot.
        if (dialog.id === "spot-dialog") {
            youtubePlayer?.removeAttribute("src");
        }
    });
});
// Cerrar los horarios al ir al formulario de reserva.
document
    .querySelector("#schedule-book")
    ?.addEventListener("click", () => schedule?.close());
// Formulario de demostración: no envía ni guarda datos.
document
    .querySelector("#booking-form")
    ?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (status) {
        status.hidden = false;
        status.textContent =
            "¡Ya has dado el primer paso! Has completado la reserva de demostración. No se han enviado ni guardado tus datos.";
    }
});
// Franja que alterna frases y colores.
{
    const banner = document.querySelector(".rhythm-banner");
    if (banner && banner.querySelector(".rhythm-banner__message")) {
        const messages = Array.from(banner.querySelectorAll(".rhythm-banner__message"));
        const pauseButton = banner.querySelector(".rhythm-banner__pause");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let currentMessage = 0;
        let isVisible = false;
        let isPaused = false;
        let timer;
        // Prepara las letras manteniendo cada palabra unida.
        // Todas las letras reservan su espacio antes de aparecer.
        messages.forEach((message) => {
            let letterIndex = 0;
            message
                .querySelectorAll(".rhythm-banner__line")
                .forEach((line) => {
                const text = (line.textContent ?? "")
                    .trim()
                    .replace(/\s+/g, " ");
                const fragment = document.createDocumentFragment();
                text.split(/(\s+)/).forEach((part) => {
                    if (/^\s+$/.test(part)) {
                        fragment.append(document.createTextNode(part));
                        return;
                    }
                    const word = document.createElement("span");
                    word.className = "rhythm-banner__word";
                    Array.from(part).forEach((character) => {
                        const letter = document.createElement("span");
                        letter.className = "rhythm-banner__letter";
                        letter.textContent = character;
                        letter.style.setProperty("--letter-delay", `${letterIndex * 35}ms`);
                        word.append(letter);
                        letterIndex += 1;
                    });
                    fragment.append(word);
                });
                line.replaceChildren(fragment);
            });
        });
        const showMessage = () => {
            messages.forEach((message, index) => {
                message.classList.toggle("is-active", index === currentMessage);
            });
            banner.classList.toggle("is-dark", currentMessage === 1);
        };
        const stopAnimation = () => {
            if (timer !== undefined) {
                window.clearInterval(timer);
                timer = undefined;
            }
            // Al detenerla, deja la frase completa visible.
            banner.classList.remove("is-animating");
        };
        const updateAnimation = () => {
            stopAnimation();
            if (!isVisible ||
                isPaused ||
                document.hidden ||
                reducedMotion.matches) {
                return;
            }
            banner.classList.add("is-animating");
            timer = window.setInterval(() => {
                currentMessage = (currentMessage + 1) % messages.length;
                showMessage();
            }, 5500);
        };
        pauseButton?.addEventListener("click", () => {
            isPaused = !isPaused;
            pauseButton.setAttribute("aria-pressed", String(isPaused));
            pauseButton.textContent = isPaused
                ? "Reanudar animación"
                : "Pausar animación";
            updateAnimation();
        });
        const observer = new IntersectionObserver(([entry]) => {
            if (isVisible === entry.isIntersecting)
                return;
            isVisible = entry.isIntersecting;
            updateAnimation();
        }, { threshold: 0.15 });
        observer.observe(banner);
        document.addEventListener("visibilitychange", updateAnimation);
        reducedMotion.addEventListener("change", updateAnimation);
    }
}
// Carrusel de instalaciones: un indicador por espacio.
{
    const section = document.querySelector("#gimnasio");
    const slider = section?.querySelector(".spaces-slider");
    if (section && slider) {
        const cards = Array.from(slider.querySelectorAll("figure"));
        const dotsContainer = section.querySelector(".spaces-dots");
        const previous = section.querySelector('[data-space-direction="-1"]');
        const next = section.querySelector('[data-space-direction="1"]');
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let currentIndex = 0;
        const dots = cards.map(() => document.createElement("i"));
        dotsContainer?.replaceChildren(...dots);
        const showSpace = (index, animate = true) => {
            if (!cards.length)
                return;
            currentIndex = Math.max(0, Math.min(index, cards.length - 1));
            dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
            if (previous)
                previous.disabled = currentIndex === 0;
            if (next)
                next.disabled = currentIndex === cards.length - 1;
            slider.scrollTo({
                left: cards[currentIndex].getBoundingClientRect().left - cards[0].getBoundingClientRect().left,
                behavior: animate && !reducedMotion.matches ? "smooth" : "instant",
            });
        };
        previous?.addEventListener("click", () => showSpace(currentIndex - 1));
        next?.addEventListener("click", () => showSpace(currentIndex + 1));
        slider.addEventListener("keydown", (event) => {
            if (event.target !== slider)
                return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                showSpace(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
            }
        });
        window.addEventListener("resize", () => showSpace(currentIndex, false));
        showSpace(0, false);
    }
}
