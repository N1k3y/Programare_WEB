$(document).ready(function() {

    let timerInterval;
    let timeLeft = 25 * 60;
    let isRunning = false;

    // animatia sliding panel
    let isPanelOpen = false;

    $('#pomodoro-toggle').click(function() {
        if (isPanelOpen) {
            // impingem inapoi in dreapta
            $('.pomodoro-container').animate({ right: '-250px' }, 350, "swing");
        } else {
            $('.pomodoro-container').animate({ right: '0px' }, 350, "swing");
        }
        isPanelOpen = !isPanelOpen; // schimbam starea
    });

    // actualizarea timpului
    function updateDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        
        $('#pomodoro-time').text(minutes + ":" + seconds);
    }

    // logica butonului start
    $('#pom-start').click(function() {
        if (!isRunning && timeLeft > 0) {
            isRunning = true;
            
            timerInterval = setInterval(function() {
                timeLeft--;
                updateDisplay();
                
                // efect la expirare
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    
                    $('#pomodoro-time')
                        .css('color', 'red')
                        .fadeOut(200).fadeIn(200)
                        .fadeOut(200).fadeIn(200)
                        .fadeOut(200).fadeIn(200, function() {
                            alert("Timpul a expirat! Ia o pauză binemeritată de 5 minute.");
                        });
                }
            }, 1000);
        }
    });

    // butonul de pauza
    $('#pom-pause').click(function() {
        clearInterval(timerInterval);
        isRunning = false;
    });

    // butonul de reset
    $('#pom-reset').click(function() {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = 25 * 60; 
        $('#pomodoro-time').css('color', '#1e3c72'); 
        updateDisplay();
    });

    updateDisplay();

});