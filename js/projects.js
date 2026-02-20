document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".favourite-icon");

    icons.forEach((icon) => {
        const tooltip = icon.parentElement.querySelector(".favourite-tooltip");
        if (!tooltip) return;

        document.body.appendChild(tooltip);

        const move = (e) => {
            tooltip.style.left = `${e.clientX + 16}px`;
            tooltip.style.top = `${e.clientY - 32}px`;
        };

        icon.addEventListener("mouseenter", (e) => {
            tooltip.textContent = "Author really likes this project.";
            tooltip.style.display = "block";
            move(e);
        });

        icon.addEventListener("mousemove", move);

        icon.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
});
