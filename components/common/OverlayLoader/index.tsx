// Base Imports
import React from 'react'

// Other Imports
import { useUI } from '@components/ui/context'

const OverlayLoader = () => {
  const { overlayLoaderState }: any = useUI()

  return (
    <>
      {overlayLoaderState?.visible && (
        <div className="overlay-panel">
          <div className="fixed top-0 right-0 z-50 flex items-center justify-center w-screen h-screen">
            <div className="m-auto">
              <div className="w-32 h-32 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              {overlayLoaderState?.message && (
                <div className="flex items-center">
                  <p className="text-white m-auto">
                    {overlayLoaderState?.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OverlayLoader
