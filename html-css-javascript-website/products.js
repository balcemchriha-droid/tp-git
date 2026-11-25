// ==========================================
// SWEET DELIGHTS - PRODUCT FUNCTIONALITIES
// A2: Search and Category Filter
// A4: Product Functions
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. HTML ELEMENTS
    // ======================================

    const productsContainer = document.getElementById("productsContainer");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");

    // Modal elements
    const modal = document.getElementById("productModal");
    const closeModalButton = document.getElementById("closeModal");

    const modalName = document.getElementById("modalName");
    const modalCategory = document.getElementById("modalCategory");
    const modalDescription = document.getElementById("modalDescription");
    const modalPrice = document.getElementById("modalPrice");

    // Additional elements
    const sortSelect = document.getElementById("sortProducts");
    const relatedContainer = document.getElementById("relatedProducts");
    const galleryImage = document.getElementById("galleryImage");

    if (!productsContainer || !searchInput || !categoryFilter ||
        !modal || !closeModalButton || !galleryImage) {
        console.error("Some required HTML elements are missing.");
        return;
    }

    if (typeof productsData === "undefined") {
        console.error("productsData is not loaded. Check products-data.js.");
        return;
    }

    // ======================================
    // 2. WISHLIST
    // ======================================

    let wishlist = [];

    try {
        const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist = Array.isArray(saved)
            ? saved.filter(id => typeof id === "string")
            : [];
    } catch (error) {
        wishlist = [];
    }

    function toggleWishlist(productId) {

        const index = wishlist.indexOf(productId);

        if (index === -1) {
            wishlist.push(productId);
        } else {
            wishlist.splice(index, 1);
        }

        try {
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        } catch (error) {
            console.error("Could not save wishlist:", error);
        }

        filterProducts();
    }

    // ======================================
    // 3. DYNAMIC PRODUCT DISPLAY
    // ======================================

    function displayProducts(products) {

        productsContainer.innerHTML = "";

        if (products.length === 0) {

            if (resultsCount) {
                resultsCount.textContent = "0 products found";
            }

            if (noResults) {
                noResults.style.display = "block";
            }

            return;
        }

        if (noResults) {
            noResults.style.display = "none";
        }

        products.forEach(product => {

            const card = document.createElement("article");
            card.classList.add("product-card");

            card.dataset.id = product.id;
            card.dataset.category = product.category;

            // Product image
            const image = document.createElement("img");

            image.src = product.image;
            image.alt = product.name;

            image.onerror = function () {
                this.alt = "Product image unavailable";
            };

            // Product information
            const info = document.createElement("div");
            info.classList.add("product-info");

            const name = document.createElement("h2");
            name.textContent = product.name;

            const description = document.createElement("p");
            description.classList.add("product-description");
            description.textContent = product.description;

            const price = document.createElement("p");
            price.classList.add("product-price");
            price.textContent = Number(product.price).toFixed(2) + " TND";

            // VIEW DETAILS BUTTON
            const detailsButton = document.createElement("button");

            detailsButton.type = "button";
            detailsButton.classList.add("details-btn");
            detailsButton.textContent = "View Details";

            detailsButton.addEventListener("click", function () {
                showProductDetails(product.id);
            });

            // WISHLIST BUTTON
            const wishlistButton = document.createElement("button");

            wishlistButton.type = "button";
            wishlistButton.classList.add("wishlist-btn");

            updateWishlistButton(wishlistButton, product.id);

            wishlistButton.addEventListener("click", function () {
                toggleWishlist(product.id);
            });

            // Assemble card
            info.appendChild(name);
            info.appendChild(description);
            info.appendChild(price);
            info.appendChild(detailsButton);
            info.appendChild(wishlistButton);

            card.appendChild(image);
            card.appendChild(info);

            productsContainer.appendChild(card);

        });

        if (resultsCount) {
            resultsCount.textContent =
                `${products.length} product(s) found`;
        }
    }

    // ======================================
    // 4. UPDATE WISHLIST APPEARANCE
    // ======================================

    function updateWishlistButton(button, productId) {

        const isFavorite = wishlist.includes(productId);

        button.textContent = isFavorite
            ? "♥ Added to Wishlist"
            : "♡ Add to Wishlist";

        button.classList.toggle("is-favorite", isFavorite);

        button.setAttribute("aria-pressed", String(isFavorite));
    }

    // ======================================
    // 5. SEARCH, FILTER AND SORT
    // ======================================

    function filterProducts() {

        const searchValue = searchInput.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;

        let filteredProducts = productsData.filter(product => {

            const matchesName =
                product.name.toLowerCase().includes(searchValue);

            const matchesDescription =
                product.description.toLowerCase().includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return (matchesName || matchesDescription) && matchesCategory;

        });

        // Sorting
        if (sortSelect) {

            switch (sortSelect.value) {

                case "price-low":
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;

                case "price-high":
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;

                case "name":
                    filteredProducts.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    break;
            }
        }

        displayProducts(filteredProducts);
    }

    searchInput.addEventListener("input", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);

    if (sortSelect) {
        sortSelect.addEventListener("change", filterProducts);
    }

    // ======================================
    // 6. PRODUCT DETAILS
    // ======================================

    function showProductDetails(productId) {

        const product = productsData.find(
            item => item.id === productId
        );

        if (!product) {
            console.error("Product not found:", productId);
            return;
        }

        modalName.textContent = product.name;
        modalCategory.textContent = product.category.toUpperCase();
        modalDescription.textContent = product.description;
        modalPrice.textContent =
            Number(product.price).toFixed(2) + " TND";

        openGallery(product);
        displayRelatedProducts(product);

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }

    // ======================================
    // 7. PRODUCT IMAGE GALLERY
    // ======================================

    let currentImages = [];
    let currentImageIndex = 0;

    function openGallery(product) {

        currentImages =
            product.images && product.images.length > 0
                ? product.images
                : [product.image];

        currentImageIndex = 0;

        galleryImage.src = currentImages[0];
        galleryImage.alt = product.name;
    }

    function changeImage(direction) {

        if (currentImages.length <= 1) {
            return;
        }

        currentImageIndex += direction;

        if (currentImageIndex >= currentImages.length) {
            currentImageIndex = 0;
        }

        if (currentImageIndex < 0) {
            currentImageIndex = currentImages.length - 1;
        }

        galleryImage.src = currentImages[currentImageIndex];
    }

    window.changeImage = changeImage;

    // ======================================
    // 8. RELATED PRODUCTS
    // ======================================

    function displayRelatedProducts(product) {

        if (!relatedContainer) {
            return;
        }

        const relatedProducts = productsData.filter(item =>
            item.category === product.category &&
            item.id !== product.id
        );

        relatedContainer.innerHTML = "";

        if (relatedProducts.length === 0) {

            relatedContainer.textContent =
                "No related products available.";

            return;
        }

        relatedProducts.forEach(item => {

            const card = document.createElement("div");
            card.classList.add("related-card");

            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;

            const name = document.createElement("h4");
            name.textContent = item.name;

            const price = document.createElement("p");
            price.textContent =
                Number(item.price).toFixed(2) + " TND";

            const button = document.createElement("button");

            button.type = "button";
            button.textContent = "View Details";

            button.addEventListener("click", function () {
                showProductDetails(item.id);
            });

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(button);

            relatedContainer.appendChild(card);
        });
    }

    // ======================================
    // 9. CLOSE PRODUCT MODAL
    // ======================================

    function closeModal() {

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
    }

    closeModalButton.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            closeModal();
        }
    });

    // ======================================
    // 10. INITIALIZE PRODUCTS
    // ======================================

    displayProducts(productsData);

});