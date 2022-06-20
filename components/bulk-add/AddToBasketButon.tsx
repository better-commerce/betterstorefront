import React, { FC } from "react";

interface IAddToBasketButtonProps {
    readonly buttonText: string;
}

export const AddToBasketButton: FC<IAddToBasketButtonProps> = (props: IAddToBasketButtonProps) => {
    const { buttonText } = props;
    return (
        <div className="flex flex-col grid absolute justify-items-end align-right bottom-0 right-0 z-999 w-full px-4 bg-gray-50 border-t py-4">
            <button className="flex justify-center w-2/5 px-6 mr-3 relative right-0 text-sm items-center py-3 border border-transparent rounded-sm shadow-sm font-medium text-white bg-black hover:bg-gray-900 ">
                {buttonText}
            </button>
        </div>
    )
};