export const getSchools = (fishes: number[], days: number) => {
  let school = [...fishes]
  const snapshots = [[...fishes]]

  for (let day = 0; day < days; day++) {
    const currentDay = [...school]
    for (const [index, fish] of currentDay.entries()) {
      if (!fish) {
        currentDay[index] = 6
        currentDay.push(8 + 1)
      } else {
        currentDay[index]--
      }
    }
    snapshots.push([...currentDay])
    school = currentDay
  }

  return snapshots
}

type SchoolListProps = {
  schools: number[][]
}

export function SchoolList({ schools }: SchoolListProps) {
  return (
    <>
      {schools.map((arr, index) => (
        <p key={`formula-slider-${index}`}>
          Day {index}: {JSON.stringify(arr)}{' '}
          {arr[arr.length - 1] === 8 && `<-- fish created`}
        </p>
      ))}
    </>
  )
}
