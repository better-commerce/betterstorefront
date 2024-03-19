"use client";
import React, { FC, useEffect, useRef } from "react";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import ButtonSecondary from "./shared/Button/ButtonSecondary";
import Input from "./shared/Input/Input";
import NcModal from "./shared/NcModal/NcModal";
import { useTranslation } from "@commerce/utils/use-translation";

export interface ModalEditProps {
  show: boolean;
  onCloseModalEdit: () => void;
}

const ModalEdit: FC<ModalEditProps> = ({ show, onCloseModalEdit }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        const element: HTMLTextAreaElement | null = textareaRef.current;
        if (element) {
          (element as HTMLTextAreaElement).focus();
          (element as HTMLTextAreaElement).setSelectionRange(
            (element as HTMLTextAreaElement).value.length,
            (element as HTMLTextAreaElement).value.length
          );
        }
      }, 400);
    }
  }, [show]);

  const renderContent = () => {
    const translate = useTranslation()
    return (
      <form action="#">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          {translate('common.label.changePriceText')}
        </h3>
        <span className="text-sm">{translate('common.label.changePriceConfirmationText')}</span>
        <div className="relative mt-8 rounded-md shadow-sm">
          <Input ref={textareaRef} defaultValue={"1.000"} type={"text"} />

          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              {translate('label.navBar.currencyText')}
            </label>
            <select
              id="currency"
              name="currency"
              className="h-full py-0 pl-2 bg-transparent border-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-7 text-neutral-500 dark:text-neutral-300 sm:text-sm"
            >
              <option>{translate('label.modalEdit.ethText')}</option>
              <option>{translate('label.modalEdit.btcText')}</option>
              <option>{translate('label.modalEdit.bthText')}</option>
            </select>
          </div>
        </div>
        <div className="mt-4 space-x-3">
          <ButtonPrimary type="submit">{translate('common.label.submitText')}</ButtonPrimary>
          <ButtonSecondary type="button" onClick={onCloseModalEdit}>
            {translate('common.label.cancelText')}
          </ButtonSecondary>
        </div>
      </form>
    );
  };

  const renderTrigger = () => {
    return null;
  };

  return (
    <NcModal
      isOpenProp={show}
      onCloseModal={onCloseModalEdit}
      contentExtraClass="max-w-lg"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle=""
    />
  );
};

export default ModalEdit;
