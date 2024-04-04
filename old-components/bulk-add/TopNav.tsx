// Base Imports
import React, { memo } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

interface ITopNavProps {
  readonly b2bSettings: Array<{ key: string; value: string }>
  readonly onClick: any
}
const TopNav: React.FC<ITopNavProps> = (props: ITopNavProps) => {
  const translate = useTranslation()
  const { onClick } = props
  return (
    <div className="relative flow-root px-4 mr-4 text-left border-r border-gray-300">
      <button className="flex items-center justify-center gap-1 mx-auto text-center group icon-grp align-center" onClick={onClick} >
        <ShoppingBagIcon className="w-[16px] h-[16px] opacity-80" />
        <span className="flex flex-col py-0 text-xs font-medium text-black group-hover:text-primary sm:text-xs whitespace-nowrap">
          {translate('label.bulkAdd.quickOrderText')} </span>
      </button>
    </div>
  )
}
export default memo(TopNav)