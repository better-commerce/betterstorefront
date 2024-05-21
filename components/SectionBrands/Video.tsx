import { YOUTUBE_VIDEO_EMBED_PREFIX_URL } from '@components/utils/constants'

export default function Video({ heading, name }: any) {
  return (
    <>
      <div className="w-full flex flex-col items-start max-h-44 md:max-h-full h-[60vh] /py-y gap-x-2 mt-8">
        <h2 className="py-4 mb-4 text-4xl font-semibold text-left text-gray-900 ">
          {heading || 'Featured Video'}
        </h2>
        <iframe
          width="560"
          height="315"
          src={`${YOUTUBE_VIDEO_EMBED_PREFIX_URL}/${name}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-2xl"
        />
      </div>
    </>

  )
}
