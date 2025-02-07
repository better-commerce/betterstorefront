import React, { useEffect, RefObject } from 'react'
import { tabbable } from 'tabbable'

interface Props {
  children: React.ReactNode | any
  focusFirst?: boolean
}

export default function FocusTrap({ children, focusFirst = false }: Props) {
  const root: RefObject<any> = React.useRef()
  const anchor: RefObject<any> = React.useRef(document.activeElement)

  const returnFocus = () => {
    // Returns focus to the last focused element prior to trap.
    if (anchor) {
      anchor.current.focus()
    }
  }

    useEffect(() => {
    setTimeout(() => {
      // Focus the container element
      if (root.current) {
        root.current.focus()
      }
    }, 20)
    return () => {
      returnFocus()
    }
  }, [root, children, focusFirst])

  return React.createElement(
    'div',
    {
      ref: root,
      className: 'outline-none focus-trap',
      tabIndex: -1,
    },
    children
  )
}
