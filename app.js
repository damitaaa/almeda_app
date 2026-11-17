
// Almeda hairstyle collections
const collections = {
    protective: [
        "Box braids",
        "Knotless braids",
        "Bora Bora braids",
        "Miracle knots",
        "French curl",
        "Cornrows"
    ],

    natural: [
        "Wash and gos",
        "Mini twists",
        "Mini braids",
        "Locs"
    ]
};

// Get page elements
const categoryButtons = document.querySelectorAll(".open-category");
const subcategorySection = document.getElementById("subcategory-section");
const subcategoryGrid = document.getElementById("subcategory-grid");
const subcategoryHeading = document.getElementById("subcategory-heading");
const backButton = document.getElementById("back-categories");
// Gallery elements
const gallerySection = document.getElementById("gallery-section");
const galleryGrid = document.getElementById("gallery-grid");
const galleryHeading = document.getElementById("gallery-heading");
const backSubcategoriesButton = document.getElementById("back-subcategories");

// Store the selected category
let currentCategory = "";

// Open a category
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentCategory = button.dataset.category;

        const categoryName =
            currentCategory === "protective"
                ? "Protective styles"
                : "Natural styles";

        subcategoryHeading.textContent = categoryName;

        displaySubcategories();

        subcategorySection.hidden = false;
        document.querySelector(".style-category-section").hidden = true;
        document.querySelector(".hair-type-section").hidden = true;

        subcategorySection.scrollIntoView({
            behavior: "smooth"
        });
    });
});


// Display subcategories
function displaySubcategories() {
    subcategoryGrid.innerHTML = "";

    collections[currentCategory].forEach((name, index) => {
        const card = document.createElement("article");
        card.className = "subcategory-card";

        const id = `${currentCategory}-${index}`;

        card.innerHTML = `
            <h4>${name}</h4>

            <button class="view-style"
                data-name="${name}">
                View hairstyles →
            </button>

            <button class="save-item"
                data-id="${id}"
                data-name="${name}"
                data-type="subcategory">
                ♡ Save
            </button>
        `;

        subcategoryGrid.appendChild(card);
    });

    updateSaveButtons();
}

// Return to categories
backButton.addEventListener("click", () => {
    subcategorySection.hidden = true;
    document.querySelector(".style-category-section").hidden = false;
    document.querySelector(".hair-type-section").hidden = false;
});

// Save items
let savedItems = JSON.parse(
    localStorage.getItem("almedaSavedItems") || "[]"
);

function updateSaveButtons() {
    document.querySelectorAll(".save-item").forEach(button => {
        const isSaved = savedItems.some(
            item => item.id === button.dataset.id
        );

        button.textContent = isSaved ? "♥ Saved" : "♡ Save";
        button.classList.toggle("saved", isSaved);
    });
}

document.addEventListener("click", event => {
    const button = event.target.closest(".save-item");

    if (!button) return;

    const id = button.dataset.id;

    const existingItem = savedItems.find(item => item.id === id);

    if (existingItem) {
        savedItems = savedItems.filter(item => item.id !== id);
    } else {
        savedItems.push({
            id: id,
            name: button.dataset.name,
            type: button.dataset.type
        });
    }

    localStorage.setItem(
        "almedaSavedItems",
        JSON.stringify(savedItems)
    );

    updateSaveButtons();
});

// Update saved buttons when the page loads
updateSaveButtons();

// Open a hairstyle gallery
document.addEventListener("click", async event => {
    const button = event.target.closest(".view-style");

    if (!button) return;

    const styleName = button.dataset.name;
    console.log("Gallery button clicked:", styleName);

    // Hide the previous sections
    subcategorySection.hidden = true;
    gallerySection.hidden = false;

    galleryHeading.textContent = styleName;
    galleryGrid.innerHTML = "<p>Loading hairstyles...</p>";

    gallerySection.scrollIntoView({
        behavior: "smooth"
    });

    try {
        const response = await fetch(
            `/api/photos?query=${encodeURIComponent(styleName)}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch hairstyles.");
        }

        const data = await response.json();

        galleryGrid.innerHTML = "";

        if (data.results.length === 0) {
            galleryGrid.innerHTML = "<p>No hairstyles found.</p>";
            return;
        }

        data.results.forEach(photo => {
            const card = document.createElement("article");
            card.className = "gallery-card";

            const image = document.createElement("img");
            image.src = photo.image;
            image.alt = photo.description;
            image.loading = "lazy";

            const photographer = document.createElement("a");
            photographer.href = photo.photographerLink;
            photographer.textContent = `Photo by ${photo.photographer}`;
            photographer.target = "_blank";
            photographer.rel = "noopener noreferrer";

            const photoLink = document.createElement("a");
            photoLink.href = photo.photoLink;
            photoLink.textContent = "View on Unsplash";
            photoLink.target = "_blank";
            photoLink.rel = "noopener noreferrer";

            card.appendChild(image);
            card.appendChild(photographer);
            card.appendChild(photoLink);

            galleryGrid.appendChild(card);
        });

    } catch (error) {
        console.error(error);

        galleryGrid.innerHTML =
            "<p>Sorry, we couldn't load the hairstyles. Please try again.</p>";
    }
});

// Return to the subcategories
backSubcategoriesButton.addEventListener("click", () => {
    gallerySection.hidden = true;
    subcategorySection.hidden = false;

    galleryGrid.innerHTML = "";
});

console.log("Almeda categories are working!");
