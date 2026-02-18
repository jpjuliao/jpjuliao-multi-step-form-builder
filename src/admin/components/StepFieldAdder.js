import { useState } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FIELD_TYPES } from './FieldTypes';

const StepFieldAdder = ({ onAddField }) => {
  const [showFieldTypes, setShowFieldTypes] = useState(false);

  const handleAddField = (fieldType) => {
    onAddField(fieldType);
    setShowFieldTypes(false);
  };

  return (
    <div className="msf-add-field">
      <Button
        variant="secondary"
        onClick={() => setShowFieldTypes(!showFieldTypes)}
      >
        {showFieldTypes
          ? __('Hide Field Types', 'jpjuliao-multi-step-form-builder')
          : __('Add Field', 'jpjuliao-multi-step-form-builder')}
      </Button>

      {showFieldTypes && (
        <div className="msf-field-types-grid">
          {FIELD_TYPES.map((fieldType) => (
            <button
              key={fieldType.type}
              className="msf-field-type-btn"
              onClick={() => handleAddField(fieldType)}
            >
              <span className="msf-field-type-icon">{fieldType.icon}</span>
              <span className="msf-field-type-label">{fieldType.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepFieldAdder;
