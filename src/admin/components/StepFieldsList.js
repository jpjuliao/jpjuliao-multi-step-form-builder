import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from 'react';

const FieldEditor = lazy(() => import('./FieldEditor'));

const StepFieldsList = ({ fields, onUpdateField, onDeleteField, onMoveField }) => {
  if (!fields || fields.length === 0) {
    return (
      <p className="msf-empty-message">
        {__('No fields yet. Add your first field below.', 'jpjuliao-multi-step-form-builder')}
      </p>
    );
  }

  return (
    <div className="msf-fields-list-items">
      {fields.map((field, index) => (
        <div key={field.id || index} className="msf-field-item">
          {index > 0 && (
            <Button
              icon="arrow-up"
              onClick={() => onMoveField(index, index - 1)}
              isSmall
              className="msf-move-btn"
            />
          )}
          <Suspense fallback={<div className="msf-field-loading">Loading field...</div>}>
            <FieldEditor
              field={field}
              onUpdate={(updatedField) => onUpdateField(index, updatedField)}
              onDelete={() => onDeleteField(index)}
            />
          </Suspense>
          {index < fields.length - 1 && (
            <Button
              icon="arrow-down"
              onClick={() => onMoveField(index, index + 1)}
              isSmall
              className="msf-move-btn"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepFieldsList;
