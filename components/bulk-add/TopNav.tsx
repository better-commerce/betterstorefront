// Base Imports
import React, { memo } from 'react'

// Package Imports
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'

// Other Imports
import { GENERAL_BULK_ORDER_PAD } from '@components/utils/textVariables'

interface ITopNavProps {
  readonly b2bSettings: Array<{ key: string; value: string }>
  readonly onClick: any
}

const TopNav: React.FC<ITopNavProps> = (props: ITopNavProps) => {
  const { b2bSettings, onClick } = props

  return (
    <div className="relative flow-root px-4 mr-4 text-left border-r border-gray-600 -top-0.5">
      <button
        className="flex items-center justify-center mx-auto text-center group icon-grp align-center"
        onClick={onClick}
      >
        <DocumentDuplicateIcon
          className="flex-shrink-0 w-5 h-5 mx-auto text-black group-hover:text-orange-600"
          aria-hidden="true"
          aria-label="Bulk Add"
        />
        <span className="flex flex-col py-0 text-xs font-medium text-black group-hover:text-orange-600 sm:text-xs whitespace-nowrap">
          QuickOrder
        </span>
      </button>
    </div>
  )
}

export default memo(TopNav)
