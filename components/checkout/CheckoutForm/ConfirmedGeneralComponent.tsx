export default function ConfirmedGeneralComponent({
  onStateChange,
  content = {},
}: any) {
  return (
    <div className="text-gray-900 flex justify-between items-center">
      <ul className={`text-gray-900 mt-10`}>
        {Object.keys(content).map((item: any, idx: number) => {
          return <li className="font-semibold">{content[item]}</li>
        })}
      </ul>
      <button onClick={onStateChange} className="btn btn" type="button">
        Edit
      </button>
    </div>
  )
}
