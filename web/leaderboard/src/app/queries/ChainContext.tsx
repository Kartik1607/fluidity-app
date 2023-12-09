import { createContext, useContext, useState, useEffect } from "react";
import {
  useLeaderboardRanking24Hours,
  LeaderboardRanking,
  LeaderboardRankingRes,
} from "./useLeaderboardRanking";
import { m } from "framer-motion";
import { SupportedChains } from "@fluidity-money/surfing";

export type Network = "arbitrum" | "etheruim";

interface ApiState {
  leaderboardRanking: LeaderboardRanking[] | [];
}

interface ChainState {
  //chain: SupportedChainsList;
  network: Network;
  //setChain: Dispatch<SetStateAction<SupportedChainsList>>;
  apiState: ApiState;
}

const initChainState = (): ChainState => {
  return {
    //  chain: "ARB",
    network: "arbitrum",
    //  setChain: () => { },
    apiState: {
      leaderboardRanking: [],
      //onChainData: { data: undefined, loading: false },
    },
  };
};

const ChainContext = createContext<ChainState>(initChainState());

const ChainContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  //  const [chain, setChain] = useState<SupportedChainsList>("ARB");

  const network: Network = "arbitrum";

  const [leaderboardRanking, setLeaderboardRanking] = useState<
    LeaderboardRanking[]
  >([]);
  const [onChainData, setOnChainData] = useState<any>({
    data: undefined,
    loading: false,
  });

  const apiState = {
    leaderboardRanking,
    onChainData,
  };

  useLeaderboardRanking24Hours(
    ({ leaderboard_ranking }: LeaderboardRankingRes) =>
      setLeaderboardRanking(leaderboard_ranking),
    "arbitrum"
    // formatToGraphQLDate(prevWeekDate),
  );

  useEffect(() => {
    setOnChainData({ data: undefined, loading: true });
  }, []);

  return (
    <ChainContext.Provider value={{ network, apiState }}>
      {children}
    </ChainContext.Provider>
  );
};

const useChainContext = () => {
  return useContext(ChainContext);
};

export { ChainContextProvider, useChainContext };
