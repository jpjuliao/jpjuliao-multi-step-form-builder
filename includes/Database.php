<?php

namespace JPJULIAO\Wordpress\MultiStepFormBuilder;

if (!defined('ABSPATH')) {
  exit;
}

class Database
{

  private string $table_name;

  public function __construct()
  {
    global $wpdb;
    $this->table_name = $wpdb->prefix . 'msf_submissions';
  }

  public function create_table(): void
  {
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$this->table_name} (
      id bigint(20) NOT NULL AUTO_INCREMENT,
      form_id bigint(20) NOT NULL,
      user_id bigint(20) DEFAULT NULL,
      submission_data longtext NOT NULL,
      ip_address varchar(100) DEFAULT NULL,
      user_agent varchar(255) DEFAULT NULL,
      created_at datetime DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY  (id),
      KEY form_id (form_id),
      KEY user_id (user_id),
      KEY created_at (created_at)
    ) $charset_collate;";

    require_once(\ABSPATH . 'wp-admin/includes/upgrade.php');
    \dbDelta($sql);
  }

  public function save_submission(int $form_id, array $data): int|false
  {
    global $wpdb;

    $user_id = \get_current_user_id();
    $ip_address = $this->get_client_ip();
    $user_agent = isset($_SERVER['HTTP_USER_AGENT'])
      ? \sanitize_text_field(\wp_unslash((string) $_SERVER['HTTP_USER_AGENT']))
      : '';

    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery -- Using $wpdb->insert for custom plugin table writes.
    $result = $wpdb->insert(
      $this->table_name,
      array(
        'form_id' => $form_id,
        'user_id' => $user_id ?: null,
        'submission_data' => \wp_json_encode($data),
        'ip_address' => $ip_address,
        'user_agent' => $user_agent,
      ),
      array('%d', '%d', '%s', '%s', '%s')
    );

    return $result !== false ? $wpdb->insert_id : false;
  }

  public function get_submissions(int $form_id, int $limit = 50, int $offset = 0): array
  {
    global $wpdb;

    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
    $results = $wpdb->get_results(
      $wpdb->prepare(
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is trusted (constructed from $wpdb->prefix + constant); only dynamic values are parameterized via $wpdb->prepare().
        "SELECT * FROM {$this->table_name} WHERE form_id = %d ORDER BY created_at DESC LIMIT %d OFFSET %d",
        $form_id,
        $limit,
        $offset
      )
    );

    foreach ($results as &$result) {
      $result->submission_data = json_decode($result->submission_data, true);
    }

    return $results;
  }

  public function get_submission_count(int $form_id): int
  {
    global $wpdb;

    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
    return (int) $wpdb->get_var(
      $wpdb->prepare(
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is trusted (constructed from $wpdb->prefix + constant); only dynamic values are parameterized via $wpdb->prepare().
        "SELECT COUNT(*) FROM {$this->table_name} WHERE form_id = %d",
        $form_id
      )
    );
  }

  public function delete_submission(int $id): bool
  {
    global $wpdb;

    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Using $wpdb->delete for custom plugin table deletions; no caching layer is required here.
    return $wpdb->delete(
      $this->table_name,
      array('id' => $id),
      array('%d')
    );
  }

  private function get_client_ip(): string
  {
    $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');

    foreach ($ip_keys as $key) {
      if (array_key_exists($key, $_SERVER) === true) {
        $server_value = \sanitize_text_field(\wp_unslash((string) $_SERVER[$key]));
        foreach (explode(',', $server_value) as $ip) {
          $ip = trim($ip);
          if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
            return $ip;
          }
        }
      }
    }

    return '';
  }
}
