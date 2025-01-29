export default function AddItems({ conditions, accessories, nextStep, steps, selectedIndex, selectedAccIndexes, setSelectedIndex, handleAccessoryClick, currentStep }: any) {
  return (
    <>
      <div className='flex flex-col w-full gap-6 mt-4 sm:mt-5'>
        <div className='flex flex-col justify-center w-full mt-6 text-center sm:mt-8'>
          <h3 className='mb-1 text-xl font-semibold sm:text-3xl text-[#2d4d9c] sm:mb-1'>What would you like to sell?</h3>
          <h4 className='mb-4 font-medium text-black text-md sm:text-lg sm:mb-6'>Simply complete our form below and receive an instant quote.*</h4>
        </div>
      </div>
      <div className='flex flex-col justify-start w-full gap-2 text-left'>
        <label className='text-lg font-semibold text-[#2d4d9c]'>Item 1</label>
        <span className='text-sm font-normal text-black'>Tell us about your item</span>
        <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Please search and Select Your Model' />
      </div>
      <div className='flex flex-col justify-start w-full gap-2 text-left'>
        <label className='text-lg font-semibold text-[#2d4d9c]'>Condition</label>
        <div className="grid grid-cols-5 gap-3">
          {conditions?.map((cn: any, cnIdx: number) => (
            <div key={`condition-${cnIdx}`} className={`flex flex-col items-center justify-center group w-full gap-4 p-4 text-center border rounded cursor-pointer transition ${selectedIndex === cnIdx ? "bg-[#2d4d9c] text-white shadow-lg" : "bg-white border-gray-200 hover:shadow-md"}`} onClick={() => setSelectedIndex(cnIdx)} >
              <h3 className={`font-semibold text-xl ${selectedIndex === cnIdx ? "text-white" : "text-black group-hover:text-[#2d4d9c]"}`} >
                {cn?.name}
              </h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`w-12 h-auto transition ${selectedIndex === cnIdx ? "fill-white" : "fill-black group-hover:fill-[#2d4d9c]"}`} >
                <path d="M220.6 121.2L271.1 96 448 96v96H333.2c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24H64V128H192c9.9 0 19.7-2.3 28.6-6.8zM0 128V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H271.1c-9.9 0-19.7 2.3-28.6 6.8L192 64H160V48c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"></path>
              </svg>
              <p className={`font-normal text-[10px] leading-3 ${selectedIndex === cnIdx ? "text-white" : "text-black group-hover:text-[#2d4d9c]"}`} >
                {cn?.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col justify-start w-full gap-2 text-left'>
        <label className='text-lg font-semibold text-[#2d4d9c]'>Accessories</label>
        <div className={`grid grid-cols-3 gap-3`}>
          {accessories?.map((ac: any, acIdx: number) => (
            <div key={`condition-${acIdx}`} className={`flex flex-col items-center group justify-center w-full gap-4 p-4 text-center border rounded cursor-pointer transition ${selectedAccIndexes.includes(acIdx) ? "bg-[#2d4d9c] text-white shadow-lg" : "bg-white border-gray-200 hover:shadow-md"}`} onClick={() => handleAccessoryClick(acIdx)} >
              <h3 className={`font-semibold text-xl ${selectedAccIndexes.includes(acIdx) ? "text-white" : "text-black group-hover:text-[#2d4d9c]"}`}>
                {ac?.name}
              </h3>
              {ac?.icon()}
            </div>
          ))}
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="flex flex-col gap-5 pt-6 mt-2 border-t border-gray-200">
        <button className="w-full px-4 py-3 text-[#2d4d9c] text-sm border border-[#2d4d9c] bg-white rounded disabled:bg-gray-300" >
          [+] Add another item
        </button>
        <div className='flex flex-col w-full gap-1'>
          <button onClick={nextStep} disabled={currentStep === steps.length - 1} className="w-full px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300" >
            Next add your details
          </button>
          <span className='text-xs font-normal text-left text-black'>*Some products require further attention. One of used specialists will update the quote within 2 working days.</span>
        </div>
      </div>
    </>
  )
}