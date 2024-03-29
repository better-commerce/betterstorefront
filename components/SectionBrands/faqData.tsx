import { useTranslation } from "@commerce/utils/use-translation";

const useFaqData = () => {
  const translate = useTranslation();
  return {
    "title": translate('label.faqs.popularFaqsText'),
    "results": [
      {
        "faq": translate('label.faqs.dummyFaq1'),
        "ans": translate('label.faqs.dummyAns1')
      },
      {
        "faq": translate('label.faqs.dummyFaq2'),
        "ans": translate('label.faqs.dummyAns1')
      },
      {
        "faq": translate('label.faqs.dummyFaq3'),
        "ans": translate('label.faqs.dummyAns1')
      }
    ]
  }
}

export default useFaqData;
