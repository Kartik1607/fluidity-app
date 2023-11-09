"use client";

import Image from "next/image";
import styles from "./page.module.sass";
import {
  Text,
  GeneralButton,
  Heading,
  Display,
  CaretRight,
  ArrowTopRight,
} from "@fluidity-money/surfing";

export default function Home() {
  return (
    <main className={styles.main}>
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
          <Display color={"gray"} extraSmall>
            Step into the Fluidity Arena!{" "}
          </Display>{" "}
          <Text>
            Compete in our Leaderboard Challenge by transacting with ƒluid
            Assets on-chain. Rise in ranks, earn your bragging rights, and claim
            exclusive rewards. Each week brings a new opportunity — Dive in,
            explore, and may the best ƒluider win! LEARN MORE
            <ArrowTopRight />
          </Text>
        </div>
      </div>
    </main>
  );
}
