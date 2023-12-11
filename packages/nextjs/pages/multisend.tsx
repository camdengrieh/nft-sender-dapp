import { useEffect, useState } from "react";
import { abi as baseNftAbi } from "../abis/baseNFT";
import { readContract } from "@wagmi/core";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { NftUI } from "~~/components/multisendNfts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const selectedContractStorageKey = "scaffoldEth2.selectedNftContract";

const Multisend: NextPage = () => {
  //get address of user
  const { address } = useAccount();

  const { data: nftContractAddresses, isLoading: addressesLoading } = useScaffoldContractRead({
    contractName: "NFTFactory",
    functionName: "getDeployedNFTs",
    args: [address],
  });
  const [nftContractNames, setNftContractNames] = useState([] as string[]);

  const [selectedContract, setSelectedContract] = useLocalStorage(selectedContractStorageKey, "");

  useEffect(() => {
    const fetchContractNames = async () => {
      if (nftContractAddresses !== undefined) {
        const contractNames = await Promise.all(
          nftContractAddresses.map(nftAddress =>
            readContract({
              abi: baseNftAbi,
              address: nftAddress,
              functionName: "name",
            }),
          ),
        );
        setNftContractNames(contractNames as string[]);
      } else {
        setNftContractNames([]);
      }
    };

    fetchContractNames();
  }, [nftContractAddresses]);

  return (
    <>
      <MetaHeader title="NFT Contract Creator" description="Create your NFT and deploy" />
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {nftContractAddresses?.length === 0 && !addressesLoading ? (
          <p className="text-3xl mt-14">No contracts found!</p>
        ) : (
          <>
            {nftContractAddresses && nftContractAddresses.length > 1 && (
              <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                {nftContractAddresses.map(nftAddress => (
                  <button
                    className={`btn btn-secondary btn-sm normal-case font-thin ${
                      nftAddress === selectedContract ? "bg-base-300" : "bg-base-100"
                    }`}
                    key={nftAddress}
                    onClick={() => setSelectedContract(nftAddress)}
                  >
                    {nftContractNames[nftContractAddresses.indexOf(nftAddress)]}
                  </button>
                ))}
              </div>
            )}
            {nftContractAddresses?.map(nftAddress => (
              <NftUI
                key={nftAddress}
                contractAddress={nftAddress}
                contractName={nftContractNames[nftContractAddresses.indexOf(nftAddress)]}
                className={nftAddress === selectedContract ? "" : "hidden"}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Multisend;
