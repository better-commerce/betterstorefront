import { GENERAL_EDIT } from '@components/utils/textVariables'

export default function ConfirmedGeneralComponent({
  onStateChange,
  content = {},
  isPaymentLink = false,
}: any) {
  return (
    <div className="flex flex-col text-gray-900">
      <div className="flex">
        <ul className={`text-gray-900 mt-3 sm:flex gap-0 sm:flex-col grid-cols-1 grid`} >
          {Object.keys(content).map((item: any, idx: number) => {
            return (
              <li key={idx} className="pr-1 m-0 font-normal d-inline font-sm">
                <div dangerouslySetInnerHTML={{ __html: content[item] }} />                
              </li>
            )
          })}
        </ul>
      </div>

      {!isPaymentLink && (
        <div className="flex">
          <button
            onClick={onStateChange}
            className="font-bold uppercase btn font-xs"
            type="button"
          >
            {GENERAL_EDIT}
          </button>
        </div>
      )}
    </div>
  )
}
