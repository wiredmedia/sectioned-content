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

define('SECTIONED_OPTION', 'jagmp_store');

require_once dirname(__FILE__) . '/upgrade.php';
require_once dirname(__FILE__) . '/api.php';

class Plugin {

    public function __construct() {
        add_action('admin_init', array(&$this, 'check_php_version'));
        add_action('init', array(&$this, 'upgrade_plugin'));
        add_action('admin_enqueue_scripts', array(&$this, 'the_js'));
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

    function the_js($hook){
        if( $hook != 'post.php' && $hook != 'post-new.php' ){
            return;
        }

        wp_register_script('sectionedcontent', plugins_url('js/sectioned-content.js', __FILE__), array('jquery', 'jquery-ui-tabs'), '', true);
        wp_enqueue_script('sectionedcontent');
    }

}

new Plugin;