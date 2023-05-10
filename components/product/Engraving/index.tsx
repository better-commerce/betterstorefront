import { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { GENERAL_ADD_TO_BASKET, GENERAL_CLOSE, GENERAL_ENGRAVING, GENERAL_ENGRAVING_PERSONALIZE_BOTTLE, GENERAL_PERSONALISATION, GENERAL_PERSONALISATION_READONLY } from '@components/utils/textVariables'
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
  }, [product])

  useEffect(() => {
    if (readOnly) {
      setData((v: any) => ({
        ...v,
        readOnly: readOnly,
      }))
    }
  }, [readOnly])

  const onSubmit = (data: {
    message: string,
    imageUrl: string,
  }) => {
    submitForm({ line1: data })
  }

  return (
    <>
    <Dialog
      open={show}
      onClose={() => handleToggleDialog()}
      className="z-999"
    >
      {/* backdrop component */}
      <div
        className="fixed top-0 right-0 inset-0"
        aria-hidden="true"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />

      <div className="fixed inset-0 overflow-auto xsm:overflow-hidden">
        <div className="flex min-h-full items-center justify-center p-4 xsm:p-0 ">
          <Dialog.Panel>

            <div className='flex'>
              <div className="max-w-md relative flex flex-col items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-xl">
                <Dialog.Title className=''>
                  <span
                      onClick={() => handleToggleDialog()}
                      className='cursor-pointer block py-2 transition select-none'
                    >
                  <XMarkIcon className="w-6 h-6 absolute right-0 mr-6 text-gray-400 hover:text-gray-600" aria-hidden="true" />              
                  </span>
                </Dialog.Title>
                {/* <div className="text-gray-900">hello</div>  */}
                <section className="flex p-0 w-full flex-col">
                  { readOnly ? (
                    <div className="mt-6 flex flex-col mx-auto">
                      <p className="text-black text-4xl font-bold text-center">{GENERAL_PERSONALISATION_READONLY}</p>
                    </div>
                  )
                  : (
                  <div className="py-0 flex flex-col mx-auto">
                    <p className="text-black text-4xl font-bold mx-auto text-center">{GENERAL_PERSONALISATION}</p>
                    <span className="py-2 text-gray-500 text-md w-3/4 text-center m-auto">
                      {GENERAL_ENGRAVING_PERSONALIZE_BOTTLE} {engravingPrice}{' '}
                    </span>
                  </div>)}
                  <div className='w-full font-semibold mt-4'>

                   <ProductPersonaliser
                        canvasWidth={280}
                        canvasHeight={420}
                        colors={[
                          {
                            label: 'White',
                            value: '#FFFFFF',
                          },
                          {
                            label: 'Blue',
                            value: '#1166FF',
                          },
                          {
                            label: 'Magenta',
                            value: '#FF00FF',
                          },
                          {
                            label: 'Purple',
                            value: '#7851a9',
                          },
                        ]}
                        characters='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                        maxTextLength={7}
                        submitText={isPersonalizeLoading ? <LoadingDots /> : GENERAL_ADD_TO_BASKET}
                        onSubmit={onSubmit}
                        readOnly={data?.readOnly}
                        product={product}
                        images={[]} 
                        fonts={[]}                      
                    />


                  </div>
                  
                </section>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>

    </Dialog>

    {/* ///////////PREVIOUS//DESIGN/////////// */}

    {/* <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-999 inset-0 overflow-y-auto"
        onClose={() => onClose(false)}
      >
        <div
          className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style={{ fontSize: 0 }}
        > */}
          {/* <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child> */}

          {/* This element is to trick the browser into centering the modal contents. */}
          {/* <span
            className="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
            >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          > */}
            {/* <div className="custom-overlay flex flex-col text-base text-left transform transition w-full md:inline-block md:max-w-lg md:px-4 md:my-8 md:align-middle lg:max-w-xl"> */}
              {/* <div>
                <img src={product?.images[0].image}></img>
              </div> */}
              {/* <div className="w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-xl">
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  onClick={() => onClose(false)}
                >
                  <span className="sr-only">{GENERAL_CLOSE}</span>
                  <XMarkIcon className="h-6 w-6 text-black" aria-hidden="true" />
                </button> */}
                {/* <div className="text-gray-900">hello</div>  */}
                {/* <section className="flex p-0 w-full flex-col">
                  <div className="py-0 flex flex-col">
                    <h1 className="text-black text-xl font-bold">{GENERAL_ENGRAVING}</h1>
                    <span className="py-2 text-gray-500 text-md">
                      {GENERAL_ENGRAVING_PERSONALIZE_BOTTLE} {engravingPrice}{' '}
                    </span>
                  </div>
                  <Form submitForm={submitForm} />
                </section>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root> */}
    </>
  )
}
