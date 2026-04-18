document.addEventListener('DOMContentLoaded', () => {
    // Selectăm elementele necesare
    const slides = document.querySelectorAll('#lista-anunturi .slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Verificăm dacă există lista pe pagină pentru a evita erori pe alte pagini
    if (slides.length === 0) return; 

    let currentIndex = 0;
    const timpAfisare = 4000; // n secunde (aici am pus 4000 milisecunde = 4 secunde)
    let slideTimer;

    // Funcția care schimbă slide-ul vizibil
    function arataSlide(index) {
        // Ascundem slide-ul curent ștergându-i clasa "active"
        slides[currentIndex].classList.remove('active');
        
        // Actualizăm indexul curent, asigurându-ne că e în limite (efect de buclă)
        currentIndex = index;
        
        if (currentIndex < 0) {
            currentIndex = slides.length - 1; // De la primul sărim la ultimul
        } else if (currentIndex >= slides.length) {
            currentIndex = 0; // De la ultimul sărim la primul
        }
        
        // Afișăm noul slide adăugându-i clasa "active"
        slides[currentIndex].classList.add('active');
    }

    // Funcția pentru a trece la următorul slide
    function nextSlide() {
        arataSlide(currentIndex + 1);
        resetTimer(); // Resetăm temporizatorul dacă utilizatorul a dat click manual
    }

    // Funcția pentru a trece la slide-ul anterior
    function prevSlide() {
        arataSlide(currentIndex - 1);
        resetTimer();
    }

    // Funcția care pornește trecerea automată după n secunde
    function startTimer() {
        slideTimer = setInterval(() => {
            arataSlide(currentIndex + 1);
        }, timpAfisare);
    }

    // Funcția care resetează timpul (utilă când apăsăm butoanele)
    function resetTimer() {
        clearInterval(slideTimer);
        startTimer();
    }

    // Atașăm evenimentele de click pentru butoane
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Pornim cronometrul la încărcarea paginii
    startTimer();
});