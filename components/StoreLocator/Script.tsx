// Package Imports
import Script from 'next/script'

const StoreLocatorScript = (props: any) => {
  const { onScriptReady }: any = props
  return (
    <>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA1v3pkeBrwwbC-0KPCK5Uuhn77iHg2AjY&libraries=places"
        strategy="lazyOnload"
        onReady={() => onScriptReady()}
      />
    </>
  )
}

export default StoreLocatorScript
