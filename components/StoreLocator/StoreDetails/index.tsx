import { MapIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
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
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-1">
        <div className="sm:col-span-1">
          <div className="flex flex-col mb-2">
            <div className="flex gap-0 mt-2">
              <MapIcon className='w-4 h-4 mr-2' />
              <div dangerouslySetInnerHTML={{ __html: `${store?.address1}, ${store?.address2}` }} className="text-sm text-gray-700 sm:block" />
            </div>
          </div>
          <div className="flex mb-2">
            <MapPinIcon className='w-4 h-4 mr-2' />
            <span className="text-sm text-gray-700 sm:block dark:text-black">{store?.postCode}</span>
          </div>
          <div className="flex mb-2">
            <PhoneIcon className='w-4 h-4 mr-2' />
            <span className="text-sm text-gray-700 sm:block dark:text-black">{store?.phoneNo}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <button type="button" className="w-1/2 px-4 py-2 text-xs text-white bg-black border-2 border-r-2 border-black hover:bg-slate-800 rounded-xl" onClick={() => { getDirection(store?.latitude, store?.longitude) }} >
          Get Directions
        </button>
        <Link
          href={`/store-locator/${store?.id}`}
          passHref
          className="w-1/2 px-4 py-2 text-xs text-center text-black bg-white border hover:bg-slate-200 border-slate-400 rounded-xl"
        >
          Store Details
        </Link>
      </div>
    </div>
  )
}

export default StoreDetails
