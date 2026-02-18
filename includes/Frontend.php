<?php

namespace JPJULIAO\WordPress\MultiStepFormBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Frontend {


	public function __construct() {
		\add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}

	public function enqueue_frontend_assets(): void {
		global $post;

		$should_enqueue = false;

		if ( is_a( $post, 'WP_Post' ) && \has_shortcode( $post->post_content, 'multi_step_form' ) ) {
			$should_enqueue = true;
		}

		if ( ! $should_enqueue ) {
			$modal_forms = $this->get_modal_forms();
			if ( ! empty( $modal_forms ) ) {
				$should_enqueue = true;
			}
		}

		if ( $should_enqueue ) {
			\wp_enqueue_script(
				'msf-frontend',
				\plugin_dir_url( __DIR__ ) . 'build/frontend.js',
				array( 'wp-element', 'wp-i18n', 'wp-api-fetch' ),
				\filemtime( \plugin_dir_path( __DIR__ ) . 'build/frontend.js' ),
				true
			);

			\wp_enqueue_style(
				'msf-frontend',
				\plugin_dir_url( __DIR__ ) . 'build/frontend.css',
				array(),
				\filemtime( \plugin_dir_path( __DIR__ ) . 'build/frontend.css' )
			);

			$modal_forms = $this->get_modal_forms();

			\wp_localize_script(
				'msf-frontend',
				'msfFrontend',
				array(
					'apiUrl'     => \rest_url( 'msf/v1' ),
					'nonce'      => \wp_create_nonce( 'wp_rest' ),
					'restUrl'    => \rest_url(),
					'modalForms' => $modal_forms,
				)
			);
		}
	}

	private function get_modal_forms(): array {
		$args = array(
			'post_type'      => 'msf_form',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'fields'         => 'ids',
		);

		$form_ids    = \get_posts( $args );
		$modal_forms = array();

		foreach ( $form_ids as $form_id ) {
			$config = \get_post_meta( $form_id, '_msf_form_config', true );
			if ( $config ) {
				$config   = json_decode( $config, true );
				$settings = isset( $config['settings'] ) ? $config['settings'] : array();

				if ( isset( $settings['showModalOnLoad'] ) && $settings['showModalOnLoad'] ) {
					$modal_forms[] = array(
						'id'    => $form_id,
						'delay' => isset( $settings['modalDelay'] ) ? intval( $settings['modalDelay'] ) : 0,
					);
				}
			}
		}

		return $modal_forms;
	}
}
