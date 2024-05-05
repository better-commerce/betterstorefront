import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import LoadingDots from '@components/ui/LoadingDots'
import { useTranslation } from '@commerce/utils/use-translation'
import { ProductPersonaliser } from '../ProductPersonaliser'
import ButtonClose from '@components/shared/ButtonClose/ButtonClose'
export default function Engraving({ engravingPrice = '5.99', show = false, handleToggleDialog, submitForm, product, isPersonalizeLoading, readOnly = false, isLoading }: any) {
  const [data, setData] = useState<any>(null)
  const translate = useTranslation();
  const getData = async () => {
    const productSlug = product.slug || product.link || null
    if (!productSlug) return
  }

  useEffect(() => {
    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  useEffect(() => {
    if (readOnly) {
      setData((v: any) => ({
        ...v,
        readOnly: readOnly,
      }))
    }
  }, [readOnly])

  const onSubmit = (data: { message: string; imageUrl: string }) => {
    submitForm({ line1: data })
  }

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 cart-z-index-9999" onClose={() => handleToggleDialog()} >
          <div className="flex items-stretch justify-center h-full text-center md:items-center md:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/70" />
            </Transition.Child>
            <span className="inline-block align-middle" aria-hidden="true"> &#8203; </span>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95" >
              <div className="relative inline-flex w-full max-w-7xl max-h-full xl:py-8 z-[99999]">
                <div className="flex flex-1 w-full max-h-full p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl lg:rounded-2xl dark:bg-neutral-900 dark:border dark:border-slate-700 dark:text-slate-100" >
                  <span className="absolute z-50 end-3 top-3">
                    <ButtonClose onClick={() => handleToggleDialog()} />
                  </span>

                  <div className="flex-1 overflow-y-auto rounded-xl hiddenScrollbar">
                    <ProductPersonaliser
                      canvasWidth={280}
                      canvasHeight={420}
                      characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                      maxTextLength={7}
                      submitText={isPersonalizeLoading ? <LoadingDots /> : translate('label.basket.addToBagText')}
                      onSubmit={onSubmit}
                      readOnly={data?.readOnly}
                      product={product}
                      images={[]}
                      engravingPrice={engravingPrice}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
