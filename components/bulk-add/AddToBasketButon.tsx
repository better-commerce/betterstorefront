import SubmitButton, {
  ISubmitButtonProps,
} from '@components/common/SubmitButton'
import React, { FC } from 'react'

interface IAddToBasketButtonProps {
  readonly buttonText: string
}

export const AddToBasketButton: FC<
  IAddToBasketButtonProps & ISubmitButtonProps
> = (props: IAddToBasketButtonProps & ISubmitButtonProps) => {
  const { source, submitState, buttonText } = props
  return (
    <div className="flex flex-col grid absolute justify-items-end align-right bottom-0 right-0 z-999 w-full px-4 bg-gray-50 border-t py-4">
      <SubmitButton
        cssClass="flex w-2/5 px-6 mr-3 items-center justify-center py-3 capitalize transition btn-primary hover:opacity-75"
        submitState={submitState}
        source={source}
      >
        {buttonText}
      </SubmitButton>
    </div>
  )
}
