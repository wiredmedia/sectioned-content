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

            compileHandlebars();

            addTabStructure();

            $.when(loadTabs())
                .then(function(tabs){
                    initTabs();

                    // have to add the new tab button after the tabs have been setup
                    addNewTabBtn();
                });

        };

        function addTabStructure(){
            // wrap tabs structure around post area
            $('#postdivrich')
                .wrap('<div id="sectioned-content" class="sectioned-content"><div id="sectioned-post-1" class="tab-content"></div></div>');

            el.tabs = $('#sectioned-content'); // cache the tabs element
        }

        function compileHandlebars(){
            wpEditorTemplate = Handlebars.compile($("#entry-template").html());
        }

        function initTabs(){
            //initiate tabs
            el.tabs.tabs({
                add: function(event, ui) {
                    var tab = '#' + ui.panel.id;

                    el.tabs.tabs('select', tab); // automatically select tab

                    /* get the current post id, then setup the wp-editor
                    ----------------------------------------------------- */
                    $(tab).append(
                        wpEditorTemplate({
                            id: "editor-" + ui.panel.id,
                            post_id: sectionedcontent.postId, // outputed using wp_localize_script()
                            admin_url: userSettings.url
                        })
                    );

                    tinyMCE.execCommand('mceAddControl', false, 'editor-' + ui.panel.id);

                }
            });
        }

        function buildTabNavs(items){
            var out = '<ul class="nav-tabs">';

            out = out + '<li><a href="#sectioned-post-1">Section 1</a></li>';

            for(var i=2, l=items.length; i<l+2; i++) {
                out = out + '<li><a href="#sectioned-post-'+ i +'">Section ' + i + '</a></li>';
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

        function loadTabs(){

            return $.post(
                ajaxurl, // declared by wp admin
                {
                    action:"sectioned_get_tabs",
                    'cookie' : encodeURIComponent(document.cookie),
                    post_id : sectionedcontent.post_id
                },
                function(tabs){

                    el.tabs.prepend(
                        buildTabNavs(tabs)
                    );

                    el.tabNav = $('.nav-tabs'); // cache the nav tabs

                },
                'json'
            );

        }

    };

    jQuery(function($,window,undefined){
        module.sectionedContent(jQuery);
    });

    return module;

}(SECTIONED || {}));