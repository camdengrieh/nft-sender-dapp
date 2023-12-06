//import { useReducer } from "react";
import { useRef, useState } from "react";
//import { Spinner } from "~~/components/assets/Spinner";
import Papa from "papaparse";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { abi as basenft } from "~~/abis/baseNFT";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

type ContractUIProps = {
  contractAddress: string;
  contractName: string;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const NftUI = ({ contractAddress, contractName, className = "" }: ContractUIProps) => {
  //const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const { address: account } = useAccount();

  const [addresses, setAddresses] = useState([`${account}`] as string[]);

  const addressesRef = useRef<HTMLTextAreaElement>(null);

  const configuredNetwork = getTargetNetwork();

  const networkColor = useNetworkColor();

  const { config: mintConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: basenft,
    functionName: "mintMultipleToAddresses",
    args: [addresses],
    //args: [`[${addressesRef.current?.value.split("\n")}]`],
  });

  const { write: writeMint, data, isLoading, isSuccess } = useContractWrite(mintConfig);

  const changeHandler = (event: any) => {
    console.log(event.target.files[0]);
    if (!event.target.files[0]) return;
    Papa.parse(event.target.files[0], {
      header: true,
      complete: function (results) {
        console.log(results);
        const addresses = results.data.map((result: any) => result.WalletAddress);
        setAddresses(addresses);
        console.log(addresses);
      },
    });
  };

  if (!contractAddress) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${configuredNetwork.name}"!`}
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address address={contractAddress as string} />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance address={contractAddress} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
            </div>
            {configuredNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{" "}
                <span style={{ color: networkColor }}>{configuredNetwork.name}</span>
              </p>
            )}
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Send</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-base-300">
                <h5 className="text-xl">Add CSV file or paste addesses</h5>
              </div>
              <div className="px-5 min-w-full divide-y divide-base-300">
                <form className="text-m">
                  Add addresses: {"  "}
                  <input onChange={changeHandler} type="file" accept="csv" className="text-m" />
                </form>

                <textarea
                  ref={addressesRef}
                  defaultValue={addresses.join("\n")}
                  className=" text-m min-w-[100%] mt-5"
                  placeholder="Paste addresses here"
                >
                  {/* {addresses.map(address => `${address}\n`).join("")} */}
                </textarea>
              </div>
              <div className="p-5 divide-y divide-base-300 mb-8">
                <button className="absolute right-10 " disabled={!writeMint} onClick={() => writeMint?.()}>
                  Mint Batches{" "}
                </button>
                {isLoading && <div>Check Wallet</div>}
                {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
              </div>
            </div>
          </div>
          {/* <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Write</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
