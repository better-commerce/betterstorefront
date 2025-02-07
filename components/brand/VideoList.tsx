import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
export default function VideoList({ data, video }: any) {
  const [videoLink, videoUrl] = useState(video)
  const handleClick = (value: any) => () => {
    videoUrl(value)
    setIsOpen(true)
  }
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }
  return (
    <>
     {data &&
      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
        {data?.length > 0 &&
          data?.map((video: any, viid: number) => (
            <>
              {video?.videogallery_videolink ? (
                <>
                  <div className="relative w-full" key="viid">
                    <img
                      src={video?.videogallery_thumbnailimage}
                      alt="image"
                      className="object-cover object-center w-full h-full max-w-full"
                    />
                    {video?.videogallery_videolink != '' ? (
                      <>
                        <a
                          onClick={handleClick(video.videogallery_videolink)}
                          className="absolute cursor-pointer top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 play-icon-span"
                        >
                          <img
                            src="/assets/images/play-icon.svg"
                            alt="play-icon"
                            className='brand-image-width'
                          />
                        </a>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={closeModal}
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
                        <div className="fixed inset-0 bg-black bg-opacity-30" />
                      </Transition.Child>

                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-full h-full max-w-6xl p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl">
                              <>
                                <div className="flex justify-end">
                                  <XMarkIcon
                                    className="w-8 h-8 mb-5 text-white border border-white rounded-md cursor-pointer hover:text-orange-500 hover:border-orange-500"
                                    onClick={closeModal}
                                  ></XMarkIcon>
                                </div>
                                <div className="p-0 overflow-hidden text-left align-bottom transition-all transform bg-whiterounedshadow-xl sm:align-middle sm:max-w-auto md:max-h-screen sm:w-auto sm:p-0 mobile-video-open video-height">
                                  <iframe
                                    width="453.73"
                                    height="254.95"
                                    src={`${videoLink}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  />
                                </div>
                              </>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                </>
              ) : (
              <div>       
                {video?.videogallery_thumbnailimage ? (
                  <>
                    <Link href={video?.videogallery_imagelink}>
                      <img
                        src={video?.videogallery_thumbnailimage}
                        alt="image"
                        className="object-cover object-center w-full h-full max-w-full"
                      />
                    </Link>
                  </>
                ) : (
                  <></>
                )}
              </div>
              )}
            </>
          ))}
      </div>
      }
    </>
  )
}
