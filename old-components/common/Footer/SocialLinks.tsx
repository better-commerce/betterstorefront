import { useTranslation } from "@commerce/utils/use-translation"

export default function SocialLinks() {
  const translate = useTranslation()
  return (
    <>
      <div className='social-icon'>
        <h3 className='font-24 mob-font-16 text-white mb-3 uppercase'>{translate('label.social.generalText')}</h3>
        <ul className='flex items-center justify-start mt-0 social-icon gap-2'>
          <li className='inline-block mt-0 mr-2 sm:mr-3'><a rel="noreferrer" aria-label="Facebook" target="_blank" href="https://www.facebook.com/shark.helmets/" className='inline-block'><i className='sprite-icons sprite-fb-icon'></i></a></li>
          <li className='inline-block mt-0 mr-2 sm:mr-3'><a rel="noreferrer" aria-label="Instagram" target="_blank" href="https://www.instagram.com/shark_helmets/" className='inline-block'><i className='sprite-icons sprite-instagram-icon'></i></a></li>
        </ul>
      </div>
    </>
  )
}
