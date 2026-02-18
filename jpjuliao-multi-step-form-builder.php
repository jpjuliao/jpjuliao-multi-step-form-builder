<?php
/**
 * Plugin Name: JPJuliao — Multi Step Form Builder
 * Description: A comprehensive multi-step form builder plugin with drag-and-drop interface.
 * Version: 1.2.3
 * Author: Juan Pablo Juliao
 * Author URI: https://jpjuliao.github.io/
 * Text Domain: jpjuliao-multi-step-form-builder
 * Domain Path: /languages
 * License: GPL2
 * Tested up to: 6.9
 */

namespace JPJULIAO\Wordpress\MultiStepFormBuilder;

if (!defined('ABSPATH')) {
  exit;
}

require_once plugin_dir_path(__FILE__) . 'includes/class-plugin.php';

function init(): void
{
  Plugin::get_instance();
}

\add_action('plugins_loaded', __NAMESPACE__ . '\\init');
