'use client'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import axios from 'axios'

import { NEXT_POST_LOGGER } from '@components//utils/constants'

function ErrorBoundary({ children }: any) {
  const logError = async (error: Error) => {
    try {
      await axios.post(NEXT_POST_LOGGER, {
        data: {
          name: error.name,
          message: error.message,
        },
      })
    } catch (err) {
      // console.log(err)
    }
  }

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {children}
    </ReactErrorBoundary>
  )
}

function ErrorFallback(props: any) {
  const { error, resetErrorBoundary } = props
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  )
}

export default ErrorBoundary
