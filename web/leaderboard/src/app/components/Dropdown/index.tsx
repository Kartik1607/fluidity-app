import { Text } from "@fluidity-money/surfing";
import styles from "./Dropdown.module.scss";

const sortedBy = [
  { title: "volume transacted", name: "volume" },
  { title: "rewards earned", name: "rewards" },
  { title: "number of transactions", name: "number" },
];

export const DropdownOptions = ({
  setSortedByItem,
  setOpenDropdown,
}: {
  setSortedByItem: (value: string) => void;
  setOpenDropdown: (value: boolean) => void;
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
