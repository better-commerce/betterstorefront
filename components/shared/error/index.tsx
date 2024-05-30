import React from 'react'
import NextHead from 'next/head'
import axios from 'axios'
import { useTranslation } from 'next-i18next'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { NEXT_POST_LOGGER } from '@components/utils/constants'

interface IProps {
  readonly children: any
}

interface IState {
  readonly hasError: boolean
}

class ErrorBoundary extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
          {this.props.children}
        </ReactErrorBoundary>
      )
    }

    return this.props.children; 
  }
}

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

/*function ErrorBoundary({ children }: any) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {children}
    </ReactErrorBoundary>
  )
}*/

function ErrorFallback(props: any) {
  const { t } = useTranslation()
  const { error, resetErrorBoundary } = props
  return (
    <div role="alert">
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" id="canonical" href={`${process.env.SITE_ORIGIN_URL!}`} />
        <title>{t('common.label.siteNameText')}</title>
        <meta name="title" content="Bering" />
        <meta name="description" content="Bering" />
        <meta name="keywords" content="Bering" />
        <style>{`
        .startBubble-0-0-1 {
          display: none !important;
        }
      `}</style>
      </NextHead>
      <div className='h-96 flex items-center justify-center'>
        {
          process.env.NODE_ENV === 'production' ? (
            <p className='font-16 font-bold'>{t('common.message.requestCouldNotProcessErrorMsg')}</p>
          ) : (
            <div>
              <p className='font-16 font-bold'>{error?.message}</p>
              <p className='font-16 font-bold'>{error?.stack}</p>
            </div>
          )
        }

      </div>

      {/*<p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Retry</button>*/}
    </div>
  )
}

export default ErrorBoundary
