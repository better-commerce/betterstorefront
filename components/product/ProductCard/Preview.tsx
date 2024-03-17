import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import ImageZoom from 'react-image-zooom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { useTranslation } from '@commerce/utils/use-translation';
interface Props {
  previewImg: any
  handlePreviewClose: any
}
// Define the Preview
const Preview: FC<React.PropsWithChildren<Props>> = ({ previewImg, handlePreviewClose }) => {
  const translate = useTranslation()
  return (
    <>
      <Transition.Root show={previewImg != undefined} as={Fragment}>
        <Dialog
          as="div"
          className="relative mt-4 z-999 top-4"
          onClose={handlePreviewClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handlePreviewClose}
            />
          </Transition.Child>

          <div className="fixed top-0 left-0 w-full overflow-y-auto z-9999">
            <div className="flex items-end justify-center h-screen min-h-screen p-4 mx-auto text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="relative px-4 pt-5 pb-4 mx-auto overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-2/6 sm:p-2">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="absolute p-2 text-gray-400 hover:text-gray-500 right-2 top-2 z-99"
                      onClick={handlePreviewClose}
                    >
                      <span className="sr-only">{translate('common.label.closePanelText')}</span>
                      <XMarkIcon
                        className="w-6 h-6 text-black"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="text-center">
                    {previewImg && (
                      <div key={previewImg.name + 'tab-panel'}>
                        <ImageZoom
                          src={previewImg || IMG_PLACEHOLDER}
                          alt={previewImg.name}
                          blurDataURL={
                            `${previewImg}?h=600&w=400&fm=webp` ||
                            IMG_PLACEHOLDER
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default Preview;
