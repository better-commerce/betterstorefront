import { FC, useEffect, useState } from 'react'
import { Logo } from '@components/ui'
import { useRouter } from 'next/router'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import FooterMenu from '../Footer/FooterMenu'
import SocialLinks from '../Footer/SocialLinks'
import Newsletter from '../Footer/Newsletter'
import { IExtraProps } from '../Layout/Layout'
import Script from 'next/script'
import { SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

interface Props {
  config: []
}

const Footer: FC<Props & IExtraProps> = ({
  config,
  deviceInfo,
}) => {
  const translate = useTranslation()
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
        className="px-4 py-8 pt-10 bg-gray-100 shadow-inner sm:px-6 md:px-6 sm:pt-16 sm:mt-2 bg-footer-color"
      >
        <h3 id="footer-heading" className="sr-only">
          {translate('label.footer.footerText')}
        </h3>
        <div className="container grid grid-cols-1 mx-auto sm:grid-cols-12 sm:gap-2">
          <div className="sm:col-span-4">
            <Logo />
            <div className="my-4 sm:col-span-12">
              <Newsletter />
            </div>
            <div className='hidden w-full my-4'>
              <SocialLinks />
            </div>
          </div>
          <div className="sm:col-span-8">
            <FooterMenu config={config} />
            {/* <div className='hidden w-full mt-4'>
              <SocialLinks />
            </div> */}
          </div>
          <div className="justify-center mt-10 text-center border-t border-white sm:col-span-12 sm:pt-6 sm:mt-10">
            <p className="my-4 font-semibold text-black sm:my-0 text-footer-clr ">
              &copy; {new Date().getFullYear()} {translate('label.footer.companyRightsText')}
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
