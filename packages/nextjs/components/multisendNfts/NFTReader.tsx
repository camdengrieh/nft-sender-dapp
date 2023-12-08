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
      fetch(nftMetadata.toString())
        .then(response => response.json())
        .then(data => {
          setNftImage(data.image);
        });
    }
  }, [nftMetadata]);

  return (
    <>
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {metaDataLoading ? <p className="text-3xl mt-14">Loading...</p> : <div></div>}
      </div>
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {nftImage ? (
          <Image width="50" height="50" src={nftImage} alt="NFT" />
        ) : (
          <p className="text-3xl mt-14">No NFT found!</p>
        )}
      </div>
    </>
  );
};
