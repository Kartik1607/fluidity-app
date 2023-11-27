import { Text } from "@fluidity-money/surfing";
import styles from "./Dropdown.module.scss";

const sortedBy = [
  { title: "volume transacted", name: "volume" },
  { title: "rewards earned", name: "rewards" },
  { title: "number of transactions", name: "number" },
];

export const DropdownOptions = ({
  sortData,
  setSortedByItem,
}: {
  sortData: (value: string) => void;
  setSortedByItem: (value: string) => void;
}) => {
  return (
    <div className={styles.dropdown_options}>
      <ul>
        {sortedBy.map((option) => (
          <li key={`${option.title}`}>
            <button
              className={styles.option}
              onClick={() => {
                console.log(option);
                sortData(option.name);
                setSortedByItem(option.title);
              }}
            >
              <Text size="xl" prominent={true}>
                {option.title}
              </Text>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
