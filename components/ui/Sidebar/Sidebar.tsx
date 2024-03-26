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
      <div className="absolute inset-0 overflow-hidden z-99">
        <div className={s.backdrop} onClick={onClose} />
        <section className="fixed inset-y-0 right-0 z-20 flex max-w-full pl-10 outline-none">
          <div className="w-full h-full md:w-screen md:max-w-md">
            <div className="w-full h-full max-w-md" ref={contentRef}>{children}</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Sidebar
