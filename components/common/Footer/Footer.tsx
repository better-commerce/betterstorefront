import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import type { Page } from '@commerce/types/page'
import { Logo } from '@components/ui'
import config from './config'
import { useRouter } from 'next/router'
import {
  BTN_SIGN_UP,
  COPYRIGHT_FOOTER_INFO,
  GENERAL_EMAIL_ADDRESS,
  GENERAL_FOOOTER,
  SIGN_UP_FOR_NEWSLETTER,
  SIGN_UP_TEXT,
} from '@components/utils/textVariables'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import FooterMenu from '../Footer/FooterMenu'
import Newsletter from '../Footer/Newsletter'
import { IExtraProps } from '../Layout/Layout'
import Script from 'next/script'
import { SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'

interface Props {
  config: []
}

const Footer: FC<Props & IExtraProps> = ({
  config,
  deviceInfo,
  maxBasketItemsCount,
}) => {
  const router = useRouter()
  const [hasConfig, setHasConfig] = useState(false)
  const { isMobile, isIPadorTablet } = deviceInfo

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }

  useEffect(() => {
    setHasConfig(Boolean(config))
  }, [config])
  const handleRedirect = (path: string) => (path ? router.push(path) : {})

  function footerClick(detail: any) {
    let currentPage = getCurrentPage()
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'footer_query_click', {
          device: deviceCheck,
          page_clicked_on: currentPage,
          click_detail: detail,
        })
      }
    }
  }
  return (
    <>
      <footer
        aria-labelledby="footer-heading"
        className="px-4 py-8 pt-10 bg-gray-100 shadow-inner sm:px-0 sm:h-96 sm:pt-16 sm:mt-2 bg-footer-color"
      >
        <h3 id="footer-heading" className="sr-only">
          {GENERAL_FOOOTER}
        </h3>
        <div className="container grid grid-cols-1 mx-auto sm:grid-cols-12">
          <div className="sm:col-span-1">
            <Logo />
          </div>
          <div className="sm:col-span-6">
            <FooterMenu config={config}></FooterMenu>
          </div>
          <div className="sm:col-span-5">
            <Newsletter></Newsletter>
          </div>
          <div className="justify-center mt-10 text-center border-t border-white sm:col-span-12 sm:pt-6 sm:mt-10">
            <p className="my-4 font-semibold text-black sm:my-0 text-footer-clr ">
              &copy; {new Date().getFullYear()} {COPYRIGHT_FOOTER_INFO}
            </p>
          </div>
        </div>
      </footer>
      <Script
        type="application/ld+json"
        id="schema"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": ${SITE_NAME},
                "url": ${SITE_ORIGIN_URL},
                "logo": ${SITE_ORIGIN_URL}+"/assets/icons/logo.svg",
                "alternateName": ${SITE_NAME},
                "sameAs": [
                  "https://www.instagram.com/${SITE_NAME}/",
                  "https://www.facebook.com/${SITE_NAME}/",
                  "https://twitter.com/${SITE_NAME}?lang=en",
                  "https://www.linkedin.com/company/${SITE_NAME}"
                ],
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "telephone": "+911234567890",
                    "contactType": "",
                    "email": "support@${SITE_NAME}.com",
                    "areaServed": "IN",
                    "availableLanguage": "en"
                  }
                ]
              }
            `,
        }}
      />
      <Script
        type="application/ld+json"
        id="schema"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name":  ${SITE_NAME},
                "image": ${SITE_ORIGIN_URL}"/assets/icons/logo.svg",
                "@id":  ${SITE_ORIGIN_URL},
                "url": ${SITE_ORIGIN_URL},
                "telephone": "+91 1234567890",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "",
                  "addressLocality": "",
                  "postalCode": "",
                  "addressCountry": "+91",
                  "addressRegion": ""
                },
                "sameAs": [
                  "https://www.instagram.com/${SITE_NAME}/",
                  "https://www.facebook.com/${SITE_NAME}/",
                  "https://twitter.com/${SITE_NAME}?lang=en",
                  "https://www.linkedin.com/company/${SITE_NAME}"
                ],
              }
            `,
        }}
      />
    </>
  )
}

export default Footer
