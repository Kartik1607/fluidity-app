import { Text } from "@fluidity-money/surfing";
import styles from "./Dropdown.module.scss";

const sortedBy = [
  { title: "VOLUME", name: "volume" },
  { title: "REWARDS", name: "rewards" },
  { title: "#TX", name: "number" },
];

export const DropdownOptions = ({
  setSortedByItem,
  setOpenDropdown,
  sortData,
}: {
  setSortedByItem: (value: string) => void;
  setOpenDropdown: (value: boolean) => void;
  sortData: (value: string) => void;
}) => {
  return (
    <div className={styles.dropdown_options}>
      <ul>
        {sortedBy.map((option) => (
          <li key={`${option.title}`}>
            <button
              className={styles.option}
              onClick={() => {
                setSortedByItem(option.name);
                setOpenDropdown(false);
                sortData(option.name);
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
