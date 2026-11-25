
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("sweetForm");

    const dessertType = document.getElementById("dessertType");
    const dessertSize = document.getElementById("dessertSize");
    const dessertFlavor = document.getElementById("dessertFlavor");
    const sweetMessage = document.getElementById("sweetMessage");
    const sweetQuantity = document.getElementById("sweetQuantity");

    const summaryType = document.getElementById("summaryType");
    const summarySize = document.getElementById("summarySize");
    const summaryFlavor = document.getElementById("summaryFlavor");
    const summaryDecorations = document.getElementById("summaryDecorations");
    const summaryExtras = document.getElementById("summaryExtras");
    const summaryMessage = document.getElementById("summaryMessage");
    const summaryQuantity = document.getElementById("summaryQuantity");
    const totalPrice = document.getElementById("totalPrice");

    function getSelectedOptions(name) {
        return Array.from(
            document.querySelectorAll(
                `input[name="${name}"]:checked`
            )
        );
    }

    function updateSummary() {

        const selectedDessert =
            dessertType.options[dessertType.selectedIndex];

        const selectedSize =
            dessertSize.options[dessertSize.selectedIndex];

        const basePrice = Number(selectedDessert.dataset.base);
        const multiplier = Number(selectedSize.dataset.multiplier);

        let unitPrice = basePrice * multiplier;

        // Decorations
        const decorations = getSelectedOptions("decoration");

        let decorationNames = [];

        decorations.forEach(option => {
            decorationNames.push(option.value);
            unitPrice += Number(option.dataset.price);
        });

        // Extras
        const extras = getSelectedOptions("extra");

        let extraNames = [];

        extras.forEach(option => {
            extraNames.push(option.value);
            unitPrice += Number(option.dataset.price);
        });

        // Quantity
        const quantity = Math.max(
            1,
            Math.min(20, Number(sweetQuantity.value) || 1)
        );

        // Update displayed summary
        summaryType.textContent = dessertType.value;
        summarySize.textContent = dessertSize.value;
        summaryFlavor.textContent = dessertFlavor.value;

        summaryDecorations.textContent =
            decorationNames.length
                ? decorationNames.join(", ")
                : "None";

        summaryExtras.textContent =
            extraNames.length
                ? extraNames.join(", ")
                : "None";

        summaryMessage.textContent =
            sweetMessage.value.trim() || "None";

        summaryQuantity.textContent = quantity;

        const total = unitPrice * quantity;

        totalPrice.textContent = total.toFixed(2) + " DT";

        return {
            dessert: dessertType.value,
            size: dessertSize.value,
            flavor: dessertFlavor.value,
            decorations: decorationNames,
            extras: extraNames,
            message: sweetMessage.value.trim(),
            quantity: quantity,
            unitPrice: unitPrice,
            total: total
        };
    }

    // Update whenever an option changes
    form.addEventListener("input", updateSummary);
    form.addEventListener("change", updateSummary);

    // Confirm customization
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const order = updateSummary();

        try {
            localStorage.setItem(
                "customizedSweetOrder",
                JSON.stringify(order)
            );
        } catch (error) {
            alert("Unable to save your customization.");
            return;
        }

        alert(
            "Your sweet has been successfully customized! ❤️\n\n" +
            "Dessert: " + order.dessert + "\n" +
            "Size: " + order.size + "\n" +
            "Flavor: " + order.flavor + "\n" +
            "Quantity: " + order.quantity + "\n" +
            "Total: " + order.total.toFixed(2) + " DT\n\n" +
            "Your customization has been saved!"
        );

    });

    // Initial summary
    updateSummary();

});
