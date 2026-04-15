<?php
define("BELINUS_CHILD_VERSION","1.2.0");
function belinus_enqueue_styles(){wp_enqueue_style("divistyle",get_template_directory_uri()."/style.css",array(),BELINUS_CHILD_VERSION);wp_enqueue_style("belinus-child-style",get_stylesheet_directory_uri()."/style.css",array("belinus-child-style"),BELINUS_CHILD_VERSION);}
add_action("wp_enqueue_scripts","belinus_enqueue_styles");
function belinus_theme_setup(){add_theme_support("title-tag");}
add_action("after_setup_theme","belinus_theme_setup");
add_action("wp_head",function(){if(!is_page("integration-test-2")&&!is_page("integration-test"))return;echo "<script>console.log('Chat widget loading');</script>";});