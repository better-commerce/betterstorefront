import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import Link from "next/link";

export default function LandingFeaturedCategory({ featuredCategory, categoryname, deviceInfo }: any) {
  return (
    <section className="pt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6 heading-border-top">Shop {categoryname} by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredCategory
            ?.filter((featured: any) => featured?.isFeatured === true)
            .map((featured: any, featuredIdx: number) => (
              <div className="w-full text-center" key={featuredIdx}>
                <Link
                  href={`/${featured?.link}`}
                  className="group"
                >
                  <div className="bg-white border-[#B8B8B8] border p-3 rounded-xl flex flex-col items-center transition-all hover:shadow-md">
                    <div className="w-9/12 flex items-center justify-center mb-2">
                      {featured?.image ? (
                        <img
                          src={generateUri(featured?.image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                          className="max-h-full max-w-full object-contain"
                          alt="Image"
                        />
                      ) : (
                        <img
                          src={IMG_PLACEHOLDER}
                          className="max-h-full max-w-full object-contain"
                          alt="Image"
                        />
                      )}
                    </div>
                  </div>
                </Link>
                <span className="text-xs block mt-2 text-center font-medium text-gray-700 group-hover:text-blue-600">
                  {featured?.name}
                </span>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
