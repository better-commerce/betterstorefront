export default function PostgreDetail({ data }: any) {
  return (
    <>
      <div className='flex flex-col w-full gap-6 mt-4 sm:mt-5'>
        <div className='flex flex-col justify-center w-full gap-4 mt-6 text-center sm:mt-8'>
          <h3 className="px-4 py-3 text-xl w-full text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">That's it, all the hard work is done!</h3>
          <h3 className="px-4 py-3 text-xl w-full text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">Your Quote Reference Number: UQ623925</h3>
          <h3 className="px-4 py-3 text-xl w-full text-white bg-[#2d4d9c] rounded disabled:bg-gray-300">View Trade-in Summary</h3>
        </div>
        <div className='flex flex-col justify-start w-full gap-4 mt-4 text-left'>
          <p className='text-sm font-normal text-black'>Thank you for choosing to visit Park Cameras Burgess Hill to complete your trade-in. We look forward to seeing you. Our friendly in-store staff will be happy to guide you through the trade-in process whilst answering any other questions you may have regarding photographic equipment.</p>
          <p className='text-sm font-normal text-black'>To ensure your trade-in continues to move forward smoothly, please can you either print out the packing slip below or download to your phone so the in-store team can pick up the trade-in from the correct point.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-1 lg:grid-cols-1">
        {data.slice(0, 1).map((store: any, index: number) => {
          return (
            <div key={index} className={`p-4 text-left border rounded-lg shadow-lg cursor-pointer bg-white`} >
              <div className="flex items-center w-full gap-2 pb-1 mb-4 border-b border-gray-300">
                <h2 className="w-full text-xl font-semibold text-gray-700 uppercase">
                  {store?.name}
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <div className='sm:col-span-5'>
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
                <div className='sm:col-span-7'>
                  <iframe frameBorder="0" height="450" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2513.3276813845987!2d-0.15801428409022267!3d50.95464555878721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48758dbeae99ba11%3A0xe18db3c1e0dfadb9!2sPark%20Cameras!5e0!3m2!1sen!2suk!4v1593620065303!5m2!1sen!2suk" width="100%"></iframe>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex flex-col justify-start w-full gap-4 mt-4 text-left'>
        <p className='text-sm font-normal text-black'>If in the meantime you decide that you would rather a collections be organised please call us on 01444 237070 or email us at sales@parkcameras.com and someone will be willing to help you change the shipping method.</p>
        <p className='text-sm font-normal text-black'>Before coming into store, why not check out our extensive range of camera gear.</p>
      </div>
    </>
  )
}