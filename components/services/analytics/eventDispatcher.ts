export default function eventDispatcher(eventType: string, payload: any) {
  console.log(eventType)
  let event = new CustomEvent(eventType, {
    detail: { action: eventType, payload },
  })
  window.dispatchEvent(event)
}
