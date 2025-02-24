import { useState } from "react";

export default function ShippingDetail({ shipping, isStore, setSelectedStore, showStores, showDpdStore, dpd, nextStep, stores }: any) {
  const [selectedCameraStore, setSelectedCameraStore] = useState<any>(null);
  return (
    <>
      <div className='flex justify-start flex-1 mt-6'>
        <button className="px-4 py-3 text-sm text-white bg-[#2d4d9c] rounded disabled:bg-gray-300" >
          View Trade in summary
        </button>
      </div>
      <div className='flex flex-col w-full'>
        <h3 className='text-lg font-normal text-left text-black'>Select from the following options to get your equipment to Park Cameras:</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {shipping?.map((ship: any, shipIdx: number) => (
          <div key={`condition-${shipIdx}`} className={`flex flex-col group w-full px-4 py-4 text-center border rounded cursor-pointer transition ${ship?.id === isStore ? "bg-gray-200 text-black shadow-lg" : "bg-white border-gray-200 hover:shadow-md"}`} onClick={() => setSelectedStore(ship?.id)} >
            <h3 className={`font-semibold bg-[#2d4d9c] w-full py-3 text-xl ${ship?.id === isStore ? "text-white" : "text-white"}`} >
              {ship?.name}
            </h3>
            <img src={ship?.image} className='object-cover w-full h-52' alt={ship?.name} />
            <p className={`font-normal text-sm text-left leading-3 mt-4 ${ship?.id === isStore ? "text-black" : "text-gray-600 group-hover:text-[#2d4d9c]"}`} >
              {ship?.desc}
            </p>
          </div>
        ))}
      </div>

      {isStore == "1" &&
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
                nextStep();
                document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }} className="px-10 py-3 w-full text-sm text-white bg-[#39a029] rounded disabled:bg-gray-300">
                Confirm Drop off at DPD Store
              </button>
            </>
          }
        </>
      }
      {isStore == "2" &&
        <div className='flex flex-col w-full gap-4 sm:w-5/12'>
          <div className='flex flex-col w-full gap-1 mt-4 mb-5'>
            <h4 className='text-xl font-medium text-left text-black'>Your Address</h4>
          </div>
          <div className='flex flex-col justify-start w-full gap-1 text-left'>
            <span className='text-sm font-normal text-black'>House No/Name</span>
            <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Please search and Select Your Model' />
          </div>
          <div className='flex flex-col justify-start w-full gap-1 text-left'>
            <span className='text-sm font-normal text-black'>Street</span>
            <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Please search and Select Your Model' />
          </div>
          <div className='flex flex-col justify-start w-full gap-1 text-left'>
            <span className='text-sm font-normal text-black'>Town</span>
            <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Please search and Select Your Model' />
          </div>
          <div className='flex flex-col justify-start w-full gap-1 text-left'>
            <span className='text-sm font-normal text-black'>Postcode</span>
            <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Please search and Select Your Model' />
          </div>
          <div className='flex flex-col justify-start w-full gap-1 text-left'>
            <span className='text-sm font-normal text-black'>Collection/Drop-off date</span>
            <input type='text' value="" className='w-full px-2 py-3 text-sm font-normal text-black bg-white border border-gray-200 placeholder:text-gray-400' placeholder='Please search and Select Your Model' />
          </div>
          <button onClick={() => {
            nextStep();
            document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }} className="px-10 py-3 mt-4 w-full text-sm text-white bg-[#39a029] rounded disabled:bg-gray-300">
            Confirm collection from DPD
          </button>
        </div>
      }
      {isStore == "3" &&
        <>
          <div className='flex flex-col w-full gap-1 mt-4'>
            <h4 className='text-xl font-medium text-left text-black'>Where would you like to drop off your items?</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-2">
            {stores.map((store: any, index: number) => {
              const isSelected = selectedCameraStore === index;
              return (
                <div
                  key={index}
                  className={`p-4 text-left border rounded shadow-lg cursor-pointer ${isSelected ? "border-blue-500 bg-gray-100 shadow-xl" : "bg-white"}`}
                  onClick={() => setSelectedCameraStore(index)}
                >
                  <div className="flex items-center w-full gap-2 pb-1 mb-4 border-b border-gray-300">
                    <input
                      type="radio"
                      name="store"
                      checked={isSelected}
                      onChange={() => setSelectedCameraStore(index)}
                      className="relative w-5 h-5 text-blue-500 focus:ring-blue-400"
                    />
                    <h2 className="w-full text-xl font-semibold text-gray-700 uppercase">
                      {store?.name}
                    </h2>
                  </div>
                  <img src={store?.image} alt={store?.name} className="w-full h-auto" />
                  <div className="grid grid-cols-12 gap-1">
                    <div className='sm:col-span-6'>
                      <h2 className="mt-2 mb-4 text-sm font-semibold text-gray-700 uppercase">Address:</h2>
                      <p>{store?.address?.store}</p>
                      <p>{store?.address?.street}</p>
                      {store?.address?.area && <p>{store?.address?.area}</p>}
                      <p>{store?.address?.city}, {store?.address?.postcode}</p>
                      <p className="mt-4 mb-4 text-sm font-semibold text-gray-700 uppercase">Opening Hours:</p>
                      <ul className="text-sm text-gray-700 border border-gray-200 divide-y divide-gray-200">
                        {Object.entries(store?.opening_hours).map(([day, hours]: any) => (
                          <li className='grid grid-cols-2 px-3 pt-2' key={day}>
                            <span className='text-sm font-semibold text-black uppercase'>{day}</span>
                            <span>{hours}</span>
                          </li>
                        ))}
                      </ul>
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
            nextStep();
            document.getElementById("step-component")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }} className="px-10 py-3 w-full text-sm text-white bg-[#39a029] rounded disabled:bg-gray-300">
            Confirm Drop off to Park Cameras Store
          </button>
        </>
      }
    </>
  )
}