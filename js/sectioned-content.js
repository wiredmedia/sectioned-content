jQuery.noConflict();

/*
 * module:
 * uses:
 * description:
 ---------------------------------------- */
var SECTIONED = (function (module) {

    module.sectionedContent = function($){

        var el = {};
        var wpEditorTemplate;

        init();

        function init(){
            var tabs;

            // compile handlebars templates
            wpEditorTemplate = Handlebars.compile($("#entry-template").html());

            // wrap tabs structure around post area
            $('#postdivrich')
                .wrap('<div id="sectioned-content" class="sectioned-content"><div id="sectioned-post-1" class="tab-content"></div></div>');

            el.tabs = $('#sectioned-content'); // cache the tabs element


            // add tabs
            tabs = [
                {title: 'Section 1'}
            ];

            el.tabs.prepend(
                buildTabNavs(tabs)
            );

            el.tabNav = $('.nav-tabs'); // cache the nav tabs

            //initiate tabs
            el.tabs.tabs({
                add: function(event, ui) {
                    var tab = '#' + ui.panel.id;

                    el.tabs.tabs('select', tab); // automatically select tab

                    /* get the current post id, then setup the wp-editor
                    ----------------------------------------------------- */
                    $(tab).append(
                        wpEditorTemplate({
                            id: "sectioned-editor-" + ui.panel.id,
                            post_id: sectionedcontent.postId // outputed using wp_localize_script()
                        })
                    );

                    tinyMCE.execCommand('mceAddControl', false, 'sectioned-editor-' + ui.panel.id);

                }
            });

            /*
             * have to add the new tab button after the tabs have been setup
             */
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