import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
  SelectControl,
  Button,
  Spinner,
  Notice,
  Modal
} from '@wordpress/components';

const SubmissionsList = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(window.msfAdmin?.formId || 0);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      loadSubmissions();
    }
  }, [selectedForm]);

  const loadForms = async () => {
    try {
      const response = await apiFetch({
        path: '/wp/v2/msf_form?per_page=100',
      });
      setForms(response);
      if (response.length > 0 && !selectedForm) {
        setSelectedForm(response[0].id);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await apiFetch({
        path: `/msf/v1/forms/${selectedForm}/submissions`,
      });
      setSubmissions(response.submissions || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setNotice({ type: 'error', message: __('Failed to load submissions', 'jpjuliao-multi-step-form-builder') });
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (submissionId) => {
    if (!confirm(__('Are you sure you want to delete this submission?', 'jpjuliao-multi-step-form-builder'))) {
      return;
    }

    try {
      await apiFetch({
        path: `/msf/v1/submissions/${submissionId}`,
        method: 'DELETE',
      });
      setNotice({ type: 'success', message: __('Submission deleted', 'jpjuliao-multi-step-form-builder') });
      loadSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      setNotice({ type: 'error', message: __('Failed to delete submission', 'jpjuliao-multi-step-form-builder') });
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      alert(__('No submissions to export', 'jpjuliao-multi-step-form-builder'));
      return;
    }

    // Get all unique field names
    const fieldNames = new Set();
    submissions.forEach(sub => {
      Object.keys(sub.submission_data).forEach(key => fieldNames.add(key));
    });

    // Create CSV header
    const headers = ['ID', 'Date', 'User ID', 'IP Address', ...Array.from(fieldNames)];
    let csv = headers.join(',') + '\n';

    // Add data rows
    submissions.forEach(sub => {
      const row = [
        sub.id,
        sub.created_at,
        sub.user_id || '',
        sub.ip_address || '',
        ...Array.from(fieldNames).map(field => {
          const value = sub.submission_data[field] || '';
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        })
      ];
      csv += row.join(',') + '\n';
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-${selectedForm}-submissions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formOptions = forms.map(form => ({
    label: form.title.rendered,
    value: form.id
  }));

  return (
    <div className="msf-submissions-list">
      {notice && (
        <Notice
          status={notice.type}
          onRemove={() => setNotice(null)}
          isDismissible
        >
          {notice.message}
        </Notice>
      )}

      <div className="msf-submissions-header">
        <SelectControl
          label={__('Select Form', 'jpjuliao-multi-step-form-builder')}
          value={selectedForm}
          options={[
            { label: __('Select a form...', 'jpjuliao-multi-step-form-builder'), value: 0 },
            ...formOptions
          ]}
          onChange={(value) => setSelectedForm(parseInt(value))}
        />
        <Button
          variant="secondary"
          onClick={exportToCSV}
          disabled={submissions.length === 0}
        >
          {__('Export to CSV', 'jpjuliao-multi-step-form-builder')}
        </Button>
      </div>

      {loading ? (
        <div className="msf-loading">
          <Spinner />
        </div>
      ) : submissions.length > 0 ? (
        <table className="wp-list-table widefat fixed striped">
          <thead>
            <tr>
              <th>{__('ID', 'jpjuliao-multi-step-form-builder')}</th>
              <th>{__('Date', 'jpjuliao-multi-step-form-builder')}</th>
              <th>{__('User', 'jpjuliao-multi-step-form-builder')}</th>
              <th>{__('IP Address', 'jpjuliao-multi-step-form-builder')}</th>
              <th>{__('Actions', 'jpjuliao-multi-step-form-builder')}</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id}>
                <td>{submission.id}</td>
                <td>{new Date(submission.created_at).toLocaleString()}</td>
                <td>{submission.user_id || __('Guest', 'jpjuliao-multi-step-form-builder')}</td>
                <td>{submission.ip_address}</td>
                <td>
                  <Button
                    variant="secondary"
                    isSmall
                    onClick={() => setViewingSubmission(submission)}
                  >
                    {__('View', 'jpjuliao-multi-step-form-builder')}
                  </Button>
                  {' '}
                  <Button
                    variant="secondary"
                    isSmall
                    isDestructive
                    onClick={() => deleteSubmission(submission.id)}
                  >
                    {__('Delete', 'jpjuliao-multi-step-form-builder')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{__('No submissions yet.', 'jpjuliao-multi-step-form-builder')}</p>
      )}

      {viewingSubmission && (
        <Modal
          title={__('Submission Details', 'jpjuliao-multi-step-form-builder')}
          onRequestClose={() => setViewingSubmission(null)}
        >
          <div className="msf-submission-details">
            <p><strong>{__('Date:', 'jpjuliao-multi-step-form-builder')}</strong> {new Date(viewingSubmission.created_at).toLocaleString()}</p>
            <p><strong>{__('User ID:', 'jpjuliao-multi-step-form-builder')}</strong> {viewingSubmission.user_id || __('Guest', 'jpjuliao-multi-step-form-builder')}</p>
            <p><strong>{__('IP Address:', 'jpjuliao-multi-step-form-builder')}</strong> {viewingSubmission.ip_address}</p>
            <hr />
            <h3>{__('Form Data', 'jpjuliao-multi-step-form-builder')}</h3>
            <table className="widefat">
              <tbody>
                {Object.entries(viewingSubmission.submission_data).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{Array.isArray(value) ? value.join(', ') : value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubmissionsList;
