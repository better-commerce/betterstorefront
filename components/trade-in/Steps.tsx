import { useState } from "react";

export default function Steps({ data, setCurrentStep, currentStep }: any) {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(data.length).fill(false));
  return (
    <div className="flex flex-col w-full mx-auto mt-2 mb-5 sm:mt-10 sm:mb-10 sm:w-8/12">
      <div className='step-indicator'>
        {data?.map((step: any, index: number) => (
          <span className={`flex items-center ${index == 4 ? '' : 'w-[25%]'}`} key={`trade-in-${index}`}>
            <button
              disabled={index > currentStep && !completedSteps[index - 1]} // Prevents skipping steps
              className={`step step${index + 1} ${currentStep >= index ? "active" : ""}`}>
              <div className='step-icon'>{step.step}</div>
              <p className='text-sm !font-semibold'>{step.name}</p>
            </button>
            {index < data.length - 1 && (
              <div id={`StepLine${index + 1}`} className={`indicator-line ${currentStep >= index + 1 ? "active" : ""}`} ></div>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}