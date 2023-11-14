"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.scss";
import {
  Text,
  GeneralButton,
  Heading,
  Display,
  CaretRight,
  ArrowTopRight,
  ProviderIcon,
  ArrowRight,
  LoadingDots,
  Socials,
} from "@fluidity-money/surfing";
import { LinkButton } from "@fluidity-money/surfing";

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

  const Row = ({ RowElement, index, className }: IRow & { index: number }) => {
    return (
      <motion.tr
        className={`${styles.table_row}`}
        key={`row-${index}`}
        variants={{
          enter: { opacity: [0, 1] },
          ready: { opacity: 1 },
          exit: { opacity: 0 },
          transitioning: {
            opacity: [0.75, 1, 0.75],
            transition: { duration: 1.5, repeat: Infinity },
          },
        }}
      >
        {filteredHeadings.map(({ name }) => (
          <RowElement heading={name} key={name} />
        ))}
      </motion.tr>
    );
  };

  const airdropRankRow = (data: any): IRow => {
    //const { address } = useContext(FluidityFacadeContext);
    const { user, rank, tx, volume, earned } = data;

    return {
      RowElement: ({ heading }: { heading: string }) => {
        switch (heading) {
          case "RANK":
            return (
              <td>
                <Text prominent>{rank === -1 ? "???" : rank}</Text>
              </td>
            );
          case "USER":
            return (
              <td>
                <a target="_blank" href="/" rel="noreferrer">
                  <Text prominent>{user}</Text>
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
            Fluidity Leaderboard Competition
          </Heading>
        </div>
        <div className={styles.description}>
          <Display color={"gray"} size="xxs">
            Step into the Fluidity Arena!{" "}
          </Display>{" "}
          {/*<Heading className={styles.title}>
            Step into the Fluidity Arena!{" "}
          </Heading>*/}
          <Text prominent>
            Compete in our Leaderboard Challenge by transacting with ƒluid
            Assets on-chain. Rise in ranks, earn your bragging rights, and claim
            exclusive rewards. Each week brings a new opportunity — Dive in,
            explore, and may the best ƒluider win! LEARN MORE
            <ArrowTopRight />
          </Text>
        </div>
      </div>

      <div className={styles.ldb__banner}>
        <Image
          src="./prise.svg"
          alt="Prise"
          width={20}
          height={24}
          className={styles.ldb__banner_svg}
        />

        <Text>
          Weekly Challenge: Top Volume Contributors Win Extra Rewards!
        </Text>
      </div>
      <div className={styles.ldb__table}>
        <div className={styles.ldb__table_header}>
          <div>
            <div className={styles.ldb__table_header_title}>
              <Heading as="h1">Leaderboard</Heading>
            </div>
            <Text prominent>
              This leaderboard shows your rank among other users
              {filterIndex === 0 ? " per" : " for"}
              &nbsp;
              {filterIndex === 0 ? (
                <span className={styles.ldb_table_time_filter}>24 HOURS</span>
              ) : (
                <span className={styles.ldb_table_time_filter}>ALL TIME</span>
              )}
              .
            </Text>
          </div>
          <div className={styles.ldb__table_header_filters}>
            <div>
              <GeneralButton
                type={filterIndex === 0 ? "secondary" : "transparent"}
                handleClick={() => setFilterIndex(0)}
              >
                <Text code size="sm">
                  24 HOURS
                </Text>
              </GeneralButton>
              <GeneralButton
                type={filterIndex === 1 ? "secondary" : "transparent"}
                handleClick={() => setFilterIndex(1)}
              >
                <Text code size="sm">
                  ALL TIME
                </Text>
              </GeneralButton>
            </div>
            <div>
              <Text>SORT BY:</Text>
              <GeneralButton
                type="transparent"
                //icon={<ArrowRight />}
                onClick={() => console.log("rank")}
              >
                RANK
              </GeneralButton>
            </div>
          </div>
        </div>

        <div className={styles.ldb__table_wrapper}>
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
            <table className={styles.ldb__table_content}>
              {/* Table Headings */}
              <thead>
                <tr>
                  {filteredHeadings.map((heading) => {
                    return (
                      <th key={heading.name}>
                        <Text>{heading.name}</Text>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Table Body */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.tbody
                  //  key={`page-${page}`}
                  initial="enter"
                  //  animate={
                  //    isTransition.state === "idle" ? "enter" : "transitioning"
                  //  }
                  exit="exit"
                  variants={{
                    enter: {
                      opacity: 1,
                      transition: {
                        when: "beforeChildren",
                        staggerChildren: 0.05,
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        when: "afterChildren",
                        staggerChildren: 0.05,
                      },
                    },
                    transitioning: {},
                  }}
                >
                  {/* Frozen Rows */}
                  {/*{frozenRows.map((row, i) => (
                <Row index={i} key={i} {...renderRow(row)} />
              ))}*/}
                  {/* Unfrozen Rows */}
                  {data
                    //.filter((_) => !freezeRow?.(_))
                    .map((row, i) => (
                      <Row
                        index={i}
                        key={i}
                        {...airdropRankRow(row)}
                        className={styles.row}
                      />
                    ))}
                </motion.tbody>
              </AnimatePresence>
            </table>
          )}
        </div>
      </div>

      <Socials />
      <div className={styles.ldb__footer}>
        <div>
          <Text as="p" size="xs">
            Fluidity Money 2023
          </Text>
        </div>
        <div className={styles.ldb__footer_btns}>
          {/*<LinkButton size="xs">Terms</LinkButton>*/}
          <Text size="xs">Terms</Text>
          <Text size="xs">Privacy policy</Text>
          <Text size="xs">© 2023 Fluidity Money. All Rights Reserved.</Text>
        </div>
      </div>
    </main>
  );
}
