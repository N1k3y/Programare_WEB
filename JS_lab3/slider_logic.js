function setupSlideshowControls() {
    // elementele galeriei
    const mainImage = document.querySelector('.css-slider .default-image');
    
    const imaginiMari = Array.from(document.querySelectorAll('.css-slider .large-img')).map(img => img.src);
    
    if (!mainImage || imaginiMari.length === 0) return;

    // selectăm elementele de control adăugate în HTML
    const playPauseBtn = document.getElementById('playPauseBtn');
    const repeatCheckbox = document.getElementById('repeatCheckbox');
    const intervalSelect = document.getElementById('intervalSelect');

    let currentIndex = 0;
    let isPlaying = false;
    let timer = null;

    // functia care efectueaza trecerea la urmatoarea poza
    function nextImage() {
        currentIndex++;
        
        if (currentIndex >= imaginiMari.length) {
            // daca am depasit nr de poze incepem de la 0
            if (repeatCheckbox.checked) {
                currentIndex = 0; 
            } else {
                currentIndex = imaginiMari.length - 1;
                stopSlideshow();
                return;
            }
        }
        
        mainImage.src = imaginiMari[currentIndex];
    }

    function startSlideshow() {
        isPlaying = true;
        
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pauză';
        playPauseBtn.style.backgroundColor = '#dc3545';
        
        if (currentIndex === imaginiMari.length - 1 && repeatCheckbox.checked) {
            currentIndex = -1; 
        }

        // citim intervalul 
        const interval = parseInt(intervalSelect.value, 10);
        
        timer = setInterval(nextImage, interval);
    }


    function stopSlideshow() {
        isPlaying = false;
        
        // revenim la aspectul inițial al butonului
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        playPauseBtn.style.backgroundColor = '#007BFF'; // Albastru la loc
        
        // Oprim cronometrul
        clearInterval(timer);
    }

    //evenimente
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    intervalSelect.addEventListener('change', () => {
        // daca slideshow-ul rulează deja, îi dăm un "restart" ca să preia noua viteză instantaneu
        if (isPlaying) {
            stopSlideshow();
            startSlideshow();
        }
    });
}

// apelam cand DOM ul este incarcat
document.addEventListener('DOMContentLoaded', setupSlideshowControls);