import { GENERAL_EDIT } from '@components/utils/textVariables'

export default function ConfirmedGeneralComponent({
  onStateChange,
  content = {},
  isPaymentLink = false,
}: any) {
  return (
    <div className="text-gray-900 flex flex-col">
      <div className="flex">
        <ul
          className={`text-gray-900 mt-3 sm:flex xs:flex-col grid-cols-1 grid`}
        >
          {Object.keys(content).map((item: any, idx: number) => {
            return (
              <li key={idx} className="font-normal d-inline font-sm pr-1">
                {content[item]}
              </li>
            )
          })}
        </ul>
      </div>

      {!isPaymentLink && (
        <div className="flex">
          <button
            onClick={onStateChange}
            className="btn font-xs uppercase font-bold"
            type="button"
          >
            {GENERAL_EDIT}
          </button>
        </div>
      )}
    </div>
  )
}
