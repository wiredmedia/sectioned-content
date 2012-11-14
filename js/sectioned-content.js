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

            el.tabNav = $('.nav-tabs');

            //initiate tabs
            el.tabs.tabs({
                add: function(event, ui) {
                    var tab = '#' + ui.panel.id;
                    el.tabs.tabs('select', tab);
                    $(tab).append('<p>test</p>');
                }
            });

            addNewTabBtn();

        };

        function buildTabNavs(items){
            var out = '<ul class="nav-tabs">';
            for(var i=0, l=items.length; i<l; i++) {
                out = out + '<li><a href="#sectioned-post-'+ (i + 1) +'">' + items[i].title + '</a></li>';
            }

            return out + '</ul>';
        }

        function addNewTabBtn(){
            el.tabNav.append('<li><a href="#" id="sectioned-content-new">+</a></li>');
            el.newTab = $('#sectioned-content-new');
            el.tabNav.delegate('#sectioned-content-new', 'click', function(){
                addTab();
            });
        }

        function addTab(){
            var $addTabBtn, newTab;

            $addTabBtn = el.tabNav.children('li:last-child').remove();

            tabCount = el.tabNav.find('li').length;
            newTab = tabCount + 1;

            // add tab nav
            el.tabs.tabs("add", '#sectioned-post-' + newTab, 'Section '+ newTab)

            el.tabNav.append($addTabBtn);

        }

    };

    jQuery(function($,window,undefined){
        module.sectionedContent(jQuery);
    });

    return module;

}(SECTIONED || {}));