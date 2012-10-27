<?php

namespace SECTIONED;

class Post_types {

    public function __construct() {
        add_action('admin_head', array(&$this, 'cpt_icons'));
        add_action('init', array(&$this, 'init'));
    }

    function init(){
        register_post_type( "content_section",
            array(
            'labels' => array(
                    'name'                  => __( 'Post Sections', 'browsephotographers' ),
                    'singular_name'         => __( 'Photographer Page', 'browsephotographers' ),
                    'add_new'               => __( 'Add Photographer Page', 'browsephotographers' ),
                    'add_new_item'          => __( 'Add New Photographer Page', 'browsephotographers' ),
                    'edit'                  => __( 'Edit', 'browsephotographers' ),
                    'edit_item'             => __( 'Edit Photographer Page', 'browsephotographers' ),
                    'new_item'              => __( 'New Photographer Page', 'browsephotographers' ),
                    'view'                  => __( 'View Photographer Page', 'browsephotographers' ),
                    'view_item'             => __( 'View Photographer Page', 'browsephotographers' ),
                    'search_items'          => __( 'Search Photographer Pages', 'browsephotographers' ),
                    'not_found'             => __( 'No Photographer Pages found', 'browsephotographers' ),
                    'not_found_in_trash'    => __( 'No Photographer Pages found in trash', 'browsephotographers' ),
                    'parent'                => __( 'Parent Photographer Page', 'browsephotographers' )
                ),
            'description'           => __( 'This is where your photographers content appears as they add it.', 'browsephotographers' ),
            'public'                => true,
            'show_ui'               => true,
            'capability_type'       => 'post',
            'publicly_queryable'    => true,
            'exclude_from_search'   => false,
            'hierarchical'          => true,
            'query_var'             => true,
            'supports'              => array('editor'),
            'has_archive'           => false,
            'show_in_nav_menus'     => false
            )
        );
    }

    /*
    add nicer custom post type icons
    http://randyjensenonline.com/thoughts/wordpress-custom-post-type-fugue-icons/
    */
    function cpt_icons(){ ?>
    <style type="text/css" media="screen">
      #menu-posts-photographer_page .wp-menu-image {
        background: url(<?php bloginfo('template_url') ?>/images/icons/camera-lens.png) no-repeat 6px -17px !important;
      }
      #menu-posts-photographer_page:hover .wp-menu-image, #menu-posts-photographer_page.wp-has-current-submenu .wp-menu-image {
        background-position:6px 7px!important;
      }
    </style><?php
    }

}

new Post_types;