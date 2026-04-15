<?php
define("BELINUS_CHILD_VERSION","1.2.0");

function belinus_enqueue_styles(){
    wp_enqueue_style("divistyle",get_template_directory_uri()."/style.css",array(),BELINUS_CHILD_VERSION);
    wp_enqueue_style("belinus-child-style",get_stylesheet_directory_uri()."/style.css",array("belinus-child-style"),BELINUS_CHILD_VERSION);
}
add_action("wp_enqueue_scripts","belinus_enqueue_styles");

function belinus_theme_setup(){
    add_theme_support("title-tag");
}
add_action("after_setup_theme","belinus_theme_setup");

add_action("wpcf7_before_send_mail","poweriq_cf7_to_crm",10,3);
function poweriq_cf7_to_crm($contact_form,&$abort,$submission){
    $contact_form->skip_mail=true;
    $data=$submission->get_posted_data();
    $payload=array(
        "first-name"=>sanitize_text_field($data["first-name"]??""),
        "last-name"=>sanitize_text_field($data["last-name"]??""),
        "your-email"=>sanitize_email($data["your-email"]??""),
        "phone"=>sanitize_text_field($data["phone"]??""),
        "company"=>sanitize_text_field($data["company"]??""),
        "company-website"=>esc_url_raw($data["company-website"]??""),
        "function"=>sanitize_text_field($data["function"]??""),
        "product-interest"=>sanitize_text_field($data["product-interest"]??""),
        "message"=>sanitize_textarea_field($data["message"]??""),
        "source_url"=>get_permalink(),
        "form_id"=>$contact_form->id(),
        "form_title"=>$contact_form->title()
    );
    $response=wp_remote_post("http://144.91.126.111:8000/api/ingest/webform",array(
        "method"=>"POST",
        "timeout"=>5,
        "headers"=>array("Content-Type"=>"application/json"),
        "body"=>wp_json_encode($payload),
        "data_format"=>"body"
    ));
    if(is_wp_error($response)){
        error_log("[PowerIQ CF7] Ingest API failed: ".$response->get_error_message());
    }
}