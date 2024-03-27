// Base Imports
import React from 'react'

// Other Imports
import { EmptyString } from '@components//utils/constants'
import { IOverlayLoaderState, useUI } from '@components//ui/context'
import Spinner from '@components//ui/Spinner'

const OverlayLoader = () => {
  const { overlayLoaderState }: any = useUI()
  const { visible = false, message = EmptyString, backdropInvisible = false, }: IOverlayLoaderState = overlayLoaderState

  return (
    <>
      {visible && (
        <div className={`${backdropInvisible ? "overlay-panel-over-viewport" : "overlay-panel"}`} >
          <div className="fixed top-0 right-0 z-50 flex items-center justify-center w-screen h-screen">
            <div className="m-auto">
              {
                backdropInvisible ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="w-32 h-32 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    {message && (
                      <div className="flex items-center">
                        <p className="text-white m-auto">
                          {message}
                        </p>
                      </div>
                    )}
                  </>
                )
              }
            </div>
          </div >
        </div >
      )}
    </>
  )
}

export default OverlayLoader
