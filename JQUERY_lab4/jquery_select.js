$(document).ready(function() {
    
   // la clcik deschidem/inchidem meniul
    $('.custom-select-trigger').click(function(e) {
        e.stopPropagation();
        let container = $(this).siblings('.custom-options-container');
        
        // inchide alte meniuri de acelasi tip
        $('.custom-options-container').not(container).hide(); 
        
        container.toggle();
        
        // pune cursorul
        if (container.is(':visible')) {
            container.find('#live-search').focus();
        }
    });

    // cautare live
    $('#live-search').on('keyup', function() {
        // facem lowercase
        let searchedText = $(this).val().toLowerCase();
        
        // trecem prin fiecare optiune
        $('.custom-options-list li').each(function() {
            let itemText = $(this).text().toLowerCase();
            
        
            if (itemText.includes(searchedText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // selectarea unei optiuni din lista
    $('.custom-options-list li').click(function() {
        let selectedText = $(this).text();
        let selectedValue = $(this).data('value'); 
        
        let wrapper = $(this).closest('.custom-select-wrapper');
        
        // schimbam textul din buton
        wrapper.find('.selected-text').text(selectedText);
        
        
        wrapper.find('#abonat_id').val(selectedValue);
        
        // ascunde lista
        $('.custom-options-container').hide();
        
        // resetam valoarea pentru urmatorea deschidere
        $('#live-search').val('');
        $('.custom-options-list li').show();
    });

    $(document).click(function() {
        $('.custom-options-container').hide();
    });
    
    $('.custom-options-container').click(function(e) {
        e.stopPropagation();
    });
    
});