
require("dotenv").config();

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Serve Almeda's frontend files
app.use(express.static(__dirname));

// Search Unsplash for hairstyle photos
app.get("/api/photos", async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({
            error: "Please provide a search query."
        });
    }

    if (!ACCESS_KEY) {
        return res.status(500).json({
            error: "Unsplash API key is missing."
        });
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&content_filter=high`,
            {
                headers: {
                    Authorization: `Client-ID ${ACCESS_KEY}`,
                    "Accept-Version": "v1"
                }
            }
        );

        if (!response.ok) {
            console.error("Unsplash error:", response.status);

            return res.status(response.status).json({
                error: "Unable to retrieve photos from Unsplash."
            });
        }

        const data = await response.json();

        const photos = data.results.map(photo => ({
            id: photo.id,
            description: photo.alt_description || photo.description || query,
            image: photo.urls.regular,
            photographer: photo.user.name,
            photographerLink: photo.user.links.html +
                "?utm_source=almeda&utm_medium=referral",
            photoLink: photo.links.html +
                "?utm_source=almeda&utm_medium=referral"
        }));

        res.json({ results: photos });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            error: "Something went wrong while fetching photos."
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Almeda is running on port ${PORT}`);
});
