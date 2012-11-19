<?php

namespace SECTIONED;

function get_sections($post_id){

    $sections = json_decode(get_post_meta($post_id, '_post_sections', true));
    $section_ids = array();

    foreach($sections as $key => $value){
        $section_ids[] = $value->id;
    }

    $args = array(
        'post_type' => 'content_section',
        'orderby' => 'menu_order',
        'order' => 'DESC',
        'include' => $section_ids,
        'numberposts' => -1
    );

    return get_posts($args);

}