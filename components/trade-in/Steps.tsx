import { useState } from "react";

export default function Steps({ data, setCurrentStep, currentStep }: any) {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(data.length).fill(false));

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
  };
  const handleStepCompletion = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);
    if (currentStep < data.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  return (
    <div className="flex flex-col w-8/12 mx-auto mt-10 mb-10">
      <div className='step-indicator'>
        {data.map((step: any, index: number) => (
          <>
            <button onClick={() => handleStepChange(index)} 
              disabled={index > currentStep && !completedSteps[index - 1]} // Prevents skipping steps
              className={`step step${index + 1} ${currentStep >= index ? "active" : ""}`} >
              <div className='step-icon'>{step.step}</div>
              <p className='text-sm !font-semibold'>{step.name}</p>
            </button>
            {index < data.length - 1 && (
              <div id={`StepLine${index + 1}`} className={`indicator-line ${currentStep >= index + 1 ? "active" : ""}`} ></div>
            )}
          </>
        ))}
      </div>
    </div>
  )
}