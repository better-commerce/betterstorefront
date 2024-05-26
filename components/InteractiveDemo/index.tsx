import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import _, { groupBy } from 'lodash';
import config from './config.json'
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/outline';
import { matchStrings } from '@framework/utils/parse-util';
import { useUI } from '@components/ui';
import { useTranslation } from '@commerce/utils/use-translation';

declare const window: any

interface IWebsite {
  readonly name: string;
  readonly url: string;
  readonly features: IFeature[];
  readonly code: string;
}

interface IFeature {
  readonly name: string;
  readonly url: string;
}

export default function InteractiveDemoSideBar({ featureToggle }: any) {
  const router = useRouter();
  const translate = useTranslation()
  const { setOverlayLoaderState, hideOverlayLoaderState } = useUI()
  const websites = config?.websites || []
  const [selectedWebsite, setSelectedWebsite] = useState<IWebsite | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(undefined);
  const [featureGrouped, setFeatureGrouped] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  // Step 2: Create a function to toggle the state
  const toggleDiv = () => {
    setIsVisible(!isVisible);
  };
  const toggleAccordion = (index: any) => {
    setOpenIndex(index)
    if (openIndex == index) {
      setIsOpen(true);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (websites?.length) {
      const currentOrigin = window.location.origin
      const qs = new URL(window.location.href);
      if (qs.searchParams.size > 0) {
        //const storeCode = qs.searchParams.get('storecode');
        const urlCode = qs.searchParams.get('urlcode');

        //const store: any = websites.find(o => o.code === (storeCode || 'fashion'));
        const store: any = websites.find(o => o.url === currentOrigin);
        if (store) {
          const storeUrlCode = store?.code
          const feature = store?.features?.find((o: any) => o.urlCode === urlCode || storeUrlCode);
          setSelectedWebsite(store);

          const featureGroupedObj = groupBy(store?.features, 'group');
          setFeatureGrouped(featureGroupedObj);

          let accordionOpenIdx = 0;
          if (urlCode) {
            for (let i in featureGroupedObj) {
              const features = featureGroupedObj[i];
              if (features?.some((o: any) => o.urlCode === urlCode)) {
                break;
              }
              accordionOpenIdx += 1;
            }
          }
          toggleAccordion(accordionOpenIdx);

          setRouteOnFeatureChange({ store, feature });
        }
      } else {
        const store = websites[0];
        setSelectedWebsite(store);

        const featureGroupedObj = groupBy(store?.features, 'group');
        setFeatureGrouped(featureGroupedObj);

        toggleAccordion(0);
        setRouteOnFeatureChange({ store });
      }
    }
  }, [websites]);

  const setRouteOnFeatureChange = useCallback(({ feature, store }: any) => {
    const qs = new URLSearchParams();
    if (store && !feature) {
      qs.set('storecode', store?.code || 'fashion');
    } else {
      qs.set('storecode', store?.code || 'fashion');
      qs.set('urlcode', feature?.urlCode || 'home');
    }
    const newUrl = `${window.location.pathname}?${qs.toString()}`;
    window.history.replaceState(null, '', newUrl);
    return newUrl;
  }, []);

  const handleWebsiteChange = (e: any) => {
    const website = websites.find(w => w.name === e.target.value);
    if (website) {
      setOverlayLoaderState({ visible: true, message: translate('common.message.loaderLoadingText'), })
      window.location.href = `${website?.url}?demo=1`
      //setSelectedWebsite(website);
      //setRouteOnFeatureChange({ store: website });
    }
  };

  const handleFeatureClick = (feature: any) => {
    setRouteOnFeatureChange({ feature, store: selectedWebsite });
    setIsVisible(!isVisible);
    // Assuming you want to navigate to a different route based on feature URL without a full reload
    //router.push(`${feature?.url}?storecode=${selectedWebsite?.code}&urlcode=${feature?.urlCode}`, undefined, { shallow: true }).then(() => window.history.replaceState(null, '', newUrl));
    
    
    const currentOrigin = window.location.origin
    const targetUrl = new URL(feature?.url)
    if (matchStrings(currentOrigin, targetUrl.origin, true)) {
      let redirectUrl = `${targetUrl?.pathname}${targetUrl?.search}`
      if (!targetUrl?.search)
        redirectUrl = `${redirectUrl}?demo=1`
      else
      redirectUrl = `${redirectUrl}&demo=1`
      router.push(redirectUrl).then(() => setRouteOnFeatureChange({ feature, store: selectedWebsite }));
    } else {
      router.push(feature?.url).then(() => setRouteOnFeatureChange({ feature, store: selectedWebsite }));
    }
  };
  return (
    <>
      {featureToggle?.features?.enableDemoToggle &&
        <>
          <button onClick={toggleDiv} title="Enable Demo" className={isVisible ? 'btn btn-primary btn-fixed shadow-2xl demo-open-btn' : 'btn btn-primary btn-fixed shadow-2xl'}>
            {isVisible ? (
              <>
                Disable Demo <ChevronDoubleDownIcon className='w-6 h-6 ml-3 text-white' />
              </>
            ) : (
              <>
                Enable Demo <ChevronDoubleUpIcon className='w-6 h-6 ml-3 text-white' />
              </>
            )}

          </button>
          {isVisible &&
            <div className="demo-enable-section bg-blue-50" style={{ display: 'flex', height: '100%', zIndex: '99' }}>
              <div className='w-full' style={{ zIndex: '99' }}>
                <div className='flex items-center justify-between px-2 mb-3 border-b border-gray-200'>
                  <h2 className='px-3 py-2 font-semibold text-white text-md'>Websites
                  </h2>
                  <button onClick={toggleDiv}><XMarkIcon className='w-5 h-5 text-white'></XMarkIcon></button>
                </div>
                <div className='flex flex-col px-3 pb-3 mb-3 border-b border-gray-200'>
                  <select onChange={handleWebsiteChange} value={selectedWebsite?.name || ''} className='w-full p-2 text-sm font-medium text-black bg-white border border-gray-400 rounded-md'>
                    {websites.map(website => (
                      <option key={website.name} value={website.name}>{website.name}</option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col w-full custom-scroll min'>
                  {selectedWebsite && Object.keys(featureGrouped).map((group: any, index: number) => (
                    <div className="flex flex-col px-3 accordion-group" key={`accordion-${index}`}>
                      <button className="flex justify-between py-1 font-semibold text-left border-b border-gray-300 accordion-title title-sec-list text-md" onClick={() => toggleAccordion(index)}>
                        <span className='font-semibold text-md'>{group}</span>
                        <span>
                          {openIndex != index ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 font-bold">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                          )}
                        </span>
                      </button>
                      {openIndex == index && (
                        <div className="accordion-content max-demo-list">
                          <ul className='mt-2'>
                            {featureGrouped[group].map((item: any, index: number) => (
                              <li key={`content${index}`} className='mb-1 text-sm font-normal cursor-pointer hover:underline' onClick={() => handleFeatureClick(item)}>
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        </>
      }

    </>

  );
}
