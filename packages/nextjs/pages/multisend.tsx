import { useEffect, useMemo, useState } from "react";
import { abi as baseNftAbi } from "../abis/baseNFT";
import { readContract } from "@wagmi/core";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { getContract } from "viem";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { NftUI } from "~~/components/multisendNfts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { GenericContract } from "~~/utils/scaffold-eth/contract";

const selectedContractStorageKey = "scaffoldEth2.selectedNftContract";

const Multisend: NextPage = () => {
  //get address of user
  const account = useAccount();

  //get addresses of contracts deployed by user
  const { data: nftContractAddresses } = useScaffoldContractRead({
    contractName: "NFTFactory",
    functionName: "getDeployedNFTs",
    args: [account.address],
  });

  const [nftContracts, setNftContracts] = useState([
    getContract({ address: nftContractAddresses ? nftContractAddresses[0] : "", abi: baseNftAbi }) as GenericContract,
  ]);

  const [nftContractNames, setNftContractNames] = useState([] as string[]);

  useMemo(() => {
    const nftContractsFromAddress = [];
    if (nftContractAddresses !== undefined) {
      for (const address of nftContractAddresses) {
        nftContractsFromAddress.push(getContract({ address: address, abi: baseNftAbi }));
      }
      setNftContracts(nftContractsFromAddress as GenericContract[]);
    }
  }, [nftContractAddresses]);

  const [selectedContract, setSelectedContract] = useLocalStorage(
    selectedContractStorageKey,
    getContract({ address: nftContractAddresses ? nftContractAddresses[0] : "", abi: baseNftAbi }) as GenericContract,
  );

  // const { data: contractName } = useContractRead({
  //   abi: baseNftAbi,
  //   address: selectedContract.address,
  //   functionName: "name",
  //   args: [],
  // }) as { data: string };

  useEffect(() => {
    const fetchContractNames = async () => {
      if (account && nftContractAddresses !== undefined) {
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
  }, [nftContractAddresses, account]);

  return (
    <>
      <MetaHeader title="NFT Contract Creator" description="Create your NFT and deploy" />
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {nftContractAddresses?.length === 0 ? (
          <p className="text-3xl mt-14">No contracts found!</p>
        ) : (
          <>
            {nftContracts && nftContracts.length > 1 && (
              <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                {nftContracts.map(nftContract => (
                  <button
                    className={`btn btn-secondary btn-sm normal-case font-thin ${
                      nftContract.address === selectedContract.address ? "bg-base-300" : "bg-base-100"
                    }`}
                    key={nftContract.address}
                    onClick={() => setSelectedContract(nftContract)}
                  >
                    {nftContractNames[nftContracts.indexOf(nftContract)]}
                  </button>
                ))}
              </div>
            )}
            {nftContracts?.map(nftContract => (
              <NftUI
                key={nftContract.address}
                contractAddress={nftContract.address}
                contractName={nftContractNames[nftContracts.indexOf(nftContract)]}
                className={nftContract.address === selectedContract.address ? "" : "hidden"}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Multisend;
