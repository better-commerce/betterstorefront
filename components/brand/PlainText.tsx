import cn from 'classnames'

export default function PlainText({ textNames, heading }: any) {
  return (
    <div className="bg-[#F3EDE3] grid grid-cols-1 gap-5 md:grid-cols-2 h-[612px] p-20">
      <div className="flex items-end py-10">
        <p className="font-bold md:text-[32px] leading-10 text-sm">
          {heading
            ? heading
            : 'The brand represents performance, innovation, andreliability, with a hard-earned reputation for quality and highlevels of durability.'}
        </p>
      </div>
      <div className="">
        <p>
          {textNames.length > 0 &&
            textNames.map((val: any, index: number) => {
              return (
                <span
                  key={index}
                  className={cn('font-bold', {
                    'font-semibold': index != 0,
                    'font-bold': index == 0,
                  })}
                >
                  {val}
                  <br></br>
                  <br></br>
                </span>
              )
            })}
        </p>
      </div>
    </div>
  )
}
