const button = document.getElementById("theme-toggle");

let theme = localStorage.getItem("theme") || "light";

document.documentElement.setAttribute("data-theme", theme);

function updateButton() {
    if (theme === "dark") {
        button.textContent = "☀️ Light Mode";
    } else {
        button.textContent = "🌙 Dark Mode";
    }
}

updateButton();

button.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);

    updateButton();
});