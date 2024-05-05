// Package Imports
import * as Yup from 'yup'

// Other Imports
import { useTranslation } from "@commerce/utils/use-translation";

export const useStockCheckSchema = () => {
    const translate = useTranslation();
    const stockCheckSchema = Yup.object().shape({
    postCode: Yup.string()
      .trim()
      .max(
        10,
        translate('common.message.profile.postCodeMaxLenMsg')
      )
      .required(translate('common.message.postCodeRequiredMsg')),
    })
  
    return stockCheckSchema;
  }