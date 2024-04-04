import React, { FC } from "react";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import ButtonSecondary from "./shared/Button/ButtonSecondary";
import NcModal from "./shared/NcModal/NcModal";
import { useTranslation } from "@commerce/utils/use-translation";

export interface ModalDeleteProps {
  show: boolean;
  onCloseModalDelete: () => void;
}

const ModalDelete: FC<ModalDeleteProps> = ({ show, onCloseModalDelete }) => {
  const translate = useTranslation();
  const handleClickSubmitForm = () => {
    console.log({ 1: "1" });
  };

  const renderContent = () => {
    return (
      <form action="#">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          {translate('common.label.deleteNFTText')}
        </h3>
        <span className="text-sm">
          {translate('common.label.deleteNFTConfirmationText')}
        </span>
        <div className="mt-4 space-x-3">
          <ButtonPrimary onClick={handleClickSubmitForm} type="submit">
            {translate('common.label.deleteText')}
          </ButtonPrimary>
          <ButtonSecondary type="button" onClick={onCloseModalDelete}>
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
      onCloseModal={onCloseModalDelete}
      contentExtraClass="max-w-screen-sm"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle=""
    />
  );
};

export default ModalDelete;
