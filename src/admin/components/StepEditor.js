import { lazy, Suspense } from 'react';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

const StepHeader = lazy(() => import('./StepHeader'));
const StepFieldsList = lazy(() => import('./StepFieldsList'));
const StepFieldAdder = lazy(() => import('./StepFieldAdder'));

const StepEditor = ({ step, stepIndex, onUpdate, onDelete }) => {
  const updateStep = (key, value) => {
    onUpdate({ ...step, [key]: value });
  };

  const addField = (fieldType) => {
    const newField = {
      ...fieldType.defaultConfig,
      name: `field_${Date.now()}`,
      id: `field_${Date.now()}`
    };
    const newFields = [...(step.fields || []), newField];
    updateStep('fields', newFields);
  };

  const updateField = (fieldIndex, updatedField) => {
    const newFields = [...step.fields];
    newFields[fieldIndex] = updatedField;
    updateStep('fields', newFields);
  };

  const deleteField = (fieldIndex) => {
    const newFields = step.fields.filter((_, i) => i !== fieldIndex);
    updateStep('fields', newFields);
  };

  const moveField = (fromIndex, toIndex) => {
    const newFields = [...step.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    updateStep('fields', newFields);
  };

  return (
    <div className="msf-step-editor">
      <Suspense fallback={<Spinner />}>
        <StepHeader
          title={step.title}
          description={step.description}
          index={stepIndex}
          onUpdate={updateStep}
          onDelete={onDelete}
        />

        <div className="msf-fields-list">
          <h4>{__('Fields', 'jpjuliao-multi-step-form-builder')}</h4>
          <StepFieldsList
            fields={step.fields}
            onUpdateField={updateField}
            onDeleteField={deleteField}
            onMoveField={moveField}
          />
        </div>

        <StepFieldAdder onAddField={addField} />
      </Suspense>
    </div>
  );
};

export default StepEditor;
