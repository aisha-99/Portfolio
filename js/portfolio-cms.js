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

            document.getElementById("created-with").textContent = "Created With: " + project.createdWith;
            document.getElementById("link").textContent = project.link;

            document.getElementById("project-name").textContent = project.projectName;
            document.getElementById("project-intro").textContent = project.intro;
            document.getElementById("main-image").src = getImageUrl(project.mainImage.sys.id);
            document.getElementById("project-information").textContent = project.information;
            document.getElementById("moreInformation").textContent = project.moreInformation;
            document.getElementById("moreInformation2").textContent = project.moreInformation2;
            document.getElementById("image1").src = getImageUrl(project.image1.sys.id);
            document.getElementById("image2").src = getImageUrl(project.image2.sys.id);
            document.getElementById("image3").src = getImageUrl(project.image3.sys.id);
            document.getElementById("image4").src = getImageUrl(project.image4.sys.id);



            const galleryTrack = document.querySelector(".gallery-track");
            const dotsContainer = document.querySelector(".carousel-dots");

            galleryTrack.innerHTML = "";
            dotsContainer.innerHTML = "";

            const imageElements = project.images.map((image, index) => {
                return new Promise((resolve) => {
                    const img = document.createElement("img");
                    img.src = getImageUrl(image.sys.id);
                    img.alt = `Gallery Image ${index + 1}`;
                    img.classList.add("carousel-image");
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error("Error loading image:", img.src);
                        resolve(img);
                    };
                });
            });

            Promise.all(imageElements).then((images) => {
                images.forEach(img => galleryTrack.appendChild(img));

                initializeCarousel(images.length);
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

function initializeCarousel(totalImages) {
    const galleryTrack = document.querySelector(".gallery-track");
    const images = document.querySelectorAll(".carousel-image");
    const dotsContainer = document.querySelector(".carousel-dots");
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");

    let currentIndex = 0;

    if (totalImages === 0) return;

    // Set uniform width for images
    galleryTrack.style.width = `${totalImages * 100}%`;
    images.forEach(image => {
        image.style.width = "100%";
        image.style.height = "500px";
        image.style.objectFit = "cover";
    });

    // Create and append dots
    dotsContainer.innerHTML = ""; // Clear old dots if they exist
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll(".dot");
    dots[0].classList.add("active");

    function updateCarousel(index) {
        currentIndex = (index + totalImages) % totalImages;
        galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[currentIndex].classList.add("active");
    }

    nextButton.addEventListener("click", () => updateCarousel(currentIndex + 1));
    prevButton.addEventListener("click", () => updateCarousel(currentIndex - 1));

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const clickedIndex = parseInt(dot.dataset.index);
            updateCarousel(clickedIndex);
        });
    });
}

