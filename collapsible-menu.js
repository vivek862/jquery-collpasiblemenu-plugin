(function($){
	$.fn.CollapsibleMenu = function (options) {
	    'use strict';
	
	    var root = $(this),
	    	pluginCssClass = "collapsible-menu",
	    	hasSubMenuCssClass = "has-submenu",
	        settings = $.extend({}, {
	            activeListItemName 			:		"active", // Is given to active list elements
	            clickToggleBarCallback		: 		function () {}, // callback for clicking the root "togglebar"
	            siblingsHideCallback        :       function () {}
	        }, options),
	        
	    clickEventDocument = function () {
	        $(document).click(function () {
	        	// If set by user in setting that menu is wanted to hide when clicking somewhere else
	        	if (settings.hideMenuOnDocumentClick) {
		        	hideMenu();
	        	}
	        });
	    },
	
	    clickEventListItem = function () {
	        root.find("ul li").click(function (event) {
	        	lisItemClickEvent(event, this);
	        });
	    },

	    lisItemClickEvent = function (event, context) {
	    	// Stop parent event bubbling
	    	if (event !== undefined) {
	    		event.stopPropagation();
	    	}
            
            // If some siblings are visible, close them and remove active class
            var siblings = $(context).siblings();
        	// Close siblings and their children
        	siblings.find("ul").animate({ height: "hide"}, function () {
        		settings.siblingsHideCallback.call(context);
        	});
        	
        	// If method is not invoked by event
        	if (event !== undefined) {
        		// Remove active class from siblings and their children
        		siblings.removeClass(settings.activeListItemName);
        		siblings.find("ul li").removeClass(settings.activeListItemName);

        		// Add clicked element active class
	            if ($(context).hasClass(settings.activeListItemName)) {
	            	$(context).removeClass(settings.activeListItemName);
	            } else {
	            	$(context).addClass(settings.activeListItemName);
	            }
        	}
            
            // Toggle clicked element direct child unsorted list
            var that = context;

            $(context).find("ul").first().animate({ height: "toggle", width: "toggle" }, 200, function () {
            	// Callback for togglebar
	        	settings.clickToggleBarCallback.call(that);
            });
	    },
	    
	    hideMenu = function () {
        	// Choose the second level to toggle
        	var hideElements = root.find("ul.level-2");
        	
        	// hide all elements that are open
        	hideElements.each(function() {
        		if ($(this).css("display") === "block") {
        			var that = this;
	        		$(this).animate({ height: "toggle", width : "toggle"}, 200);
	        	}
        	});
	    },
	    
	    setEventHandlers = function () {
	    	clickEventDocument();
	        clickEventListItem();
	    },
	
	    setupUnsortedLists = function () {
	    	// Give root a class to make indicating easier
	    	root.addClass(pluginCssClass);
	
			// Find all unsorted lists under the nav root
			var lists = root.find("ul");

			var activeLinks = [];
			//add active class to all li elements which has active link elements
			var lilists = root.find('a.active');
			$.each(lilists,function(){
				$(this).parent().addClass(settings.activeListItemName);
			});
			// Set class level-n to all unsorted lists
	        $.each(lists, function (index, value) {
	            var depth = $(this).parents('ul').length + 1;

	            // Add level CSS class for style modifications
    			$(this).addClass('level-' + depth);
    			
    			$.each($("li", $(this)), function (index, value) {
    				// Add has-submenu CSS class for style modifications
    				if ($(this).find("ul li").length !== 0) {
    					$(this).addClass(hasSubMenuCssClass);
    				}

    				// Add all active links into array
    				if ($(this).hasClass("active")) {
    					activeLinks.push(this);
    				}
    			});
	        });
	        
	        // To have first level visible as titles
	        lists = root.find("ul.level-1 ul");
	        
	        // Hiding all wanted unsorted lists
	        lists.css({ display: "none" });

	        // Go through active links to toggle their children
	        $.each(activeLinks, function (index, element) {
	        	if ($(element).hasClass(hasSubMenuCssClass)) {
	        		lisItemClickEvent(undefined, element);
	        	}
	        });
	    },
	
	    init = function () {
	        setupUnsortedLists();
	        setEventHandlers();
	    };
	
	    return init();
	};
})( jQuery );