import React, { FC } from 'react'
import { Cross, ChevronLeft } from '@components/icons'
import cn from 'classnames'
import s from './SidebarLayout.module.css'
import { GENERAL_BACK, GENERAL_CLOSE } from '@components/utils/textVariables'

type ComponentProps = { className?: string } & (
  | { handleClose: () => any; handleBack?: never }
  | { handleBack: () => any; handleClose?: never }
)

const SidebarLayout: FC<ComponentProps> = ({
  children,
  className,
  handleClose,
  handleBack,
}) => {
  return (
    <div className={cn(s.root, className)}>
      <header className={s.header}>
        {handleClose && (
          <button
            onClick={handleClose}
            aria-label="Close"
            className="hover:text-accent-5 transition ease-in-out duration-150 flex items-center focus:outline-none"
          >
            <Cross className="h-6 w-6 hover:text-accent-3" />
            <span className="ml-2 text-accent-7 text-sm ">{GENERAL_CLOSE}</span>
          </button>
        )}
        {handleBack && (
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="hover:text-accent-5 transition ease-in-out duration-150 flex items-center focus:outline-none"
          >
            <ChevronLeft className="h-6 w-6 hover:text-accent-3" />
            <span className="ml-2 text-accent-7 text-xs">{GENERAL_BACK}</span>
          </button>
        )}
      </header>
      <div className={s.container}>{children}</div>
    </div>
  )
}

export default SidebarLayout
