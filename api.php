<?php

namespace SECTIONED;

function get_sections($post_id){

    $sections = json_decode(get_post_meta($post_id, '_post_sections', true));
    $section_ids = array();

    if(!empty($sections)){

        foreach($sections as $key => $value){
            $section_ids[] = $value->id;
        }

        $args = array(
            'post_type' => 'content_section',
            'orderby' => 'menu_order',
            'order' => 'ASC',
            'include' => $section_ids,
            'numberposts' => -1
        );

        return get_posts($args);
    }else{
        return array();
    }

}

function get_section_post_meta($post_id, $key){
    return get_post_meta($post_id, '_section_'. $post_id .'_'. $key, true);
}