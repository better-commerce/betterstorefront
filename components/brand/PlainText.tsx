import cn from 'classnames'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function PlainText({ textNames, heading }: any) {
  const [height, setHeight] = useState('h-[612px]')
  const [isExpandable, setIsExpandable] = useState(false)

  useEffect(() => {
    if (isExpandable) {
      setHeight('h-[120vh]')
    }
    if (!isExpandable) {
      setHeight('h-[306px] md:h-[612px]')
    }
  }, [isExpandable])

  return (
    <div
      className={`bg-[#F3EDE3] grid grid-cols-1 gap-5 md:grid-cols-2 ${height} p-10 sm:p-20`}
    >
      <div className="flex items-center sm:items-end py-0 sm:py-10">
        <p className="font-semibold text-[12px] md:text-[32px] leading-2 sm:leading-10 text-sm">
          {heading
            ? heading
            : 'The brand represents performance, innovation, andreliability, with a hard-earned reputation for quality and highlevels of durability.'}
        </p>
      </div>
      <div className="">
        <p>
          {textNames?.length > 0 &&
            textNames.map((val: any, index: number) => {
              return (
                <span
                  key={index}
                  className={cn(
                    'font-bold text-[10px] md:text-sm leading-1 sm:leading-4',
                    {
                      'font-semibold': index != 0,
                      'font-bold': index == 0,
                      'hidden sm:block': isExpandable == false,
                    }
                  )}
                >
                  {val}
                  <br></br>
                  <br></br>
                </span>
              )
            })}
        </p>
      </div>
      {!isExpandable ? (
        <div
          className="sm:hidden flex flex-col uppercase items-center font-bold gap-y-2"
          onClick={() => {
            setIsExpandable(true)
          }}
        >
          <span>Expand</span>
          <Image
            height={150}
            width={150}
            src="/brands/downArrow.svg"
            alt={'downArrow'}
            className="h-5 w-6"
          />
        </div>
      ) : (
        <div
          className="sm:hidden flex flex-col uppercase items-center font-bold gap-y-2"
          onClick={() => {
            setIsExpandable(false)
          }}
        >
          <span>Collapse</span>
          <Image
            height={50}
            width={50}
            src="/brands/downArrow.svg"
            alt={'downArrow'}
            className="h-5 w-6 rotate-180"
          />
        </div>
      )}
    </div>
  )
}
