<?php
define("BELINUS_CHILD_VERSION", "1.2.0");

function belinus_enqueue_styles() {
    $t = get_template_directory_uri();
    $s = get_stylesheet_directory_uri();
    wp_enqueue_style("divistyle", $t."/style.css", array(), BELINUS_CHILD_VERSION);
    wp_enqueue_style("belinus-child-style", $s."/style.css", array("belinus-child-style"), BELINUS_CHILD_VERSION);
}
add_action("wp_enqueue_scripts", "belinus_enqueue_styles");

function belinus_theme_setup() {
    add_theme_support("title-tag");
}
add_action("after_setup_theme", "belinus_theme_setup");

add_action("wp_head", function() {
    if (!is_page("integration-test-2") && !is_page("integration-test")) return;
    echo "<script>((function(d,t){var BASE_URL=\"https://chat.belinus.net\";var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.src=BASE_URL.\"/packs/js/sdk.js\";g.defer=true;g.async=true;s.parentNode.insertBefore(g,s);g.onload=function(){window.chatwootSDK.run({websiteToken:\"4VkiBbVD6xdvbAyKOMof\",baseUrl:BASE_URL})}})(document,\"script\"));</script>";
});