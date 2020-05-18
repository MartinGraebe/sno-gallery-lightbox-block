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
        add_action( 'init', array($this, 'custom_thumb_sizes') );
        add_filter('the_content',  array($this, 'enqueue_frontend_block_sno_gallery_block') ); 
        add_filter('wp_prepare_attachment_for_js',  array($this, 'custom_thumb_sizes_in_json'), 10, 3 ); 

        
    }
    function custom_thumb_sizes(){
        // register horizontal and vertical  orientation non cropped image sizes in wp
        add_image_size( 'sno_gallery_horizontal', 0, 300, false );
        add_image_size( 'sno_gallery_vertical', 300, 0, false );
        add_image_size( 'sno_gallery_square', 300, 300, true );
    }
    function custom_thumb_sizes_in_json($response, $attachment, $meta){
        $custom_sizes = array ('sno_gallery_horizontal', 'sno_gallery_vertical', 'sno_gallery_square'  );

        foreach( $custom_sizes as $size){
            if( isset($meta['sizes'][$size])){
                $attachment_url = wp_get_attachment_url($attachment->ID);
                $base_url = str_replace( wp_basename( $attachment_url ), '', $attachment_url );
                $size_meta = $meta['sizes'][ $size ];

                $response['sizes'][ $size ] = array(
                    'height'        => $size_meta['height'],
                    'width'         => $size_meta['width'],
                    'url'           => $base_url . $size_meta['file'],
                    'orientation'   => $size_meta['height'] > $size_meta['width'] ? 'portrait' : 'landscape',
                );
            }
        
        
        }
        return $response;
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


