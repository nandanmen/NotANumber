import Item from "../shared/Item";

export default ({ state }) => {
  return (
    <>
      <div className="flex w-full justify-center">
        {state.arr.map((item, index) => (
          <Item key={index} active={state.window.includes(index)}>
            {item}
          </Item>
        ))}
      </div>
      <p className="font-mono w-full text-center mt-4">k = 2 sum: {state.sum}</p>
    </>
  );
};
