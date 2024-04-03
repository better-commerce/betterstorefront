import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

function StoreDetails({ store }: any) {

  const getDirection = (lat: string, lng: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col w-full px-6 py-4 mb-4 border border-slate-200 bg-slate-100 rounded-2xl">
      <div className="flex flex-col pt-4">
        <Link href={`/store-locator/${store?.id}`} passHref>
          <h2 className="font-semibold leading-7 hover:text-sky-800 text-slate-800 dark:text-slate-500 font-20">
            {store?.name} Branch
          </h2>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 pb-4">
        <div className="sm:col-span-1">
          <div className="flex flex-col mb-2">
            <div className="flex gap-0 mt-2">
              <MapPinIcon className='h-4 w-4 mr-2' />
              <div dangerouslySetInnerHTML={{ __html: `${store?.address1}, ${store?.address2}` }} className="text-sm text-gray-700 sm:block" />
            </div>
          </div>
          <div className="flex mb-2">
            <PhoneIcon className='h-4 w-4 mr-2' />
            <span className="text-sm text-gray-700 sm:block dark:text-black">{store?.phoneNo}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <button
          type="button"
          className="text-xs px-[12px] py-[8px] w-[49%]  border-r-2 text-white bg-black border-2 border-black rounded-xl"
          onClick={() => {
            getDirection(store?.latitude, store?.longitude)
          }}
        >
          Get Directions
        </button>
        <Link
          href={`/store-locator/${store?.id}`}
          passHref
          className="text-[#251000a3] w-[49%] text-xs border-2 px-[12px] py-[8px] border-r-2 rounded-xl text-center"
        >
          Store Details
        </Link>
      </div>
    </div>
  )
}

export default StoreDetails
