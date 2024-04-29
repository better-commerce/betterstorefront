// Base Imports
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

// Component Imports
const Button = dynamic(() => import('@components/ui/IndigoButton'))

// Other Imports
import { useTranslation } from '@commerce/utils/use-translation'
import MapWithMarkers from '@components/ui/Map/MultiMarker'

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
            for (let i = 0; i < storeList.length; i++) {
                const marker: any = new window.google.maps.Marker({
                    position: {
                        lat: parseFloat(storeList[i]?.lat),
                        lng: parseFloat(storeList[i]?.lng),
                    },
                    map: map,
                    title: storeList[i]?.name + ' Branch',
                })
                bounds.extend(marker.getPosition())
            }
            map.fitBounds(bounds)
            const findZoom = isMobile ? 10 : 12
            if (map.getZoom() > findZoom) {
                map.setZoom(findZoom)
            }
        }
    }, [storeList, map, isMobile])

    return (
        <div className="flex flex-col text-lg max-h-96 overflow-y-auto scrollbar-hidden">
            <h4 className="font-semibold">Find in Store</h4>
            <hr className="h-1 my-4"></hr>
             {/* Product Detail Section */}
            <div className='flex flex-row p-4 gap-x-4'>
                <img src={product?.image} alt={product?.name} height={1200} width={1200} className='w-1/2 h-96'></img>
                <div className='flex flex-col justify-start gap-y-4 p-4 h-1/2 my-auto'>
                    <h4 className='font-semibold text-4xl leading-3'>{product?.name}</h4>
                    <span className='text-2xl font-semibold text-gray-700'>{product?.brand}</span>
                    <span className='font-normal text-gray-600 text-md'>{product?.shortDescription}</span>
                    <span className='font-semibold text-gray-700 text-md'>{product?.price?.formatted?.withTax}</span>
                    <Button className='!w-1/2' title={buttonConfig.title} action={() => buttonConfig.action()} buttonType={buttonConfig.type || 'cart'} />
                </div>
            </div>
            <div className="flex flex-row gap-x-10 my-2">
                {/* Google Map Section */}
                <div className="border box-border w-1/2">
                    {/* <MapWithMarkers locations={storeList} setMap={setMap} /> */}
                </div>
                {/* Store List Section */}
                <div className="w-1/2 overflow-y-auto">
                    <h4 className="font-semibold">Check Store Stock</h4>
                    <hr className="h-1 my-4"></hr>
                    {storeList?.map((store:any) => (
                        <div className="flex flex-row w-full gap-x-4 justify-between" key={store?.DeliveryCenterName}>
                            <p className="uppercase text-sm w-1/3">{store?.DeliveryCenterName}</p>
                            <p className="text-sm font-semibold uppercase text-gray-600">
                                {store?.Qty > 0 ? store?.Qty : 'label.basket.outOfStockText'}
                            </p>
                            <p className="text-sm text-gray-600">{Math.ceil(store?.DistanceInMiles)} mile</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StoreListSection