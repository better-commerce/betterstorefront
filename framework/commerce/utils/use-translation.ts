// Other Imports
import { useI18n } from '@components/ui/i18nContext';
import { EmptyString } from '@components/utils/constants';

const useLocalizedTranslation = (): any => {
    const i18nLocalized: any = useI18n();

    if (i18nLocalized?.locale) {
        return (key: string) => {
            return i18nLocalized?.localized[key] || EmptyString
        }
    }
    //const { t } = useTranslation()
    //return t

    return () => {
        return EmptyString
    }
}

export { useLocalizedTranslation as useTranslation }