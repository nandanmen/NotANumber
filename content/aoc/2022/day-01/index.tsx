export function getMaxTotalCalories(text: string) {
  const groups = text.split("\n\n");

  const totalCaloriesByElf = [];
  for (const group of groups) {
    const calories = group
      .split("\n")
      .reduce((acc, countString) => acc + Number(countString), 0);
    totalCaloriesByElf.push(calories);
  }

  totalCaloriesByElf.sort((a, b) => b - a);
  return totalCaloriesByElf[0] + totalCaloriesByElf[1] + totalCaloriesByElf[2];
}
