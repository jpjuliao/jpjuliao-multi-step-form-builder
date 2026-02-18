<?php

namespace JPJULIAO\WordPress\MultiStepFormBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Admin {


	public function __construct() {
		\add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		\add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
	}

	public function enqueue_admin_assets( string $hook ): void {
		global $post;

		if ( $hook === 'post.php' || $hook === 'post-new.php' ) {
			if ( isset( $post ) && $post->post_type === 'msf_form' ) {
				\wp_enqueue_script(
					'msf-admin',
					\plugin_dir_url( __DIR__ ) . 'build/admin.js',
					array( 'wp-element', 'wp-components', 'wp-i18n', 'wp-api-fetch', 'wp-data' ),
					\filemtime( \plugin_dir_path( __DIR__ ) . 'build/admin.js' ),
					true
				);

				\wp_enqueue_style(
					'msf-admin',
					\plugin_dir_url( __DIR__ ) . 'build/admin.css',
					array( 'wp-components' ),
					\filemtime( \plugin_dir_path( __DIR__ ) . 'build/admin.css' )
				);

				\wp_localize_script(
					'msf-admin',
					'msfAdmin',
					array(
						'formId' => $post->ID,
						'apiUrl' => \rest_url( 'msf/v1' ),
						'nonce'  => \wp_create_nonce( 'wp_rest' ),
					)
				);
			}
		}

		$page = \sanitize_key(
			(string) \filter_input(
				INPUT_GET,
				'page',
				FILTER_SANITIZE_FULL_SPECIAL_CHARS
			)
		);
		if ( $page === 'msf-submissions' ) {
			\wp_enqueue_script(
				'msf-admin',
				\plugin_dir_url( __DIR__ ) . 'build/admin.js',
				array( 'wp-element', 'wp-components', 'wp-i18n', 'wp-api-fetch', 'wp-data' ),
				\filemtime( \plugin_dir_path( __DIR__ ) . 'build/admin.js' ),
				true
			);

			\wp_enqueue_style(
				'msf-admin',
				\plugin_dir_url( __DIR__ ) . 'build/admin.css',
				array( 'wp-components' ),
				\filemtime( \plugin_dir_path( __DIR__ ) . 'build/admin.css' )
			);

			$form_id = (int) \filter_input(
				INPUT_GET,
				'form_id',
				FILTER_SANITIZE_NUMBER_INT
			);

			\wp_localize_script(
				'msf-admin',
				'msfAdmin',
				array(
					'formId' => $form_id,
					'apiUrl' => \rest_url( 'msf/v1' ),
					'nonce'  => \wp_create_nonce( 'wp_rest' ),
				)
			);
		}
	}

	public function add_admin_menu(): void {
		\add_submenu_page(
			'edit.php?post_type=msf_form',
			__( 'Submissions', 'jpjuliao-multi-step-form-builder' ),
			__( 'Submissions', 'jpjuliao-multi-step-form-builder' ),
			'manage_options',
			'msf-submissions',
			array( $this, 'render_submissions_page' )
		);
	}

	public function render_submissions_page(): void {
		?>
	<div class="wrap">
		<h1>
		<?php esc_html_e( 'Form Submissions', 'jpjuliao-multi-step-form-builder' ); ?>
		</h1>
		<div id="msf-submissions-root"></div>
	</div>
		<?php
	}
}
