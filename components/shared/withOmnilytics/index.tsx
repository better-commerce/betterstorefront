import { CURRENT_THEME } from "@components/utils/constants"

const featureToggle = require(`/public/theme/${CURRENT_THEME}/features.config.json`)

const withOmnilytics = (Component: any) => {
  return (props: any) => {
    if (!featureToggle?.features?.enableOmnilytics) {
      return null
    }
    return <Component {...props} />
  }
}

export default withOmnilytics
