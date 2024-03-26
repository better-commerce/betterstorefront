// Base Imports
import React, { useEffect, useState } from 'react'

// Component Imports
import { useUI } from '@new-components/ui'

// Other Imports
import { AlertType, CheckoutStep } from '@framework/utils/enums'
import { vatIncluded } from '@framework/utils/app-util'
import { eddDateFormat } from '@framework/utils/parse-util'
import { Guid } from '@commerce/types'
import FindStore from './FindStore'
import { useTranslation } from '@commerce/utils/use-translation'

interface ShippingMethod {
  id: string
  name: string
  description: string
  charge: number
}

interface DeliveryMethodSelectionProps {
  readonly basket: any
  readonly deliveryMethod: any
  onDeliveryMethodSelect: (method: ShippingMethod, store: any) => void
  onContinue: () => void
  goToStep: any
}

const DeliveryMethodSelection: React.FC<DeliveryMethodSelectionProps> = ({
  basket,
  deliveryMethod,
  onDeliveryMethodSelect,
  onContinue,
  goToStep = () => {}
}) => {
  const translate = useTranslation()
  const isIncludeVAT = vatIncluded()
  const { setAlert } = useUI()
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<any>(null)
  const [showFindStore, setShowFindStore] = useState<boolean>(false)
  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>()
  const [selectedShippingMethodId, setSelectedShippingMethodId] =
    useState<string>(basket?.shippingMethodId)

  const handleMethodSelection = (method: any) => {
    setSelectedShippingMethodId(method?.id)
    setSelectedShippingMethod(method)
  }

  const handleContinue = async () => {
    let isValid = false;
    let errorMessage = '';
  
    if (showFindStore) {
      isValid = selectedStore !== null;
      errorMessage = translate('common.message.selectStoreErrorMsg');
    } else {
      isValid =
        selectedShippingMethod?.type === 1 && selectedDeliveryMethod?.type === 1;
      errorMessage = translate('common.message.selectDeliveryToContinueErrorMsg');
    }
  
    if (isValid) {
      await onDeliveryMethodSelect(selectedShippingMethod, showFindStore ? selectedStore : null);
      onContinue();
    } else {
      setAlert({
        type: AlertType.ERROR,
        msg: errorMessage,
      });
    }
  }

  useEffect(() => {
    if(deliveryMethod){
      setSelectedDeliveryMethod(deliveryMethod)
    } else {
      goToStep(CheckoutStep.ADDRESS)
    }
  }, [deliveryMethod])

  useEffect(() => {
    if (basket?.shippingMethodId && basket?.shippingMethodId !== Guid.empty) {
      const selectedShippingMethod = basket?.shippingMethods?.find(
        (x: any) => x?.id === basket?.shippingMethodId
      )
      if (selectedShippingMethod) {
        setSelectedShippingMethodId(basket?.shippingMethodId)
        setSelectedShippingMethod(selectedShippingMethod)
      }
    }
  }, [basket])

  useEffect(()=>{
    const isDeliveryTypeCollect = 
    selectedDeliveryMethod?.type === 2 &&
    selectedDeliveryMethod?.children?.some((x:any) => x?.id === selectedShippingMethodId);

    setShowFindStore(isDeliveryTypeCollect);
  },[selectedShippingMethodId, selectedDeliveryMethod])

  const handleStoreSelection = (store:any) => {
  // handle selected store 
  setSelectedStore(store)
  }
  return (
    <>
      {selectedDeliveryMethod?.children?.length > 0 ? (
        <>
          <div className="flex flex-col gap-2 my-4 bg-white rounded-md sm:p-4 sm:border sm:border-gray-200 sm:bg-gray-50">
            <h5 className="font-semibold uppercase font-18 dark:text-black">{translate('label.checkout.deliveryText')}</h5>
            <div className="grid border border-gray-200 sm:border-0 rounded-md sm:rounded-none sm:p-0 p-2 grid-cols-1 mt-0 bg-[#fbfbfb] sm:bg-transparent sm:mt-4 gap-2">
              {selectedDeliveryMethod?.children?.map((method: any) => (
                <div key={method?.id} className={`${selectedShippingMethodId === method?.id ? 'bg-gray-200' : 'bg-white border-gray-200'} border flex sm:flex-row flex-col items-center sm:justify-between justify-start sm:p-4 p-2 cursor-pointer rounded`}
                  onClick={() => handleMethodSelection(method)}>
                  <div className="flex justify-start w-full gap-0 sm:gap-3">
                    <div className="check-panel">
                      <span className={`rounded-check rounded-full check-address ${selectedShippingMethodId === method.id ? 'bg-black border border-black' : 'bg-white border border-gray-600'}`}></span>
                    </div>
                    <div className="flex justify-between info-panel">
                      <span className="font-medium text-black">
                        <h4 className="my-0 text-sm dark:text-black text-wrap-p sm:text-xl">
                          {method?.id === basket?.shippingMethodId ? basket?.shippingMethods?.find((x: any) => x?.id === basket?.shippingMethodId)?.displayName : method?.displayName}{' '}
                        </h4>
                        <div dangerouslySetInnerHTML={{ __html: method?.description, }} className="my-0 font-12 dark:text-black" />
                        {basket?.estimatedDeliveryDate && (
                          <span className="block text-xs font-normal sm:text-sm text-wrap-p">
                            {translate('common.label.expectedDeliveryDateText')}:{' '}
                          <span className="font-bold">
                              {eddDateFormat(basket?.estimatedDeliveryDate)}{' '}
                            </span>
                          </span>
                        )}
                      </span>
                      <span className="flex justify-start font-bold text-black sm:justify-end">
                        {method?.id === basket?.shippingMethodId ? (
                          basket?.shippingCharge?.raw?.withTax == 0 ? translate('label.orderSummary.freeText') : isIncludeVAT ? basket?.shippingCharge?.formatted?.withTax : basket?.shippingCharge?.formatted?.withoutTax
                        ) : (
                          method?.price?.raw?.withTax == 0 ? translate('label.orderSummary.freeText') : isIncludeVAT ? method?.price?.formatted?.withTax : method?.price?.formatted?.withoutTax
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showFindStore && (
           <FindStore onStoreSelected={handleStoreSelection}/>
          )}
          <div className="grid flex-col w-full sm:justify-end sm:flex-row sm:flex sm:w-auto">
            <button
              className="px-1 py-3 mb-4 border border-black btn-primary lg:py-2 sm:px-4"
              onClick={handleContinue}
              disabled={!selectedShippingMethodId}
            >
              {translate('label.checkout.continueToPaymentText')}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='flex flex-col w-full'>
            <span className='font-medium text-gray-400'>{translate('label.checkout.noDeliveryMethodAvailableText')}</span>
          </div>
        </>
      )}
    </>
  )
}

export default DeliveryMethodSelection
