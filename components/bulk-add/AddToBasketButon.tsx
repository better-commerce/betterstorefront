import React, { FC } from 'react'

interface IAddToBasketButtonProps {
  readonly buttonText: string
}

export const AddToBasketButton: FC<IAddToBasketButtonProps> = (
  props: IAddToBasketButtonProps
) => {
  const { buttonText } = props
  return (
    <div className="flex flex-col grid absolute justify-items-end align-right bottom-0 right-0 z-999 w-full px-4 bg-gray-50 border-t py-4">
      <button className="flex w-2/5 px-6 mr-3 items-center justify-center py-3 capitalize transition btn-primary hover:opacity-75">
        {buttonText}
      </button>
    </div>
  )
}
