// Base Imports
import React from 'react'

// Component Imports
import Spinner from '@components/ui/Spinner'

const Loader = ({ backdropInvisible, message }: any) => {
  return (
    <div
      className={`${
        backdropInvisible ? 'overlay-panel-over-viewport' : 'overlay-panel'
      }`}
    >
      <div className="fixed top-0 right-0 z-50 flex items-center justify-center w-screen h-screen">
        <div className="m-auto">
          {backdropInvisible ? (
            <Spinner />
          ) : (
            <>
              <div className="w-32 h-32 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              {message && (
                <div className="flex items-center">
                  <p className="m-auto text-white">{message}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Loader
