import { useEffect, useState } from "react";
import ConditionCarousal from "./ConditionCarousal";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function AddItems({ products, conditions, accessories, nextStep, setSelectedItems, currentStep, steps, selectedItems, setCurrentStep }: any) {
  const [items, setItems] = useState<any>([{ searchTerm: "", selectedProduct: "", selectedProductImage: "", selectedProductPrice: "", selectedProductCurrency: "", selectedCondition: null, selectedAccessories: [] }]);

  useEffect(() => {
    // Pre-fill the form if selectedItems are provided
    if (selectedItems.length > 0) {
      setItems(selectedItems);
    }
  }, [selectedItems]);

  const addNewItem = () => {
    setItems([...items, { searchTerm: "", selectedProduct: "", selectedProductImage: "", selectedProductPrice: "", selectedProductCurrency: "", selectedCondition: null, selectedAccessories: [] }]);
  };

  const updateItem = (index: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };
  const removeItem = (index: number) => {
    const newItems = items.filter((_:any, i:number) => i !== index);
    setItems(newItems);
  };

  return (
    <>
      <div className='flex flex-col w-full gap-6 mt-4 sm:mt-5'>
        <div className='flex flex-col justify-center w-full mt-6 text-center sm:mt-8'>
          <h3 className='mb-1 text-xl font-semibold sm:text-3xl text-[#2d4d9c] sm:mb-1'>What would you like to sell?</h3>
          <h4 className='mb-4 font-medium text-black text-md sm:text-lg sm:mb-6'>Simply complete our form below and receive an instant quote.*</h4>
        </div>
      </div>
      {/* <div className="ceCSDL">
        <ConditionCarousal />
      </div> */}
      {items.map((item: any, index: number) => (
        <div key={index} className="flex flex-col gap-6 pb-6 border-b border-gray-200">
          <div className='relative flex flex-col justify-start w-full gap-2 text-left'>
            <label className='text-lg font-semibold text-[#2d4d9c]'>Item {index + 1}</label>
            <span className='text-sm font-normal text-black'>Tell us about your item</span>
            {/* Remove Button - Only for additional items */}
            {index > 0 && (
              <button
                onClick={() => removeItem(index)}
                className="absolute right-0 top-4">
                <TrashIcon className="w-5 h-5 text-gray-600 hover:text-red-500"/>
              </button>
            )}
            <div className="relative flex flex-col w-full">
              <input
                type='text'
                value={item.searchTerm || item.selectedProduct}  // Display search term first, fallback to selected product
                onChange={(e) => {
                  updateItem(index, "searchTerm", e.target.value);
                  updateItem(index, "selectedProduct", ""); // Clear selected product if user starts typing again
                }}
                className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400'
                placeholder='Please search and Select Your Model'
              />

              {products.filter((p: any) => p.product_name.toLowerCase().includes(item.searchTerm.toLowerCase())).length > 0 && item.searchTerm && (
                <ul className='absolute z-10 w-full overflow-y-auto bg-white border border-gray-300 divide-y divide-gray-200 shadow-lg top-12 max-h-60'>
                  {products.filter((p: any) => p.product_name.toLowerCase().includes(item.searchTerm.toLowerCase())).map((product: any) => (
                    <li
                      key={product.id}
                      onClick={() => {
                        updateItem(index, "selectedProduct", product.product_name);
                        updateItem(index, "selectedProductImage", product.image);
                        updateItem(index, "selectedProductPrice", product.price);
                        updateItem(index, "selectedProductCurrency", product.currency);
                        updateItem(index, "searchTerm", ""); // Clear the search term
                      }}
                      className='flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 justify-normal'
                    >
                      <span><img src={product.image} className="w-auto h-7" alt={product.product_name} /></span>
                      <span>{product.product_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className='flex flex-col justify-start w-full gap-2 text-left'>
            <label className='text-lg font-semibold text-[#2d4d9c]'>Condition</label>
            <div className="grid grid-cols-5 gap-3">
              {conditions?.map((cn: any, cnIdx: number) => (
                <button
                  key={cnIdx}
                  onClick={() => updateItem(index, "selectedCondition", cn)}  // Pass the condition itself (or its ID)
                  className={`flex flex-col items-center justify-center group w-full gap-4 p-4 text-center border rounded cursor-pointer transition 
                  ${item.selectedCondition?.id === cn.id ? "bg-[#2d4d9c] text-white shadow-lg" : "bg-white border-gray-200 hover:shadow-md"}`}
                >
                  <h3 className={`font-semibold text-xl ${item.selectedCondition?.id === cn.id ? "text-white" : "text-black group-hover:text-[#2d4d9c]"}`}>
                    {cn?.name}
                  </h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                    className={`w-12 h-auto transition ${item.selectedCondition?.id === cn.id ? "fill-white" : "fill-black group-hover:fill-[#2d4d9c]"}`}>
                    <path d="M220.6 121.2L271.1 96 448 96v96H333.2c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24H64V128H192c9.9 0 19.7-2.3 28.6-6.8zM0 128V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H271.1c-9.9 0-19.7 2.3-28.6 6.8L192 64H160V48c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"></path>
                  </svg>
                  <p className={`font-normal text-[10px] leading-3 ${item.selectedCondition?.id === cn.id ? "text-white" : "text-black group-hover:text-[#2d4d9c]"}`}>
                    {cn?.desc}
                  </p>
                </button>
              ))}

            </div>
          </div>


          <div className='flex flex-col justify-start w-full gap-2 text-left'>
            <label className='text-lg font-semibold text-[#2d4d9c]'>Accessories</label>
            <div className={`grid grid-cols-3 gap-3`}>
              {accessories.map((ac: any, acIdx: number) => (
                <button key={acIdx} onClick={() => {
                  const newAccessories = item.selectedAccessories.includes(ac.name)  // Change ID to name
                    ? item.selectedAccessories.filter((name: string) => name !== ac.name)  // Filter by name instead of ID
                    : [...item.selectedAccessories, ac.name];  // Add name to selectedAccessories
                  updateItem(index, "selectedAccessories", newAccessories);
                }} className={`flex flex-col items-center group justify-center w-full gap-4 p-4 text-center border rounded cursor-pointer transition ${item.selectedAccessories.includes(ac.name) ? "bg-[#2d4d9c] text-white shadow-lg" : "bg-white border-gray-200 hover:shadow-md"}`}>
                  <h3 className={`font-semibold text-xl ${item.selectedAccessories.includes(ac.name) ? "text-white" : "text-black group-hover:text-[#2d4d9c]"}`}>{ac.name}</h3>
                  {ac?.icon()}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
      {/* Navigation Buttons */}
      <div className="flex flex-col gap-5 mt-2">
        <button onClick={addNewItem} className="w-full px-4 py-3 text-[#2d4d9c] text-sm border border-[#2d4d9c] bg-white rounded disabled:bg-gray-300">
          [+] Add another item
        </button>
        <div className='flex flex-col w-full gap-1'>
          <button
            onClick={() => { setSelectedItems(items); nextStep(); }}
            disabled={items.length === 0 || currentStep === steps.length - 1}  // Disable if no items selected or on the last step
            className="w-full px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300"
          >
            Next add your details
          </button>

          <span className='text-xs font-normal text-left text-black'>*Some products require further attention. One of used specialists will update the quote within 2 working days.</span>
        </div>
      </div>
    </>
  )
}