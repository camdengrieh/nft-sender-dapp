import { ethers } from "hardhat";
import readCsv from "./utils/csvReader";

async function main() {
  const ContractFactory = await ethers.getContractFactory("MetawinMillionaireMarketing");

  //Get the first account from the list of accounts
  const accounts = await ethers.getSigners();

  async function withTimeout<T>(promise: Promise<T>, timeoutMillis: number) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), timeoutMillis)),
    ]);
  }

  const initialOwner = (await ethers.getSigners())[0].address;
  //Deploy the contract
  const nftContract = await ContractFactory.deploy(initialOwner);
  await nftContract.waitForDeployment();

  const addresses = await readCsv("players.csv");

  //We can only send to 400 addresses at a time due to gas limits so we need to batch the addresses and make seperate transactions

  const batchSize = 400;
  const numBatches = Math.ceil(addresses.length / batchSize) - 1;
  console.log(`Sending ${numBatches} batches of ${batchSize} addresses`);

  const transactions = [];

  const batchSend = async () => {
    for (let i = 0; i < numBatches; i++) {
      const start = i * batchSize;
      const end = start + batchSize;
      const batch = addresses.slice(start, end);
      const tx = await nftContract.mintMultipleToAddresses(batch);
      transactions.push(tx);
      console.log(`Batch ${i} sent`);
    }
  };

  try {
    await withTimeout(batchSend(), 80000); // wait at most 80 seconds for the contract to be deployed
    console.log("Batches sent successfully");
  } catch (error) {
    console.error("Failed to send batches:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
