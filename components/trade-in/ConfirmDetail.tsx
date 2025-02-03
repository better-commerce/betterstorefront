import TradeInLogin from "@components/shared/Login/TradeInLogin";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function ConfirmDetails({ setCurrentStep, selectedItems, currentStep, steps, nextStep, setGuestCheckout, isGuest, }: any) {
  return (
    <>
      <div className='flex flex-col w-full gap-6 mt-4 sm:mt-5'>
        <div className='flex flex-col justify-center w-full mt-6 text-center sm:mt-8'>
          <h3 className='mb-1 text-xl font-semibold sm:text-3xl text-[#2d4d9c] sm:mb-1'>Quote Summary</h3>
        </div>
      </div>
      <div className='flex flex-col w-full overflow-hidden shadow ring-1 ring-black/5 sm:rounded'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Description</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Condition</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[200px]">Accessories</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Instant Quote Available</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedItems?.map((item: any, itemIdx: number) => (
              <tr key={`items-${itemIdx}`}>
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap sm:pl-6">
                  <img src={item?.selectedProductImage} className='inline-block w-10 h-auto' alt={item?.selectedProduct} /> {item?.selectedProduct}
                </td>
                <td className="px-3 py-4 text-sm text-left text-gray-500 whitespace-nowrap">{item?.selectedCondition?.name}</td>
                <td className="items-center gap-2 px-3 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                  {item?.selectedAccessories?.map((acc: any, accId: number) => (
                    <span key={`accessories-${accId}`} className="pr-2">{acc?.replace("?", " ")}</span>
                  ))}
                </td>
                <td className="px-3 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                  <CheckIcon className='w-6 h-6 text-emerald-600' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-end flex-1'>
        <button
          onClick={() => setCurrentStep(0)} // Ensure you're setting the correct step here
          disabled={currentStep === steps.length - 1}
          className="px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300"
        >
          Edit Items
        </button>
      </div>
      <div className='flex flex-col w-10/12 mx-auto my-4 border border-gray-200'>
        <TradeInLogin pluginConfig={undefined} />
      </div>
      {isGuest ?
        <div className='flex flex-col justify-start w-10/12 gap-2 mx-auto my-4'>
          <h4 className='text-xl font-medium text-left text-black'>Continue as guest</h4>
          <p className='text-sm font-normal text-left text-gray-600'>Don't have a quote and want to continue as a guest:</p>
          <div className='flex justify-start flex-1 w-full gap-4 sm:w-10/12'>
            <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Enter Name' />
            <input type='email' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Email' />
            <input type='number' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Phone Number' />
          </div>
          <button onClick={nextStep} className="px-4 py-3 w-full text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300" >
            Continue as guest
          </button>
        </div> :
        <div className='flex flex-col w-10/12 mx-auto mt-4 text-center'>
          <h4 className='text-lg font-medium text-black'>Continue as a guest</h4>
          <p className='text-sm font-normal text-gray-700'>Don't have an account and want to complete the quote as a guest, please
            <span className='pl-1 underline cursor-pointer text-sky-600' onClick={() => setGuestCheckout()}>click here.</span>
          </p>
        </div>
      }

      <div className='flex flex-col justify-center w-10/12 gap-2 mx-auto my-4'>
        <h4 className='text-sm font-normal text-black'>Do you have a promo code? Please enter below:</h4>
        <div className='flex justify-start flex-1 w-full mx-auto sm:w-5/12'>
          <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Enter Promo Code' />
          <button className="px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300" >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}