"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEnsName, useAccount, useConnect, useDisconnect } from "wagmi";
import { fetchEnsName } from "@wagmi/core";
import Image from "next/image";
import styles from "./page.module.scss";
import {
  Text,
  GeneralButton,
  Heading,
  ArrowTopRight,
  useClickOutside,
} from "@fluidity-money/surfing";
import Socials from "./components/Socials";
import Table from "./components/Table";
import Footer from "./components/Footer";
import { DropdownOptions } from "./components/Dropdown";

import { Transfer, AggregatedData, Data, Reward } from "./types";
import { tableHeadings, SORTED_ITEM } from "./config";

import { Client, cacheExchange, fetchExchange, gql } from "urql";

import { timestamp24HoursAgo } from "./utils";

const APIURL =
  "https://gateway-arbitrum.network.thegraph.com/api/f9ffa86b5ab1229ce9b91179448a0891/subgraphs/id/CdS3475tZUcWVHsecnELJxBEGXV8nrbe5h3VmCbhe9qd";

const queryAllTime = gql`
  query {
    transfers {
      value
      from
      blockTimestamp
    }
    rewards {
      amount
      winner
    }
  }
`;

const queryLast24hours = gql`
  query {
    transfers(where: { blockTimestamp_gte: ${String(timestamp24HoursAgo)} }) {
      value
      from
    }
    rewards(where: { blockNumber_gte: ${String(timestamp24HoursAgo)} }) {
      amount
      winner
    }
  }
`;

const client = new Client({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
});

export type IRow = React.HTMLAttributes<HTMLDivElement> & {
  RowElement: React.FC<{ heading: string }>;
};

export default function Home() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [loaded, setLoaded] = useState();

  const [allTimeData, setAllTimeData] = useState<Data[] | []>([]);
  const [last24TimeData, setLast24TimeData] = useState<Data[] | []>([]);

  const [userAddress, setUserAddress] = useState(
    "0x1cb94adfd3314d48ca8145b2c6983419257c0486"
  );

  const { address, connector, isConnected } = useAccount();

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => {
    setTimeout(() => setOpenDropdown(false), 200);
  });

  const [sortedData, setSortedData] = useState<Data[]>([]);
  const [sortedByItem, setSortedByItem] = useState<string>("number");

  async function fetch24HoursData() {
    const response = await client.query(queryLast24hours, {}).toPromise();
    const data: Data[] = createNewArray(
      response.data.transfers,
      response.data.rewards
    );

    console.log(response);
    setLast24TimeData(data);
  }

  async function fetchAllTimeData() {
    const response = await client.query(queryAllTime, {}).toPromise();
    console.log("response:", response);

    const data: Data[] = createNewArray(
      response.data.transfers,
      response.data.rewards
    );
    setAllTimeData(data);
  }

  function sortData(sortBy: string, data: Data[]) {
    switch (sortBy) {
      case "volume":
        const newSortedData = data.sort(
          (a, b) =>
            parseInt(b.volume.replace(/,/g, ""), 10) -
            parseInt(a.volume.replace(/,/g, ""), 10)
        );
        setSortedData(newSortedData);
        break;
      case "rewards":
        const newSortedDataEarned = data.sort(
          (a, b) =>
            parseInt(b.earned.replace(/,/g, ""), 10) -
            parseInt(a.earned.replace(/,/g, ""), 10)
        );
        setSortedData(newSortedDataEarned);
        break;
      default:
        setSortedData(data.sort((a, b) => b.tx - a.tx));
    }
  }

  useEffect(() => {
    fetchAllTimeData();
  }, []);

  useEffect(() => {
    sortData(sortedByItem, sortedData);
  }, [sortedByItem]);

  function createNewArray(transfers: Transfer[], rewards: Reward[]) {
    const newArr: AggregatedData = {};

    transfers.forEach(({ value, from }: Transfer) => {
      const numericValue = parseInt(value, 10);
      if (!newArr[from]) {
        newArr[from] = {
          volume: numericValue,
          tx: 1,
          earned: 0,
          user: from,
        };
      } else {
        newArr[from].volume += numericValue;
        newArr[from].tx += 1;
      }
    });

    for (let key in newArr) {
      for (let i = 0; i < rewards.length; i++) {
        if (newArr[key].user === rewards[i].winner) {
          const numericValue = parseInt(rewards[i].amount, 10);
          newArr[key].earned += numericValue;
        } else {
          console.log(`${rewards[i]} is not found`);
        }
      }
    }

    const resultArray: Data[] = Object.entries(newArr).map(
      ([from, { volume, tx, user, earned }], index) => ({
        user: receiveEnsName(from),
        volume: volume.toLocaleString().replace(/\s/g, ","),
        tx,
        earned: earned.toLocaleString().replace(/\s/g, ","),
        rank: index + 1,
      })
    );

    const sortedResult: Data[] = resultArray.sort((a, b) => b.tx - a.tx);
    setSortedData(sortedResult);
    return resultArray;
  }

  const receiveEnsName = async (address: any) => {
    try {
      const ensName = await fetchEnsName({
        address: address,
        chainId: 1,
      });

      if (ensName !== null) {
        return ensName;
      }

      return address;
    } catch (error) {
      console.error("Error fetching ENS name:", error);
    }
  };

  const airdropRankRow = (data: any): IRow => {
    const address = "0x1cb94adfd3314d48ca8145b2c6983419257c0486";
    const { user, rank, tx, volume, earned } = data;

    return {
      className: `${
        address === user.value ? styles.highlited : styles.table_row
      }`,
      RowElement: ({ heading }: { heading: string }) => {
        switch (heading) {
          case "RANK":
            return (
              <td>
                <Text>{rank === -1 ? "???" : rank}</Text>
              </td>
            );
          case "USER":
            return (
              <td>
                <a target="_blank" href="/" rel="noreferrer">
                  <Text prominent>
                    {
                      address === user.value ? "ME" : user
                      //  trimAddress(user)
                    }
                  </Text>
                </a>
              </td>
            );
          case "#TX":
            return (
              <td>
                <Text prominent>{tx}</Text>
              </td>
            );
          case "VOLUME (USD)":
            return (
              <td>
                <Text prominent>{volume}</Text>
              </td>
            );
          case "YIELD EARNED (USD)":
            return (
              <td>
                <Text prominent>{earned}</Text>
              </td>
            );
          default:
            return <></>;
        }
      },
    };
  };

  return (
    <main className={styles.main}>
      <Image
        src="./red.svg"
        alt="Red spot"
        width={914}
        height={450}
        className={styles.red_spot}
      />
      <Image
        src="./blue.svg"
        alt="Blue spot"
        width={1033}
        height={602}
        className={styles.blue_spot}
      />
      <Image
        src="./white.svg"
        alt="White spot"
        width={401}
        height={784}
        className={styles.white_spot}
      />
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="./logo_fluidity.svg"
            alt="Logo Fluidity"
            width={74}
            height={12}
          />
        </div>

        <div>
          <Heading className={styles.title}>
            Fluidity Leaderboard{" "}
            <span className={styles.light}>Competition</span>
          </Heading>
        </div>
        <div className={styles.description}>
          <Text className={styles.description_highlited}>
            Step into the Fluidity Arena!{" "}
          </Text>{" "}
          <Text>
            Compete in our Leaderboard Challenge by transacting with ƒluid
            Assets on-chain. Rise in ranks, earn your bragging rights, and claim
            exclusive rewards. Each week brings a new opportunity — Dive in,
            explore, and may the best ƒluider win!{" "}
          </Text>
          <span>
            <Text className={styles.description_learn}>LEARN MORE</Text>{" "}
            <ArrowTopRight />
          </span>
        </div>
      </div>

      <div className={styles.banner}>
        <Image src="./prise.svg" alt="Prise" width={20} height={24} />

        <Text>
          Weekly Challenge: Top Volume Contributors Win Extra Rewards!{" "}
          <ArrowTopRight className={styles.banner_arrow} />
        </Text>
      </div>
      <div className={styles.table}>
        <div className={styles.table_header}>
          <div>
            <div className={styles.title}>
              <Heading as="h1" color="white">
                Leaderboard
              </Heading>
            </div>
            <Text>
              This leaderboard shows your rank among other users
              {filterIndex === 1 ? " per" : " for"}
              &nbsp;
              {filterIndex === 1 ? (
                <span className={styles.time_filter}>24 HOURS</span>
              ) : (
                <span className={styles.time_filter}>ALL TIME</span>
              )}
              .
            </Text>
          </div>
          <div className={styles.filters}>
            <div className={styles.btns}>
              <GeneralButton
                handleClick={() => {
                  setFilterIndex(1);
                  fetch24HoursData();
                }}
                className={
                  filterIndex === 1
                    ? `${styles.btn} ${styles.btn_highlited}`
                    : `${styles.btn}`
                }
              >
                <Text size="sm">24 HOURS</Text>
              </GeneralButton>
              <GeneralButton
                handleClick={() => {
                  setFilterIndex(0);
                  fetchAllTimeData();
                }}
                className={
                  filterIndex === 1
                    ? `${styles.btn}`
                    : `${styles.btn} ${styles.btn_highlited}`
                }
              >
                <Text code size="sm">
                  ALL TIME
                </Text>
              </GeneralButton>
            </div>
            <div className={styles.filters_sorting}>
              <Text className={styles.sorted_by}>SORT BY:</Text>
              <div ref={dropdownRef} className={styles.sorted_list}>
                <GeneralButton
                  type="transparent"
                  onClick={() => {
                    setOpenDropdown(!openDropdown);
                  }}
                  className={styles.btn}
                >
                  {SORTED_ITEM[sortedByItem as keyof typeof SORTED_ITEM]}{" "}
                  <Image
                    src="./arrowDownWhite.svg"
                    alt="Arrow right"
                    width={10}
                    height={10}
                  />
                </GeneralButton>
                {openDropdown && (
                  <DropdownOptions
                    setSortedByItem={setSortedByItem}
                    setOpenDropdown={setOpenDropdown}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          {sortedData.length === 0 ? (
            !loaded ? (
              <>
                Fetching table data...
                <div className="center-table-loading-anim loader-dots">
                  {/*{showLoadingAnimation && <LoadingDots />}*/}
                </div>
              </>
            ) : (
              <>
                <div className="center-table-loading-anim loader-dots">
                  <Text size="lg">No records found!</Text>
                </div>
              </>
            )
          ) : (
            <Table
              itemName=""
              headings={tableHeadings}
              pagination={{
                paginate: false,
                page: 1,
                rowsPerPage: 11,
              }}
              count={0}
              data={sortedData}
              renderRow={(data) => airdropRankRow(data)}
              freezeRow={(data) => {
                return data.user === userAddress;
              }}
              onFilter={() => true}
              activeFilterIndex={0}
              filters={[]}
              //  loaded={loaded}
            />
          )}
        </div>
      </div>

      <Socials />

      <Footer />
    </main>
  );
}
