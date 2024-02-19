import { FC, useEffect, useRef } from 'react'
import s from './Sidebar.module.css'
import cn from 'classnames'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock'
import { IExtraProps } from '@components/common/Layout/Layout'

interface SidebarProps {
  children: any
  onClose: () => void
}

const Sidebar: FC<React.PropsWithChildren<SidebarProps & IExtraProps>> = ({
  children,
  onClose,
  deviceInfo,
  maxBasketItemsCount = 0,
}) => {
  const { isMobile, isIPadorTablet } = deviceInfo
  const sidebarRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const contentRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const onKeyDownSidebar = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    const contentElement = contentRef.current

    if (contentElement) {
      disableBodyScroll(contentElement, { reserveScrollBarGap: true })
    }

    return () => {
      if (contentElement) enableBodyScroll(contentElement)
      clearAllBodyScrollLocks()
    }
  }, [])

  return (
    <div
      className={cn(s.root)}
      ref={sidebarRef}
      onKeyDown={onKeyDownSidebar}
      tabIndex={1}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className={s.backdrop} onClick={onClose} />
        <section className="fixed inset-y-0 right-0 max-w-full flex outline-none pl-10">
          <div className="h-full w-full md:w-screen md:max-w-md">
            <div className="h-full w-full max-w-md" ref={contentRef}>{children}</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Sidebar
