import scaffoldConfig from "~~/scaffold.config";
import { ContractName, contracts } from "~~/utils/scaffold-eth/contract";

export function getContractAddresses() {
  const contractsData = contracts?.[scaffoldConfig.targetNetwork.id];
  return contractsData ? (Object.keys(contractsData) as ContractName[]) : [];
}

//Get Deployed Contract Addresses for a given chainId and contractName
