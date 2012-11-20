<?php

namespace SECTIONED;

class Post_types {

    public function __construct() {
        add_action('init', array(&$this, 'init'));
    }

    function init(){
        register_post_type( "content_section",
            array(
            'labels' => array(
                'name'  => __('Post Sections', 'sectionedcontent' ),
            ),
            'public'                => true,
            'show_ui'               => false,
            'capability_type'       => 'post',
            'publicly_queryable'    => true,
            'exclude_from_search'   => true,
            'hierarchical'          => false,
            'query_var'             => true,
            'supports'              => array('editor'),
            'has_archive'           => false,
            'show_in_nav_menus'     => false
            )
        );
    }

}

new Post_types;