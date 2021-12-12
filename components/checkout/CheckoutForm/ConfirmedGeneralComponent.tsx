export default function ConfirmedGeneralComponent({
  onStateChange,
  content = {},
}: any) {
  return (
    <div className="text-gray-900 flex flex-col">
      <div className="flex">
        <ul className={`text-gray-900 mt-3 flex`}>
          {Object.keys(content).map((item: any, idx: number) => {
            return (
              <li key={idx} className="font-normal d-inline font-sm pr-1">
                {content[item]}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="flex">
        <button onClick={onStateChange} className="btn text-indigo-500 font-xs" type="button">
          Edit
        </button>
      </div>
      
     
    </div>
  )
}
