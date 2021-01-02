import Item from "../shared/Item";

export default () => {
  const subOne = [1, 2, 3, 4];
  const subTwo = [2, 3, 4, 5];
  return (
    <>
      <div style={{ marginRight: `3.5rem` }} className="flex justify-center">
        {subOne.map((item, index) => (
          <Item
            key={index}
            variant={index > 0 ? "danger" : "base"}
            className="relative"
            active
          >
            {item}
          </Item>
        ))}
      </div>
      <div style={{ marginLeft: `3.5rem` }} className="flex justify-center mt-2">
        {subTwo.map((item, index) => (
          <Item
            key={index}
            variant={index < subTwo.length - 1 ? "danger" : "base"}
            className="relative"
            active
          >
            {item}
          </Item>
        ))}
      </div>
      <p className="font-mono w-full text-center mt-4">k = 4</p>
    </>
  );
};
