import { useContractRead } from "wagmi";
import { baseNftAbi } from "~~/abis";

export const NFTReader = ({ contractAddress }: { contractAddress: string }) => {
  const { isLoading: metaDataLoading } = useContractRead({
    address: contractAddress,
    functionName: "uri",
    args: [],
    abi: baseNftAbi.abi,
  });

  return (
    <>
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {metaDataLoading ? <p className="text-3xl mt-14">Loading...</p> : <div></div>}
      </div>
    </>
  );
};
