function setupSlideshowControls() {
    // Selectăm elementele galeriei tale
    const mainImage = document.querySelector('.css-slider .default-image');
    
    // Extragem într-un array (listă) toate sursele de imagini mari (.large-img)
    const imaginiMari = Array.from(document.querySelectorAll('.css-slider .large-img')).map(img => img.src);
    
    // Dacă nu avem galeria pe pagină, oprim scriptul pentru a nu da erori
    if (!mainImage || imaginiMari.length === 0) return;

    // Selectăm elementele de control adăugate în HTML
    const playPauseBtn = document.getElementById('playPauseBtn');
    const repeatCheckbox = document.getElementById('repeatCheckbox');
    const intervalSelect = document.getElementById('intervalSelect');

    let currentIndex = 0;
    let isPlaying = false;
    let timer = null;

    // 1. Funcția care efectuează trecerea la următoarea poză
    function nextImage() {
        currentIndex++;
        
        // Verificăm dacă am depășit numărul de poze
        if (currentIndex >= imaginiMari.length) {
            // Dacă checkbox-ul este bifat, o luăm de la 0
            if (repeatCheckbox.checked) {
                currentIndex = 0; 
            } else {
                // Dacă NU este bifat, ne oprim la ultima imagine
                currentIndex = imaginiMari.length - 1;
                stopSlideshow();
                return;
            }
        }
        
        // Schimbăm sursa imaginii principale cu cea corespunzătoare noului index
        mainImage.src = imaginiMari[currentIndex];
    }

    // 2. Funcția de Start
    function startSlideshow() {
        isPlaying = true;
        
        // Modificăm aspectul butonului
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pauză';
        playPauseBtn.style.backgroundColor = '#dc3545'; // Culoare roșie pentru Pauză
        
        // Dacă am rămas blocat la ultima poză (repetare debifată) și dau din nou play, o iau de la capăt
        if (currentIndex === imaginiMari.length - 1 && repeatCheckbox.checked) {
            currentIndex = -1; // Setăm la -1 pentru că nextImage() îl va face imediat 0
        }

        // Citim valoarea selectată în Combobox (ex: 2000 milisecunde)
        const interval = parseInt(intervalSelect.value, 10);
        
        // Pornim repetiția
        timer = setInterval(nextImage, interval);
    }

    // 3. Funcția de Stop
    function stopSlideshow() {
        isPlaying = false;
        
        // Revenim la aspectul inițial al butonului
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        playPauseBtn.style.backgroundColor = '#007BFF'; // Albastru la loc
        
        // Oprim cronometrul
        clearInterval(timer);
    }

    // ========================
    // EVENIMENTE (LISTENERS)
    // ========================

    // La click pe Play/Pauză
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    // La schimbarea secundelor din Combobox
    intervalSelect.addEventListener('change', () => {
        // Dacă slideshow-ul rulează deja, îi dăm un "restart" ca să preia noua viteză instantaneu
        if (isPlaying) {
            stopSlideshow();
            startSlideshow();
        }
    });
}

// Apelăm funcția când documentul este încărcat
document.addEventListener('DOMContentLoaded', setupSlideshowControls);