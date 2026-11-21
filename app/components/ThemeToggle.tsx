import { BiSun } from "react-icons/bi";
import { useTheme } from "./theme";

import { SecondaryButton } from "./SecondaryButton";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <SecondaryButton
      className="h-10 w-10 text-[1.5rem]"
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
    >
      <BiSun />
    </SecondaryButton>
  );
};
