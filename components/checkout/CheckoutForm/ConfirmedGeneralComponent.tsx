export default function ConfirmedGeneralComponent({ onStateChange }: any) {
  return (
    <div className="text-gray-900 flex justify-between items-center">
      <span>it's confirmed</span>
      <button onClick={onStateChange} className="btn btn">
        change
      </button>
    </div>
  )
}
