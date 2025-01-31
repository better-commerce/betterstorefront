export default function Steps({ data, setCurrentStep, currentStep }: any) {
  return (
    <div className="flex flex-col w-8/12 mx-auto mt-10 mb-10">
      <div className='step-indicator'>
        {data.map((step: any, index: number) => (
          <>
            <button onClick={() => setCurrentStep(index)} className={`step step${index + 1} ${currentStep >= index ? "active" : ""}`} >
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