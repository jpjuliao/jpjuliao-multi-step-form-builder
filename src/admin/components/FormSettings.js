import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, PanelBody, ToggleControl } from '@wordpress/components';

const FormSettings = ({ settings, onUpdate, formId }) => {
  const updateSetting = (key, value) => {
    onUpdate({ ...settings, [key]: value });
  };
  const buttonShortcode = formId ? `[multi_step_form_button id="${formId}"]` : '[multi_step_form_button id=""]';

  return (
    <div className="msf-form-settings">
      <PanelBody title={__('Button Labels', 'jpjuliao-multi-step-form-builder')} initialOpen={true}>
        <TextControl
          label={__('Next Button Text', 'jpjuliao-multi-step-form-builder')}
          value={settings.nextButtonText || 'Next'}
          onChange={(value) => updateSetting('nextButtonText', value)}
        />
        <TextControl
          label={__('Previous Button Text', 'jpjuliao-multi-step-form-builder')}
          value={settings.previousButtonText || 'Previous'}
          onChange={(value) => updateSetting('previousButtonText', value)}
        />
        <TextControl
          label={__('Submit Button Text', 'jpjuliao-multi-step-form-builder')}
          value={settings.submitButtonText || 'Submit'}
          onChange={(value) => updateSetting('submitButtonText', value)}
        />
      </PanelBody>

      <PanelBody title={__('Messages', 'jpjuliao-multi-step-form-builder')} initialOpen={true}>
        <TextareaControl
          label={__('Success Message', 'jpjuliao-multi-step-form-builder')}
          value={settings.successMessage || 'Thank you for your submission!'}
          onChange={(value) => updateSetting('successMessage', value)}
          rows={3}
        />
      </PanelBody>

      <PanelBody title={__('Display Conditions', 'jpjuliao-multi-step-form-builder')} initialOpen={true}>
        <ToggleControl
          label={__('Show in Modal on Page Load', 'jpjuliao-multi-step-form-builder')}
          checked={settings.showModalOnLoad || false}
          onChange={(value) => updateSetting('showModalOnLoad', value)}
          help={__('Display the form in a modal popup when the page loads', 'jpjuliao-multi-step-form-builder')}
        />
        {settings.showModalOnLoad && (
          <TextControl
            label={__('Delay (seconds)', 'jpjuliao-multi-step-form-builder')}
            type="number"
            value={settings.modalDelay || 0}
            onChange={(value) => updateSetting('modalDelay', parseInt(value) || 0)}
            help={__('Delay before showing the modal (0 for immediate)', 'jpjuliao-multi-step-form-builder')}
            min={0}
            max={60}
          />
        )}
        <ToggleControl
          label={__('Show Modal Trigger Button Shortcode', 'jpjuliao-multi-step-form-builder')}
          checked={settings.showModalOnButtonClick || false}
          onChange={(value) => updateSetting('showModalOnButtonClick', value)}
          help={__('Display a shortcode that opens the form in a modal when the button is clicked', 'jpjuliao-multi-step-form-builder')}
        />
        {settings.showModalOnButtonClick && (
          <TextControl
            label={__('Modal Button Shortcode', 'jpjuliao-multi-step-form-builder')}
            value={buttonShortcode}
            onChange={() => {}}
            readOnly
          />
        )}
      </PanelBody>
    </div>
  );
};

export default FormSettings;
