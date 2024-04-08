import { Fragment, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'

//
import LoadingDots from '@components/ui/LoadingDots'
import { Cookie } from '@framework/utils/constants'
import { stringToBoolean } from '@framework/utils/parse-util'

const UseMyLocationModal = ({
  isLocationDialog,
  setLocationDialog,
  getUserLocation,
  setLoadingDots,
  loadingDots,
  isErrorMsg,
  setErrorMsg,
  deviceInfo,
}: any) => {
  const { isMobile } = deviceInfo
  const disableUserLocationPopup = useMemo(() => stringToBoolean(Cookies.get(Cookie.Key.DISABLE_USER_LOCATION_POPUP)), [])

  if (disableUserLocationPopup) {
    return <></>
  }

  return (
    <Transition.Root show={isLocationDialog} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-99"
        onClose={() => {
          setLocationDialog(false)
          setErrorMsg(false)
        }}
      >
        <div className="fixed inset-0 left-0 bg-gray-600/0">
          <div className="fixed inset-0 overflow-hidden">
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ background: 'rgba(106, 52, 31, 0.4)' }}
            >
              <div
                className={`fixed ${
                  isMobile ? 'top-auto bottom-0' : 'inset-y-0'
                } right-0 flex max-w-full pl-0 pointer-events-none bottom-to-top sm:pl-0`}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-200 sm:duration-200"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  leave="transform transition ease-in-out duration-200 sm:duration-200"
                  leaveFrom="translate-y-0"
                  leaveTo="translate-y-full"
                >
                  <Dialog.Panel className="w-screen pointer-events-auto">
                    <div className="relative flex flex-col h-full shadow-xl bg-gray-900/20 z-99">
                      <div
                        className="w-full h-auto max-w-md shadow-xl mx-auto bg-white rounded-2xl center-fix-panel"
                        style={{
                          boxShadow: '0px -4px 4px 0px rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        <div className="sticky top-0 z-10 pt-[20px] pb-[16px] px-5  border-b border-gray-200 sm:px-6 left-1">
                          <div className="flex justify-between items-baseline">
                            <div>
                              <h3 className="text-base font-semibold text-black">
                                See Nearby Stores
                              </h3>
                              <h5 className="text-xs font-light text-primary">
                                We use your location to show you nearby stores
                              </h5>
                            </div>

                            <button
                              type="button"
                              className="mr-2 text-[#251000A3] rounded-md outline-none font-semibold text-xs"
                              onClick={() => {
                                setLocationDialog(false)
                                setErrorMsg(false)
                                Cookies.set(Cookie.Key.DISABLE_USER_LOCATION_POPUP, 'true')
                              }}
                            >
                              Skip
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center px-5  pt-[20px] pb-[28px]">
                          <button
                            type="button"
                            className="w-full mt-2 h-[55px] flex items-center justify-center gap-[5px] px-[20px] py-[18px] border-r-2 text-white bg-black border-2 border-black rounded-xl hover:bg-gray-800 hover:text-white hover:border-gray-900"
                            onClick={() => {
                              getUserLocation()
                              setLoadingDots('currentLocation')
                              Cookies.set(Cookie.Key.DISABLE_USER_LOCATION_POPUP, 'true')
                            }}
                          >
                            {' '}
                            {loadingDots == 'currentLocation' ? (
                              <LoadingDots />
                            ) : (
                              <>
                                <MapPinIcon className='h-4 w-4' />
                                Use my current location
                              </>
                            )}
                          </button>
                          {isErrorMsg ? (
                            <div
                              className="text-xs mt-2 w-full"
                              style={{ color: '#C10000' }}
                            >
                              Please Allow Location to see your nearest stores.
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default UseMyLocationModal