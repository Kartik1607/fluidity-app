import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

export const queryLeaderboardRanking24Hours = gql`
  query LeaderboardRanking {
    leaderboard_ranking(
      args: { i: "1 day", network_: "arbitrum" }
      limit: 40
      order_by: { number_of_transactions: desc }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

export const queryLeaderboardRankingAllTime = gql`
  query LeaderboardRanking {
    leaderboard_ranking(
      args: { network_: "arbitrum" }
      limit: 40
      order_by: { number_of_transactions: desc }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

export const queryLeaderboardRanking24Hour = gql`
  query LeaderboardRanking {
    leaderboard_ranking(
      args: { i: "1 day", network_: $network }
      limit: 40
      order_by: { number_of_transactions: desc }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

console.log(queryLeaderboardRanking24Hour);

export type LeaderboardRanking = {
  rank?: number;
  address: string;
  volume: string | number;
  number_of_transactions: number;
  yield_earned: string;
};

export type LeaderboardRankingRes = {
  leaderboard_ranking: LeaderboardRanking[];
};

const useLeaderboardRanking24Hours = (
  onNext: (ranking: LeaderboardRankingRes) => void,
  network: string
) => {
  const { query, options } = useMemo(
    () => ({
      query: queryLeaderboardRanking24Hour,
      options: {
        variables: {
          network,
        },
        onCompleted: onNext,
      },
    }),
    [network, onNext]
  );

  return useQuery(query, options);
};

export { useLeaderboardRanking24Hours };
