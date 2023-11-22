"use client";

import { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.scss";
import {
  Text,
  GeneralButton,
  Heading,
  ArrowTopRight,
} from "@fluidity-money/surfing";
import Socials from "./components/Socials";
import Table from "./components/Table";

import { Client, cacheExchange, fetchExchange, gql } from "urql";

const APIURL =
  "https://gateway-arbitrum.network.thegraph.com/api/f9ffa86b5ab1229ce9b91179448a0891/subgraphs/id/CdS3475tZUcWVHsecnELJxBEGXV8nrbe5h3VmCbhe9qd";

const query = gql`
  query {
    approvals {
      id
      owner
      spender
      value
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

const DATA = [
  {
    rank: "1",
    user: "user_1",
    tx: "tx",
    volume: 100,
    earned: 10,
  },
  {
    rank: "2",
    user: "user_2",
    tx: "tx",
    volume: 100,
    earned: 10,
  },
  {
    rank: "3",
    user: "user_3",
    tx: "tx",
    volume: 100,
    earned: 10,
  },
];

export default function Home() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [data, setData] = useState(DATA);
  const [loaded, setLoaded] = useState();
  const [filteredHeadings, usefilteredHeadings] = useState([
    { name: "RANK" },
    { name: "USER" },
    { name: "#TX" },
    { name: "VOLUME (USD)" },
    { name: "YIELD EARNED (USD)" },
  ]);

  const [userAddress, setUserAddress] = useState();

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const response = await client.query(query).toPromise();
    console.log("response:", response);
  }

  const airdropRankRow = (data: any): IRow => {
    //const { address } = useContext();
    const { address } = "string";
    const { user, rank, tx, volume, earned } = data;

    return {
      className: `${address === user ? styles.highlited : styles.table_row}`,
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
                      address === user ? "ME" : user
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
                handleClick={() => setFilterIndex(0)}
                className={
                  filterIndex === 0
                    ? `${styles.btn} ${styles.btn_highlited}`
                    : `${styles.btn}`
                }
              >
                <Text size="sm">24 HOURS</Text>
              </GeneralButton>
              <GeneralButton
                handleClick={() => setFilterIndex(1)}
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
              <GeneralButton
                type="transparent"
                onClick={() => console.log("rank")}
                className={styles.sorting_list}
              >
                RANK{" "}
                <Image
                  src="./arrowDownWhite.svg"
                  alt="Arrow right"
                  width={10}
                  height={10}
                />
              </GeneralButton>
            </div>
          </div>
        </div>

        <div>
          {data.length === 0 ? (
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
              headings={filteredHeadings}
              pagination={{
                paginate: false,
                page: 1,
                rowsPerPage: 11,
              }}
              count={0}
              data={data}
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

      <div className={styles.footer}>
        <div>
          <Text as="p" size="xs">
            Fluidity Money 2023
          </Text>
        </div>
        <div className={styles.btns}>
          <Text size="xs">Terms</Text>
          <Text size="xs">Privacy policy</Text>
          <Text size="xs">© 2023 Fluidity Money. All Rights Reserved.</Text>
        </div>
      </div>
    </main>
  );
}
