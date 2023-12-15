import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployNFTFactoryContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */

  await hre.run("verify:verify", {
    address: "0xba5231d5df6c70850f850038456d0e085d8f4657",
    constructorArguments: [
      "0x1544D2de126e3A4b194Cfad2a5C6966b3460ebE3",
      "Metawin Millionaire",
      "https://bafybeigte2we6svwd3jatpekq3gzqdst7e5tpwtkpguix2ayvcscgkgvj4.ipfs.dweb.link",
    ],
  });

  console.log("NFTFactory verified");
  // Get the deployed contract
  // const yourContract = await hre.ethers.getContract("YourContract", deployer);
};

export default deployNFTFactoryContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags NFTFactory
deployNFTFactoryContract.tags = ["NFTFactory"];
