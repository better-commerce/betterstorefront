import Loader from "@components/Loader";
import { useUI } from "@components/ui";
import { NEXT_ADDRESS, NEXT_TRADE_IN_UPDATE_SHIPPING_METHOD, NEXT_TRADE_IN_UPDATE_STORE_ADDRESS, TradeInItemCondition } from '@components/utils/constants';
import { NEXT_TRADE_IN_GET_QUOTE_BY_ID, NEXT_TRADE_IN_GET_SHIPPING_METHODS, NEXT_TRADE_IN_GET_STORES, NEXT_TRADE_IN_SAVE_ADDRESS, NEXT_TRADE_IN_USER_TOKEN } from "@components/utils/constants";
import { logError } from "@framework/utils/app-util";
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from "react";

export default function ShippingDetail({ shipping, isStore, setSelectedStore, showStores, nextSteps, showDpdStore, dpd, stores, setCurrentStep, quoteData, token, shippingData }: any) {
  const [selectedCameraStore, setSelectedCameraStore] = useState<any>(0);
  const { isGuestUser, user } = useUI()
  const [isLoading, setIsLoading] = useState(false);
  const [isSummary, setShowSummary] = useState(false);
  const [storeData, setStoreData] = useState<any>([])
  const [isStoreOpen, setStoreOpen] = useState<any>(0)
  const [addressData, setAddressData] = useState({ addressType: 2, street: "", street2: "", city: "", state: "", country: "", postcode: "" });
  const [userAddress, setUserAddress] = useState<any>([])
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>(null)
  const [selectedUserAddress, setSelectedUserAddress] = useState<any>(null);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddressData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitStoreDropOff = async () => {
    setIsLoading(true);
    const store = storeData?.value?.[selectedCameraStore];

    try {
      const response = await axios.post(NEXT_TRADE_IN_UPDATE_STORE_ADDRESS, {
        data: {
          id: quoteData?.value?.id,
          storeid: store?.id,
          token,
        }
      });

      if (response?.data?.isSuccess) {
        // Fetch updated quote only if the response is successful
        const responseNew = await axios.post(NEXT_TRADE_IN_GET_QUOTE_BY_ID, {
          data: { id: quoteData?.value?.id, token }
        });
        nextSteps(responseNew?.data);
      }
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false);
    }
  };


  const submitRequest = async (isStoreDropOff = false) => {
    setIsLoading(true);

    let requestBody;
    if (isStoreDropOff && selectedCameraStore !== null) {
      const selectedStore = storeData?.value?.[selectedCameraStore];
      requestBody = {
        addressType: 2, // For store drop-off
        street: selectedStore?.street || "-",
        street2: selectedStore?.street2 || "-",
        city: selectedStore?.city || "-",
        state: "-", // Assuming state info isn't provided
        country: selectedStore?.country || "",
        postcode: selectedStore?.postCode || "",
        id: quoteData?.value?.id,
        token: token
      };
    } else if (user.userId && selectedUserAddress !== null) {
      const address = userAddress[selectedUserAddress];
      requestBody = {
        addressType: 1,
        street: address?.address1 || "-",
        street2: address?.address2 || "-",
        city: address?.city || "-",
        state: address?.state || "-",
        country: address?.country || "",
        postcode: address?.postCode || "",
        id: quoteData?.value?.id,
        token: token
      };
    } else {
      requestBody = {
        ...addressData,
        addressType: 1, // For DPD collection
        id: quoteData?.value?.id,
        token: token
      };
    }

    try {
      // SAVE ADDRESS API CALL
      const response = await axios.post(NEXT_TRADE_IN_SAVE_ADDRESS, { data: requestBody })
      const shippingMethodResponse = await axios.post(NEXT_TRADE_IN_UPDATE_SHIPPING_METHOD, {
        data: {
          id: quoteData?.value?.id,
          token,
          shippingMethodId: selectedShippingMethod?.iId,
        }
      })

      // Fetch updated quote
      const responseNew = await axios.post(NEXT_TRADE_IN_GET_QUOTE_BY_ID, { data: { id: quoteData?.value?.id, token } });
      nextSteps(responseNew?.data);
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false);
    }
  };

  const selectShipping = async (method: any) => {
    setSelectedShippingMethod(method)
    setStoreOpen(method?.iId)
    if (method?.iId == 2) {
      const storeResult = await axios.post(NEXT_TRADE_IN_GET_STORES, { data: { token } })
      setStoreData(storeResult?.data)
    }
  }
  const id = user?.userId;
  const getAddress = async () => {
    setIsLoading(true)
    const response = await axios.post(NEXT_ADDRESS, {
      id,
    })
    if (response.data) {
      setIsLoading(false)
    }
    if (response) {
      setIsLoading(false)
    }
    setUserAddress(response.data)
    return response.data
  }

  useEffect(() => {
    getAddress()
  }, [])

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex justify-start flex-1 mt-6">
        <button onClick={() => setShowSummary(!isSummary)} className="px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300" >
          {isSummary ? "Hide Trade in summary" : "View Trade in summary"}
        </button>
      </div>

      {isSummary &&
        <div className='flex flex-col w-full overflow-hidden shadow ring-2 ring-sky-600 sm:rounded'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Trade in Product</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Quote Value</th>
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
                      {item?.condition != "" && <span className='text-xs text-left text-gray-600'><strong>Condition: </strong>{item?.condition == 1 ? TradeInItemCondition.WELL_USED : item?.condition == 2 ? TradeInItemCondition.GOOD : item?.condition == 3 ? TradeInItemCondition.LIKE_NEW : item?.condition == 4 ? TradeInItemCondition.VERY_GOOD : item?.condition == 5 ? TradeInItemCondition.EXCELLENT : ''}</span>}
                      {item?.accessories?.length > 0 &&
                        <span className='text-xs text-left text-gray-600'><strong>Accessories: </strong>
                          {item?.accessories?.map((acc: any, accId: number) => (
                            <span key={`accessories-${accId}`} className="pr-2">{acc?.name}</span>
                          ))}
                        </span>
                      }
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-right text-black whitespace-nowrap">
                    {"£"}{item?.price}
                  </td>
                  <td className={`whitespace-nowrap`}>
                    <span className={`${item?.status == "Accepted" ? 'bg-emerald-100 border-emerald-400 text-emerald-600' : 'bg-red-100 border-red-400 text-red-600'} px-2 py-1 text-xs border font-semibold whitespace-nowrap rounded`}>{item?.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-4 pl-6 text-xl font-semibold text-left text-black whitespace-nowrap">Quote Total</td>
                <td className="px-3 py-4 text-xl font-semibold text-right text-black whitespace-nowrap">
                  £{quoteData?.value?.grandTotal}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      }
      <div className='flex flex-col w-full'>
        <h3 className='text-lg font-normal text-left text-black'>Select from the following options to get your equipment to Park Cameras:</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {shippingData?.value?.map((ship: any, shipIdx: number) => (
          <div key={`condition-${shipIdx}`} className={`flex flex-col group w-full text-center border rounded cursor-pointer transition ${ship?.iId === isStoreOpen ? "bg-sky-100 border-[#2d4d9c] text-black shadow-lg" : "bg-white border-gray-300 hover:shadow-md"}`} onClick={() => selectShipping(ship)}>
            <h3 className={`rounded-t w-full font-medium py-3 text-md ${ship?.iId === isStoreOpen ? "bg-[#2d4d9c] text-white" : "bg-gray-200 text-black"}`} >
              {ship?.name}
            </h3>
            <img src={ship?.imageurl} className='object-cover w-full h-52' alt={ship?.name} />
            <p className={`font-normal text-sm text-left leading-3 px-4 pb-3 mt-4 ${ship?.iId === isStoreOpen ? "text-black" : "text-gray-600 group-hover:text-[#2d4d9c]"}`} >
              {ship?.description}
            </p>
          </div>
        ))}
      </div>
      {isStoreOpen == 1 &&
        <div className={`flex flex-col w-full gap-4 ${user?.userId ? ' sm:w-full' : ' sm:w-5/12'}`}>
          <div className='flex flex-col w-full gap-1 mt-4 mb-5'>
            <h4 className='text-xl font-medium text-left text-black'>Your Address</h4>
          </div>
          {user?.userId ? (
            <div className="grid grid-cols-3 gap-4 text-left">
              {userAddress?.length > 0 ? userAddress?.map((address: any, addIdx: number) => {
                const isSelected = selectedUserAddress === addIdx;
                return (
                  <div
                    className={`flex flex-col gap-2 p-4 border rounded cursor-pointer ${isSelected ? "bg-sky-100 border-[#2d4d9c]" : "border-gray-200 hover:border-gray-400"}`}
                    key={`address-${addIdx}`}
                    onClick={() => setSelectedUserAddress(addIdx)}
                  >
                    <p className="font-semibold text-black">{address?.firstName} {address?.lastName}</p>
                    <p>{address?.address1} {address?.address2}</p>
                    <p>{address?.address3}</p>
                    <p>{address?.city} {address?.state}</p>
                    <p>{address?.country} {address?.postCode}</p>
                  </div>
                );
              }) : (
                ["street", "street2", "city", "state", "country", "postcode"].map((field) => (
                  <div className="flex flex-col gap-1" key={`fields-${field}`}>
                    <label className="text-sm font-medium text-left text-black capitalize">{field}</label>
                    <input
                      type="text"
                      name={field}
                      placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                      value={addressData[field as keyof typeof addressData]}
                      onChange={handleInputChange}
                      className="p-2 text-sm font-normal text-black border border-gray-200 rounded"
                    />
                  </div>
                ))
              )}
            </div>
          ) : (
            ["street", "street2", "city", "state", "country", "postcode"].map((field) => (
              <div className="flex flex-col gap-1" key={`fields-${field}`}>
                <label className="text-sm font-medium text-left text-black capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                  value={addressData[field as keyof typeof addressData]}
                  onChange={handleInputChange}
                  className="p-2 text-sm font-normal text-black border border-gray-200 rounded"
                />
              </div>
            ))
          )}

          <button onClick={() => {
            submitRequest();
            document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }} className="w-full px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">
            Confirm collection from DPD
          </button>
        </div>
      }
      {isStoreOpen == 2 &&
        <>
          <div className='flex flex-col w-full gap-1 mt-4'>
            <h4 className='text-xl font-medium text-left text-black'>Where would you like to drop off your items?</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-2">
            {storeData?.value?.map((store: any, index: number) => {
              const isSelected = selectedCameraStore === index;
              return (
                <div key={index} className={`p-4 text-left border rounded shadow-lg cursor-pointer ${isSelected ? "border-blue-500 bg-gray-100 shadow-xl" : "bg-white"}`} onClick={() => setSelectedCameraStore(index)}>
                  <div className="flex items-center w-full gap-2 pb-1 mb-4 border-b border-gray-300">
                    <input type="radio" name="store" checked={isSelected} onChange={() => setSelectedCameraStore(index)} className="relative w-5 h-5 text-blue-500 focus:ring-blue-400" />
                    <h2 className="w-full text-xl font-semibold text-gray-700 uppercase">
                      {store?.name}
                    </h2>
                  </div>
                  {/* <img src={store?.image} alt={store?.name} className="w-full h-auto" /> */}
                  <div className="grid grid-cols-12 gap-1">
                    <div className='sm:col-span-6'>
                      <h2 className="mt-2 mb-4 text-sm font-semibold text-gray-700 uppercase">Address:</h2>
                      <p>{store?.name}</p>
                      <p>{store?.street}</p>
                      {store?.street2 && <p>{store?.street2}</p>}
                      <p>{store?.city}, {store?.country}, {store?.postCode}</p>
                      <p className="mt-4 mb-4 text-sm font-semibold text-gray-700 uppercase">Opening Hours:</p>
                      <div className="flex flex-col text-sm font-normal divide-x divide-gray-200" dangerouslySetInnerHTML={{ __html: store?.openingHours }}></div>
                    </div>
                    <div className='sm:col-span-6'>
                      <iframe frameBorder="0" height="450" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2513.3276813845987!2d-0.15801428409022267!3d50.95464555878721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48758dbeae99ba11%3A0xe18db3c1e0dfadb9!2sPark%20Cameras!5e0!3m2!1sen!2suk!4v1593620065303!5m2!1sen!2suk" width="100%"></iframe>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => {
            submitStoreDropOff(); // Pass true for store drop-off
            document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }} className="w-full px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">
            Confirm Drop off to Park Cameras Store
          </button>
        </>
      }
      {isStoreOpen == 3 &&
        <>
          <div className='flex flex-col w-full gap-1 mt-4'>
            <h4 className='text-xl font-medium text-left text-black'>DPD Store</h4>
            <p className='text-sm font-normal text-left text-gray-600'>You can drop your parcel off to any DPD store nationwide, please update below to find the most convenient one to you:</p>
            <div className='flex justify-start flex-1 w-full mt-2 sm:w-5/12'>
              <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Postcode' />
              <button className="px-10 py-3 text-sm text-white bg-[#39a029] rounded disabled:bg-gray-300" onClick={() => showStores()}>
                Find
              </button>
            </div>
          </div>
          {showDpdStore &&
            <>
              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
                {dpd.map((store: any, index: number) => (
                  <div key={index} className="p-4 text-left bg-white border rounded shadow-lg">
                    <h2 className="pb-1 mb-4 text-xl font-semibold text-gray-700 uppercase border-b border-gray-200">{store.name}</h2>
                    <h2 className="mb-2 text-sm font-semibold text-gray-700 uppercase">Store Detail:</h2>
                    <p className="text-gray-600">Distance: {store.distance}</p>
                    <p className="text-gray-600">Info: {store.info.join(", ")}</p>
                    <h2 className="mt-2 mb-4 text-sm font-semibold text-gray-700 uppercase">Address:</h2>
                    <p>{store.address.store}</p>
                    <p>{store.address.street}</p>
                    {store.address.area && <p>{store.address.area}</p>}
                    <p>{store.address.city}, {store.address.postcode}</p>
                    <p className="mt-4 mb-4 text-sm font-semibold text-gray-700 uppercase">Opening Hours:</p>
                    <ul className="text-sm text-gray-700 border border-gray-200 divide-y divide-gray-200">
                      {Object.entries(store.opening_hours).map(([day, hours]: any) => (
                        <li className='grid grid-cols-2 px-3 pt-2' key={day}><span className='text-sm font-semibold text-black uppercase'>{day}</span> <span>{hours}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                nextSteps();
                document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }} className="w-full px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">
                Confirm Drop off at DPD Store
              </button>
            </>
          }
        </>
      }
    </>
  )
}