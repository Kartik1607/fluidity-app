"use client";

import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useEnsAvatar } from "wagmi";
import Image from "next/image";
import styles from "./page.module.scss";
import {
  Text,
  GeneralButton,
  Heading,
  ArrowTopRight,
  useClickOutside,
  toSignificantDecimals,
} from "@fluidity-money/surfing";
import Socials from "./components/Socials";
import Table from "./components/Table";
import Footer from "./components/Footer";
import { DropdownOptions } from "./components/Dropdown";

import { Data } from "./types";
import { tableHeadings, SORTED_ITEM } from "./config";

import {
  useLeaderboardRanking24Hours,
  useLeaderboardRankingAllTime,
} from "./queries/useLeaderboardRanking";

import UseEnsName from "./ensName";

export type IRow = React.HTMLAttributes<HTMLDivElement> & {
  RowElement: React.FC<{ heading: string }>;
};

export default function Home() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [loaded, setLoaded] = useState();

  const data24Hours = useLeaderboardRanking24Hours();
  const dataAllTime = useLeaderboardRankingAllTime();

  const [last24HoursTimeData, setLast24HoursTimeData] = useState<Data[] | []>(
    []
  );
  const [allTimeData, setAllTimeData] = useState<Data[] | []>([]);

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

  const sortData = useCallback(
    (sortBy: string) => {
      switch (sortBy) {
        case "volume":
          const newSortedData = sortedData.sort(
            (a, b) => Number(b.volume) - Number(a.volume)
          );
          setSortedData(newSortedData);
          break;
        case "rewards":
          const newSortedDataEarned = sortedData.sort(
            (a, b) => Number(b.yield_earned) - Number(a.yield_earned)
          );
          setSortedData(newSortedDataEarned);
          break;
        default:
          setSortedData(
            sortedData.sort(
              (a, b) => b.number_of_transactions - a.number_of_transactions
            )
          );
      }
    },
    [sortedData]
  );

  useEffect(() => {
    try {
      data24Hours.then((res) => {
        setLast24HoursTimeData(res.data.leaderboard_ranking);
        setSortedData(res.data.leaderboard_ranking);
      });
      dataAllTime.then((res) => setAllTimeData(res.data.leaderboard_ranking));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const airdropRankRow = (data: any): IRow => {
    const addressUser = "0x1cb94adfd3314d48ca8145b2c6983419257c0486";
    const { address, rank, number_of_transactions, volume, yield_earned } =
      data;

    return {
      className: `${styles.table_row} ${
        addressUser === address ? styles.highlighted_row : ""
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
                    {addressUser === address ? (
                      "ME"
                    ) : (
                      <UseEnsName address={address} />
                    )}
                  </Text>
                </a>
              </td>
            );
          case "#TX":
            return (
              <td>
                <Text prominent>{number_of_transactions}</Text>
              </td>
            );
          case "VOLUME (USD)":
            return (
              <td>
                <Text prominent>{toSignificantDecimals(volume, 1)}</Text>
              </td>
            );
          case "YIELD EARNED (USD)":
            return (
              <td>
                <Text prominent>{toSignificantDecimals(yield_earned, 3)}</Text>
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
              {filterIndex === 0 ? " per" : " for"}
              &nbsp;
              {filterIndex === 0 ? (
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
                  setFilterIndex(0);
                  setSortedData(last24HoursTimeData);
                  setSortedByItem("number");
                }}
                className={
                  filterIndex === 0
                    ? `${styles.btn} ${styles.btn_highlited}`
                    : `${styles.btn}`
                }
              >
                <Text size="sm">24 HOURS</Text>
              </GeneralButton>
              <GeneralButton
                handleClick={() => {
                  setFilterIndex(1);
                  setSortedData(allTimeData);
                  setSortedByItem("number");
                }}
                className={
                  filterIndex === 0
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
                    sortData={sortData}
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
                return data.address === userAddress;
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
