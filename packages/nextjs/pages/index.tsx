import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">NFT</span>
            <span className="block text-4xl font-bold">Multi Sender</span>
          </h1>
          <p className="text-center text-lg">
            Add your metadata, with the amount of NFTs and batch of addresses you wish to send
          </p>
          <p className="text-center text-lg"> When happy with the parameters, create the NFT </p>
          <p className="text-center text-lg"> Upload a csv file of addresses (Max 400) </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>
                Create your NFT using the{" "}
                <Link href="/create" passHref className="link">
                  Create NFT
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>
                Multisend to multiple addresses with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Multisend
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
