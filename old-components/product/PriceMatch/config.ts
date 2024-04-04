import { useTranslation } from '@commerce/utils/use-translation'
export const useConfig =() =>{
  const translate = useTranslation()
  const config = [
    {
      key: 'websiteName',
      placeholder: translate('label.product.priceMatchwebsiteNameText'),
      type: 'text',
    },
    {
      key: 'websiteLink',
      placeholder: translate('label.product.priceMatchDirectLinkText'),
      type: 'text',
    },
    {
      key: 'costOfProduct',
      placeholder: translate('label.product.priceMatchCostText'),
      type: 'number',
    },
    {
      key: 'deliveryCost',
      placeholder: translate('label.product.priceMatchDeliveryCostText'),
      type: 'number',
    },
    {
      key: 'totalCost',
      placeholder: translate('label.product.priceMatchTotalCostText'),
      type: 'number',
    },
    {
      key: 'name',
      placeholder: translate('label.product.priceMatchUserName'),
      type: 'string',
    },
    {
      key: 'email',
      placeholder: translate('label.product.priceMatchUserEmail'),
      type: 'email',
    },
    {
      key: 'phone',
      placeholder: translate('label.product.priceMatchUserTelephone'),
      type: ':tel',
    },
  ]
  return config;
}
