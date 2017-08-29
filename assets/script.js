/*  assets/script.js    */

/*============================================================================
 Money Format
 - Shopify.format money is defined in option_selection.js.
 If that file is not included, it is redefined here.
 ==============================================================================*/
if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);

        if (typeof cents == 'string') {
            cents = cents.replace('.','');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal   = defaultOption(decimal, '.');

            if (isNaN(number) || number == null) {
                return 0;
            }

            number = (number/100.0).toFixed(precision);

            var parts   = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents   = parts[1] ? (decimal + parts[1]) : '';

            return dollars + cents;
        }

        switch(formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }

        return formatString.replace(placeholderRegex, value);
    };
}

/**
 * Navbar scrolling logic
 */
function updateHeader() {
    var scroll = $(window).scrollTop(),
        navbar = $('.navbar-fixed-top'),
        body = $('body');

    if (body.hasClass('not-index') && body.hasClass('offside-js--is-open')) {
        // Ensure that the navbar on a page that isn't the homepage doesn't jump
        // to an incorrect position on the page when it's open.
        navbar.css('position', 'fixed');
        navbar.css('top', (scroll - 90) + 'px');
    } else {
        if (scroll >= 50) {
            // If not at the top of a page...
            navbar.css('position', 'absolute');

            if (body.hasClass('not-index') && body.hasClass('is-closing')) {
                // This is a hack to ensure that the navbar on a page that isn't
                // the home page doesn't jump to an incorrect position on the
                // page as we're closing the slide-in menu.
                body.removeClass('is-closing');
                navbar.css('top', (scroll - 90) + 'px');
            } else {
                navbar.css('top', scroll + 'px');
            }
        } else {
            // If at the top of a page...
            navbar.css('position', 'fixed');

            if (body.hasClass('not-index') && body.hasClass('is-closing')) {
                // This is a hack to ensure that the navbar on a page that isn't
                // the home page doesn't jump to an incorrect position on the
                // page as we're closing the slide-in menu.
                body.removeClass('is-closing');
                navbar.css('top', (scroll - 90) + 'px');
            } else {
                navbar.css('top', '0px');
            }
        }
    }
    
    if (scroll >= 50) {
        navbar.addClass("top-nav-collapse");
        $('.navbar-brand img').addClass("logo-max-height");
    } else {
        navbar.removeClass("top-nav-collapse");
        $('.navbar-brand img').removeClass("logo-max-height");
    }
}

var offsideMenu,
    cartloadcount = 0;
offsideMenu = offside('#slideInMenu', {
    slidingElementsSelector:'#container',
    buttonsSelector: '.slide-in-menu-close, .header-cart-icon',
    slidingSide: 'right',
    beforeOpen: function(){

      if(window.innerWidth > 1024){
        document.getElementById('CartContainer').style.overflow = 'hidden';
        setTimeout(function(){document.getElementById('CartContainer').style.overflow = 'auto'; }, 300);
      }else{
        document.getElementById('CartContainer').style.overflow = null; 
      }
    }
});

window.onload = function() {
    /*offsideMenu = offside('#slideInMenu', {
        slidingElementsSelector:'#container',
        buttonsSelector: '.slide-in-menu-close, .header-cart-icon',
        slidingSide: 'right',
        beforeOpen: function(){
          
          if(window.innerWidth > 1024){
            document.getElementById('CartContainer').style.overflow = 'hidden';
            setTimeout(function(){document.getElementById('CartContainer').style.overflow = 'auto'; }, 300);
          }else{
            document.getElementById('CartContainer').style.overflow = null; 
          }
        }
    });

    jQuery(document.body).on('afterCartLoad.ajaxCart', function(event, cart) {
        cartloadcount++;
        if (cart.items.length > 0 && cartloadcount > 1) {
            offsideMenu.open();
        } else {
            offsideMenu.close();
        }
    });*/

    /* Show/Hide Delivery Instructions */
    jQuery('#cart-note-checkout').hide();
    if(jQuery('#leave-unattended').prop('checked'))
    {
        jQuery('#cart-note-checkout').show('slow');
    }
    jQuery('#leave-unattended').on('click', function() {
        jQuery('#cart-note-checkout').hide('slow');
        if(jQuery(this).prop('checked'))
        {
            jQuery('#cart-note-checkout').show('slow');
        }
    });
};

$(document.body).on('afterCartLoad.ajaxCart', function (event, cart) {
    cartloadcount++;
    if (cart.items.length > 0 && cartloadcount > 1) {
      offsideMenu.open();
    } else {
      offsideMenu.close();
    }

    //Clear Cart
    $('.clear-cart-btn a').click(function () {
        $.ajax({
            type: "POST",
            url: '/cart/clear.js',
            data: '',
            dataType: 'json',
            success: function() {
                $.ajax({
                    type: "POST",
                    url: "/cart/update.js",
                    data: {attributes: {'terms_and_conditions': '', 'recycle_box': '', 'authority_to_leave': ''}, note: ''},
                    dataType: 'json',
                    success: function() {
                        ajaxCart.load();
                    },
                    error: function(XMLHttpRequest, textStatus) {
                        /* error code */
                        console.log('Error');
                        console.log(textStatus);
                    }
                });
            },
            error: function(XMLHttpRequest, textStatus) {
              /* error code */
              console.log('Error');
              console.log(textStatus);
            }
        });
    }); /* ## Clear Cart end ## */

    /* Remove a meal plan item */
    $('.remove-mealplan-item > a').click(function(e) {

        e.preventDefault();
        
        var products = {};
        
        $('.ajaxcart__product-data').each(function(i, v) {
            var el = $(this).data();
            products[el.key] = 0;
        });

        $.post( '/cart/update.js', {updates: products})
            .always(function( data ) {
                console.log(data );
                ajaxCart.load()
            });


    });
});

/* Navbar - Shrink logo, when navbar scrolls */
$(window).on('scroll', function() {
    var scroll = $(window).scrollTop(),
        navbar = $('.navbar-fixed-top'),
        body = $('body');

    if (scroll >= 50) {
        navbar.addClass("top-nav-collapse");
        $('.navbar-brand img').addClass("logo-max-height");
    } else {
        navbar.removeClass("top-nav-collapse");
        $('.navbar-brand img').removeClass("logo-max-height");
    }
});

// jQuery to vertically, horizontally align banner text
$('.vertical-outer').css({'height':($(document).height())+'px'});




$('#product-thumbs').delegate('img','click', function(){
    $('#large-image').attr('src',$(this).attr('src'));
    $('#featured').attr('href',$(this).attr('src'));
});

$('#search-form').submit(function( event ) {
    $('#search-box').val($('#search-box').val() + '*');
});

$(document).ready(function(){
    $('#search-result-title').text($('#search-result-title').text().replace('*', ''));

    if(checkStorageSupport.storageAvailable('localStorage')) {
        if(localStorage.getItem('closeBrowserDetection')) {
            $('.browser-detection-warning').addClass('hide');
        } else {
            $('.browser-detection-warning').removeClass('hide');
        }
    }

    //Browser Detection Close
    $('.css-close').on('click', function(e) {
        e.preventDefault();
        $('.browser-detection-warning').addClass('hide');
        localStorage.setItem('closeBrowserDetection', true);
    });
    
    //Getting the localstorage data
    var previousLoadProduct = localStorage.getItem('lastLoadProduct'),
        currentDate = new Date(),
        clearCartParams = {
            type: "POST",
            url: '/cart/clear.js',
            dataType: 'json',
            success: function() {
                ajaxCart.load();
            },
            error: function(XMLHttpRequest, textStatus) {
                console.log('Error');
                console.log(textStatus);
            }
        };

    //Setting the hours, minutes, seconds, milliseconds to 0
    currentDate.setHours(0,0,0,0);

    //Check whether previousLoadProduct is null - This happens for a fresh start
    if( previousLoadProduct == null ) {
        previousLoadProduct = currentDate;
    } else { //This happens when previousLoadProduct gets the data from the localstroage
        previousLoadProduct = new Date(previousLoadProduct);
    }

    //Check previousLoadProduct timestamp with current timestamp
    if( previousLoadProduct.getTime() < currentDate.getTime() ) {
        $.ajax(clearCartParams);
        localStorage.removeItem('previousLoadProduct');
        // Load a popup explaining why the cart is cleared
        //var targeted_popup_class = $('[data-popup-open]').attr('data-popup-open');
        //$('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
             
        //----- CLOSE
        // $('[data-popup-close]').on('click', function(e)  {
        //     var targeted_popup_class = $(this).attr('data-popup-close');
        //     $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
     
        //     e.preventDefault();
        // });
    }

    $('#container').on('click', function() {
        if( $('#slideInMenu').hasClass('is-open') ) {
            offsideMenu.close();
        }
    });
});