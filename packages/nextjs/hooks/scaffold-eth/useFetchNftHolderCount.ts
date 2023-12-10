import { useMemo, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useNetwork } from "wagmi";

const useConnectToAlchemy = () => {
  const { chain } = useNetwork();
  const config = {
    apikey: chain?.id === 5 ? "L7epMz-6xDH1M1j2xZ1qAyZAC5pWo1Pi" : "uMiVWqum44amfo6vdE8Js2jHWoIxLYjN",
    network: chain?.id === 5 ? Network.ETH_GOERLI : Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(config);
  return alchemy;
};

export const useFetchNftHolderCount = (contractAddress: string) => {
  const [nftHolderCount, setNftHolderCount] = useState<number>(0);
  const alchemy = useConnectToAlchemy();

  async function getNftHolderCount() {
    const response = await alchemy.nft.getOwnersForNft(contractAddress, "1");
    setNftHolderCount(response.owners.length);
    console.log(response.owners.length);
  }

  useMemo(() => {
    if (contractAddress) {
      getNftHolderCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress]);

  return { nftHolderCount };
};
