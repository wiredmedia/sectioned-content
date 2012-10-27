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
        var panelPrefix = 'sectioned-post-';
        var tabStore;

        init();

        function init(){
            var tabs;

            compileHandlebars();

            addTabStructure();

            $.when(loadTabs())
                .then(function(tabs){

                    tabStore = tabs;

                    initTabs();

                    addNewTabBtn(); // have to be initiated first

                    buildTabs()
                });

        };

        function addTabStructure(){
            // wrap tabs structure around post area
            $('#postdivrich')
                .wrap('<div id="sectioned-content" class="sectioned-content"><div id="sectioned-post-1" class="tab-content"></div></div>');

            el.tabs = $('#sectioned-content'); // cache the tabs element

            // create the nav tabs
            el.tabs.prepend(
                '<ul class="nav-tabs"><li><a href="#sectioned-post-1">Section 1</a></li></ul>'
            );

            el.tabNav = $('.nav-tabs'); // cache the nav tabs
        }

        function compileHandlebars(){
            wpEditorTemplate = Handlebars.compile($("#entry-template").html());
        }

        function initTabs(){
            //initiate tabs
            el.tabs.tabs({
                add: function(event, ui) {
                    var tab = '#' + ui.panel.id;

                    //el.tabs.tabs('select', tab); // automatically select tab

                    // setup the wp-editor
                    $(tab).append(
                        wpEditorTemplate({
                            id: "editor-" + ui.panel.id,
                            post_id: sectionedcontent.postId, // outputed using wp_localize_script()
                            admin_url: userSettings.url,
                            content: getTabContent(ui.panel.id)
                        })
                    );

                    tinyMCE.execCommand('mceAddControl', false, 'editor-' + ui.panel.id);

                }
            });
        }

        function getTabContent(panelId){
            var id, content

            id = parseInt(panelId.replace(panelPrefix, ''));

            $.each(tabStore, function(index, value){
                if(id === value.id){
                    content = value.content;
                    return false; // break
                }
            });

            return content;
        }

        function buildTabs(){
            for(var i=0, l=tabStore.length; i<l; i++) {
                addTab(tabStore[i].id);
            }
        }

        function addNewTabBtn(){
            el.tabNav.append('<li><a href="#" id="sectioned-content-new">+</a></li>');
            el.newTab = $('#sectioned-content-new');
            el.tabNav.delegate('#sectioned-content-new', 'click', function(){
                addTab();
            });
        }

        function addTab(tabId = null){
            var $addTabBtn, idPrefix, tabCount;

            $addTabBtn = el.tabNav.children('li:last-child').remove();

            tabCount = el.tabNav.find('li').length + 1;

            if(!tabId){
                tabId = tabCount;

                // just to make sure we pick a unique id
                while($(panelPrefix + tabId).length > 0){
                    tabId = tabId + 1;
                }
            }

            el.tabs.tabs("add", '#' + panelPrefix + tabId, 'Section '+ tabCount);

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
                function(tabs){},
                'json'
            );

        }

    };

    jQuery(function($,window,undefined){
        module.sectionedContent(jQuery);
    });

    return module;

}(SECTIONED || {}));