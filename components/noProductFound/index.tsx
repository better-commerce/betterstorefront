import { useTranslation } from '@commerce/utils/use-translation'

export default function NoProductFound() {
  const translate = useTranslation()
  return (
    <div className="flex flex-col items-center mt-10 justify-center min-h-[600px]">
      <div className="flex items-center justify-center w-12 h-12 transform rotate-45 bg-gray-400">
        <span className="font-bold text-white -rotate-45">!</span>
      </div>
      <p className="mt-6 text-lg font-medium text-center text-gray-600">
        {translate('label.search.noMatchingProductFoundText')}
      </p>
      <p className="mt-4 text-sm text-center text-gray-500">
        {translate('label.search.noMatchingProductFoundDescText')}
      </p>
    </div>
  )
}
