
// Find the search bar, hairstyle cards and category buttons
const searchInput = document.getElementById("search-input");
const hairstyleCards = document.querySelectorAll(".hairstyle-card");
const categoryButtons = document.querySelectorAll(".category");

// Store the selected category
let selectedCategory = "All";

// Filter hairstyles
function filterHairstyles() {
    const searchTerm = searchInput.value.toLowerCase();

    hairstyleCards.forEach(card => {
        const category = card.dataset.category;
        const cardText = card.textContent.toLowerCase();

        const matchesCategory =
            selectedCategory === "All" || category === selectedCategory;

        const matchesSearch = cardText.includes(searchTerm);

        card.style.display =
            matchesCategory && matchesSearch ? "block" : "none";
    });
}

// Search as the user types
searchInput.addEventListener("input", filterHairstyles);

// Filter by category
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.textContent.trim();

        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        filterHairstyles();
    });
});

// Get favourite elements
const favouriteButtons = document.querySelectorAll(".favourite-btn");
const savedList = document.getElementById("saved-list");
const savedEmpty = document.getElementById("saved-empty");

// Load saved hairstyles
let savedHairstyles = JSON.parse(
    localStorage.getItem("almedaFavourites") || "[]"
);

// Display favourites
function displayFavourites() {
    savedList.innerHTML = "";

    savedEmpty.style.display =
        savedHairstyles.length === 0 ? "block" : "none";

    savedHairstyles.forEach(name => {
        const item = document.createElement("li");
        item.textContent = name;
        savedList.appendChild(item);
    });
}

// Update favourite buttons
function updateFavouriteButtons() {
    favouriteButtons.forEach(button => {
        const card = button.closest(".hairstyle-card");
        const name = card.querySelector("h3").textContent;

        if (savedHairstyles.includes(name)) {
            button.textContent = "♥ Saved";
            button.classList.add("saved");
        } else {
            button.textContent = "♡ Save to favourites";
            button.classList.remove("saved");
        }
    });
}

// Save or remove favourites
favouriteButtons.forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".hairstyle-card");
        const name = card.querySelector("h3").textContent;

        if (savedHairstyles.includes(name)) {
            savedHairstyles = savedHairstyles.filter(
                hairstyle => hairstyle !== name
            );
        } else {
            savedHairstyles.push(name);
        }

        localStorage.setItem(
            "almedaFavourites",
            JSON.stringify(savedHairstyles)
        );

        displayFavourites();
        updateFavouriteButtons();
    });
});

// Display favourites when the page loads
displayFavourites();
updateFavouriteButtons();

// Get hairstyle detail elements
const detailSection = document.getElementById("hairstyle-details");
const detailTitle = document.getElementById("detail-title");
const detailCategory = document.getElementById("detail-category");
const detailDescription = document.getElementById("detail-description");
const backButton = document.getElementById("back-btn");
const viewButtons = document.querySelectorAll(".view-btn");

// Open a hairstyle's details
viewButtons.forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".hairstyle-card");

        detailTitle.textContent = card.querySelector("h3").textContent;
        detailCategory.textContent = card.dataset.category;
        detailDescription.textContent = card.dataset.description;

        detailSection.hidden = false;
        document.querySelector(".explore-section").hidden = true;

        detailSection.scrollIntoView({ behavior: "smooth" });
    });
});

// Return to the hairstyle gallery
backButton.addEventListener("click", () => {
    detailSection.hidden = true;
    document.querySelector(".explore-section").hidden = false;

    document.querySelector(".explore-section").scrollIntoView({
        behavior: "smooth"
    });
});