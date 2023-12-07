const gql = String.raw;

const jsonPost = async <
  Req = { query: string },
  Res = { data: Record<string, unknown> }
>(
  url: string,
  body: Req,
  headers?: Record<string, string>
): Promise<Res> => {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(headers ? headers : {}),
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    return res.json();
  } catch (e) {
    throw new Error(`Could not parse JSON: ${e}`);
  }
};

const queryLeaderboardRanking24Hours = gql`
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

const queryLeaderboardRankingAllTime = gql`
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

const useLeaderboardRanking24Hours = () => {
  const variables = {};
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryLeaderboardRanking24Hours,
  };

  return jsonPost(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useLeaderboardRankingAllTime = () => {
  const variables = {};
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryLeaderboardRankingAllTime,
  };

  return jsonPost(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useLeaderboardRanking24Hours, useLeaderboardRankingAllTime };
