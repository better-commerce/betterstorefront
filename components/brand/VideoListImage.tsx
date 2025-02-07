import React, { Fragment, useState } from 'react'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface IVideoListImageProps {
  readonly data: any
}

const VideoListImage: React.FC<IVideoListImageProps> = ({ data }: IVideoListImageProps) => {
  const [videoLink, videoUrl] = useState()
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
      {data?.length > 0 && (
        <section className="container-ffx">
          <div className={`grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mb-10 mt-5`}>
            {data?.length > 0 &&
              data?.map((video: any, viid: number) => (
                <>
                  {video?.imagevideolist_videolink ? (
                    <>
                      <div className="relative w-full mt-3" key={viid}>
                        <img
                          src={video?.imagevideolist_videoimage}
                          alt="image"
                          className="object-cover w-full h-full max-w-full"
                        />
                        <a
                          onClick={handleClick(
                            video?.imagevideolist_videolink
                          )}
                          className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 play-icon-span"
                        >
                          <img
                            src="/assets/images/play-icon.svg"
                            alt="play-icon"
                            className='brand-image-width'
                          />
                        </a>
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
                            <div className="fixed inset-0 bg-black bg-opacity-60" />
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
                                <Dialog.Panel className="w-full max-w-6xl p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl">
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
                    <div
                      className={`mt-2 ${viid == 1 ? 'mr-0 lg:mr-2' : ''} ${viid == 2 ? 'ml-0 lg:ml-2' : ''
                        }`}
                    >
                      {video?.imagevideolist_imagelink != '' ? (
                        <>
                          <Link href={video?.imagevideolist_imagelink}>
                            <img
                              src={video?.imagevideolist_image}
                              alt="image"
                              className="object-cover w-full h-full max-w-full"
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
        </section>
      )}
    </>
  )
}

export default VideoListImage