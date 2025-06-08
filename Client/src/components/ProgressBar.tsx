import React from 'react';

type StatusStep = 'Registrerad' | 'Behandlas' | 'Skickad' | 'Mottagen';

const orderSteps: { label: string; key: StatusStep }[] = [
  { label: 'Registrerad', key: 'Registrerad' },
  { label: 'Behandlas', key: 'Behandlas' },
  { label: 'Skickad', key: 'Skickad' },
  { label: 'Mottagen', key: 'Mottagen' }
];

type Props = {
  status: StatusStep | string;
  className?: string;
};

const ProgressBar: React.FC<Props> = ({ status, className }) => {
  const steps = orderSteps;
  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      {steps.map((step, idx) => (
        <div key={step.key} className="flex items-center">
          <div
            className={
              'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ' +
              (idx <= currentStep
                ? 'bg-green-500 text-white border-2 border-green-500'
                : 'bg-gray-200 text-gray-400 border-2 border-gray-300')
            }
          >
            {idx + 1}
          </div>
          <span
            className={
              'ml-1 mr-2 text-s ' +
              (idx <= currentStep ? 'text-green-700 font-semibold' : 'text-gray-400')
            }
          >
            {step.label}
          </span>
          {idx < steps.length - 1 && (
            <span className={idx < currentStep ? 'text-green-500' : 'text-gray-300'}>&rarr;</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
