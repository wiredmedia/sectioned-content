jQuery.noConflict();

/*
 * module:
 * uses:
 * description:
 ---------------------------------------- */
var SECTIONED = (function (module) {

    module.sectionedContent = function($){

        var el = {};

        init();

        function init(){
            var tabs;

            el.postArea = $('#postdivrich');

            // wrap tabs structure around post area
            el.postArea
                .wrap('<div id="sectioned-content" class="sectioned-content"><div id="sectioned-post-1" class="tab-content"></div></div>');

            el.tabs = $('#sectioned-content');


            // add tabs
            tabs = [
                {title: 'Section 1'}
            ];

            el.tabs.prepend(
                buildTabNavs(tabs)
            );

            //initiate tabs
            $( "#sectioned-content" ).tabs();

        };

        function buildTabNavs(items){
            var out = '<ul class="nav-tabs">';
            for(var i=0, l=items.length; i<l; i++) {
                out = out + '<li><a href="#sectioned-post-'+ i +'">' + items[i].title + '</a></li>';
            }

            out = out + '<li><a href="#">+</a></li>';

            return out + '</ul>';
        }

    };

    jQuery(function($,window,undefined){
        module.sectionedContent(jQuery);
    });

    return module;

}(SECTIONED || {}));