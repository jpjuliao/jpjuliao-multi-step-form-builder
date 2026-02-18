import { lazy, Suspense } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, Spinner, TabPanel, Notice } from '@wordpress/components';
import { useFormConfig } from '../hooks/useFormConfig';
import { useSteps } from '../hooks/useSteps';

const StepEditor = lazy(() => import('./StepEditor'));
const FormSettings = lazy(() => import('./FormSettings'));
const FormHeader = lazy(() => import('./FormHeader'));

const FormBuilder = () => {
  const formId = window.msfAdmin?.formId;
  const {
    formConfig,
    setFormConfig,
    loading,
    saving,
    notice,
    setNotice,
    saveForm,
  } = useFormConfig(formId);

  const {
    addStep,
    updateStep,
    deleteStep,
    moveStep,
    updateSettings,
  } = useSteps(formConfig, setFormConfig);

  if (loading) {
    return (
      <div className="msf-loading">
        <Spinner />
        <p>{__('Loading form...', 'jpjuliao-multi-step-form-builder')}</p>
      </div>
    );
  }

  const tabs = [
    {
      name: 'steps',
      title: __('Steps', 'jpjuliao-multi-step-form-builder'),
      className: 'msf-tab-steps',
    },
    {
      name: 'header',
      title: __('Header', 'jpjuliao-multi-step-form-builder'),
      className: 'msf-tab-header',
    },
    {
      name: 'settings',
      title: __('Settings', 'jpjuliao-multi-step-form-builder'),
      className: 'msf-tab-settings',
    },
  ];

  return (
    <div className="msf-form-builder">
      {notice && (
        <Notice
          status={notice.type}
          onRemove={() => setNotice(null)}
          isDismissible
        >
          {notice.message}
        </Notice>
      )}

      <div className="msf-builder-header">
        <Button
          variant="primary"
          onClick={saveForm}
          isBusy={saving}
          disabled={saving}
        >
          {saving ? __('Saving...', 'jpjuliao-multi-step-form-builder') : __('Save Form', 'jpjuliao-multi-step-form-builder')}
        </Button>
      </div>

      <TabPanel
        className="msf-tabs"
        activeClass="is-active"
        tabs={tabs}
      >
        {(tab) => (
          <Suspense fallback={<div className="msf-loading-tab"><Spinner /></div>}>
            {(() => {
              if (tab.name === 'header') {
                return (
                  <div className="msf-header-panel">
                    <FormHeader
                      formConfig={formConfig}
                      updateFormConfig={setFormConfig}
                    />
                  </div>
                );
              }

              if (tab.name === 'steps') {
                return (
                  <div className="msf-steps-panel">
                    {formConfig.steps?.length > 0 ? (
                      formConfig.steps.map((step, index) => (
                        <div key={step.id || index} className="msf-step-wrapper">
                          <div className="msf-step-controls">
                            <span className="msf-step-number">
                              {__('Step', 'jpjuliao-multi-step-form-builder')} {index + 1}
                            </span>
                            <div className="msf-step-move-buttons">
                              {index > 0 && (
                                <Button
                                  icon="arrow-up"
                                  onClick={() => moveStep(index, index - 1)}
                                  label={__('Move Up', 'jpjuliao-multi-step-form-builder')}
                                  isSmall
                                />
                              )}
                              {index < formConfig.steps.length - 1 && (
                                <Button
                                  icon="arrow-down"
                                  onClick={() => moveStep(index, index + 1)}
                                  label={__('Move Down', 'jpjuliao-multi-step-form-builder')}
                                  isSmall
                                />
                              )}
                            </div>
                          </div>
                          <StepEditor
                            step={step}
                            stepIndex={index}
                            onUpdate={(updatedStep) => updateStep(index, updatedStep)}
                            onDelete={() => deleteStep(index)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="msf-empty-state">
                        <p>{__('No steps yet. Add your first step to get started.', 'jpjuliao-multi-step-form-builder')}</p>
                      </div>
                    )}
                    <Button variant="secondary" onClick={addStep} className="msf-add-step-btn">
                      {__('Add Step', 'jpjuliao-multi-step-form-builder')}
                    </Button>
                  </div>
                );
              }

              if (tab.name === 'settings') {
                return (
                  <FormSettings
                    settings={formConfig.settings || {}}
                    onUpdate={updateSettings}
                    formId={formId}
                  />
                );
              }
            })()}
          </Suspense>
        )}
      </TabPanel>
    </div>
  );
};

export default FormBuilder;
