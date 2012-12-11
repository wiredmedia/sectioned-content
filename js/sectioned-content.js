jQuery.noConflict();

/*
 * module:
 * uses:
 * description:
 ---------------------------------------- */
var SECTIONED = (function (module) {

    module.sectionedContent = function($){

        var wpEditorTemplate,
            fieldTemplate,
            newFieldTemplate,
            panelPrefix = 'sectioned-post-',
            tabStore;

        // jquery element cache
        var el = {
            tabs: '',
            tabNav: '',
            newTab: ''
        };

        init();

        function init(){
            var tabs;

            compileHandlebars();

            addTabStructure();

            $.when(loadTabs())
                .then(function(tabs){

                    tabStore = tabs;

                    initTabs();

                    newTabBtn(); // have to be initiated first

                    buildTabs();

                    closeBtns();
                });

        };

        function compileHandlebars(){
            wpEditorTemplate = Handlebars.compile($("#entry-template").html());
            fieldTemplate = Handlebars.compile($("#field-template").html());
            newFieldTemplate = Handlebars.compile($("#new-field-template").html());
        }

        function addTabStructure(){
            // wrap tabs structure around post area
            $('#postdivrich')
                .wrap('<div id="sectioned-content" class="sectioned-content"><div id="sectioned-post-1" class="tab-content"></div></div>');

            el.tabs = $('#sectioned-content'); // cache the tabs element

            // create the nav tabs
            el.tabs.prepend(
                '<ul class="nav-tabs"><li><a href="#sectioned-post-1">Section</a></li></ul>'
            );

            el.tabNav = $('.nav-tabs'); // cache the nav tabs
        }

        function initTabs(){
            //initiate tabs
            el.tabs.tabs({
                add: function(event, ui) {

                    var tab = '#' + ui.panel.id;
                    var $tab = $(tab);
                    var fields;
                    var $fieldContainer;
                    var id = parseInt(ui.panel.id.replace(panelPrefix, ''));

                    //el.tabs.tabs('select', tab); // automatically select tab

                    // add close btn
                    $(ui.tab).parent().prepend('<span class="icon close">x</span>');

                    // setup the wp-editor
                    $tab.append(
                        wpEditorTemplate({
                            id: "editor-" + ui.panel.id,
                            post_id: sectionedcontent.postId, // outputed using wp_localize_script()
                            admin_url: userSettings.url,
                            content: getTabContent(ui.panel.id)
                        })
                    );

                    tinyMCE.execCommand('mceAddControl', false, 'editor-' + ui.panel.id);

                    fields = getCustomFields(ui.panel.id);
                    $tab.append('<div class="section-fields"><h2>Options</h2>');

                    $tab.find('.section-fields').append(newFieldTemplate({
                        id: id
                    }));

                    $tab.find('.section-fields .new-field a').click(function(){
                        addCustomField($(this));
                    });

                    if(fields){
                        fields = getCustomFields(ui.panel.id);
                        $.each(fields, function(index, value){
                            $tab.find('.section-fields').append(
                                fieldTemplate({
                                    name: index,
                                    label: index.replace(/_section_[0-9]*_/, ''),
                                    value: value
                                })
                            );
                        });
                    }

                },

                select: function(event, ui){
                    var tab = '#' + ui.panel.id;
                    // disable all sections custom fields
                    $('.section-fields').find('input').attr('disabled', 'disabled');
                    // enable this tabs fields
                    $(tab).find('input').removeAttr("disabled");
                }

            });
        }

        function addCustomField($elem){
            var id;

            id = $elem.attr('data-section');

            $elem.parents('.section-fields').append(
                fieldTemplate({
                    name: '_section_'+ id + '_'+ $elem.parent().find('.new-name').val(),
                    label: $elem.parent().find('.new-name').val(),
                    value: $elem.parent().find('.new-value').val()
                })
            );

            $elem.parent().find('.new-name').val('');
            $elem.parent().find('.new-value').val('');
        }

        function getTabContent(panelId){
            var id, content;

            id = parseInt(panelId.replace(panelPrefix, ''));

            $.each(tabStore, function(index, value){
                if(id === value.id){
                    content = value.content;
                    return false; // break
                }
            });

            return content;
        }

        function getCustomFields(panelId){
            var id, fields;

            id = parseInt(panelId.replace(panelPrefix, ''));

            $.each(tabStore, function(index, value){
                if(id === value.id){
                    fields = value.fields;
                    return false; // break
                }
            });

            if(fields){
                return fields;
            }else{
                return false;
            }
        }

        function removeTabContent(panelId){
            var id;

            id = parseInt(panelId.replace('#' + panelPrefix, ''));

            $.each(tabStore, function(index, value){
                if(id === value.id){
                    tabStore.splice(index);
                    return false; // break
                }
            });
        }

        function buildTabs(){
            for(var i=0, l=tabStore.length; i<l; i++) {
                addTab(tabStore[i].id);
            }
        }

        function newTabBtn(){
            el.tabNav.append('<li><a href="#" id="sectioned-content-new">+</a></li>');
            el.newTab = $('#sectioned-content-new');
            el.tabNav.delegate('#sectioned-content-new', 'click', function(e){
                addTab();
                e.preventDefault();
            });
        }

        function addTab(tabId){
            var $addTabBtn, idPrefix, tabCount;

            $addTabBtn = el.tabNav.children('li:last-child').remove();

            tabCount = el.tabNav.find('li').length + 1;

            if(!tabId){
                tabId = tabCount;

                // just to make sure we pick a unique id
                while($('#' + panelPrefix + tabId).length > 0){
                    tabId = tabId + 1;
                }
            }

            el.tabs.tabs("add", '#' + panelPrefix + tabId, 'Section');

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

        function closeBtns(){
            el.tabNav.delegate('.close', 'click', function(){
                var $addTabBtn, href;

                href = $(this).parent().find('a').attr('href');

                removeTabContent(href); // remove it from the tabStore

                /* have to remove tinymce editor to free up the textarea id
                this is the case even after the textarea has been removed from the dom */
                tinymce.execCommand('mceRemoveControl', false, href.replace('#', 'editor-'));

                $addTabBtn = el.tabNav.children('li:last-child').remove();

                el.tabs.tabs('remove', href);

                el.tabNav.append($addTabBtn);

            });
        }

    };

    jQuery(function($,window,undefined){
        module.sectionedContent(jQuery);
    });

    return module;

}(SECTIONED || {}));