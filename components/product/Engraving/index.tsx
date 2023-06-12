import { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  GENERAL_ADD_TO_BASKET,
  GENERAL_CLOSE,
  GENERAL_ENGRAVING,
  GENERAL_ENGRAVING_PERSONALIZE_BOTTLE,
  GENERAL_PERSONALISATION,
  GENERAL_PERSONALISATION_READONLY,
} from '@components/utils/textVariables'
import { ProductPersonaliser } from '../ProductPersonaliser'
import LoadingDots from '@components/ui/LoadingDots'
import { XMarkIcon } from '@heroicons/react/24/outline'
export default function Engraving({
  onClose = () => {},
  engravingPrice = '£5.99',
  show = false,
  handleToggleDialog,
  submitForm,
  product,
  isPersonalizeLoading,
  readOnly = false,
}: any) {
  const [data, setData] = useState<any>(null)

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
    <Dialog open={show} onClose={() => handleToggleDialog()} className="z-999">
      <div
        className="fixed inset-0 top-0 right-0"
        aria-hidden="true"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      />
      <div className="fixed inset-0 overflow-auto xsm:overflow-hidden">
        <div className="flex items-center justify-center min-h-full p-4 xsm:p-0 ">
          <Dialog.Panel>
            <div className="relative flex flex-col items-center max-w-full px-4 pb-8 overflow-hidden bg-white shadow-2xl pt-14 sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-xl">
              <Dialog.Title className="block py-2 transition cursor-pointer select-none">
                <XMarkIcon
                  onClick={() => handleToggleDialog()}
                  title="Close Panel"
                  className="absolute right-0 w-6 h-6 mr-6 text-gray-400 hover:text-gray-600"
                  aria-hidden="true"
                />
              </Dialog.Title>
              <ProductPersonaliser
                canvasWidth={280}
                canvasHeight={420}
                characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                maxTextLength={7}
                submitText={
                  isPersonalizeLoading ? <LoadingDots /> : GENERAL_ADD_TO_BASKET
                }
                onSubmit={onSubmit}
                readOnly={data?.readOnly}
                product={product}
                images={[]}
                engravingPrice={engravingPrice}
              />
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
