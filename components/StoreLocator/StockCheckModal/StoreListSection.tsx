// Base Imports
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

// Component Imports
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import MapWithMarkers from '@components/ui/Map/MultiMarker'

// Other Imports
import { useTranslation } from '@commerce/utils/use-translation'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'

const StoreListSection = ({
    product,
    storeList,
    buttonConfig,
    deviceInfo,
}: any) => {
    const [map, setMap] = useState<any>(null)
    const { isMobile } = deviceInfo;
    const translate = useTranslation();

    useEffect(() => {
        if (map && storeList?.length) {
            const bounds = new window.google.maps.LatLngBounds()
            for (let i = 0; i < storeList?.length; i++) {
                const marker: any = new window.google.maps.Marker({
                    position: {
                        lat: +(storeList[i]?.DeliveryCenterLatitude),
                        lng: +(storeList[i]?.DeliveryCenterLongitude),
                    },
                    map: map,
                    title: storeList[i]?.DeliveryCenterName + ' Branch',
                })
                bounds.extend(marker.getPosition())
            }
            map.fitBounds(bounds)
            const findZoom = isMobile ? 10 : 12
            if (map.getZoom() > findZoom) {
                map.setZoom(findZoom)
            }
        }
    }, [storeList, map])

    return (
        <div className="flex flex-col text-lg">
            <div className='flex flex-col p-4 border-b border-gray-200'>
                <h4 className="font-semibold">{translate('label.store.findInStoreText')}</h4>
            </div>
            <div className='flex flex-col w-full max-h-[70vh] overflow-y-auto overflow-x-hidden !custom-scroll p-4'>
                <div className='flex flex-col pb-6 mb-4 border-b sm:flex-row gap-x-4'>
                    <img src={generateUri(product?.image, 'h=500&fm-webp')|| IMG_PLACEHOLDER} alt={product?.name} height={1200} width={1200} className='w-full h-auto sm:w-1/5 rounded-xl'></img>
                    <div className='flex flex-col justify-start p-0 my-auto mt-2 gap-y-4 sm:mt-0 sm:p-4 h-1/2'>
                        <h4 className='text-xl font-semibold leading-3'>{product?.name}</h4>
                        <span className='text-2xl font-semibold text-gray-700'>{product?.brand}</span>
                        <span className='font-normal text-gray-600 text-md'>{product?.shortDescription}</span>
                        <span className='font-semibold text-gray-700 text-md'>{product?.price?.formatted?.withTax}</span>
                        <Button className='w-full sm:!w-1/2' title={buttonConfig.title} action={() => buttonConfig.action()} buttonType={buttonConfig.type || 'cart'} />
                    </div>
                </div>
                <div className="flex flex-col my-2 sm:flex-row gap-x-6">
                    {/* Google Map Section */}
                    <div className="w-full sm:w-1/2">
                        <MapWithMarkers locations={storeList} setMap={setMap} />
                    </div>
                    {/* Store List Section */}
                    <div className="w-full mx-2 mt-2 sm:w-1/2 sm:mt-0">
                        <h4 className="font-semibold">{translate('label.store.checkStoreStockText')}</h4>
                        <hr className="h-1 my-4"></hr>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="w-1/3 text-sm font-semibold text-gray-900 uppercase">{translate('label.store.storeNameText')}</th>
                                    <th className="text-sm font-semibold text-gray-900 uppercase">{translate('common.label.quantityText')}</th>
                                    <th className="text-sm font-semibold text-gray-900 uppercase">{translate('common.label.distanceText')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {storeList?.map((store: any) => (
                                    <tr key={store?.DeliveryCenterName}>
                                        <td className="py-2 text-sm text-center uppercase border border-gray-400">{store?.DeliveryCenterName}</td>
                                        <td className="py-2 text-sm text-center uppercase border border-gray-400"> {store?.Qty > 0 ? store?.Qty : translate('label.basket.outOfStockText')} </td>
                                        <td className="py-2 text-sm text-center border border-gray-400">{Math.ceil(store?.DistanceInMiles) <= 1 ? `${Math.ceil(store?.DistanceInMiles)} ${translate('common.label.mileText')}` : `${Math.ceil(store?.DistanceInMiles)} ${translate('common.label.milesText')}`} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreListSection