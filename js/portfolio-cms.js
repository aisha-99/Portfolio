document.addEventListener("DOMContentLoaded", async () => {
    const spaceID = "9ivsylmw9p3m";
    const accessToken = "SjUQZDO7xSYc2IeDzAWqx5j0WuwEjMLPCPvt6QCeils";

    const url = `https://cdn.contentful.com/spaces/${spaceID}/environments/master/entries?access_token=${accessToken}&content_type=portfolio`;

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


            const galleryTrack = document.getElementById("gallery-track");
            project.images.forEach(image => {
                let img = document.createElement("img");
                img.src = getImageUrl(image.sys.id);
                img.alt = "Gallery Image";
                galleryTrack.appendChild(img);
            });



            
            // Gallery Carousel
            let currentIndex = 0;
            const images = document.querySelectorAll(".gallery-track img");
            const totalImages = images.length;

            document.getElementById("next").addEventListener("click", () => {
                if (currentIndex < totalImages - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                galleryTrack.style.transform = `translateX(-${currentIndex * 260}px)`;
            });

            document.getElementById("prev").addEventListener("click", () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = totalImages - 1;
                }
                galleryTrack.style.transform = `translateX(-${currentIndex * 260}px)`;
            });
        }

    } catch (error) {
        console.error("Error fetching Contentful data:", error);
    }
});

