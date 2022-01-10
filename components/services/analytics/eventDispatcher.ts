export default function eventDispatcher(eventType: string, payload: any) {
  console.count('custom event logged')
  let event = new CustomEvent(eventType, {
    detail: { action: eventType, payload },
  })
  window.dispatchEvent(event)
}
