import { useEffect, useState } from "react";
import Image from "next/image";
import { useContractRead } from "wagmi";
import { baseNftAbi } from "~~/abis";

export const NFTReader = ({ contractAddress }: { contractAddress: string }) => {
  const [nftImage, setNftImage] = useState<string>("");

  const { data: nftMetadata, isLoading: metaDataLoading } = useContractRead({
    address: contractAddress,
    functionName: "uri",
    args: [0],
    abi: baseNftAbi.abi,
  });

  useEffect(() => {
    if (nftMetadata) {
      const fetchMetadata = async () => {
        try {
          const uriResponse = await fetch(nftMetadata.toString());
          const json = await uriResponse.json();
          setNftImage(json.image);
        } catch (error) {
          console.log(error);
        }
      };

      fetchMetadata();
    }
  }, [nftMetadata]);

  return (
    <>
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {metaDataLoading ? (
          <p className="text-3xl mt-14">Loading...</p>
        ) : (
          <div className="flex flex-col gap-y-3 lg:gap-y-4 py-4 lg:py-6 justify-center items-center">
            {nftImage ? (
              <Image width="200" height="200" src={nftImage} alt="NFT" />
            ) : (
              <p className="text-3xl mt-14">No Image found!</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
