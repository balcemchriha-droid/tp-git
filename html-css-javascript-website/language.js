
document.addEventListener("DOMContentLoaded", () => {

    let currentLanguage = "en";

    const languageButton = document.getElementById("language-toggle");

    if (!languageButton) {
        console.error("Language button not found!");
        return;
    }

    languageButton.addEventListener("click", () => {

        currentLanguage = currentLanguage === "en" ? "fr" : "en";

        document.documentElement.lang = currentLanguage;

        const elements = document.querySelectorAll("[data-en][data-fr]");

        elements.forEach(element => {
            element.textContent = element.dataset[currentLanguage];
        });

        languageButton.textContent =
            currentLanguage === "en" ? "FR 🇫🇷" : "EN 🇬🇧";

    });

});
