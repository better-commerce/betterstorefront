import React from 'react'
import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { resolve } from 'url'

interface ICategoryListProps {
  readonly data: any
  readonly heading: any
}

const CategoryList: React.FC<ICategoryListProps> = ({ data, heading }: ICategoryListProps) => {
  return (
    <>
      {data &&
        <section className="w-full">
          <div className="container-ffx">
            {heading?.length > 0 &&
              heading?.map((catheading: any, hid: number) => (
                <div className="flex justify-between w-full py-4" key={hid}>
                  <h4>{catheading?.categoryheading_heading}</h4>
                  {catheading?.categoryheading_buttonlink != '' ? (
                    <>
                      <Link
                        title={catheading?.categoryheading_buttonlink}
                        href={resolve("/", catheading?.categoryheading_buttonlink)}
                        passHref
                        legacyBehavior
                      >
                        <a className="font-semibold uppercase font-14 desk-width-200">
                          {catheading?.categoryheading_buttontext}
                        </a>
                      </Link>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {data?.length > 0 &&
                data?.map((category: any, catid: number) => (
                <div key={catid}>
                <Link
                  title={category?.categorylist_link}
                  href={resolve('/', category?.categorylist_link)}
                  passHref
                >
                  <div className="relative group cat-hover">
                    <div className="absolute top-0 left-0 right-0 w-full h-full bg-transparent hover-bg"></div>
                    {category?.categorylist_image != '' ? (
                      <>
                        <img
                          src={
                            generateUri(
                              category?.categorylist_image,
                              'fm=webp&h=200'
                            ) || IMG_PLACEHOLDER
                          }
                          className="object-cover object-center w-full max-height-211"
                          alt={category?.categorylist_buttontext}
                          width={240}
                          height={160}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="w-full text-center sm:absolute sm:top-2/4 sm:-translate-y-2/4 sm:left-2/4 sm:-translate-x-2/4">
                      {category?.categorylist_link != '' ? (
                        <>
                            <p className="uppercase btn-primary-white font-14 desk-width-200">
                              {category?.categorylist_buttontext}
                            </p>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </Link>
                </div>
                ))}
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default CategoryList