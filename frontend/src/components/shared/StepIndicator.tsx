'use client';

interface StepIndicatorProps {
    currentStep: number; // 1-indexed
    steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center w-full max-w-2xl mx-auto py-4">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;
                const isFuture = stepNumber > currentStep;

                return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                        {/* Step circle + label */}
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300 ease-out
                  ${isCompleted
                                        ? 'bg-cnh-success text-white'
                                        : isActive
                                            ? 'bg-cnh-primary text-white ring-4 ring-cnh-primary/20'
                                            : 'bg-transparent border-2 border-cnh-text-muted text-cnh-text-muted'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            <span
                                className={`
                  text-xs font-medium text-center whitespace-nowrap hidden sm:block
                  ${isActive ? 'text-cnh-primary font-semibold' : isFuture ? 'text-cnh-text-muted' : 'text-cnh-text-secondary'}
                `}
                            >
                                {step}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-2 h-0.5 mb-5 sm:mb-0 sm:mt-[-18px]">
                                <div
                                    className={`
                    h-full rounded-full transition-colors duration-300
                    ${stepNumber < currentStep ? 'bg-cnh-success' : 'bg-cnh-border'}
                  `}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
