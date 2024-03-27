// Package Imports
import { useTranslation } from "@commerce/utils/use-translation";

const useFooterNavigation = () => {
  const translate = useTranslation()
  const footerNavigation = {
    products: [
      { name: translate('label.footer.navigation.bagsText'), href: '#' },
      { name: translate('label.footer.navigation.teesText'), href: '#' },
      { name: translate('label.footer.navigation.objectsText'), href: '#' },
      { name: translate('label.footer.navigation.homeGoodsText'), href: '#' },
      { name: translate('label.footer.navigation.accessoriesText'), href: '#' },
    ],
    company: [
      { name: translate('label.footer.navigation.whoWeAreText'), href: '#' },
      { name: translate('label.footer.navigation.sustainabilityText'), href: '#' },
      { name: translate('label.footer.navigation.pressText'), href: '#' },
      { name: translate('label.footer.navigation.careersText'), href: '#' },
      { name: translate('label.footer.navigation.termsAndConditionsText'), href: '#' },
      { name: translate('label.footer.navigation.privacyText'), href: '#' },
    ],
    customerService: [
      { name: translate('label.footer.navigation.contactText'), href: '#' },
      { name: translate('label.footer.navigation.shippingText'), href: '#' },
      { name: translate('label.footer.navigation.returnsText'), href: '#' },
      { name: translate('label.footer.navigation.warrantyText'), href: '#' },
      { name: translate('label.footer.navigation.securePaymentText'), href: '#' },
      { name: translate('label.footer.navigation.faqText'), href: '#' },
      { name: translate('label.footer.navigation.findAStoreText'), href: '#' },
    ],
  }
  return footerNavigation
}

export default useFooterNavigation
