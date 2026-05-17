document.addEventListener('DOMContentLoaded', () => {
    
    const slides = document.querySelectorAll('#lista-anunturi .slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (slides.length === 0) return; 

    let currentIndex = 0;
    const timpAfisare = 4000; 
    let slideTimer;

    
    function arataSlide(index) {
        // stergem clasa slide ului curent
        slides[currentIndex].classList.remove('active');
        
        // actualizam indexul
        currentIndex = index;
        
        if (currentIndex < 0) {
            currentIndex = slides.length - 1; 
        } else if (currentIndex >= slides.length) {
            currentIndex = 0; 
        }
        
        slides[currentIndex].classList.add('active');
    }

    function nextSlide() {
        arataSlide(currentIndex + 1);
        resetTimer(); 
    }

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

    function resetTimer() {
        clearInterval(slideTimer);
        startTimer();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    startTimer();
});