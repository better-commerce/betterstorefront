import StoreDetails from '../StoreDetails'

export const StoreList = ({ isDataLoading, filteredStores }: any) => {
  return (
    <>
      {isDataLoading
        ? Array.from(Array(6).keys()).map((num) => {
            return (
              <div
                className="flex flex-col justify-between border-2 p-[20px] mb-[20px] h-[270px] bg-[#dbdbdb52] rounded"
                key={num}
              >
                <div></div>
                <div className="flex justify-between">
                  <div className="bg-[#DBDBDB] h-[32px] px-[12px] py-[8px] w-[49%]"></div>
                  <div className="bg-[#DBDBDB] h-[32px] px-[12px] py-[8px] w-[49%]"></div>
                </div>
              </div>
            )
          })
        : filteredStores?.map((store: any) => (
            <StoreDetails key={store?.id} store={store} />
          ))}
      {filteredStores.length == 0 && !isDataLoading ? (
        <h3 className="text-primary">There is no store at current location.</h3>
      ) : (
        ''
      )}
    </>
  )
}
