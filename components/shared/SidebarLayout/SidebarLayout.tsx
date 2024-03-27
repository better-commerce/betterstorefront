import React, { FC } from 'react'
import { Cross, ChevronLeft } from '@components//shared/icons'
import cn from 'classnames'
import s from './SidebarLayout.module.css'
import { useTranslation } from '@commerce/utils/use-translation'

type ComponentProps = { className?: string } & (
  | { handleClose: () => any; handleBack?: never }
  | { handleBack: () => any; handleClose?: never }
)

const SidebarLayout: FC<React.PropsWithChildren<ComponentProps>> = ({
  children,
  className,
  handleClose,
  handleBack,
}) => {
  const translate = useTranslation()
  return (
    <div className={cn(s.root, className)}>
      <header className={s.header}>
        {handleClose && (
          <button
            onClick={handleClose}
            aria-label="Close"
            className="flex items-center transition duration-150 ease-in-out hover:text-accent-5 focus:outline-none"
          >
            <Cross className="w-6 h-6 hover:text-accent-3" />
            <span className="ml-2 text-sm text-accent-7 ">{translate('common.label.closeText')}</span>
          </button>
        )}
        {handleBack && (
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="flex items-center transition duration-150 ease-in-out hover:text-accent-5 focus:outline-none"
          >
            <ChevronLeft className="w-6 h-6 hover:text-accent-3" />
            <span className="ml-2 text-xs text-accent-7">{translate('common.label.backText')}</span>
          </button>
        )}
      </header>
      <div className={s.container}>{children}</div>
    </div>
  )
}

export default SidebarLayout
