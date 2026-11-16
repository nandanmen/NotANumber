import { useTheme } from "next-themes";
import { BiSun } from "react-icons/bi";
import { styled } from "~/stitches.config";

import { SecondaryButton } from "./SecondaryButton";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
    >
      <BiSun />
    </Button>
  );
};

const Button = styled(SecondaryButton, {
  fontSize: "$xl",
  width: "$10",
  height: "$10",
});
