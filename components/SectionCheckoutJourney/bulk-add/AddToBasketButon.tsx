
import SubmitButton, { ISubmitButtonProps } from '@components//shared/Button/SubmitButton'
import React, { FC } from 'react'

interface IAddToBasketButtonProps {
  readonly buttonText: string
}

export const AddToBasketButton: FC<
  IAddToBasketButtonProps & ISubmitButtonProps
> = (props: IAddToBasketButtonProps & ISubmitButtonProps) => {
  const { source, submitState, buttonText } = props
  return (
    <div className="absolute bottom-0 right-0 flex justify-end w-full px-4 py-4 border-t justify-items-end align-right z-999 bg-gray-50">
      <SubmitButton
        cssClass="flex w-2/5 px-6 mr-3 items-center justify-center py-3 rounded font-medium bg-black text-white uppercase transition hover:opacity-75"
        submitState={submitState}
        source={source}
      >
        {buttonText}
      </SubmitButton>
    </div>
  )
}
