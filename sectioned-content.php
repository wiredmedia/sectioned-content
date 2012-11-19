<?php
/*
Plugin Name: Sectioned Content (Wired Media)
Plugin URI:
Description: Enables the adding of new sections for a peice of content
Version: 0.1
Author: Wired Media (carl)
Author URI: http://wiredmedia.co.uk
License: GPLv2
*/

namespace SECTIONED;

define('SECTIONED_OPTION', 'sectioned_content');

require_once dirname(__FILE__) . '/upgrade.php';
require_once dirname(__FILE__) . '/post-types.php';
require_once dirname(__FILE__) . '/api.php';

class Plugin {

    public function __construct() {
        add_action('admin_init', array(&$this, 'check_php_version'));
        add_action('init', array(&$this, 'upgrade_plugin'));
        add_action('admin_enqueue_scripts', array(&$this, 'css_and_js'));

        // attached to both logged in and non logged in ajax functions
        add_action('wp_ajax_sectioned_get_tabs', array(&$this, 'get_tabs'));
        add_action('wp_ajax_nopriv_sectioned_get_tabs', array(&$this, 'get_tabs'));

        add_filter('tiny_mce_before_init', array(&$this, 'config_mce'), 1111);

        add_action('admin_head', array(&$this, 'js_templates'));
        add_action('save_post', array(&$this, 'save_post'));
    }

    public function upgrade_plugin(){
        new Upgrade();
    }

    public function check_php_version(){
        if( version_compare(PHP_VERSION, '5.3', '<') ) {
            $plugin = plugin_basename( __FILE__ );
            if( is_plugin_active($plugin) ) {
                deactivate_plugins($plugin);
                add_action('admin_notices', function(){
                $plugin_data = get_plugin_data( __FILE__, false );
                echo '<div class="error">
                <p>Sorry <strong>'. $plugin_data['Name'] .'</strong> requires PHP 5.2 or higher! your PHP version is '. PHP_VERSION .'. The plugin was not activated.</p>
                </div>';
                });
            }
        }
    }

    function css_and_js($hook){
        global $post;

        if( $hook != 'post.php' && $hook != 'post-new.php' ){
            return;
        }

        wp_register_style( 'sectionedcontent', plugins_url('css/sectioned-content.css', __FILE__) );
        wp_enqueue_style( 'sectionedcontent' );

        wp_register_script('sectionedcontent', plugins_url('js/sectioned-content.js', __FILE__), array('jquery', 'jquery-ui-tabs'), '', true);
        wp_register_script('handlesbars', plugins_url('js/handlebars-1.0.rc.1.js', __FILE__), array('sectionedcontent'), '', true);
        wp_enqueue_script('sectionedcontent');
        wp_enqueue_script('handlesbars');

        wp_localize_script('sectionedcontent', 'sectionedcontent', array('post_id' => $post->ID));
    }

    function get_tabs(){
        $post_id = $_POST['post_id'];

        $sections = json_decode(get_post_meta($post_id, '_post_sections', true));

        if(is_array($sections)){
            foreach($sections as $key => $section){
                $post = get_post($section->id);
                if(is_object($post)){
                    $section->content = wpautop($post->post_content);
                    $fields = get_post_meta($post->ID);

                    foreach($fields as $key => $value){
                        if (strstr($key, '_section_')){
                            $section->fields->{$key} = $value;
                        }
                    }
                }else{
                    unset($sections[$key]);
                }
            }
        }else{
            $sections = array();
        }

        echo json_encode($sections);

        exit;
    }

    function js_templates(){
        echo '<script id="entry-template" type="text/x-handlebars-template">';
            require 'js/templates/wp-editor.html';
        echo '</script>';

        echo '<script id="field-template" type="text/x-handlebars-template">';
            require 'js/templates/field-group.html';
        echo '</script>';

        echo '<script id="new-field-template" type="text/x-handlebars-template">';
            require 'js/templates/new-field.html';
        echo '</script>';
    }

    function save_post($post_id){
        // Verify if this is an auto save routine.
        // If it is our form has not been submitted, so we dont want to do anything
        if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE){
            return;
        }

        // have to do this check to avoid infinite loop!
        if(get_post_type($post_id) === 'content_section'){
            return;
        }

        if(get_post_type($post_id) === 'revision'){
            return;
        }

        $sections = json_decode(get_post_meta($post_id, '_post_sections', true));

        $updated_sections = array();

        foreach($_POST as $key => $section_content){
            if(substr($key, 0, 22) == "editor-sectioned-post-"){

                $section_id = (int) substr($key, 22);

                $section_exists = false;
                if(is_array($sections)){
                    foreach($sections as $key => $value){
                        if($value->id === $section_id){
                            $section_exists = true;
                            unset($sections[$key]);
                            break;
                        }
                    }
                }

                //check if in sections array
                if($section_exists){
                    // update the post
                    wp_update_post(array(
                        'ID' => $section_id,
                        'post_content' => $section_content
                    ));
                }else{
                    // create a new post
                    $section_id = wp_insert_post(array(
                        'post_content' => $section_content,
                        'post_type' => 'content_section',
                        'post_title' => 'Section for - '. $post_id,
                        'post_status' => 'publish'
                    ));
                }

                // save custom fields
                foreach($_POST as $key => $value){
                    if(strstr($key, '_section_') && strstr($key, '_'. $section_id .'_')){
                        update_post_meta($section_id, $key, $value);
                    }
                }

                // add it to the updated_sections
                $updated_sections[] = array('id' => $section_id);

            }
        }

        // now check for deleted sections
        // if any values left in $sections array, they all need deleting
        if(!empty($sections)){
            foreach($sections as $key => $value){
                wp_delete_post($value->id, true);
                unset($sections[$key]);
            }
        }

        // finally save post meta
        update_post_meta($post_id, '_post_sections', json_encode($updated_sections));

    }

    function config_mce($a) {

        $options = array(
            'height' => 463
        );

        return array_merge($a, $options);
    }

}

new Plugin;