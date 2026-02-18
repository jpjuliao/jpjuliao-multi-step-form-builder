import { useState, useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { FormsService } from '../services/forms';
import { setupPostSaveSync, triggerPostUpdate } from '../utils/saveSync';

export const useFormConfig = (formId) => {
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const isSyncingRef = useRef(false);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await FormsService.getForm(formId);
      setFormConfig(response);
    } catch (error) {
      setNotice({ type: 'error', message: __('Failed to load form', 'jpjuliao-multi-step-form-builder') });
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async () => {
    try {
      setSaving(true);
      isSyncingRef.current = true;
      await FormsService.saveForm(formId, formConfig);
      triggerPostUpdate();
      setNotice({ type: 'success', message: __('Form saved successfully!', 'jpjuliao-multi-step-form-builder') });
      setTimeout(() => setNotice(null), 3000);
    } catch (error) {
      setNotice({ type: 'error', message: __('Failed to save form', 'jpjuliao-multi-step-form-builder') });
    } finally {
      setSaving(false);
      isSyncingRef.current = false;
    }
  };

  useEffect(() => {
    loadForm();
  }, []);

  useEffect(() => {
    const unsubscribe = setupPostSaveSync(
      formId,
      () => formConfig,
      () => isSyncingRef.current
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [formId, formConfig]);

  return {
    formConfig,
    setFormConfig,
    loading,
    saving,
    notice,
    setNotice,
    saveForm,
  };
};
