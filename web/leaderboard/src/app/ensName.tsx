import React from "react";
import { useEnsName } from "wagmi";

const trimAddress = (address: string): string => {
  const leftSide = address.slice(0, 4);

  const rightSide = address.slice(-4);

  return leftSide + "..." + rightSide;
};

const UseEnsName = (address: any) => {
  const ensName = useEnsName({
    address: address.address,
    chainId: 1,
  });

  return (
    <div>
      {ensName.data === null ? trimAddress(address.address) : ensName.data}
    </div>
  );
};

export default UseEnsName;
