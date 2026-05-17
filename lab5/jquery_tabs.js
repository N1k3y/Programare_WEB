$(document).ready(function() {
    
    $('.tab-link').click(function() {
        
        //luam id ul tab uli
        var targetTabId = $(this).attr('data-tab');
        
        // gasim linia pe care ne aflam
        var $container = $(this).closest('.tabs-container');

        // dezactivam butoanele de tab din container
        $container.find('.tab-link').removeClass('active');
        
        // ascundem sectiune de continut, scoatem active
        $container.find('.tab-content').removeClass('active');

        // punem active unde s a dat click
        $(this).addClass('active');
        
    
        $("#" + targetTabId).addClass('active');
    });

});