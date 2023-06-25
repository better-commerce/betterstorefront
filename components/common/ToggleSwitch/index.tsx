// Base Imports
import React, { useEffect, useRef, useState } from 'react'

// Package Imports
import ReactSwitch from 'react-switch'

interface IToggleSwitchProps {
  readonly className?: string
  readonly checked: boolean
  readonly checkedIcon: any
  readonly uncheckedIcon: any
  readonly width: number
  readonly height: number
  onToggleChanged(value: boolean): void
}

const ToggleSwitch = ({
  className = '',
  checked,
  width,
  height,
  checkedIcon = <></>,
  uncheckedIcon = <></>,
  onToggleChanged,
}: IToggleSwitchProps) => {
  const ref: any = useRef<ReactSwitch>(null)

  const handleChange = (val: boolean) => {
    onToggleChanged(val)
  }

  return (
    <ReactSwitch
      className={className}
      ref={ref}
      handleDiameter={15}
      uncheckedIcon={uncheckedIcon}
      checkedIcon={checkedIcon}
      height={height}
      width={width}
      checked={checked}
      defaultChecked={checked}
      onChange={handleChange}
    />
  )
}

export default ToggleSwitch
