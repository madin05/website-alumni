import React from 'react';

interface StepperProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, title: 'Data Lulusan' },
  { id: 2, title: 'Status Lulusan' },
  { id: 3, title: 'Detail Aktivitas' },
  { id: 4, title: 'Penilaian SMK' },
  { id: 5, title: 'Umpan Balik' },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200">
      {/* Desktop/Tablet Horizontal Tabs Bar matching Dapodik screenshot */}
      <div className="hidden sm:grid grid-cols-5 text-center">
        {STEPS.map((step) => {
          const isCurrent = currentStep === step.id;
          const isDone = currentStep > step.id;

          return (
            <div
              key={step.id}
              className={`py-3 px-2 border-r last:border-r-0 text-xs font-medium select-none transition-colors ${
                isCurrent
                  ? 'bg-blue-600 text-white'
                  : isDone
                  ? 'bg-blue-50 text-blue-800'
                  : 'bg-white text-slate-500'
              }`}
            >
              Step {step.id} - {step.title}
            </div>
          );
        })}
      </div>

      {/* Mobile Bar */}
      <div className="sm:hidden px-4 py-3 bg-blue-600 text-white flex items-center justify-between text-xs font-medium uppercase">
        <span>STEP {currentStep} - {STEPS[currentStep - 1].title}</span>
        <span className="text-blue-100">{currentStep} / 5</span>
      </div>
    </div>
  );
};
