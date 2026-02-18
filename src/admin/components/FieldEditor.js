import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import {
  TextControl,
  TextareaControl,
  ToggleControl,
  Button,
  PanelBody,
  PanelRow
} from '@wordpress/components';

const FieldEditor = ({ field, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = (key, value) => {
    onUpdate({ ...field, [key]: value });
  };

  const updateOption = (index, key, value) => {
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    updateField('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), { label: '', value: '' }];
    updateField('options', newOptions);
  };

  const removeOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    updateField('options', newOptions);
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type);

  return (
    <div className="msf-field-editor">
      <div className="msf-field-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="msf-field-type-icon">{getFieldIcon(field.type)}</span>
        <span className="msf-field-label">{field.label || __('Untitled Field', 'jpjuliao-multi-step-form-builder')}</span>
        <div className="msf-field-actions">
          <Button
            icon="arrow-down"
            label={isExpanded ? __('Collapse', 'jpjuliao-multi-step-form-builder') : __('Expand', 'jpjuliao-multi-step-form-builder')}
            className={`msf-toggle-btn ${isExpanded ? 'expanded' : ''}`}
          />
          <Button
            icon="trash"
            label={__('Delete', 'jpjuliao-multi-step-form-builder')}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            isDestructive
          />
        </div>
      </div>

      {isExpanded && (
        <div className="msf-field-config">
          <TextControl
            label={__('Label', 'jpjuliao-multi-step-form-builder')}
            value={field.label}
            onChange={(value) => updateField('label', value)}
          />

          <TextControl
            label={__('Field Name', 'jpjuliao-multi-step-form-builder')}
            value={field.name}
            onChange={(value) => updateField('name', value)}
            help={__('Unique identifier for this field (no spaces)', 'jpjuliao-multi-step-form-builder')}
          />

          {field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'select' && (
            <TextControl
              label={__('Placeholder', 'jpjuliao-multi-step-form-builder')}
              value={field.placeholder || ''}
              onChange={(value) => updateField('placeholder', value)}
            />
          )}

          {field.type === 'textarea' && (
            <TextControl
              label={__('Rows', 'jpjuliao-multi-step-form-builder')}
              type="number"
              value={field.rows || 4}
              onChange={(value) => updateField('rows', parseInt(value))}
            />
          )}

          {field.type === 'number' && (
            <>
              <TextControl
                label={__('Min Value', 'jpjuliao-multi-step-form-builder')}
                type="number"
                value={field.min || ''}
                onChange={(value) => updateField('min', value)}
              />
              <TextControl
                label={__('Max Value', 'jpjuliao-multi-step-form-builder')}
                type="number"
                value={field.max || ''}
                onChange={(value) => updateField('max', value)}
              />
              <TextControl
                label={__('Step', 'jpjuliao-multi-step-form-builder')}
                type="number"
                value={field.step || '1'}
                onChange={(value) => updateField('step', value)}
              />
            </>
          )}

          {hasOptions && (
            <div className="msf-options-editor">
              <label className="components-base-control__label">
                {__('Options', 'jpjuliao-multi-step-form-builder')}
              </label>
              {field.options?.map((option, index) => (
                <div key={index} className="msf-option-row">
                  <TextControl
                    placeholder={__('Label', 'jpjuliao-multi-step-form-builder')}
                    value={option.label}
                    onChange={(value) => updateOption(index, 'label', value)}
                  />
                  <TextControl
                    placeholder={__('Value', 'jpjuliao-multi-step-form-builder')}
                    value={option.value}
                    onChange={(value) => updateOption(index, 'value', value)}
                  />
                  <Button
                    icon="trash"
                    onClick={() => removeOption(index)}
                    isDestructive
                    isSmall
                  />
                </div>
              ))}
              <Button onClick={addOption} variant="secondary" isSmall>
                {__('Add Option', 'jpjuliao-multi-step-form-builder')}
              </Button>
            </div>
          )}

          <TextareaControl
            label={__('Help Text', 'jpjuliao-multi-step-form-builder')}
            value={field.helpText || ''}
            onChange={(value) => updateField('helpText', value)}
            rows={2}
          />

          <ToggleControl
            label={__('Required', 'jpjuliao-multi-step-form-builder')}
            checked={field.required || false}
            onChange={(value) => updateField('required', value)}
          />
        </div>
      )}
    </div>
  );
};

const getFieldIcon = (type) => {
  const icons = {
    text: '📝',
    email: '📧',
    textarea: '📄',
    select: '📋',
    radio: '🔘',
    checkbox: '☑️',
    number: '🔢',
    tel: '📱',
    url: '🔗',
    date: '📅'
  };
  return icons[type] || '📝';
};

export default FieldEditor;
