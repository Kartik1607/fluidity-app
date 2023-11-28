export interface Transfer {
  value: string;
  from: string;
  __typename: string;
}

export interface Reward {
  amount: string;
  winner: string;
  __typename: string;
}

export interface AggregatedData {
  [from: string]: {
    rank?: number;
    user: string;
    volume: number;
    tx: number;
    earned: number;
  };
}

export interface Data {
  rank?: number;
  user: string;
  volume: string;
  tx: number;
  earned: string;
}
