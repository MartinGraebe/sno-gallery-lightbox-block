<?php
/**
 * Plugin Name: Sno Gallery Lightbox Block
 * Description: A gallery gutenberg block with lightbox
 * Version: 1.0
 * Author: Martin Graebe
 * Licence: GPL v2 or later
 * 
 *  @package SNO-GALLERY-LIGHTBOX-BLOCK
 */


if (!defined('ABSPATH')){
    die();
}




define( 'SNO_GALLERY_LIGHTBOX_BLOCK_PLUGIN_VERSION', '1.0.0' );

class SNO_GALLERY_LIGHTBOX_BLOCK {
 
    function register(){
        add_action( 'init', array($this, 'block_scripts') );
        add_filter('the_content',  array($this, 'enqueue_frontend_block_sno_gallery_block') ); 
        
    }
    function block_scripts(){
         // admin styles
        
         wp_register_style( 'sno-gallery-lightbox-admin-block-css',
         plugins_url( '/admin/css/admin.css', __FILE__ ),
         is_admin() ? array('wp-editor'): null, null );
       // admin scripts
       wp_register_script( 'sno-gallery-lightbox-admin-block-js',
       plugins_url( '/admin/js/blocks.min.js', __FILE__ ), array('wp-blocks', 'wp-i18n', 'wp-element','wp-editor'), '1.0.0', true );
        // public styles
        wp_register_style( 'sno-gallery-lightbox-public-block-css',
        plugins_url( '/public/css/public.css', __FILE__ ),
        null, null );
      // public scripts
      wp_register_script( 'sno-gallery-lightbox-public-block-js',
      plugins_url( '/public/js/public.min.js', __FILE__ ) );

      register_block_type(
        'sno/sno-gallery-lightbox-block', array(
           
            'editor_script'    => 'sno-gallery-lightbox-admin-block-js',
            'editor_style'     => 'sno-gallery-lightbox-admin-block-css',
            
        )
        );
    }



   



    // make sure frontend js and css is only loaded when block is present 
    function enqueue_frontend_block_sno_gallery_block($content = ""){
        if (wp_script_is( 'sno-gallery-lightbox-public-block-js', 'enqueued' ) || wp_style_is( 'sno-gallery-lightbox-public-block-css', 'enqueued' ) ){
            return;
        }
        elseif (has_block('sno/sno-gallery-lightbox-block')){
                wp_enqueue_script( 'sno-gallery-lightbox-public-block-js' );
                wp_enqueue_style( 'sno-gallery-lightbox-public-block-css' );
        }
        return $content;
    }



}

if (class_exists('SNO_GALLERY_LIGHTBOX_BLOCK')){
    $sno_gallery_block_plugin = new SNO_GALLERY_LIGHTBOX_BLOCK();
    $sno_gallery_block_plugin->register();
    
   
}

/* 
// ACTIVATION
register_activation_hook( __FILE__, array( $sno_gallery_block_plugin, 'activate' ));

// DEACTIVATION
register_deactivation_hook( __FILE__, array( $sno_gallery_block_plugin, 'deactivate' ) ); */


// add uninstall


