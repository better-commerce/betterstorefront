import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { IExtraProps } from '../Layout/Layout'

declare const window: any

interface Props {
  config: []
}
const FooterMenu: FC<Props> = ({ config }: any) => {
  const isProduction = process.env.NODE_ENV === 'production'
  const [renderState, setRenderState] = useState(isProduction)

  // update 'renderState' to check whether the component is rendered or not
  // used for removing hydration errors
  useEffect(() => {
    if (!isProduction) {
      setRenderState(true)
    }
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-2 py-0 pl-0 sm:gap-8 sm:grid-cols-1 sm:px-0 sm:py-6 sm:pt-0 lg:pl-4">
        {config?.length && (
          <>
            {config?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex md:flex-row flex-col gap-y-4 sm:gap-y-4"
              >
                {item?.navBlocks
                  ?.sort(
                    (
                      a: { displayOrder: number },
                      b: { displayOrder: number }
                    ) => (a.displayOrder > b.displayOrder ? 1 : -1)
                  )
                  .map(
                    (navBlock: any, fdx: number) =>
                      renderState && (
                        <div className="w-full" key={fdx}>
                          <h4 className="my-4 font-bold text-gray-900 sm:my-0 text-footer-clr">
                            {navBlock?.boxTitle}
                          </h4>
                          <ul role="list" className="mt-3 space-y-3">
                            <>
                              {navBlock?.contentBody != '' && (
                                <li
                                  className="text-sm font-medium text-gray-900 text-footer-clr f-footer-weight"
                                  key={`li${fdx}`}
                                  dangerouslySetInnerHTML={{
                                    __html: navBlock?.contentBody,
                                  }}
                                />
                              )}
                              {navBlock?.navItems != '' && (
                                <>
                                  {navBlock?.navItems?.map(
                                    (navItem: any, navItemIdx: number) => {
                                      return (
                                        <li
                                          key={navItemIdx + 'navItem'}
                                          className="text-sm font-medium text-gray-900 text-footer-clr f-footer-weight"
                                        >
                                          <Link
                                            passHref
                                            href={`/men/${navItem?.itemLink}`}
                                          >
                                            <a
                                              href={`/men/${navItem?.itemLink}`}
                                              className="text-xs"
                                            >
                                              {navItem?.caption}
                                            </a>
                                          </Link>
                                        </li>
                                      )
                                    }
                                  )}
                                </>
                              )}
                            </>
                          </ul>
                        </div>
                      )
                  )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
export default FooterMenu
