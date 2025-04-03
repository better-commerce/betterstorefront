import { TradeInItemCondition } from "@components/utils/constants";

export default function QuoteDetails({ data, quoteData, startNewTrade }: any) {
  return (
    <>
      <div className='flex flex-col w-full gap-4 border-t border-gray-200'>
        <div className='flex flex-col justify-start w-full gap-4 mt-4 text-left'>
          <h3 className="px-0 py-0 text-xl font-semibold w-full text-[#2d4d9c]">That's it, all the hard work is done!</h3>
          <h3 className="px-0 py-0 text-xl font-semibold w-full text-[#2d4d9c]">Your Quote Reference Number: {quoteData?.value?.quoteNo} <span className="text-sm text-black">(Status: {quoteData?.value?.status})</span></h3>
          <p className='text-sm font-normal text-gray-600'>Thank you for choosing to visit Park Cameras Burgess Hill to complete your trade-in. We look forward to seeing you. Our friendly in-store staff will be happy to guide you through the trade-in process whilst answering any other questions you may have regarding photographic equipment.</p>
          <p className='text-sm font-normal text-gray-600'>To ensure your trade-in continues to move forward smoothly, please can you either print out the packing slip below or download to your phone so the in-store team can pick up the trade-in from the correct point.</p>
        </div>
        <div className='flex flex-col justify-start w-full mt-3 text-left'>
          <h3 className="text-xl font-semibold w-full text-[#2d4d9c] rounded disabled:bg-gray-300">Trade-in Summary</h3>
        </div>
      </div>
      <div className='flex flex-col w-full overflow-hidden shadow ring-1 ring-gray-300 sm:rounded'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead className="bg-emerald-100">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Price</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quoteData?.value?.items?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName))?.map((item: any, itemIdx: number) => (
              <tr key={`item-${itemIdx}`} className="bg-white hover:bg-gray-100">
                <td className="flex gap-5 py-3 pl-4 pr-3 text-sm font-medium text-left text-gray-900 justify-normal whitespace-nowrap sm:pl-6">
                  <img src={item?.parentProductImageUrl} className='inline-block w-auto h-16' alt={item?.parentProductName} />
                  <div className='flex flex-col justify-center w-full gap-1 text-left'>
                    <span className="font-semibold text-left text-black">{item?.parentProductName} <span className="text-xs font-medium text-black">({item?.parentStockCode})</span></span>
                    {item?.condition != "" &&
                      <span className="text-xs text-left text-gray-600">
                        <strong>Condition: </strong>
                        {item?.condition == TradeInItemCondition.WELL_USED ? 'Well Used' :
                          item?.condition == TradeInItemCondition.GOOD ? 'Good' :
                            item?.condition == TradeInItemCondition.VERY_GOOD ? 'Very Good' :
                              item?.condition == TradeInItemCondition.EXCELLENT ? 'Excellent' :
                                item?.condition == TradeInItemCondition.LIKE_NEW ? 'Like New' :
                                  'N/A'
                        }
                      </span>
                    }
                    {item?.accessories?.length > 0 && (
                      <span className="text-xs text-left text-gray-600">
                        <strong>Accessories: </strong>
                        {item.accessories
                          .sort((a: any, b: any) => a.name.localeCompare(b.name)) // Sort alphabetically
                          .map((acc: any) => acc?.name) // Extract names
                          .join(", ") // Join with commas
                        }
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                  {"£"}{item?.price}
                </td>
                <td className={`whitespace-nowrap justify-end pr-2`} align="right">
                  <span className={`${item?.status == "Accepted" ? 'bg-emerald-100 border-emerald-400 text-emerald-600' : 'bg-red-100 border-red-400 text-red-600'} px-2 py-1 text-xs border font-semibold whitespace-nowrap rounded`}>{item?.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="py-3 pl-6 text-xl font-semibold text-left text-black whitespace-nowrap">Total</td>
              <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap">
                £{quoteData?.value?.grandTotal}
              </td>
              <td className="px-3 py-3 text-xl font-semibold text-right text-black whitespace-nowrap"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-1 lg:grid-cols-1">
        {data.slice(0, 1).map((store: any, index: number) => {
          return (
            <div key={index} className={`p-4 text-left border rounded shadow-lg cursor-pointer bg-white`}>
              <div className="flex items-center w-full gap-2 pb-1 mb-4 border-b border-gray-300">
                <h2 className="w-full text-xl font-semibold text-gray-700 uppercase">
                  DPD Home Collection Address
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className='sm:col-span-5'>
                  <h2 className="mt-2 mb-4 text-sm font-semibold text-gray-700 uppercase">Address:</h2>
                  {quoteData?.value?.street != "-" && <p>{quoteData?.value?.street}</p>}
                  {quoteData?.value?.street2 != "-" && <p>{quoteData?.value?.street2}</p>}
                  {quoteData?.value?.city != "-" && <p>{quoteData?.value?.city}</p>}
                  {quoteData?.value?.state != "-" && <p>{quoteData?.value?.state}</p>}
                  {quoteData?.value?.postCode != "-" && <p>{quoteData?.value?.postCode}</p>}
                  {quoteData?.value?.country != "-" && <p>{quoteData?.value?.country}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex flex-col justify-start w-full gap-4 text-left'>
        <p className='text-sm font-normal text-gray-600'>If in the meantime you decide that you would rather a collections be organized please call us on 01444 237070 or email us at sales@parkcameras.com and someone will be willing to help you change the shipping method.</p>
        <p className='text-sm font-normal text-gray-600'>Before coming into store, why not check out our extensive range of camera gear.</p>
      </div>
      <div className="flex flex-col mt-4">
        <button className="px-4 py-3 w-full border bg-[#2d4d9c] border-[#2d4d9c] text-white rounded hover:bg-[#2d4d9c] hover:text-white disabled:bg-gray-300"
          onClick={() => {
            startNewTrade();
            document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}>Start New Trade</button>
      </div>
    </>
  )
}