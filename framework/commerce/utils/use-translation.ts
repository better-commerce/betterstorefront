// Package Imports
import { useTranslation } from 'next-i18next'

const useLocalizedTranslation = (): any => {
    const { t } = useTranslation()
    return t
}

export { useLocalizedTranslation as useTranslation }