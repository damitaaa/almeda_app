
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
let gallerySource = "";


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
    type: button.dataset.type,
    image: button.dataset.image || "",
    photographer: button.dataset.photographer || ""
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

gallerySource = "subcategory";

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

    const saveButton = document.createElement("button");
    saveButton.className = "save-item";
    saveButton.dataset.id = `photo-${photo.id}`;
    saveButton.dataset.name = photo.description;
    saveButton.dataset.type = "photo";
    saveButton.dataset.image = photo.image;
    saveButton.dataset.photographer = photo.photographer;
    saveButton.textContent = "♡ Save";

    card.appendChild(image);
    card.appendChild(photographer);
    card.appendChild(photoLink);
    card.appendChild(saveButton);

    galleryGrid.appendChild(card);
});

updateSaveButtons();

    } catch (error) {
        console.error(error);

        galleryGrid.innerHTML =
            "<p>Sorry, we couldn't load the hairstyles. Please try again.</p>";
    }
});

// Return to the correct browsing section
backSubcategoriesButton.addEventListener("click", () => {
    gallerySection.hidden = true;
    galleryGrid.innerHTML = "";

    if (gallerySource === "subcategory") {
        subcategorySection.hidden = false;
    } else {
        document.querySelector(".style-category-section").hidden = false;
        document.querySelector(".hair-type-section").hidden = false;
    }
});

console.log("Almeda categories are working!");

// Display saved categories, hairstyles and photos
function displaySavedItems() {
    const categoriesContainer =
        document.getElementById("saved-categories");

    const subcategoriesContainer =
        document.getElementById("saved-subcategories");

    const photosContainer =
        document.getElementById("saved-photos");

    // Clear existing content
    categoriesContainer.innerHTML = "";
    subcategoriesContainer.innerHTML = "";
    photosContainer.innerHTML = "";

    // Separate saved items by type
    const categories = savedItems.filter(
        item => item.type === "category"
    );

    const subcategories = savedItems.filter(
        item => item.type === "subcategory"
    );

    const photos = savedItems.filter(
        item => item.type === "photo"
    );

    // Display categories
    categories.forEach(item => {
        const card = document.createElement("div");
        card.className = "saved-card";

        const heading = document.createElement("h4");
        heading.textContent = item.name;

        card.appendChild(heading);
        card.appendChild(createRemoveButton(item.id));
        categoriesContainer.appendChild(card);
    });

    // Display subcategories
    subcategories.forEach(item => {
        const card = document.createElement("div");
        card.className = "saved-card";

        const heading = document.createElement("h4");
        heading.textContent = item.name;

        card.appendChild(heading);
        card.appendChild(createRemoveButton(item.id));
        subcategoriesContainer.appendChild(card);
    });

    // Display saved photos
    photos.forEach(item => {
        const card = document.createElement("article");
        card.className = "gallery-card";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        image.loading = "lazy";

        const photographer = document.createElement("p");
        photographer.textContent =
            `Photo by ${item.photographer || "Unknown"}`;

        card.appendChild(image);
        card.appendChild(photographer);
        card.appendChild(createRemoveButton(item.id));

        photosContainer.appendChild(card);
    });

    // Display empty messages
    if (categories.length === 0) {
        categoriesContainer.innerHTML =
            "<p>No saved categories yet.</p>";
    }

    if (subcategories.length === 0) {
        subcategoriesContainer.innerHTML =
            "<p>No saved hairstyles yet.</p>";
    }

    if (photos.length === 0) {
        photosContainer.innerHTML =
            "<p>No saved inspiration yet.</p>";
    }
}

// Create a remove button for saved items
function createRemoveButton(id) {
    const button = document.createElement("button");

    button.className = "remove-saved";
    button.textContent = "Remove";

    button.addEventListener("click", () => {
        savedItems = savedItems.filter(
            item => item.id !== id
        );

        localStorage.setItem(
            "almedaSavedItems",
            JSON.stringify(savedItems)
        );

        displaySavedItems();
        updateSaveButtons();
        displaySavedItems();
    });

    return button;
}

// Display saved items when page loads
displaySavedItems();

// Filter hairstyle inspiration by hair type
const hairTypeButtons = document.querySelectorAll(".hair-type");

hairTypeButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const selectedHairType = button.dataset.hairType;

gallerySource = "hair-type";

        // Highlight the selected hair type
        hairTypeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Create a search query for Unsplash
        const searchQuery = selectedHairType === "All"
            ? "natural curly hairstyles"
            : `${selectedHairType} natural hair hairstyles`;

        // Open the existing gallery
       // Hide the category sections and open the gallery
document.querySelector(".style-category-section").hidden = true;
document.querySelector(".hair-type-section").hidden = true;

subcategorySection.hidden = true;
gallerySection.hidden = false;

        galleryHeading.textContent =
            selectedHairType === "All"
                ? "All hair types"
                : `${selectedHairType} hair inspiration`;

        galleryGrid.innerHTML = "<p>Loading hairstyles...</p>";

        gallerySection.scrollIntoView({
            behavior: "smooth"
        });

        try {
            const response = await fetch(
                `/api/photos?query=${encodeURIComponent(searchQuery)}`
            );

            if (!response.ok) {
                throw new Error("Unable to fetch hairstyles.");
            }

            const data = await response.json();

            galleryGrid.innerHTML = "";

            if (data.results.length === 0) {
                galleryGrid.innerHTML =
                    "<p>No hairstyles found for this hair type.</p>";
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
                photographer.textContent =
                    `Photo by ${photo.photographer}`;
                photographer.target = "_blank";
                photographer.rel = "noopener noreferrer";

                const photoLink = document.createElement("a");
                photoLink.href = photo.photoLink;
                photoLink.textContent = "View on Unsplash";
                photoLink.target = "_blank";
                photoLink.rel = "noopener noreferrer";

                const saveButton = document.createElement("button");
                saveButton.className = "save-item";
                saveButton.dataset.id = `photo-${photo.id}`;
                saveButton.dataset.name = photo.description;
                saveButton.dataset.type = "photo";
                saveButton.dataset.image = photo.image;
                saveButton.dataset.photographer = photo.photographer;
                saveButton.textContent = "♡ Save";

                card.appendChild(image);
                card.appendChild(photographer);
                card.appendChild(photoLink);
                card.appendChild(saveButton);

                galleryGrid.appendChild(card);
            });

            updateSaveButtons();

        } catch (error) {
            console.error(error);

            galleryGrid.innerHTML =
                "<p>Sorry, we couldn't load these hairstyles. Please try again.</p>";
        }
    });
});

// Search for hairstyles
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keydown", async event => {
    if (event.key !== "Enter") return;

    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") return;

    // Remember where the gallery was opened from
    gallerySource = "search";

    // Hide browsing sections
    document.querySelector(".style-category-section").hidden = true;
    document.querySelector(".hair-type-section").hidden = true;
    subcategorySection.hidden = true;

    // Open the gallery
    gallerySection.hidden = false;
    galleryHeading.textContent = `Results for "${searchTerm}"`;
    galleryGrid.innerHTML = "<p>Searching hairstyles...</p>";

    gallerySection.scrollIntoView({
        behavior: "smooth"
    });

    try {
        const response = await fetch(
            `/api/photos?query=${encodeURIComponent(searchTerm + " hairstyle")}`
        );

        if (!response.ok) {
            throw new Error("Unable to search hairstyles.");
        }

        const data = await response.json();

        galleryGrid.innerHTML = "";

        if (data.results.length === 0) {
            galleryGrid.innerHTML =
                "<p>No hairstyles found. Try another search.</p>";
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

            const saveButton = document.createElement("button");
            saveButton.className = "save-item";
            saveButton.dataset.id = `photo-${photo.id}`;
            saveButton.dataset.name = photo.description;
            saveButton.dataset.type = "photo";
            saveButton.dataset.image = photo.image;
            saveButton.dataset.photographer = photo.photographer;
            saveButton.textContent = "♡ Save";

            card.appendChild(image);
            card.appendChild(photographer);
            card.appendChild(photoLink);
            card.appendChild(saveButton);

            galleryGrid.appendChild(card);
        });

        updateSaveButtons();

    } catch (error) {
        console.error(error);

        galleryGrid.innerHTML =
            "<p>Sorry, we couldn't complete your search. Please try again.</p>";
    }
});