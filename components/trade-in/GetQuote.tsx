import { CurrencyPoundIcon } from "@heroicons/react/24/outline";

export default function GetQuote({ nextStep, currentStep, steps, selectedItems, setCurrentStep }: any) {
  return (
    <>
      <div className='flex flex-col w-full gap-6 mt-4 sm:mt-5'>
        <div className='flex flex-col justify-center w-full gap-4 mt-6 text-center sm:mt-8'>
          <h3 className="px-4 py-3 text-xl w-full text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">Hi Vikram Saxena</h3>
          <h3 className="px-4 py-3 text-xl w-full text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">Your Quote Reference Number: UQ622273</h3>
        </div>
      </div>
      <div className='flex flex-col w-full mb-6 overflow-hidden shadow ring-2 ring-sky-600 sm:rounded-lg'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Description</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quote Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedItems?.map((item: any, itemIdx: number) => (
              <tr key={`item-${itemIdx}`}>
                <td className="flex gap-10 py-4 pl-4 pr-3 text-sm font-medium text-left text-gray-900 justify-normal whitespace-nowrap sm:pl-6">
                  <img src={item?.selectedProductImage} className='inline-block w-auto h-10' alt={item?.selectedProduct} />
                  <div className='flex flex-col w-full gap-1'>
                    <span>{item?.selectedProduct}</span>
                    <span className='text-xs text-gray-600'><strong>Condition: </strong>{item?.selectedCondition?.name}</span>
                    <span className='text-xs text-gray-600'><strong>Accessories: </strong>
                      {item?.selectedAccessories?.map((acc: any, accId: number) => (
                        <span key={`accessories-${accId}`} className="pr-2">{acc?.replace("?", " ")}</span>
                      ))}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                  {item?.selectedProductCurrency === "GBP" && "£"}{item?.selectedProductPrice}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-4 pl-10 text-xl font-semibold text-left text-black whitespace-nowrap">Total</td>
              <td className="px-3 py-4 text-xl font-semibold text-left text-black whitespace-nowrap">
                £{selectedItems?.reduce((total: number, item: any) => total + (item?.selectedProductPrice || 0), 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
      <div className="flex justify-between gap-4">
        <button onClick={nextStep} disabled={currentStep === steps.length - 1} className="w-full px-4 py-3 text-sm text-white bg-red-600 rounded disabled:bg-gray-300" >
          Reject quote
        </button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1} className="w-full px-4 py-3 text-sm text-white bg-[#39a029] rounded disabled:bg-gray-300" >
          Accept quote
        </button>
      </div>
    </>
  )
}