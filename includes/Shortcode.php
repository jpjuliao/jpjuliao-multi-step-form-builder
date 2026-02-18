<?php

namespace JPJULIAO\WordPress\MultiStepFormBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Shortcode {



	public function __construct() {
		\add_shortcode( 'multi_step_form', array( $this, 'render_shortcode' ) );
		\add_shortcode( 'multi_step_form_button', array( $this, 'render_button_shortcode' ) );
	}

	public function render_shortcode( array $atts ): string {
		$atts = \shortcode_atts(
			array(
				'id' => 0,
			),
			$atts
		);

		$form_id = intval( $atts['id'] );

		if ( ! $form_id ) {
			return '<p>' . __( 'Please provide a valid form ID.', 'jpjuliao-multi-step-form-builder' ) . '</p>';
		}

		$post = \get_post( $form_id );
		if ( ! $post || 'msf_form' !== $post->post_type ) {
			return '<p>' . __( 'Form not found.', 'jpjuliao-multi-step-form-builder' ) . '</p>';
		}

		return sprintf(
			'<div class="msf-form-container" data-form-id="%d"></div>',
			$form_id
		);
	}

	public function render_button_shortcode( array $atts ): string {
		$atts = \shortcode_atts(
			array(
				'id'    => 0,
				'label' => __( 'Open Form', 'jpjuliao-multi-step-form-builder' ),
			),
			$atts
		);

		$form_id = intval( $atts['id'] );

		if ( ! $form_id ) {
			return '<p>' . __( 'Please provide a valid form ID.', 'jpjuliao-multi-step-form-builder' ) . '</p>';
		}

		$post = \get_post( $form_id );
		if ( ! $post || 'msf_form' !== $post->post_type ) {
			return '<p>' . __( 'Form not found.', 'jpjuliao-multi-step-form-builder' ) . '</p>';
		}

		return sprintf(
			'<button type="button" class="msf-modal-trigger" data-form-id="%d">%s</button>',
			$form_id,
			\esc_html( $atts['label'] )
		);
	}
}
