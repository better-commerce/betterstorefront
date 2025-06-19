import { Fragment, useEffect, useState } from "react";
import { ChevronRightIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import Carousel from "./Carousal";
import { TradeInItemCondition } from "@components/utils/constants";
import { LoadingDots } from "@components/ui";
// Define the desired order matching your TradeInItemCondition values
const conditionOrder = [
  TradeInItemCondition.LIKE_NEW,
  TradeInItemCondition.EXCELLENT,
  TradeInItemCondition.VERY_GOOD,
  TradeInItemCondition.GOOD,
  TradeInItemCondition.WELL_USED,
  TradeInItemCondition.FAULTY,
];

export default function AddItems({ products, images, onChangeSearch, nextStep, setSelectedItems, selectedItems, isLoadingDots }: any) {
  const [items, setItems] = useState<any>([{ searchTerm: "", selectedProductData: "", selectedProduct: "", selectedProductImage: "", selectedProductPrice: "", selectedProductCurrency: "", selectedCondition: null, selectedAccessories: [] }]);
  const [isOpen, setOpen] = useState(false)
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const [conditionData, setConditionData] = useState<any>([])
  const setModalClose = () => {
    setOpen(false)
  }

  const setRightCondition = (data: any) => {
    setConditionData(data)
    setOpen(true)
  }

  useEffect(() => {
    if (selectedItems?.length > 0) {
      setItems(selectedItems);
    }
  }, [selectedItems]);

  const addNewItem = () => {
    setItems([...items, { searchTerm: "", selectedProductData: "", selectedProduct: "", selectedProductImage: "", selectedProductPrice: "", selectedProductCurrency: "", selectedCondition: 1, selectedAccessories: [] }]);
  };

  const updateItem = (index: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items?.filter((_: any, i: number) => i !== index);
    setItems(newItems);
  };

  const noProduct = [{ id: "455857b8-1b04-4961-b2ad-90125da7522c", stockCode: "DP000001", name: "Place Holder Product", categoryId: "c1d81a2c-dbbd-4f29-9af0-79a15bc8b791", image: "https://liveocxstorage.blob.core.windows.net/testpc/cms-media/home/no-image.svg", accessories: [], conditions: [], checklist: [] }]

  useEffect(() => {
    const valid = items.length > 0 && items.every((item: any) => {
      // Check that a product is selected
      if (!item.selectedProductData) return false;

      // If the product has conditions, ensure the user has explicitly selected one.
      if (item.selectedProductData.conditions && item.selectedProductData.conditions.length > 0) {
        // Check that selectedCondition is set and has a valid identifier.
        return item.selectedCondition && item.selectedCondition.conditionId;
      }
      // If no conditions are available, consider it valid.
      return true;
    });
    setIsNextDisabled(!valid);
  }, [items]);

  return (
    <>
      <div className='flex flex-col w-full gap-6 mt-4 sm:mt-5'>
        <div className='flex flex-col justify-center w-full mt-6 text-center sm:mt-8'>
          <h3 className='mb-1 text-xl font-semibold sm:text-3xl text-[#2d4d9c] sm:mb-1'>What would you like to sell?</h3>
          <h4 className='mb-4 font-medium text-black text-md sm:text-lg sm:mb-6'>Simply complete our form below and receive an instant quote.*</h4>
        </div>
      </div>
      {items?.map((item: any, index: number) => (
        <div key={index} className="flex flex-col gap-6 pb-6 border-b border-gray-200">
          <div className='relative flex flex-col justify-start w-full gap-2 text-left'>
            <label className='text-lg font-semibold text-[#2d4d9c]'>Item {index + 1}</label>
            <span className='text-sm font-normal text-black'>Tell us about your item</span>
            {/* Remove Button - Only for additional items */}
            {items.length > 1 && (
              <button onClick={() => removeItem(index)} className="absolute right-0 top-4"> <TrashIcon className="w-5 h-5 text-gray-600 hover:text-red-500" /> </button>
            )}
            <div className="relative flex flex-col w-full">
              <input
                type="text"
                value={item?.selectedProduct || item?.searchTerm || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  onChangeSearch(e, index);
                  updateItem(index, "searchTerm", value);
                  updateItem(index, "selectedProduct", ""); // Clear selected product if user starts typing again
                }}
                className="w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400"
                placeholder="Please search and Select Your Model"
              />

              {item?.searchTerm?.length > 2 && isLoadingDots && (
                <div className="absolute z-10 w-full p-2 text-center text-gray-500 bg-white border border-gray-300 shadow-lg top-12">
                  <LoadingDots />
                </div>
              )}

              {/* Show search results only when searchTerm > 2 characters & loading is done */}
              {item?.searchTerm?.length > 2 && !isLoadingDots && (() => {
                // Get all selected product IDs
                const selectedProductIds = items.map((i: any) => i?.selectedProductData?.id).filter(Boolean);

                // Filter products that are NOT already selected
                let filteredProducts = (products || []).filter((p: any) => p?.name?.toLowerCase().includes(item?.searchTerm?.toLowerCase()));
                
                // If no products are found, use the dummy product with searched text
                if (!products) {
                  filteredProducts = noProduct.map((dummy) => ({
                    ...dummy,
                    name: item?.searchTerm,
                  }));
                }

                return (
                  <ul className="absolute z-10 w-full overflow-y-auto bg-white border border-gray-300 divide-y divide-gray-200 shadow-lg top-12 max-h-60">
                    {filteredProducts?.map((product: any) => (
                      <li
                        key={product.id}
                        onClick={() => {
                          updateItem(index, "selectedProductData", product);
                          updateItem(index, "selectedProduct", product?.name);
                          updateItem(index, "selectedProductImage", product?.image);
                          updateItem(index, "selectedProductPrice", product?.stockCode);
                          updateItem(index, "selectedProductCurrency", product?.categoryId);
                          updateItem(index, "searchTerm", ""); // Clear the search term
                        }}
                        className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 justify-normal"
                      >
                        <img src={product?.image} className="w-auto h-7" alt={product?.name} />
                        <span>{product?.name}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
            {item?.selectedProductData?.conditions?.length > 0 && (
              <div className='flex flex-col justify-start w-full gap-2 mt-5 text-left sm:mt-3'>
                <label className='text-lg font-semibold sm:flex-row flex-col flex text-[#2d4d9c]'>
                  <span>Condition</span>
                  <span className='pl-1 text-sm font-normal underline cursor-pointer' onClick={() => setRightCondition(item?.selectedProductData?.conditions)} >
                    (Click here for help choosing the right condition)
                  </span>
                </label>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
                  {[...item?.selectedProductData?.conditions]?.sort((a, b) => conditionOrder.indexOf(a?.conditionName) - conditionOrder.indexOf(b?.conditionName))?.map((cn: any, cnIdx: number) => {
                    // If no condition is selected, set the first one as default
                    return (
                      <label key={cnIdx} className={`flex flex-col items-center justify-center w-full gap-4 p-4 text-center border rounded cursor-pointer transition ${item?.selectedCondition?.conditionId === cn?.conditionId ? 'bg-[#2d4d9c] text-white shadow-lg' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                        <input type='radio' name='condition' value={cn.conditionId} onChange={() => updateItem(index, 'selectedCondition', cn)} className='hidden' />
                        <h3 className={`font-semibold text-xl ${item?.selectedCondition?.conditionId === cn?.conditionId ? 'text-white' : 'text-black group-hover:text-[#2d4d9c]'}`}>
                          {cn?.conditionName === TradeInItemCondition.WELL_USED ? 'Well Used' : cn?.conditionName === TradeInItemCondition.GOOD ? 'Good' : cn?.conditionName === TradeInItemCondition.VERY_GOOD ? 'Very Good' : cn?.conditionName === TradeInItemCondition.EXCELLENT ? 'Excellent' : cn?.conditionName === TradeInItemCondition.LIKE_NEW ? 'Like New' : cn?.conditionName === TradeInItemCondition.FAULTY ? 'Faulty' : 'N/A'}
                        </h3>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' className={`w-12 h-auto transition ${item?.selectedCondition?.conditionId === cn?.conditionId ? 'fill-white' : 'fill-black group-hover:fill-[#2d4d9c]'}`}>
                          <path d='M220.6 121.2L271.1 96 448 96v96H333.2c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24H64V128H192c9.9 0 19.7-2.3 28.6-6.8zM0 128V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H271.1c-9.9 0-19.7 2.3-28.6 6.8L192 64H160V48c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z'></path>
                        </svg>
                        <p className={`font-normal text-[10px] leading-3 ${item?.selectedCondition?.conditionId === cn?.conditionId ? 'text-white' : 'text-black group-hover:text-[#2d4d9c]'}`}>
                          {cn?.conditionName === TradeInItemCondition.WELL_USED ? 'Your equipment will be showing significant signs of wear.' : cn?.conditionName === TradeInItemCondition.GOOD ? 'Equipment is showing more obvious signs of cosmetic wear.' : cn?.conditionName === TradeInItemCondition.VERY_GOOD ? 'Your item may have some cosmetic wear to the paintwork.' : cn?.conditionName === TradeInItemCondition.EXCELLENT ? 'The item may have some small cosmetic blemishes that lower its grade.' : cn?.conditionName === TradeInItemCondition.LIKE_NEW ? 'Your equipment is in the condition as if you have just bought it.' : cn?.conditionName === TradeInItemCondition.FAULTY ? 'Your equipment will be significant signs of wear and damage.' : 'N/A'}
                        </p>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {item?.selectedProductData?.accessories?.length > 0 &&
              <div className='flex flex-col justify-start w-full gap-2 mt-5 text-left sm:mt-3'>
                <label className='text-lg font-semibold text-[#2d4d9c]'>Accessories</label>
                <div className={`grid sm:grid-cols-3 grid-cols-2 gap-3`}>
                  {[...item?.selectedProductData?.accessories]
                    ?.sort((a, b) => a?.accessoryName?.localeCompare(b?.accessoryName))
                    .map((ac: any, acIdx: number) => (
                      <button key={acIdx} onClick={() => {
                        const newAccessories = item?.selectedAccessories?.includes(ac?.accessoryId)  // Change Name to ID
                          ? item?.selectedAccessories?.filter((id: string) => id !== ac?.accessoryId)  // Filter by ID instead of Name
                          : [...item?.selectedAccessories, ac?.accessoryId];  // Add ID to selectedAccessories
                        updateItem(index, "selectedAccessories", newAccessories);
                      }} className={`flex flex-col items-center group justify-center w-full gap-4 p-4 text-center border rounded cursor-pointer transition ${item?.selectedAccessories?.includes(ac?.accessoryId) ? "bg-[#2d4d9c] text-white shadow-lg" : "bg-white border-gray-200 hover:shadow-md"}`}>
                        <h3 className={`font-semibold text-xl ${item?.selectedAccessories?.includes(ac?.accessoryId) ? "text-white" : "text-black group-hover:text-[#2d4d9c]"}`}>{ac?.accessoryName}</h3>
                        {ac?.accessoryName == "Boxed" &&
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-12 h-auto fill-current">
                            <path d="M256 48c0-26.5 21.5-48 48-48H592c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H381.3c1.8-5 2.7-10.4 2.7-16V253.3c18.6-6.6 32-24.4 32-45.3V176c0-26.5-21.5-48-48-48H256V48zM571.3 347.3c6.2-6.2 6.2-16.4 0-22.6l-64-64c-6.2-6.2-16.4-6.2-22.6 0l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 310.6V432c0 8.8 7.2 16 16 16s16-7.2 16-16V310.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0zM0 176c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16V176zm352 80V480c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V256H352zM144 320c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H144z"></path>
                          </svg>
                        }
                        {ac?.accessoryName == "Battery" &&
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-12 h-auto fill-current">
                            <path d="M80 96c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32l96 0c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32h16c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64l16 0zm304 96c0-8.8-7.2-16-16-16s-16 7.2-16 16v32H320c-8.8 0-16 7.2-16 16s7.2 16 16 16h32v32c0 8.8 7.2 16 16 16s16-7.2 16-16V256h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H384V192zM80 240c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16z"></path>
                          </svg>
                        }
                        {ac?.accessoryName == "Charger" &&
                          <svg className="w-12 h-auto fill-current" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"><path d="M19,0H15a2.5,2.5,0,0,0-2.45,2H11A1.5,1.5,0,0,0,9.59,3H8A.5.5,0,0,0,8,4H9.5V7H8A.5.5,0,0,0,8,8H9.59A1.5,1.5,0,0,0,11,9h1.5v3.5A2.5,2.5,0,0,0,15,15h1.5v5a3,3,0,0,1-6,0V17a3,3,0,0,0-6,0H4a1.5,1.5,0,0,0-1.5,1.5v3A.5.5,0,0,0,3,22h.5v1.5A.5.5,0,0,0,4,24H6a.5.5,0,0,0,.5-.5V22H7a.5.5,0,0,0,.5-.5v-3A1.5,1.5,0,0,0,6,17H5.5a2,2,0,1,1,4,0v3a4,4,0,0,0,8,0V15H19a2.5,2.5,0,0,0,2.5-2.5V2.5A2.5,2.5,0,0,0,19,0ZM12.5,8H11a.5.5,0,0,1-.5-.5v-4A.5.5,0,0,1,11,3h1.5Zm-7,15h-1V22h1ZM6,18a.5.5,0,0,1,.5.5V21h-3V18.5A.5.5,0,0,1,4,18Zm14.5-5.5A1.5,1.5,0,0,1,19,14H15a1.5,1.5,0,0,1-1.5-1.5V2.5A1.5,1.5,0,0,1,15,1h4a1.5,1.5,0,0,1,1.5,1.5ZM17.65,4.15l-2,2a.5.5,0,0,0,.11.79L17,7.62,15.48,9.15a.5.5,0,1,0,.71.71l2-2a.5.5,0,0,0-.11-.79l-1.25-.68,1.53-1.53a.5.5,0,0,0-.71-.71Z"></path></svg>
                        }
                      </button>
                    ))}
                </div>
              </div>
            }
          </div>
        </div>
      ))}
      {/* Navigation Buttons */}
      <div className="flex flex-col gap-5 mt-2">
        {!isNextDisabled &&
          <button onClick={addNewItem} className="w-full px-4 py-3 text-[#2d4d9c] text-sm border border-[#2d4d9c] bg-white rounded disabled:bg-gray-300"> [+] Add another item</button>
        }
        <div className='flex flex-col w-full gap-1'>
          <button
            onClick={() => {
              if (!isNextDisabled) {
                setSelectedItems(items);
                nextStep();
                document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
              } else {
                alert("Please select a product and its condition (if required) before proceeding.");
              }
            }}
            disabled={isNextDisabled}
            className="w-full px-4 py-3 text-sm text-white bg-[#2d4d9c] justify-center flex items-center gap-1 rounded disabled:bg-gray-300"
          >
            Next add your details  <ChevronRightIcon className="w-5 h-5" />
          </button>
          <span className='text-xs font-normal text-left text-black'>*Some products require further attention. One of used specialists will update the quote within 2 working days.</span>
        </div>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden z-999" onClose={() => setModalClose()} >
          <div className="absolute inset-0 overflow-hidden z-999">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Dialog.Overlay className="w-full h-screen bg-black opacity-50" onClick={() => setModalClose()} />
            </Transition.Child>
            <div className="fixed inset-0 flex items-center justify-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
                <div className="w-screen max-w-xl p-6 min-w-[600px]">
                  <div className="flex flex-col h-full pt-4 pb-2 bg-white shadow-xl rounded-xl">
                    <div className="flex-1 px-4">
                      <div className="relative flex items-center justify-center py-2 mt-2 sm:px-0">
                        <button type="button" className="absolute -top-11 right-3 lg:top-2 lg:right-0 p-0.5 bg-gray-300 rounded-full" onClick={() => setModalClose()} >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                        <div className="flex flex-col justify-center w-full text-center">
                          <h2 className="mx-auto mt-0 text-2xl font-medium text-[#2d4d9c] sm:w-11/12">How to choose the right cosmetic condition?</h2>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <h5 className="text-sm font-normal text-center text-gray-600">Whether you buy, sell or trade in gear, choose from five cosmetic conditions.</h5>
                    </div>
                    <div className="relative flex flex-col w-full pt-4 pb-10 mt-10 mb-4 bg-[#f4f5f5]">
                      <div className="flex flex-col w-full">
                        <div className="relative flex px-4 -mb-14">
                          <Carousel images={images} conditionData={conditionData} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center w-full px-4 text-center">
                      <p className="text-sm font-normal text-center text-gray-600">Not sure which cosmetic condition to choose? Don’t worry - a product specialist will inspect your gear and confirm its cosmetic condition once it arrives at our Circular Commerce Center.</p>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div >
        </Dialog >
      </Transition.Root >
    </>
  )
}