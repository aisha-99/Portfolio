document.addEventListener("DOMContentLoaded", async () => {
    const spaceID = "9ivsylmw9p3m";
    const accessToken = "SjUQZDO7xSYc2IeDzAWqx5j0WuwEjMLPCPvt6QCeils";

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("slug");

    const url = `https://cdn.contentful.com/spaces/${spaceID}/environments/master/entries?access_token=${accessToken}&content_type=portfolio&fields.slug=${slug}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items.length > 0) {
            const project = data.items[0].fields;
            const assets = data.includes.Asset;

            const getImageUrl = (id) => {
                const asset = assets.find((a) => a.sys.id === id);
                return asset ? asset.fields.file.url : "";
            };

            document.getElementById("project-name").textContent = project.projectName;
            document.getElementById("project-intro").textContent = project.intro;
            document.getElementById("main-image").src = getImageUrl(project.mainImage.sys.id);
            document.getElementById("project-information").textContent = project.information;
            document.getElementById("created-with").textContent = "Created With: " + project.createdWith;
            document.getElementById("link").textContent = project.link;

            const galleryTrack = document.querySelector(".gallery-track");
            const dotsContainer = document.querySelector(".carousel-dots");

            galleryTrack.innerHTML = "";
            dotsContainer.innerHTML = "";

            const imagePromises = project.images.map((image, index) => {
                return new Promise((resolve, reject) => {
                    const img = document.createElement("img");
                    const imageUrl = getImageUrl(image.sys.id);

                    img.addEventListener('load', () => resolve(img));
                    img.addEventListener('error', () => {
                        console.error("Error loading image:", imageUrl);
                        resolve(img); // Resolve even if there's an error
                    });

                    img.src = imageUrl;
                    img.alt = "Gallery Image";
                    img.classList.add("carousel-image");
                    galleryTrack.appendChild(img); // Append image after setting src

                    const dot = document.createElement("span");
                    dot.classList.add("dot");
                    dot.dataset.index = index;
                    dotsContainer.appendChild(dot);
                });
            });

            Promise.all(imagePromises).then(() => {
                initializeCarousel(); // Call after all images have loaded
            });

        } else {
            console.error("No project found with that slug.");
            document.querySelector(".carousel-container").innerHTML = "<p>Project not found.</p>";
        }

    } catch (error) {
        console.error("Error fetching Contentful data:", error);
        document.querySelector(".carousel-container").innerHTML = "<p>Error loading project.</p>";
    }
});

function initializeCarousel() {
    const galleryTrack = document.querySelector(".gallery-track");
    const images = document.querySelectorAll(".carousel-image"); // Get images again here
    const dots = document.querySelectorAll(".dot");
    const prevButton = document.querySelector(".prev-button"); // Correct selector!
    const nextButton = document.querySelector(".next-button"); // Correct selector!

    let currentIndex = 0;

    if (images.length === 0) return;

    galleryTrack.style.width = `${images.length * 100}%`;
    images.forEach(image => image.style.width = `${100 / images.length}%`);

    function updateCarousel(index) {
        currentIndex = (index + images.length) % images.length;
        galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[currentIndex].classList.add("active");

        console.log("Current Index:", currentIndex); // Debugging
    }

    dots[0].classList.add("active");

    nextButton.addEventListener("click", () => updateCarousel(currentIndex + 1));
    prevButton.addEventListener("click", () => updateCarousel(currentIndex - 1));

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const clickedIndex = parseInt(dot.dataset.index);
            updateCarousel(clickedIndex);
        });
    });
}