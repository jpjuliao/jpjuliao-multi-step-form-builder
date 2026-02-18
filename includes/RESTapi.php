<?php

namespace JPJULIAO\WordPress\MultiStepFormBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class RESTapi {


	private Database $database;

	public function __construct( Database $database ) {
		$this->database = $database;
		\add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes(): void {

		\register_rest_route(
			'msf/v1',
			'/forms/(?P<id>\d+)/submit',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'submit_form' ),
				'permission_callback' => '__return_true',
			)
		);

		\register_rest_route(
			'msf/v1',
			'/forms/(?P<id>\d+)/submissions',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_submissions' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			)
		);

		\register_rest_route(
			'msf/v1',
			'/forms/(?P<id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_form' ),
				'permission_callback' => '__return_true',
			)
		);

		\register_rest_route(
			'msf/v1',
			'/forms/(?P<id>\d+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'save_form' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			)
		);

		\register_rest_route(
			'msf/v1',
			'/submissions/(?P<id>\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'delete_submission' ),
				'permission_callback' => array( $this, 'check_admin_permission' ),
			)
		);
	}

	public function get_form( \WP_REST_Request $request ): \WP_REST_Response {
		$form_id = $request->get_param( 'id' );

		$form_config = \get_post_meta( $form_id, '_msf_form_config', true );

		if ( is_string( $form_config ) ) {
			$form_config = json_decode( $form_config, true );
		}

		if ( empty( $form_config ) || ! is_array( $form_config ) ) {
			$form_config = array(
				'steps'    => array(),
				'settings' => array(
					'submitButtonText'   => 'Submit',
					'successMessage'     => 'Thank you for your submission!',
					'nextButtonText'     => 'Next',
					'previousButtonText' => 'Previous',
				),
			);
		}

		return \rest_ensure_response( $form_config );
	}

	public function save_form( \WP_REST_Request $request ): \WP_REST_Response {
		$form_id     = $request->get_param( 'id' );
		$form_config = json_encode( $request->get_json_params() );

		\update_post_meta( $form_id, '_msf_form_config', $form_config );

		return \rest_ensure_response(
			array(
				'success' => true,
				'message' => 'Form saved successfully',
			)
		);
	}

	public function submit_form( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$form_id = $request->get_param( 'id' );
		$data    = $request->get_json_params();

		$post = \get_post( $form_id );
		if ( ! $post || $post->post_type !== 'msf_form' ) {
			return new \WP_Error( 'invalid_form', 'Invalid form ID', array( 'status' => 404 ) );
		}

		$form_config = \get_post_meta( $form_id, '_msf_form_config', true );

		if ( is_string( $form_config ) ) {
			$form_config = json_decode( $form_config, true );
		}

		$errors = $this->validate_submission( $data, $form_config );
		if ( ! empty( $errors ) ) {
			return new \WP_Error(
				'validation_failed',
				'Validation failed',
				array(
					'status' => 400,
					'errors' => $errors,
				)
			);
		}

		$sanitized_data = $this->sanitize_submission( $data );

		$submission_id = $this->database->save_submission( $form_id, $sanitized_data );

		if ( $submission_id ) {
			$success_message = isset( $form_config['settings']['successMessage'] )
			? $form_config['settings']['successMessage']
			: 'Thank you for your submission!';

			return \rest_ensure_response(
				array(
					'success'       => true,
					'message'       => $success_message,
					'submission_id' => $submission_id,
				)
			);
		} else {
			return new \WP_Error( 'submission_failed', 'Failed to save submission', array( 'status' => 500 ) );
		}
	}

	public function get_submissions( \WP_REST_Request $request ): \WP_REST_Response {
		$form_id  = $request->get_param( 'id' );
		$page     = $request->get_param( 'page' ) ?: 1;
		$per_page = $request->get_param( 'per_page' ) ?: 50;

		$offset = ( $page - 1 ) * $per_page;

		$submissions = $this->database->get_submissions( $form_id, $per_page, $offset );
		$total       = $this->database->get_submission_count( $form_id );

		return \rest_ensure_response(
			array(
				'submissions' => $submissions,
				'total'       => $total,
				'page'        => $page,
				'per_page'    => $per_page,
				'total_pages' => ceil( $total / $per_page ),
			)
		);
	}

	public function delete_submission( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$submission_id = $request->get_param( 'id' );

		$result = $this->database->delete_submission( $submission_id );

		if ( $result ) {
			return \rest_ensure_response( array( 'success' => true ) );
		} else {
			return new \WP_Error( 'delete_failed', 'Failed to delete submission', array( 'status' => 500 ) );
		}
	}

	private function validate_submission( array $data, array $form_config ): array {
		$errors = array();

		if ( empty( $form_config['steps'] ) ) {
			return $errors;
		}

		foreach ( $form_config['steps'] as $step ) {
			if ( empty( $step['fields'] ) ) {
				continue;
			}

			foreach ( $step['fields'] as $field ) {
				$field_name  = $field['name'];
				$field_value = isset( $data[ $field_name ] ) ? $data[ $field_name ] : '';

				if ( ! empty( $field['required'] ) && empty( $field_value ) ) {
					$errors[ $field_name ] = $field['label'] . ' is required';
					continue;
				}

				if ( $field['type'] === 'email' && ! empty( $field_value ) && ! \is_email( $field_value ) ) {
					$errors[ $field_name ] = 'Please enter a valid email address';
				}

				if ( $field['type'] === 'url' && ! empty( $field_value ) && ! filter_var( $field_value, FILTER_VALIDATE_URL ) ) {
					$errors[ $field_name ] = 'Please enter a valid URL';
				}
			}
		}

		return $errors;
	}

	private function sanitize_submission( array $data ): array {
		$sanitized = array();

		foreach ( $data as $key => $value ) {
			if ( is_array( $value ) ) {
				$sanitized[ $key ] = array_map( '\sanitize_text_field', $value );
			} else {
				$sanitized[ $key ] = \sanitize_text_field( $value );
			}
		}

		return $sanitized;
	}

	public function check_admin_permission(): bool {
		return \current_user_can( 'manage_options' );
	}
}
