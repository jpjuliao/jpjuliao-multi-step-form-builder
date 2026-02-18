<?php

namespace JPJULIAO\Wordpress\MultiStepFormBuilder;

if (!defined('ABSPATH')) {
  exit;
}

class PostType
{

  public function __construct()
  {
    \add_action('init', array($this, 'register_post_type'));
    \add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
    \add_action('save_post_msf_form', array($this, 'save_form_meta'), 10, 2);
  }

  public function register_post_type(): void
  {
    $labels = array(
      'name' => __('Forms', 'jpjuliao-multi-step-form-builder'),
      'singular_name' => __('Form', 'jpjuliao-multi-step-form-builder'),
      'menu_name' => __('Forms', 'jpjuliao-multi-step-form-builder'),
      'add_new' => __('Add New', 'jpjuliao-multi-step-form-builder'),
      'add_new_item' => __('Add New Form', 'jpjuliao-multi-step-form-builder'),
      'edit_item' => __('Edit Form', 'jpjuliao-multi-step-form-builder'),
      'new_item' => __('New Form', 'jpjuliao-multi-step-form-builder'),
      'view_item' => __('View Form', 'jpjuliao-multi-step-form-builder'),
      'search_items' => __('Search Forms', 'jpjuliao-multi-step-form-builder'),
      'not_found' => __('No forms found', 'jpjuliao-multi-step-form-builder'),
      'not_found_in_trash' => __('No forms found in trash', 'jpjuliao-multi-step-form-builder'),
    );

    $args = array(
      'labels' => $labels,
      'public' => false,
      'show_ui' => true,
      'show_in_menu' => true,
      'show_in_rest' => true,
      'menu_icon' => 'dashicons-list-view',
      'capability_type' => 'post',
      'hierarchical' => false,
      'supports' => array('title'),
      'has_archive' => false,
      'rewrite' => false,
      'query_var' => false,
    );

    \register_post_type('msf_form', $args);
  }

  public function add_meta_boxes(): void
  {
    \add_meta_box(
      'msf_form_builder',
      __('Form Builder', 'jpjuliao-multi-step-form-builder'),
      array($this, 'render_form_builder'),
      'msf_form',
      'normal',
      'high'
    );

    \add_meta_box(
      'msf_form_shortcode',
      __('Shortcode', 'jpjuliao-multi-step-form-builder'),
      array($this, 'render_shortcode_box'),
      'msf_form',
      'side',
      'default'
    );
  }

  public function render_form_builder(\WP_Post $post): void
  {
    \wp_nonce_field('msf_save_form', 'msf_form_nonce');
    echo '<div id="msf-form-builder-root"></div>';
  }

  public function render_shortcode_box(\WP_Post $post): void
  {
    if ($post->ID) {
      echo '<p>' . esc_html__('Use this shortcode to display the form:', 'jpjuliao-multi-step-form-builder') . '</p>';
      echo '<code>[multi_step_form id="' . esc_attr($post->ID) . '"]</code>';
      echo '<p><button type="button" class="button button-small" onclick="navigator.clipboard.writeText(\'[multi_step_form id=&quot;' . esc_attr($post->ID) . '&quot;]\'))">Copy Shortcode</button></p>';
    } else {
      echo '<p>' . esc_html__('Save the form to get the shortcode.', 'jpjuliao-multi-step-form-builder') . '</p>';
    }
  }

  public function save_form_meta(int $post_id, \WP_Post $post): void
  {
    $nonce = isset($_POST['msf_form_nonce'])
      ? sanitize_text_field(\wp_unslash($_POST['msf_form_nonce']))
      : '';

    if (!$nonce || !\wp_verify_nonce($nonce, 'msf_save_form')) {
      return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
      return;
    }

    if (!\current_user_can('edit_post', $post_id)) {
      return;
    }
  }
}
