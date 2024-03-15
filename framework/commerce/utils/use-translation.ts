// Package Imports
import { useTranslation } from 'next-i18next'

const useLocalizedTranslation = () => {
    const { t } = useTranslation()
    return t
}

export { useLocalizedTranslation as useTranslation }