/*
	Navbar scroll loginc
*/
var navbarHeader = (function() {
	var scroll = $(window).scrollTop(),
		navbar = $('.navbar-fixed-top'),
		body = $('body');

	var fixedTop = function() {
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
 
	    logoShrink();
	}

	var logoShrink = function() {
		console.log(scroll);
		if (scroll >= 50) {
	        navbar.addClass("top-nav-collapse");
	        $('.navbar-brand img').addClass("logo-max-height");
	    } else {
	        navbar.removeClass("top-nav-collapse");
	        $('.navbar-brand img').removeClass("logo-max-height");
	    }
	}

	return {
		fixedTop: fixedTop,
		logoShrink: logoShrink
	}
})();