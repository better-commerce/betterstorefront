import cn from 'classnames'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'

export default function PlainText({ textNames, heading }: any) {
  const [height, setHeight] = useState('min-h-[212px]')
  const [isExpandable, setIsExpandable] = useState(false)
  const translate = useTranslation()
  useEffect(() => {
    if (isExpandable) {
      setHeight('min-h-[120vh]')
    }
    if (!isExpandable) {
      setHeight('min-h-[106px] md:h-auto')
    }
  }, [isExpandable])

  return (
    <div className={`bg-[#F3F3F3] grid grid-cols-1 gap-5 md:grid-cols-2 ${height} p-10 sm:p-20`} >
      <div className="flex items-center py-0 sm:items-start">
        <h4 className="font-semibold text-[12px] text-[#212530] md:text-[32px] leading-2 sm:leading-10 text-sm">
          {heading ? heading : translate('label.brand.brandHeadingText')}
        </h4>
      </div>
      <div className="">
        {textNames?.length > 0 && textNames.map((val: any, index: number) => (
          <span key={index} className={cn('font-medium text-[10px] text-[#212530] md:text-sm leading-1 sm:leading-4', { 'font-semibold': index != 0, 'font-medium': index == 0, 'hidden sm:block': isExpandable == false, })} >
            {val}
          </span>
        ))}
      </div>
      {!isExpandable ? (
        <div className="flex flex-col items-center font-bold uppercase sm:hidden gap-y-2" onClick={() => { setIsExpandable(true) }} >
          <span className="text-[#212530]"> {translate('common.label.expandText')}</span>
          <img height={150} width={150} src="/brands/downArrow.svg" alt={'downArrow'} className="w-6 h-5" />
        </div>
      ) : (
        <div className="flex flex-col items-center font-bold uppercase sm:hidden gap-y-2" onClick={() => { setIsExpandable(false) }} >
          <span className="text-[#212530]">{translate('common.label.expandText')}</span>
          <img height={50} width={50} src="/brands/downArrow.svg" alt={'downArrow'} className="w-6 h-5 rotate-180" />
        </div>
      )}
    </div>
  )
}
