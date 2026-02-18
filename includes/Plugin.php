<?php

namespace JPJULIAO\WordPress\MultiStepFormBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Plugin {



	private static ?Plugin $instance = null;

	private Database $database;
	private PostType $post_type;
	private Admin $admin;
	private Frontend $frontend;
	private Shortcode $shortcode;
	private RESTapi $rest_api;

	public static function get_instance(): Plugin {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		$this->init_components();

		\register_activation_hook( dirname( __DIR__ ) . '/multi-step-form-builder.php', array( $this, 'activate' ) );
		\register_deactivation_hook( dirname( __DIR__ ) . '/multi-step-form-builder.php', array( $this, 'deactivate' ) );
	}

	private function init_components(): void {
		$this->database  = new Database();
		$this->post_type = new PostType();
		$this->admin     = new Admin();
		$this->frontend  = new Frontend();
		$this->shortcode = new Shortcode();
		$this->rest_api  = new RESTapi( $this->database );
	}

	public function activate(): void {
		$this->database->create_table();
		\flush_rewrite_rules();
	}

	public function deactivate(): void {
		\flush_rewrite_rules();
	}
}
