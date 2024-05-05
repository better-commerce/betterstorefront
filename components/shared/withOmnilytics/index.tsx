import { OMNILYTICS_DISABLED } from '@components/utils/constants'

const withOmnilytics = (Component: any) => {
  return (props: any) => {
    if (OMNILYTICS_DISABLED) {
      return null
    }
    return <Component {...props} />
  }
}

export default withOmnilytics
