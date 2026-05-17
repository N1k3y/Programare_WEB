$(document).ready(function() {
    let itemHeight = 300;
    let speed = 3000;
    let visibleItems = 1;
    let interval;

    function updateSliderLayout() {
        visibleItems = parseInt($('#visible-items').val());
        // ajustam inaltimea
        $('.jq-slider-container').css('height', itemHeight * visibleItems + 'px');
    }

    function startAutoSlide() {
        clearInterval(interval);
        interval = setInterval(moveUp, speed);
    }

    function moveUp() {
        $('.jq-slider-wrapper').animate({
            top: -itemHeight
        }, 600, function() {
            // Mutăm primul element la coadă
            $(this).find('.slide-item:first').appendTo(this);
            $(this).css('top', 0);
        });
    }

    function moveDown() {
        // mutam ultimul element la inceput
        $('.jq-slider-wrapper').css('top', -itemHeight);
        $('.jq-slider-wrapper').find('.slide-item:last').prependTo('.jq-slider-wrapper');
        
        $('.jq-slider-wrapper').animate({
            top: 0
        }, 600);
    }

    // on click aplica setar
    $('#apply-settings').click(function() {
        speed = parseInt($('#slider-speed').val()) * 1000;
        updateSliderLayout();
        startAutoSlide();
    });

    // Săgeți
    $('.up-arrow').click(function() {
        moveDown();
        
        startAutoSlide();
    });

    $('.down-arrow').click(function() {
        moveUp();
        startAutoSlide();
    });

    updateSliderLayout();
    startAutoSlide();
});